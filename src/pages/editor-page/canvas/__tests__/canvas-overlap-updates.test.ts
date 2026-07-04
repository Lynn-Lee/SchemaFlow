import type { NodeDimensionChange, NodePositionChange } from '@xyflow/react';
import { describe, expect, it } from 'vitest';
import { addEdge, createGraph } from '@/lib/graph';
import { DatabaseType } from '@/lib/domain/database-type';
import {
    buildUpdatedOverlapGraphForNodeChanges,
    buildVisibleTableOverlapGraph,
} from '../canvas-overlap-updates';
import type { TableNodeType } from '../table-node/table-node';
import type { DBTable } from '@/lib/domain/db-table';

const table = (overrides: Partial<DBTable>): DBTable =>
    ({
        id: 'table-1',
        name: 'table_1',
        schema: 'public',
        x: 0,
        y: 0,
        width: 100,
        fields: [],
        indexes: [],
        color: '',
        isView: false,
        ...overrides,
    }) as DBTable;

const tableNode = (overrides: Partial<TableNodeType>): TableNodeType =>
    ({
        id: 'table-1',
        type: 'table',
        position: { x: 0, y: 0 },
        measured: { width: 100, height: 100 },
        data: {
            table: table({ id: 'table-1' }),
            isOverlapping: false,
        },
        ...overrides,
    }) as TableNodeType;

describe('canvas overlap updates', () => {
    it('builds overlap graph from tables visible under filters and view settings', () => {
        const result = buildVisibleTableOverlapGraph({
            tables: [
                table({ id: 'visible-1', x: 0, y: 0, schema: 'public' }),
                table({ id: 'visible-2', x: 40, y: 40, schema: 'public' }),
                table({
                    id: 'hidden-view',
                    x: 45,
                    y: 45,
                    schema: 'public',
                    isView: true,
                }),
                table({ id: 'hidden-schema', x: 50, y: 50, schema: 'audit' }),
            ],
            filter: { schemaIds: ['public'] },
            databaseType: DatabaseType.POSTGRESQL,
            showDBViews: false,
        });

        expect(result.graph.get('visible-1')).toEqual(['visible-2']);
        expect(result.graph.get('visible-2')).toEqual(['visible-1']);
        expect(result.graph.has('hidden-view')).toBe(false);
        expect(result.graph.has('hidden-schema')).toBe(false);
    });

    it('updates overlap graph only for changed visible table nodes', () => {
        const overlapGraph = addEdge(
            createGraph<string>(),
            'table-1',
            'table-2'
        );
        const nodes = [
            tableNode({ id: 'table-1', position: { x: 300, y: 300 } }),
            tableNode({ id: 'table-2', position: { x: 0, y: 0 } }),
            tableNode({ id: 'hidden-table', hidden: true }),
        ];

        const result = buildUpdatedOverlapGraphForNodeChanges({
            overlapGraph,
            nodes,
            positionChanges: [
                { id: 'table-1', type: 'position' },
                { id: 'missing-table', type: 'position' },
                { id: 'hidden-table', type: 'position' },
            ] as NodePositionChange[],
            sizeChanges: [
                { id: 'table-2', type: 'dimensions' },
            ] as NodeDimensionChange[],
            getNode: (id) => nodes.find((node) => node.id === id),
        });

        expect(result.graph.get('table-1')).toEqual([]);
        expect(result.graph.get('table-2')).toEqual([]);
        expect(result.graph.has('hidden-table')).toBe(false);
    });
});
