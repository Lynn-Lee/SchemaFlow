import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type {
    addEdge,
    NodePositionChange,
    NodeDimensionChange,
    OnEdgesChange,
} from '@xyflow/react';
import {
    useEdgesState,
    useNodesState,
    useReactFlow,
    useKeyPress,
    useUpdateNodeInternals,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import equal from 'fast-deep-equal';
import { useChartDB } from '@/hooks/use-chartdb';
import { useToast } from '@/components/toast/use-toast';
import { useLayout } from '@/hooks/use-layout';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';
import type { DBTable } from '@/lib/domain/db-table';
import { useLocalConfig } from '@/hooks/use-local-config';
import type { ChartDBEvent } from '@/context/chartdb-context/chartdb-context';
import { debounce, getOperatingSystem } from '@/lib/utils';
import { useCanvas } from '@/hooks/use-canvas';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIsLostInCanvas } from './hooks/use-is-lost-in-canvas';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { useDiagramFilter } from '@/context/diagram-filter-context/use-diagram-filter';
import { filterTable } from '@/lib/domain/diagram-filter/filter';
import { defaultSchemas } from '@/lib/data/default-schemas';
import { useDiff } from '@/context/diff-context/use-diff';
import { useClickAway } from '@/hooks/use-click-away';
import {
    initialEdges,
    tableToTableNode,
    type EdgeType,
    type NodeType,
} from './canvas-model';
import { buildCanvasEdges } from './canvas-edges';
import {
    buildCanvasEdgesWithFloatingEdge,
    buildCanvasNodesWithCursor,
} from './canvas-floating-edge';
import { buildCanvasEventUpdate } from './canvas-chartdb-events';
import { CanvasControls } from './canvas-controls';
import { CanvasFilterLayer } from './canvas-filter-layer';
import { CanvasFlow } from './canvas-flow';
import { useCanvasPointerActions } from './canvas-pointer-actions';
import {
    buildUpdatedOverlapGraphForNodeChanges,
    buildVisibleTableOverlapGraph,
} from './canvas-overlap-updates';
import { buildCanvasNodes } from './canvas-nodes';
import { buildParentAreaUpdates } from './canvas-parent-areas';
import { buildCanvasEdgeChangeSet } from './canvas-edge-changes';
import { buildCanvasConnectAction } from './canvas-connect';
import { useCanvasNodeChangeHandler } from './canvas-node-change-handler';
import { useCanvasKeyboardHandler } from './canvas-keyboard-handler';
import { useCanvasSelectionSync } from './canvas-selection-sync';
import { CanvasViewport } from './canvas-viewport';

export type { EdgeType, NodeType } from './canvas-model';

type AddEdgeParams = Parameters<typeof addEdge<EdgeType>>[0];

export interface CanvasProps {
    initialTables: DBTable[];
}

export const Canvas: React.FC<CanvasProps> = ({ initialTables }) => {
    const { getEdge, getInternalNode, getNode, screenToFlowPosition } =
        useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
    const [selectedRelationshipIds, setSelectedRelationshipIds] = useState<
        string[]
    >([]);
    const { toast } = useToast();
    const { isLostInCanvas } = useIsLostInCanvas();
    const {
        tables,
        areas,
        notes,
        relationships,
        createRelationship,
        createDependency,
        updateTablesState,
        removeRelationships,
        removeDependencies,
        getField,
        databaseType,
        events,
        dependencies,
        readonly,
        removeArea,
        updateArea,
        removeNote,
        updateNote,
        highlightedCustomType,
        highlightCustomTypeId,
    } = useChartDB();
    const { showSidePanel } = useLayout();
    const { effectiveTheme } = useTheme();
    const { scrollAction, showDBViews, showMiniMapOnCanvas } = useLocalConfig();
    const { isMd: isDesktop } = useBreakpoint('md');
    const [highlightOverlappingTables, setHighlightOverlappingTables] =
        useState(false);
    const {
        fitView,
        setOverlapGraph,
        overlapGraph,
        showFilter,
        setShowFilter,
        setEditTableModeTable,
        tempFloatingEdge,
        endFloatingEdgeCreation,
        hoveringTableId,
        hideCreateRelationshipNode,
        closeRelationshipPopover,
        events: canvasEvents,
    } = useCanvas();
    const {
        filter,
        loading: filterLoading,
        hasActiveFilter,
        resetFilter,
    } = useDiagramFilter();
    const { checkIfNewTable } = useDiff();

    const shouldForceShowTable = useCallback(
        (tableId: string) => {
            return checkIfNewTable({ tableId });
        },
        [checkIfNewTable]
    );

    const [isInitialLoadingNodes, setIsInitialLoadingNodes] = useState(true);

    const [nodes, setNodes, onNodesChange] = useNodesState<NodeType>(
        initialTables.map((table) =>
            tableToTableNode(table, {
                filter,
                databaseType,
                filterLoading,
                showDBViews,
                forceShow: shouldForceShowTable(table.id),
                isRelationshipCreatingTarget: false,
            })
        )
    );
    const [edges, setEdges, onEdgesChange] =
        useEdgesState<EdgeType>(initialEdges);

    const [snapToGridEnabled, setSnapToGridEnabled] = useState(false);

    const [cursorPosition, setCursorPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);

    useEffect(() => {
        setIsInitialLoadingNodes(true);
    }, [initialTables]);

    useEffect(() => {
        const initialNodes = initialTables.map((table) =>
            tableToTableNode(table, {
                filter,
                databaseType,
                filterLoading,
                showDBViews,
                forceShow: shouldForceShowTable(table.id),
                isRelationshipCreatingTarget: false,
            })
        );
        if (equal(initialNodes, nodes)) {
            setIsInitialLoadingNodes(false);
        }
    }, [
        initialTables,
        nodes,
        filter,
        databaseType,
        filterLoading,
        showDBViews,
        shouldForceShowTable,
    ]);

    useEffect(() => {
        if (!isInitialLoadingNodes) {
            debounce(() => {
                fitView({
                    duration: 200,
                    padding: 0.1,
                    maxZoom: 0.8,
                });
            }, 500)();
        }
    }, [isInitialLoadingNodes, fitView]);

    useEffect(() => {
        // Force React Flow to re-register handles for all table nodes
        // This ensures handles exist before edges reference them
        const tableNodeIds = tables.map((t) => t.id);
        if (tableNodeIds.length > 0) {
            updateNodeInternals(tableNodeIds);
        }

        // Delay edge creation to ensure handles are registered
        const timeoutId = setTimeout(() => {
            setEdges((prevEdges) => {
                return buildCanvasEdges({
                    relationships,
                    dependencies,
                    previousEdges: prevEdges,
                    showDBViews,
                });
            });
        }, 100); // Delay to let handles register after updateNodeInternals

        return () => clearTimeout(timeoutId);
    }, [
        relationships,
        dependencies,
        setEdges,
        showDBViews,
        tables,
        updateNodeInternals,
    ]);

    useCanvasSelectionSync({
        nodes,
        edges,
        selectedTableIds,
        selectedRelationshipIds,
        setSelectedTableIds,
        setSelectedRelationshipIds,
        setEdges,
    });

    useEffect(() => {
        setNodes((prevNodes) => {
            const newNodes = buildCanvasNodes({
                tables,
                areas,
                notes,
                previousNodes: prevNodes,
                relationships,
                overlapGraph,
                filter,
                databaseType,
                filterLoading,
                showDBViews,
                shouldForceShowTable,
                highlightOverlappingTables,
                highlightedCustomType,
            });

            // Check if nodes actually changed
            if (equal(prevNodes, newNodes)) {
                return prevNodes;
            }

            return newNodes;
        });
    }, [
        tables,
        areas,
        notes,
        setNodes,
        filter,
        databaseType,
        overlapGraph,
        highlightOverlappingTables,
        highlightedCustomType,
        filterLoading,
        showDBViews,
        shouldForceShowTable,
        relationships,
    ]);

    // Surgical update for relationship creation target highlighting
    // This avoids expensive full node recalculation when only the visual state changes
    useEffect(() => {
        setNodes((nds) => {
            let hasChanges = false;
            const updatedNodes = nds.map((node) => {
                if (node.type !== 'table') return node;

                const shouldBeTarget =
                    !!tempFloatingEdge?.sourceNodeId &&
                    node.id !== tempFloatingEdge.sourceNodeId;
                const isCurrentlyTarget =
                    node.data.isRelationshipCreatingTarget ?? false;

                if (shouldBeTarget !== isCurrentlyTarget) {
                    hasChanges = true;
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isRelationshipCreatingTarget: shouldBeTarget,
                        },
                    };
                }
                return node;
            });

            return hasChanges ? updatedNodes : nds;
        });
    }, [tempFloatingEdge?.sourceNodeId, setNodes]);

    const prevFilter = useRef<DiagramFilter | undefined>(undefined);
    const prevShowDBViews = useRef<boolean>(showDBViews);
    useEffect(() => {
        if (
            !equal(filter, prevFilter.current) ||
            showDBViews !== prevShowDBViews.current
        ) {
            debounce(() => {
                const overlappingTablesInDiagram =
                    buildVisibleTableOverlapGraph({
                        tables,
                        filter,
                        databaseType,
                        showDBViews,
                    });
                setOverlapGraph(overlappingTablesInDiagram);
                fitView({
                    duration: 500,
                    padding: 0.1,
                    maxZoom: 0.8,
                });
            }, 500)();
            prevFilter.current = filter;
            prevShowDBViews.current = showDBViews;
        }
    }, [filter, fitView, tables, setOverlapGraph, databaseType, showDBViews]);

    useEffect(() => {
        const checkParentAreas = debounce(() => {
            const needsUpdate = buildParentAreaUpdates(nodes);

            if (needsUpdate.length > 0) {
                updateTablesState(
                    (currentTables) =>
                        currentTables.map((table) => {
                            const update = needsUpdate.find(
                                (u) => u.id === table.id
                            );
                            if (update) {
                                return {
                                    id: table.id,
                                    parentAreaId: update.parentAreaId,
                                };
                            }
                            return table;
                        }),
                    { updateHistory: false }
                );
            }
        }, 300);

        checkParentAreas();
    }, [nodes, updateTablesState]);

    const onConnectHandler = useCallback(
        async (params: AddEdgeParams) => {
            const action = buildCanvasConnectAction({
                params,
                databaseType,
                getField,
            });

            if (action.type === 'create-dependency') {
                createDependency(action);
            } else if (action.type === 'incompatible-fields') {
                toast({
                    title: 'Field types are not compatible',
                    variant: 'destructive',
                    description:
                        'Relationships can only be created between compatible field types',
                });
            } else if (action.type === 'create-relationship') {
                createRelationship(action);
            }
        },
        [createRelationship, createDependency, getField, toast, databaseType]
    );

    const onEdgesChangeHandler: OnEdgesChange<EdgeType> = useCallback(
        (changes) => {
            const {
                changesToApply,
                relationshipIdsToRemove,
                dependencyIdsToRemove,
            } = buildCanvasEdgeChangeSet({
                changes,
                readonly: !!readonly,
                getEdge: (id) => getEdge(id) as EdgeType | undefined,
            });

            if (relationshipIdsToRemove.length > 0) {
                removeRelationships(relationshipIdsToRemove);
            }

            if (dependencyIdsToRemove.length > 0) {
                removeDependencies(dependencyIdsToRemove);
            }

            return onEdgesChange(changesToApply);
        },
        [
            getEdge,
            onEdgesChange,
            removeRelationships,
            removeDependencies,
            readonly,
        ]
    );

    const updateOverlappingGraphOnChanges = useCallback(
        ({
            positionChanges,
            sizeChanges,
        }: {
            positionChanges: NodePositionChange[];
            sizeChanges: NodeDimensionChange[];
        }) => {
            if (positionChanges.length > 0 || sizeChanges.length > 0) {
                setOverlapGraph(
                    buildUpdatedOverlapGraphForNodeChanges({
                        overlapGraph,
                        nodes,
                        positionChanges,
                        sizeChanges,
                        getNode: (id) => getNode(id) as NodeType | undefined,
                    })
                );
            }
        },
        [nodes, overlapGraph, setOverlapGraph, getNode]
    );

    const updateOverlappingGraphOnChangesDebounced = debounce(
        updateOverlappingGraphOnChanges,
        200
    );

    const onNodesChangeHandler = useCanvasNodeChangeHandler({
        readonly: !!readonly,
        tables,
        areas,
        getNode: (id) => getNode(id) as NodeType | undefined,
        onNodesChange,
        updateTablesState,
        updateOverlappingGraphOnChanges:
            updateOverlappingGraphOnChangesDebounced,
        updateArea,
        removeArea,
        updateNote,
        removeNote,
    });

    const onCanvasKeyDownHandler = useCanvasKeyboardHandler({
        nodes,
        readonly: !!readonly,
        onNodesChange: onNodesChangeHandler,
    });

    const eventConsumer = useCallback(
        (event: ChartDBEvent) => {
            const update = buildCanvasEventUpdate({
                event,
                overlapGraph,
                nodes,
                getNode,
                filter,
                databaseType,
                showDBViews,
            });

            setOverlapGraph(update.overlapGraph);

            if (update.measuredNodeUpdate) {
                setTimeout(() => {
                    setNodes((prevNodes) =>
                        prevNodes.map((node) =>
                            node.id === update.measuredNodeUpdate?.id
                                ? {
                                      ...node,
                                      measured:
                                          update.measuredNodeUpdate.measured,
                                  }
                                : node
                        )
                    );
                }, 0);
            }
        },
        [
            overlapGraph,
            setOverlapGraph,
            getNode,
            nodes,
            filter,
            setNodes,
            databaseType,
            showDBViews,
        ]
    );

    events.useSubscription(eventConsumer);

    const isLoadingDOM =
        tables.length > 0 ? !getInternalNode(tables[0].id) : false;

    const hasOverlappingTables = useMemo(
        () =>
            Array.from(overlapGraph.graph).some(
                ([, value]) => value.length > 0
            ),
        [overlapGraph]
    );

    // Check if all tables are hidden due to filtering
    // Derived from filter state directly (not nodes) for better performance
    const allTablesHiddenByFilter = useMemo(() => {
        if (!hasActiveFilter || tables.length === 0 || filterLoading) {
            return false;
        }
        // Check if any table passes the filter
        const visibleTableCount = tables.filter((table) =>
            filterTable({
                table: { id: table.id, schema: table.schema },
                filter,
                options: { defaultSchema: defaultSchemas[databaseType] },
            })
        ).length;
        return visibleTableCount === 0;
    }, [hasActiveFilter, tables, filter, databaseType, filterLoading]);

    const pulseOverlappingTables = useCallback(() => {
        setHighlightOverlappingTables(true);
        setTimeout(() => setHighlightOverlappingTables(false), 600);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const exitEditTableMode = useCallback(
        () => setEditTableModeTable(null),
        [setEditTableModeTable]
    );
    useClickAway(containerRef, exitEditTableMode);
    useClickAway(containerRef, hideCreateRelationshipNode);

    const shiftPressed = useKeyPress('Shift');
    const operatingSystem = getOperatingSystem();

    useHotkeys(
        operatingSystem === 'mac' ? 'meta+f' : 'ctrl+f',
        () => {
            setShowFilter((prev) => !prev);
        },
        {
            preventDefault: true,
            enableOnFormTags: true,
        },
        []
    );

    const { handleMouseMove, onPaneClickHandler } = useCanvasPointerActions({
        tempFloatingEdge,
        endFloatingEdgeCreation,
        setCursorPosition,
        hideCreateRelationshipNode,
        exitEditTableMode,
        closeRelationshipPopover,
        screenToFlowPosition,
        canvasEvents,
    });

    // Add temporary invisible node at cursor position and edge
    const nodesWithCursor = useMemo(() => {
        return buildCanvasNodesWithCursor({
            nodes,
            tempFloatingEdge,
            cursorPosition,
        });
    }, [nodes, tempFloatingEdge, cursorPosition]);

    const edgesWithFloating = useMemo(() => {
        return buildCanvasEdgesWithFloatingEdge({
            edges,
            tempFloatingEdge,
            cursorPosition,
            hoveringTableId,
        });
    }, [edges, tempFloatingEdge, cursorPosition, hoveringTableId]);

    return (
        <CanvasViewport
            containerRef={containerRef}
            onMouseMove={handleMouseMove}
            onKeyDown={onCanvasKeyDownHandler}
        >
            <CanvasFlow
                colorMode={effectiveTheme}
                nodes={nodesWithCursor}
                edges={edgesWithFloating}
                onNodesChange={onNodesChangeHandler}
                onEdgesChange={onEdgesChangeHandler}
                onConnect={onConnectHandler}
                panOnScroll={scrollAction === 'pan'}
                snapToGrid={shiftPressed || snapToGridEnabled}
                onPaneClick={onPaneClickHandler}
                shiftPressed={shiftPressed}
            >
                <CanvasControls
                    readonly={readonly}
                    isDesktop={isDesktop}
                    isLoadingDOM={isLoadingDOM}
                    isLostInCanvas={isLostInCanvas}
                    showMiniMapOnCanvas={showMiniMapOnCanvas}
                    snapToGridEnabled={snapToGridEnabled}
                    shiftPressed={shiftPressed}
                    operatingSystem={operatingSystem}
                    hasOverlappingTables={hasOverlappingTables}
                    highlightedCustomType={highlightedCustomType}
                    onToggleSnapToGrid={() =>
                        setSnapToGridEnabled((prev) => !prev)
                    }
                    onClearCustomTypeHighlight={() =>
                        highlightCustomTypeId(undefined)
                    }
                    onPulseOverlappingTables={pulseOverlappingTables}
                    showSidePanel={showSidePanel}
                />
                <CanvasFilterLayer
                    allTablesHiddenByFilter={allTablesHiddenByFilter}
                    showFilter={showFilter}
                    onResetFilter={resetFilter}
                    onCloseFilter={() => setShowFilter(false)}
                />
            </CanvasFlow>
        </CanvasViewport>
    );
};
