import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBTable } from '@/lib/domain/db-table';
import type { Area } from '@/lib/domain/area';
import type { Note } from '@/lib/domain/note';
import {
    areaToAreaNode,
    edgeTypes,
    initialEdges,
    nodeTypes,
    noteToNoteNode,
    tableToTableNode,
} from '../canvas-model';

const table = (overrides: Partial<DBTable> = {}): DBTable => ({
    id: 'table-1',
    name: 'users',
    schema: 'public',
    x: 10,
    y: 20,
    fields: [],
    indexes: [],
    color: '#ffffff',
    isView: false,
    createdAt: 1,
    ...overrides,
});

describe('canvas model mapping', () => {
    it('exports stable React Flow node and edge type maps', () => {
        expect(Object.keys(nodeTypes).sort()).toEqual([
            'area',
            'create-relationship',
            'note',
            'table',
            'temp-cursor',
        ]);
        expect(Object.keys(edgeTypes).sort()).toEqual([
            'dependency-edge',
            'relationship-edge',
            'temp-floating-edge',
        ]);
        expect(initialEdges).toEqual([]);
    });

    it('maps tables to visible React Flow nodes with table sizing defaults', () => {
        expect(
            tableToTableNode(table(), {
                databaseType: DatabaseType.POSTGRESQL,
                filterLoading: false,
            })
        ).toMatchObject({
            id: 'table-1',
            type: 'table',
            position: { x: 10, y: 20 },
            width: 224,
            hidden: false,
            data: {
                table: expect.objectContaining({ name: 'users' }),
                isOverlapping: false,
            },
        });
    });

    it('keeps filtered tables hidden unless force shown', () => {
        const hiddenTable = table({ id: 'table-2', name: 'orders' });

        expect(
            tableToTableNode(hiddenTable, {
                databaseType: DatabaseType.POSTGRESQL,
                filter: { tableIds: ['table-1'] },
                filterLoading: false,
            }).hidden
        ).toBe(true);

        expect(
            tableToTableNode(hiddenTable, {
                databaseType: DatabaseType.POSTGRESQL,
                filter: { tableIds: ['table-1'] },
                filterLoading: false,
                forceShow: true,
            }).hidden
        ).toBe(false);
    });

    it('maps areas and notes to their canvas node layers', () => {
        const area: Area = {
            id: 'area-1',
            name: 'Core',
            x: 100,
            y: 110,
            width: 300,
            height: 200,
            color: '#ffeeaa',
        };
        const note: Note = {
            id: 'note-1',
            content: 'remember',
            x: 20,
            y: 30,
            width: 160,
            height: 100,
            color: '#fff',
        };

        expect(
            areaToAreaNode(area, {
                tables: [],
                databaseType: DatabaseType.POSTGRESQL,
                filterLoading: false,
            })
        ).toMatchObject({
            id: 'area-1',
            type: 'area',
            position: { x: 100, y: 110 },
            zIndex: -10,
            hidden: false,
        });

        expect(noteToNoteNode(note)).toMatchObject({
            id: 'note-1',
            type: 'note',
            position: { x: 20, y: 30 },
            zIndex: 50,
        });
    });
});
