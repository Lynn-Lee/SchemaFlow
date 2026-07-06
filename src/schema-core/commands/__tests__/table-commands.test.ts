import { describe, expect, it } from 'vitest';

import type { CommandContext, DiagramCommand } from '@/schema-core/commands';
import {
    applyTableCommand,
    createAddTableCommand,
    createDeleteTableCommand,
    createUpdateTableCommand,
    type DiagramTableCommandState,
} from '@/schema-core/commands';
import type { DBDependency } from '@/schema-core/model';
import {
    DatabaseType,
    type DBRelationship,
    type DBTable,
} from '@/schema-core/model';

describe('schema-core table commands', () => {
    const context: CommandContext = {
        now: () => new Date('2026-07-01T00:00:00.000Z'),
        generateId: () => 'command-1',
    };

    const createTable = (overrides: Partial<DBTable>): DBTable => ({
        id: 'table-1',
        name: 'users',
        x: 10,
        y: 20,
        fields: [],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
        ...overrides,
    });

    const baseState = (
        overrides: Partial<DiagramTableCommandState> = {}
    ): DiagramTableCommandState => ({
        databaseType: DatabaseType.POSTGRESQL,
        tables: [],
        relationships: [],
        dependencies: [],
        notes: [],
        ...overrides,
    });

    it('adds a table and returns a delete undo command', () => {
        const table = createTable({ id: 'table-1' });
        const command = createAddTableCommand({ context, table });

        const result = applyTableCommand({
            command,
            context,
            state: baseState(),
        });

        expect(result.status).toBe('success');
        expect(result.state.tables).toEqual([table]);
        expect(result.affectedEntityIds).toEqual(['table-1']);
        expect(result.undoCommand).toMatchObject<
            Partial<DiagramCommand<'table.delete'>>
        >({
            type: 'table.delete',
            payload: { tableId: 'table-1' },
        });
    });

    it('updates a table name and returns the previous table as undo payload', () => {
        const table = createTable({ id: 'table-1', name: 'users' });
        const command = createUpdateTableCommand({
            context,
            tableId: 'table-1',
            table: { name: 'accounts' },
        });

        const result = applyTableCommand({
            command,
            context,
            state: baseState({ tables: [table] }),
        });

        expect(result.status).toBe('success');
        expect(result.state.tables).toEqual([{ ...table, name: 'accounts' }]);
        expect(result.undoCommand).toMatchObject({
            type: 'table.update',
            payload: { tableId: 'table-1', table },
        });
    });

    it('returns a validation error when updating a missing table', () => {
        const command = createUpdateTableCommand({
            context,
            tableId: 'missing-table',
            table: { name: 'accounts' },
        });

        const result = applyTableCommand({
            command,
            context,
            state: baseState(),
        });

        expect(result.status).toBe('validation_error');
        expect(result.state.tables).toEqual([]);
        expect(result.validationErrors).toEqual([
            {
                code: 'table.not_found',
                message: 'Table was not found.',
                entityId: 'missing-table',
                path: ['tables', 'missing-table'],
            },
        ]);
    });

    it('deletes a table and reports removed relationships and dependencies', () => {
        const table = createTable({ id: 'table-1' });
        const otherTable = createTable({ id: 'table-2', name: 'orders' });
        const relationship: DBRelationship = {
            id: 'relationship-1',
            name: 'orders_user_id_fk',
            sourceTableId: 'table-2',
            targetTableId: 'table-1',
            sourceFieldId: 'user_id',
            targetFieldId: 'id',
            sourceCardinality: 'many',
            targetCardinality: 'one',
            createdAt: 1,
        };
        const dependency: DBDependency = {
            id: 'dependency-1',
            tableId: 'table-1',
            dependentTableId: 'table-2',
            createdAt: 1,
        };
        const command = createDeleteTableCommand({
            context,
            tableId: 'table-1',
        });

        const result = applyTableCommand({
            command,
            context,
            state: baseState({
                tables: [table, otherTable],
                relationships: [relationship],
                dependencies: [dependency],
            }),
        });

        expect(result.status).toBe('success');
        expect(result.state.tables).toEqual([otherTable]);
        expect(result.state.relationships).toEqual([]);
        expect(result.state.dependencies).toEqual([]);
        expect(result.affectedEntityIds).toEqual([
            'table-1',
            'relationship-1',
            'dependency-1',
        ]);
        expect(result.risks).toEqual([
            {
                level: 'high',
                code: 'table.delete.cascade',
                message:
                    'Deleting this table also removes relationships or dependencies.',
                affectedEntityIds: [
                    'table-1',
                    'relationship-1',
                    'dependency-1',
                ],
            },
        ]);
        expect(result.undoCommand).toMatchObject({
            type: 'table.restore',
            payload: {
                table,
                relationships: [relationship],
                dependencies: [dependency],
            },
        });
    });
});
