import type { EdgeChange } from '@xyflow/react';
import type { DependencyEdgeType } from './dependency-edge/dependency-edge';
import type { RelationshipEdgeType } from './relationship-edge/relationship-edge';
import type { EdgeType } from './canvas-model';

export type CanvasEdgeLookup = (id: string) => EdgeType | undefined;

export type CanvasEdgeChangeSet = {
    changesToApply: EdgeChange<EdgeType>[];
    relationshipIdsToRemove: string[];
    dependencyIdsToRemove: string[];
};

export const buildCanvasEdgeChangeSet = ({
    changes,
    readonly,
    getEdge,
}: {
    changes: EdgeChange<EdgeType>[];
    readonly: boolean;
    getEdge: CanvasEdgeLookup;
}): CanvasEdgeChangeSet => {
    const changesToApply = readonly
        ? changes.filter((change) => change.type !== 'remove')
        : changes;

    const edgesToRemove = changesToApply
        .filter((change) => change.type === 'remove')
        .map((change) => getEdge(change.id))
        .filter((edge): edge is EdgeType => !!edge);

    return {
        changesToApply,
        relationshipIdsToRemove: (
            edgesToRemove.filter(
                (edge) => edge.type === 'relationship-edge'
            ) as RelationshipEdgeType[]
        ).flatMap((edge) =>
            edge.data?.relationship?.id ? [edge.data.relationship.id] : []
        ),
        dependencyIdsToRemove: (
            edgesToRemove.filter(
                (edge) => edge.type === 'dependency-edge'
            ) as DependencyEdgeType[]
        ).flatMap((edge) =>
            edge.data?.dependency?.id ? [edge.data.dependency.id] : []
        ),
    };
};
