import { describe, expect, it } from 'vitest';
import type { EdgeChange } from '@xyflow/react';
import {
    buildCanvasEdgeChangeSet,
    type CanvasEdgeLookup,
} from '../canvas-edge-changes';
import type { EdgeType } from '../canvas-model';

const relationshipEdge = (id: string, relationshipId: string) =>
    ({
        id,
        type: 'relationship-edge',
        data: { relationship: { id: relationshipId } },
    }) as EdgeType;

const dependencyEdge = (id: string, dependencyId: string) =>
    ({
        id,
        type: 'dependency-edge',
        data: { dependency: { id: dependencyId } },
    }) as EdgeType;

const lookup = (edges: EdgeType[]): CanvasEdgeLookup => {
    const byId = new Map(edges.map((edge) => [edge.id, edge]));
    return (id) => byId.get(id);
};

describe('canvas edge changes', () => {
    it('returns relationship and dependency ids removed by edge changes', () => {
        const changes = [
            { id: 'edge-relationship', type: 'remove' },
            { id: 'edge-dependency', type: 'remove' },
            { id: 'missing-edge', type: 'remove' },
            { id: 'edge-selected', type: 'select', selected: true },
        ] as EdgeChange<EdgeType>[];

        expect(
            buildCanvasEdgeChangeSet({
                changes,
                readonly: false,
                getEdge: lookup([
                    relationshipEdge('edge-relationship', 'rel-1'),
                    dependencyEdge('edge-dependency', 'dep-1'),
                ]),
            })
        ).toEqual({
            changesToApply: changes,
            relationshipIdsToRemove: ['rel-1'],
            dependencyIdsToRemove: ['dep-1'],
        });
    });

    it('filters remove changes without deleting relationships in readonly mode', () => {
        const selectChange = {
            id: 'edge-selected',
            type: 'select',
            selected: true,
        } as EdgeChange<EdgeType>;

        expect(
            buildCanvasEdgeChangeSet({
                changes: [
                    { id: 'edge-relationship', type: 'remove' },
                    selectChange,
                ] as EdgeChange<EdgeType>[],
                readonly: true,
                getEdge: lookup([
                    relationshipEdge('edge-relationship', 'rel-1'),
                ]),
            })
        ).toEqual({
            changesToApply: [selectChange],
            relationshipIdsToRemove: [],
            dependencyIdsToRemove: [],
        });
    });
});
