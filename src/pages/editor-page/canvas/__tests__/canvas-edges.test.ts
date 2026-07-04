import { describe, expect, it } from 'vitest';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import { buildCanvasEdges, getHighlightedCanvasEdges } from '../canvas-edges';

const relationship = (
    overrides: Partial<DBRelationship> = {}
): DBRelationship => ({
    id: 'rel-1',
    name: 'users_orders',
    sourceTableId: 'users',
    targetTableId: 'orders',
    sourceFieldId: 'id',
    targetFieldId: 'user_id',
    sourceCardinality: 'one',
    targetCardinality: 'many',
    createdAt: 1,
    ...overrides,
});

const dependency = (overrides: Partial<DBDependency> = {}): DBDependency => ({
    id: 'dep-1',
    tableId: 'orders',
    dependentTableId: 'users',
    createdAt: 1,
    ...overrides,
});

describe('canvas edge mapping', () => {
    it('maps relationships and dependencies while preserving previous edge state', () => {
        const edges = buildCanvasEdges({
            relationships: [relationship()],
            dependencies: [dependency()],
            previousEdges: [
                {
                    id: 'rel-1',
                    source: 'users',
                    target: 'orders',
                    type: 'relationship-edge',
                    selected: true,
                    animated: true,
                },
            ],
            showDBViews: false,
        });

        expect(edges).toMatchObject([
            {
                id: 'rel-1',
                source: 'users',
                target: 'orders',
                sourceHandle: 'left_rel_id',
                targetHandle: 'target_rel_0_user_id',
                type: 'relationship-edge',
                selected: true,
                animated: true,
            },
            {
                id: 'dep-1',
                source: 'users',
                target: 'orders',
                sourceHandle: 'top_dep_users',
                targetHandle: 'target_dep_0_orders',
                type: 'dependency-edge',
                hidden: true,
                selected: false,
                animated: false,
            },
        ]);
    });

    it('updates highlight state only when selected nodes or edges affect an edge', () => {
        const edges = buildCanvasEdges({
            relationships: [
                relationship(),
                relationship({
                    id: 'rel-2',
                    sourceTableId: 'orders',
                    targetTableId: 'products',
                    sourceFieldId: 'product_id',
                    targetFieldId: 'id',
                }),
            ],
            dependencies: [],
            previousEdges: [],
            showDBViews: true,
        });

        const highlightedEdges = getHighlightedCanvasEdges({
            edges,
            selectedRelationshipIds: ['rel-2'],
            selectedTableIds: ['users'],
        });

        expect(highlightedEdges).toMatchObject([
            {
                id: 'rel-1',
                animated: true,
                zIndex: 1,
                data: { highlighted: true },
            },
            {
                id: 'rel-2',
                animated: true,
                zIndex: 1,
                data: { highlighted: true },
            },
        ]);

        expect(
            getHighlightedCanvasEdges({
                edges: highlightedEdges,
                selectedRelationshipIds: ['rel-2'],
                selectedTableIds: ['users'],
            })
        ).toBe(highlightedEdges);
    });
});
