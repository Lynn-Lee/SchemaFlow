import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { RelationshipEdgeType } from './relationship-edge/relationship-edge';
import type { DependencyEdgeType } from './dependency-edge/dependency-edge';
import type { TempFloatingEdgeType } from './temp-floating-edge/temp-floating-edge';
import {
    LEFT_HANDLE_ID_PREFIX,
    TARGET_ID_PREFIX,
} from './table-node/table-node-field';
import {
    TARGET_DEP_PREFIX,
    TOP_SOURCE_HANDLE_ID_PREFIX,
} from './table-node/table-node-dependency-indicator';
import type { EdgeType } from './canvas-model';

const HIGHLIGHTED_EDGE_Z_INDEX = 1;
const DEFAULT_EDGE_Z_INDEX = 0;

export const buildCanvasEdges = ({
    relationships,
    dependencies,
    previousEdges,
    showDBViews,
}: {
    relationships: DBRelationship[];
    dependencies: DBDependency[];
    previousEdges: EdgeType[];
    showDBViews: boolean;
}): EdgeType[] => {
    const targetIndexes: Record<string, number> = relationships.reduce(
        (acc, relationship) => {
            acc[`${relationship.targetTableId}${relationship.targetFieldId}`] =
                0;
            return acc;
        },
        {} as Record<string, number>
    );

    const targetDepIndexes: Record<string, number> = dependencies.reduce(
        (acc, dep) => {
            acc[dep.tableId] = 0;
            return acc;
        },
        {} as Record<string, number>
    );

    const previousEdgeStates = new Map(
        previousEdges.map((edge) => [
            edge.id,
            { selected: edge.selected, animated: edge.animated },
        ])
    );

    return [
        ...relationships.map((relationship): RelationshipEdgeType => {
            const previousState = previousEdgeStates.get(relationship.id);

            return {
                id: relationship.id,
                source: relationship.sourceTableId,
                target: relationship.targetTableId,
                sourceHandle: `${LEFT_HANDLE_ID_PREFIX}${relationship.sourceFieldId}`,
                targetHandle: `${TARGET_ID_PREFIX}${targetIndexes[`${relationship.targetTableId}${relationship.targetFieldId}`]++}_${relationship.targetFieldId}`,
                type: 'relationship-edge',
                data: { relationship },
                selected: previousState?.selected ?? false,
                animated: previousState?.animated ?? false,
            };
        }),
        ...dependencies.map((dependency): DependencyEdgeType => {
            const previousState = previousEdgeStates.get(dependency.id);

            return {
                id: dependency.id,
                source: dependency.dependentTableId,
                target: dependency.tableId,
                sourceHandle: `${TOP_SOURCE_HANDLE_ID_PREFIX}${dependency.dependentTableId}`,
                targetHandle: `${TARGET_DEP_PREFIX}${targetDepIndexes[dependency.tableId]++}_${dependency.tableId}`,
                type: 'dependency-edge',
                data: { dependency },
                hidden: !showDBViews,
                selected: previousState?.selected ?? false,
                animated: previousState?.animated ?? false,
            };
        }),
    ];
};

export const getHighlightedCanvasEdges = ({
    edges,
    selectedRelationshipIds,
    selectedTableIds,
}: {
    edges: EdgeType[];
    selectedRelationshipIds: string[];
    selectedTableIds: string[];
}): EdgeType[] => {
    const selectedTableIdsSet = new Set(selectedTableIds);
    const selectedRelationshipIdsSet = new Set(selectedRelationshipIds);
    let hasChanges = false;

    const highlightedEdges = edges
        .filter((edge) => edge.type !== 'temp-floating-edge')
        .map((edge): EdgeType => {
            const shouldBeHighlighted =
                selectedRelationshipIdsSet.has(edge.id) ||
                selectedTableIdsSet.has(edge.source) ||
                selectedTableIdsSet.has(edge.target);
            const edgeWithData = edge as Exclude<
                EdgeType,
                TempFloatingEdgeType
            >;
            const currentHighlighted = edgeWithData.data?.highlighted ?? false;
            const currentAnimated = edge.animated ?? false;
            const currentZIndex = edge.zIndex ?? 0;
            const nextZIndex = shouldBeHighlighted
                ? HIGHLIGHTED_EDGE_Z_INDEX
                : DEFAULT_EDGE_Z_INDEX;

            if (
                currentHighlighted === shouldBeHighlighted &&
                currentAnimated === shouldBeHighlighted &&
                currentZIndex === nextZIndex
            ) {
                return edge;
            }

            hasChanges = true;

            if (edge.type === 'dependency-edge') {
                const dependencyEdge = edge as DependencyEdgeType;

                return {
                    ...dependencyEdge,
                    data: {
                        ...dependencyEdge.data!,
                        highlighted: shouldBeHighlighted,
                    },
                    animated: shouldBeHighlighted,
                    zIndex: nextZIndex,
                };
            }

            const relationshipEdge = edge as RelationshipEdgeType;

            return {
                ...relationshipEdge,
                data: {
                    ...relationshipEdge.data!,
                    highlighted: shouldBeHighlighted,
                },
                animated: shouldBeHighlighted,
                zIndex: nextZIndex,
            };
        });

    return hasChanges ? highlightedEdges : edges;
};
