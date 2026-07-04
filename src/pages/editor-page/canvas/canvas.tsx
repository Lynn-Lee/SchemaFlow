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
    NodeRemoveChange,
    NodeDimensionChange,
    OnEdgesChange,
    OnNodesChange,
    NodeChange,
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
import type { TableNodeType } from './table-node/table-node';
import type { RelationshipEdgeType } from './relationship-edge/relationship-edge';
import { useChartDB } from '@/hooks/use-chartdb';
import { useToast } from '@/components/toast/use-toast';
import { useLayout } from '@/hooks/use-layout';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';
import type { DBTable } from '@/lib/domain/db-table';
import { useLocalConfig } from '@/hooks/use-local-config';
import { MarkerDefinitions } from './marker-definitions';
import { CanvasContextMenu } from './canvas-context-menu';
import { areFieldTypesCompatible } from '@/lib/data/data-types/data-types';
import { findOverlappingTables, findTableOverlapping } from './canvas-utils';
import type { Graph } from '@/lib/graph';
import type { ChartDBEvent } from '@/context/chartdb-context/chartdb-context';
import { debounce, getOperatingSystem } from '@/lib/utils';
import type { DependencyEdgeType } from './dependency-edge/dependency-edge';
import {
    BOTTOM_SOURCE_HANDLE_ID_PREFIX,
    TOP_SOURCE_HANDLE_ID_PREFIX,
} from './table-node/table-node-dependency-indicator';
import { useCanvas } from '@/hooks/use-canvas';
import type { AreaNodeType } from './area-node/area-node';
import { updateTablesParentAreas } from '@/lib/utils/area-utils';
import { useHotkeys } from 'react-hotkeys-hook';
import { useIsLostInCanvas } from './hooks/use-is-lost-in-canvas';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { useDiagramFilter } from '@/context/diagram-filter-context/use-diagram-filter';
import { filterTable } from '@/lib/domain/diagram-filter/filter';
import { defaultSchemas } from '@/lib/data/default-schemas';
import { useDiff } from '@/context/diff-context/use-diff';
import { useClickAway } from '@/hooks/use-click-away';
import {
    getCanvasKeyboardNodeChanges,
    isCanvasKeyboardActionKey,
    isCanvasKeyboardInputTarget,
} from './canvas-keyboard-actions';
import {
    areaToAreaNode,
    initialEdges,
    noteToNoteNode,
    tableToTableNode,
    type EdgeType,
    type NodeType,
} from './canvas-model';
import { buildCanvasEdges, getHighlightedCanvasEdges } from './canvas-edges';
import {
    getSelectedCanvasEdgeIds,
    getSelectedCanvasNodeIds,
} from './canvas-selection';
import { buildCanvasNodeChangeSet } from './canvas-node-changes';
import {
    buildAreaStorageChanges,
    buildNoteStorageChanges,
    buildTableStorageChanges,
} from './canvas-node-storage-updates';
import {
    buildCanvasEdgesWithFloatingEdge,
    buildCanvasNodesWithCursor,
} from './canvas-floating-edge';
import { buildCanvasEventUpdate } from './canvas-chartdb-events';
import { CanvasControls } from './canvas-controls';
import { CanvasFilterLayer } from './canvas-filter-layer';
import { CanvasFlow } from './canvas-flow';
import { useCanvasPointerActions } from './canvas-pointer-actions';

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

    useEffect(() => {
        const selectedNodesIds = getSelectedCanvasNodeIds(nodes);

        if (equal(selectedNodesIds, selectedTableIds)) {
            return;
        }

        setSelectedTableIds(selectedNodesIds);
    }, [nodes, setSelectedTableIds, selectedTableIds]);

    useEffect(() => {
        const selectedEdgesIds = getSelectedCanvasEdgeIds(edges);

        if (equal(selectedEdgesIds, selectedRelationshipIds)) {
            return;
        }

        setSelectedRelationshipIds(selectedEdgesIds);
    }, [edges, setSelectedRelationshipIds, selectedRelationshipIds]);

    useEffect(() => {
        setEdges((prevEdges) => {
            return getHighlightedCanvasEdges({
                edges: prevEdges,
                selectedRelationshipIds,
                selectedTableIds,
            });
        });
    }, [selectedRelationshipIds, selectedTableIds, setEdges]);

    useEffect(() => {
        // Compute target edge counts per field (same logic as edge creation)
        // This ensures handle creation is synchronized with edge indices
        const targetEdgeCountsByField: Record<string, number> = {};
        relationships.forEach((rel) => {
            const fieldId = rel.targetFieldId;
            targetEdgeCountsByField[fieldId] =
                (targetEdgeCountsByField[fieldId] || 0) + 1;
        });

        setNodes((prevNodes) => {
            const newNodes = [
                ...tables.map((table) => {
                    const isOverlapping =
                        (overlapGraph.graph.get(table.id) ?? []).length > 0;

                    // Get target edge counts for this table's fields
                    const tableTargetEdgeCounts: Record<string, number> = {};
                    table.fields.forEach((field) => {
                        if (targetEdgeCountsByField[field.id]) {
                            tableTargetEdgeCounts[field.id] =
                                targetEdgeCountsByField[field.id];
                        }
                    });

                    const node = tableToTableNode(table, {
                        filter,
                        databaseType,
                        filterLoading,
                        showDBViews,
                        forceShow: shouldForceShowTable(table.id),
                        isRelationshipCreatingTarget: false,
                        targetEdgeCounts: tableTargetEdgeCounts,
                    });

                    // Check if table uses the highlighted custom type
                    let hasHighlightedCustomType = false;
                    if (highlightedCustomType) {
                        hasHighlightedCustomType = table.fields.some(
                            (field) =>
                                field.type.name === highlightedCustomType.name
                        );
                    }

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isOverlapping,
                            highlightOverlappingTables,
                            hasHighlightedCustomType,
                        },
                    };
                }),
                ...areas.map((area) =>
                    areaToAreaNode(area, {
                        tables,
                        filter,
                        databaseType,
                        filterLoading,
                    })
                ),
                ...notes.map((note) => noteToNoteNode(note)),
                ...prevNodes.filter(
                    (n) =>
                        n.type === 'temp-cursor' ||
                        n.type === 'create-relationship'
                ),
            ];

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
        overlapGraph.lastUpdated,
        overlapGraph.graph,
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
                const overlappingTablesInDiagram = findOverlappingTables({
                    tables: tables.filter(
                        (table) =>
                            filterTable({
                                table: {
                                    id: table.id,
                                    schema: table.schema,
                                },
                                filter,
                                options: {
                                    defaultSchema: defaultSchemas[databaseType],
                                },
                            }) && (showDBViews ? true : !table.isView)
                    ),
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
            const visibleTables = nodes
                .filter((node) => node.type === 'table' && !node.hidden)
                .map((node) => (node as TableNodeType).data.table);
            const visibleAreas = nodes
                .filter((node) => node.type === 'area' && !node.hidden)
                .map((node) => (node as AreaNodeType).data.area);

            const updatedTables = updateTablesParentAreas(
                visibleTables,
                visibleAreas
            );
            const needsUpdate: Array<{
                id: string;
                parentAreaId: string | null;
            }> = [];

            updatedTables.forEach((newTable, index) => {
                const oldTable = visibleTables[index];
                if (
                    oldTable &&
                    (!!newTable.parentAreaId || !!oldTable.parentAreaId) &&
                    newTable.parentAreaId !== oldTable.parentAreaId
                ) {
                    needsUpdate.push({
                        id: newTable.id,
                        parentAreaId: newTable.parentAreaId || null,
                    });
                }
            });

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
            if (
                params.sourceHandle?.startsWith?.(
                    TOP_SOURCE_HANDLE_ID_PREFIX
                ) ||
                params.sourceHandle?.startsWith?.(
                    BOTTOM_SOURCE_HANDLE_ID_PREFIX
                )
            ) {
                const tableId = params.target;
                const dependentTableId = params.source;

                createDependency({
                    tableId,
                    dependentTableId,
                });

                return;
            }

            const sourceTableId = params.source;
            const targetTableId = params.target;
            const sourceFieldId = params.sourceHandle?.split('_')?.pop() ?? '';
            const targetFieldId = params.targetHandle?.split('_')?.pop() ?? '';
            const sourceField = getField(sourceTableId, sourceFieldId);
            const targetField = getField(targetTableId, targetFieldId);

            if (!sourceField || !targetField) {
                return;
            }

            if (
                !areFieldTypesCompatible(
                    sourceField.type,
                    targetField.type,
                    databaseType
                )
            ) {
                toast({
                    title: 'Field types are not compatible',
                    variant: 'destructive',
                    description:
                        'Relationships can only be created between compatible field types',
                });
                return;
            }

            createRelationship({
                sourceTableId,
                targetTableId,
                sourceFieldId,
                targetFieldId,
            });
        },
        [createRelationship, createDependency, getField, toast, databaseType]
    );

    const onEdgesChangeHandler: OnEdgesChange<EdgeType> = useCallback(
        (changes) => {
            let changesToApply = changes;

            if (readonly) {
                changesToApply = changesToApply.filter(
                    (change) => change.type !== 'remove'
                );
            }

            const removeChanges: NodeRemoveChange[] = changesToApply.filter(
                (change) => change.type === 'remove'
            ) as NodeRemoveChange[];

            const edgesToRemove = removeChanges
                .map((change) => getEdge(change.id) as EdgeType | undefined)
                .filter((edge) => !!edge);

            const relationshipsToRemove: string[] = (
                edgesToRemove.filter(
                    (edge) => edge?.type === 'relationship-edge'
                ) as RelationshipEdgeType[]
            ).map((edge) => edge?.data?.relationship?.id as string);

            const dependenciesToRemove: string[] = (
                edgesToRemove.filter(
                    (edge) => edge?.type === 'dependency-edge'
                ) as DependencyEdgeType[]
            ).map((edge) => edge?.data?.dependency?.id as string);

            if (relationshipsToRemove.length > 0) {
                removeRelationships(relationshipsToRemove);
            }

            if (dependenciesToRemove.length > 0) {
                removeDependencies(dependenciesToRemove);
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
                let newOverlappingGraph: Graph<string> = overlapGraph;

                for (const change of positionChanges) {
                    const node = getNode(change.id) as NodeType;
                    if (!node) {
                        continue;
                    }

                    if (node.type !== 'table') {
                        continue;
                    }

                    newOverlappingGraph = findTableOverlapping(
                        { node: node as TableNodeType },
                        {
                            nodes: nodes.filter(
                                (node) => !node.hidden && node.type === 'table'
                            ) as TableNodeType[],
                        },
                        newOverlappingGraph
                    );
                }

                for (const change of sizeChanges) {
                    const node = getNode(change.id) as NodeType;
                    if (!node) {
                        continue;
                    }

                    if (node.type !== 'table') {
                        continue;
                    }

                    newOverlappingGraph = findTableOverlapping(
                        { node: node as TableNodeType },
                        {
                            nodes: nodes.filter(
                                (node) => !node.hidden && node.type === 'table'
                            ) as TableNodeType[],
                        },
                        newOverlappingGraph
                    );
                }

                setOverlapGraph(newOverlappingGraph);
            }
        },
        [nodes, overlapGraph, setOverlapGraph, getNode]
    );

    const updateOverlappingGraphOnChangesDebounced = debounce(
        updateOverlappingGraphOnChanges,
        200
    );

    const onNodesChangeHandler: OnNodesChange<NodeType> = useCallback(
        (changes) => {
            const { changesToApply, areaChanges, noteChanges, tableChanges } =
                buildCanvasNodeChangeSet({
                    changes,
                    readonly: !!readonly,
                    areas,
                    tables,
                    getNode: (id) => getNode(id) as NodeType | undefined,
                });

            const {
                positionChanges,
                removeChanges,
                sizeChanges,
                childTableMovements,
            } = tableChanges;
            const {
                positionChanges: areaPositionChanges,
                removeChanges: areaRemoveChanges,
                sizeChanges: areaSizeChanges,
            } = areaChanges;
            const {
                positionChanges: notePositionChanges,
                removeChanges: noteRemoveChanges,
                sizeChanges: noteSizeChanges,
            } = noteChanges;

            if (
                positionChanges.length > 0 ||
                removeChanges.length > 0 ||
                sizeChanges.length > 0 ||
                childTableMovements.size > 0 ||
                areaRemoveChanges.length > 0
            ) {
                const tableStorageChanges = buildTableStorageChanges({
                    tables,
                    positionChanges,
                    removeChanges,
                    sizeChanges,
                    areaRemoveChanges,
                    childTableMovements,
                });

                updateTablesState(
                    (currentTables) =>
                        buildTableStorageChanges({
                            tables: currentTables,
                            positionChanges,
                            removeChanges,
                            sizeChanges,
                            areaRemoveChanges,
                            childTableMovements,
                        }).tables,
                    { updateHistory: tableStorageChanges.updateHistory }
                );
            }

            updateOverlappingGraphOnChangesDebounced({
                positionChanges,
                sizeChanges,
            });

            if (
                areaPositionChanges.length > 0 ||
                areaRemoveChanges.length > 0 ||
                areaSizeChanges.length > 0
            ) {
                const areaStorageChanges = buildAreaStorageChanges({
                    positionChanges: areaPositionChanges,
                    removeChanges: areaRemoveChanges,
                    sizeChanges: areaSizeChanges,
                });

                areaStorageChanges.removeIds.forEach((id) => removeArea(id));
                areaStorageChanges.updates.forEach(({ id, updates }) =>
                    updateArea(id, updates)
                );
            }

            // Handle note changes
            if (
                notePositionChanges.length > 0 ||
                noteRemoveChanges.length > 0 ||
                noteSizeChanges.length > 0
            ) {
                const noteStorageChanges = buildNoteStorageChanges({
                    positionChanges: notePositionChanges,
                    removeChanges: noteRemoveChanges,
                    sizeChanges: noteSizeChanges,
                });

                noteStorageChanges.removeIds.forEach((id) => removeNote(id));
                noteStorageChanges.updates.forEach(({ id, updates }) =>
                    updateNote(id, updates)
                );
            }

            return onNodesChange(changesToApply);
        },
        [
            onNodesChange,
            updateTablesState,
            updateOverlappingGraphOnChangesDebounced,
            updateArea,
            removeArea,
            updateNote,
            removeNote,
            readonly,
            tables,
            areas,
            getNode,
        ]
    );

    const onCanvasKeyDownHandler = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (
                event.defaultPrevented ||
                !isCanvasKeyboardActionKey(event.key) ||
                isCanvasKeyboardInputTarget(event.target)
            ) {
                return;
            }

            const keyboardChanges = getCanvasKeyboardNodeChanges({
                key: event.key,
                nodes,
                readonly: !!readonly,
            }) as NodeChange<NodeType>[];

            if (keyboardChanges.length === 0) {
                return;
            }

            event.preventDefault();
            onNodesChangeHandler(keyboardChanges);
        },
        [nodes, readonly, onNodesChangeHandler]
    );

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
        <CanvasContextMenu>
            <div
                className="relative flex h-full"
                id="canvas"
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onKeyDown={onCanvasKeyDownHandler}
                role="application"
                aria-label="Diagram canvas"
                tabIndex={0}
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
                <MarkerDefinitions />
            </div>
        </CanvasContextMenu>
    );
};
