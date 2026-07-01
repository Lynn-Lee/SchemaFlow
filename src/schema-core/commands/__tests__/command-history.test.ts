import { describe, expect, it } from 'vitest';

import {
    applyTableCommand,
    createAddTableCommand,
    createCommandHistoryEntry,
    type CommandContext,
} from '@/schema-core/commands';
import { DatabaseType, type DBTable } from '@/schema-core/model';

describe('schema-core command history', () => {
    const context: CommandContext = {
        now: () => new Date('2026-07-01T00:00:00.000Z'),
        generateId: () => 'command-1',
    };

    const table: DBTable = {
        id: 'table-1',
        name: 'users',
        x: 10,
        y: 20,
        fields: [],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
    };

    it('captures redo and undo commands for a successful command result', () => {
        const redoCommand = createAddTableCommand({ context, table });
        const result = applyTableCommand({
            command: redoCommand,
            context,
            state: {
                databaseType: DatabaseType.POSTGRESQL,
                tables: [],
                relationships: [],
                dependencies: [],
                notes: [],
            },
        });

        const historyEntry = createCommandHistoryEntry({
            redoCommand,
            result,
        });

        expect(historyEntry).toMatchObject({
            redoCommand,
            undoCommand: {
                type: 'table.delete',
                payload: { tableId: 'table-1' },
            },
            affectedEntityIds: ['table-1'],
            risks: [],
        });
    });

    it('does not create history for validation errors without an undo command', () => {
        const redoCommand = createAddTableCommand({ context, table });
        const result = applyTableCommand({
            command: redoCommand,
            context,
            state: {
                databaseType: DatabaseType.POSTGRESQL,
                tables: [table],
                relationships: [],
                dependencies: [],
                notes: [],
            },
        });

        expect(createCommandHistoryEntry({ redoCommand, result })).toBeNull();
    });
});
