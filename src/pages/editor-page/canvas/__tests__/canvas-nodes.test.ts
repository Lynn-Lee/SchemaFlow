import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import { DBCustomTypeKind } from '@/lib/domain/db-custom-type';
import type { Area } from '@/lib/domain/area';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { Note } from '@/lib/domain/note';
import type { Graph } from '@/lib/graph';
import type { NodeType } from '../canvas-model';
import { buildCanvasNodes } from '../canvas-nodes';

const table = (overrides: Partial<DBTable> = {}): DBTable =>
    ({
        id: 'users',
        name: 'users',
        schema: 'public',
        x: 10,
        y: 20,
        fields: [
            {
                id: 'field-id',
                name: 'id',
                type: { id: 'uuid', name: 'uuid' },
                primaryKey: true,
                unique: false,
                nullable: false,
                createdAt: 1,
            },
        ],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
        ...overrides,
    }) as DBTable;

const relationship = (
    overrides: Partial<DBRelationship> = {}
): DBRelationship => ({
    id: 'rel-1',
    name: 'orders_users',
    sourceTableId: 'orders',
    targetTableId: 'users',
    sourceFieldId: 'user_id',
    targetFieldId: 'field-id',
    sourceCardinality: 'many',
    targetCardinality: 'one',
    createdAt: 1,
    ...overrides,
});

const area = (overrides: Partial<Area> = {}): Area => ({
    id: 'area-1',
    name: 'Core',
    x: 100,
    y: 120,
    width: 300,
    height: 200,
    color: '#f8d66d',
    ...overrides,
});

const note = (overrides: Partial<Note> = {}): Note => ({
    id: 'note-1',
    content: 'Remember indexes',
    x: 300,
    y: 320,
    width: 160,
    height: 100,
    color: '#ffffff',
    ...overrides,
});

const overlapGraph = (ids: string[] = []): Graph<string> => ({
    graph: new Map(ids.map((id) => [id, ['other-table']])),
    lastUpdated: Date.now(),
});

describe('canvas node mapping', () => {
    it('builds table, area, and note nodes while preserving transient canvas nodes', () => {
        const previousTransientNode = {
            id: 'cursor',
            type: 'temp-cursor',
            position: { x: 1, y: 2 },
            data: {},
        } as NodeType;

        const nodes = buildCanvasNodes({
            tables: [table()],
            areas: [area()],
            notes: [note()],
            previousNodes: [previousTransientNode],
            relationships: [relationship()],
            overlapGraph: overlapGraph(['users']),
            databaseType: DatabaseType.POSTGRESQL,
            filterLoading: false,
            showDBViews: true,
            highlightOverlappingTables: true,
            highlightedCustomType: {
                id: 'uuid',
                name: 'uuid',
                kind: DBCustomTypeKind.enum,
            },
            shouldForceShowTable: () => false,
        });

        expect(nodes.map((node) => node.id)).toEqual([
            'users',
            'area-1',
            'note-1',
            'cursor',
        ]);
        expect(nodes[0]).toMatchObject({
            id: 'users',
            type: 'table',
            data: {
                isOverlapping: true,
                highlightOverlappingTables: true,
                hasHighlightedCustomType: true,
                targetEdgeCounts: { 'field-id': 1 },
            },
        });
        expect(nodes[3]).toBe(previousTransientNode);
    });
});
