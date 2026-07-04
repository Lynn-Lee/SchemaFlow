import { describe, expect, it } from 'vitest';

import type { CommandContext } from '@/schema-core/commands';
import {
    applyDiagramCommand,
    createMergeDiagramDiffCommand,
    createReplaceDiagramCommand,
    type DiagramCommandState,
} from '@/schema-core/commands';
import { DatabaseType, type DBTable, type Diagram } from '@/schema-core/model';

describe('schema-core diagram commands', () => {
    const context: CommandContext = {
        now: () => new Date('2026-07-04T00:00:00.000Z'),
        generateId: () => 'command-1',
    };

    const createTable = (overrides: Partial<DBTable> = {}): DBTable => ({
        id: 'table-1',
        name: 'users',
        x: 0,
        y: 0,
        fields: [],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
        ...overrides,
    });

    const createDiagram = (overrides: Partial<Diagram> = {}): Diagram => ({
        id: 'diagram-1',
        name: 'Existing',
        databaseType: DatabaseType.POSTGRESQL,
        tables: [],
        relationships: [],
        dependencies: [],
        areas: [],
        customTypes: [],
        notes: [],
        createdAt: new Date('2026-07-01T00:00:00.000Z'),
        updatedAt: new Date('2026-07-01T00:00:00.000Z'),
        ...overrides,
    });

    const baseState = (
        overrides: Partial<DiagramCommandState> = {}
    ): DiagramCommandState => ({
        diagram: createDiagram(),
        ...overrides,
    });

    it('replaces a diagram atomically and returns the previous diagram as undo payload', () => {
        const previousDiagram = createDiagram({
            id: 'diagram-old',
            name: 'Old diagram',
            tables: [createTable({ id: 'old-table', name: 'old_table' })],
        });
        const replacement = createDiagram({
            id: 'diagram-new',
            name: 'New diagram',
            tables: [createTable({ id: 'new-table', name: 'new_table' })],
        });

        const result = applyDiagramCommand({
            command: createReplaceDiagramCommand({
                context,
                diagram: replacement,
            }),
            context,
            state: baseState({ diagram: previousDiagram }),
        });

        expect(result.status).toBe('success');
        expect(result.state.diagram).toEqual(replacement);
        expect(result.undoCommand).toMatchObject({
            type: 'diagram.replace',
            payload: { diagram: previousDiagram },
        });
        expect(result.affectedEntityIds).toEqual(['diagram-new', 'new-table']);
    });

    it('keeps the previous state when a replacement diagram has duplicate entity ids', () => {
        const previousDiagram = createDiagram({
            tables: [createTable({ id: 'existing-table' })],
        });
        const duplicateTable = createTable({ id: 'duplicate-table' });
        const replacement = createDiagram({
            tables: [duplicateTable, duplicateTable],
        });

        const result = applyDiagramCommand({
            command: createReplaceDiagramCommand({
                context,
                diagram: replacement,
            }),
            context,
            state: baseState({ diagram: previousDiagram }),
        });

        expect(result.status).toBe('validation_error');
        expect(result.state.diagram).toEqual(previousDiagram);
        expect(result.validationErrors).toEqual([
            {
                code: 'diagram.duplicate_entity_id',
                message: 'Diagram contains duplicate entity ids.',
                entityId: 'duplicate-table',
                path: ['tables', 'duplicate-table'],
            },
        ]);
    });

    it('merges diff additions through a diagram command and validates the final diagram before applying it', () => {
        const users = createTable({
            id: 'users',
            fields: [
                {
                    id: 'id',
                    name: 'id',
                    type: { id: 'integer', name: 'integer' },
                    primaryKey: true,
                    unique: true,
                    nullable: false,
                    createdAt: 1,
                },
            ],
        });
        const baseDiagram = createDiagram({ tables: [users] });
        const addedField = {
            id: 'email',
            name: 'email',
            type: { id: 'text', name: 'text' },
            primaryKey: false,
            unique: false,
            nullable: true,
            createdAt: 1,
        };
        const addedTable = createTable({ id: 'posts', name: 'posts' });

        const result = applyDiagramCommand({
            command: createMergeDiagramDiffCommand({
                context,
                additions: {
                    tables: [addedTable],
                    fieldsByTableId: new Map([['users', [addedField]]]),
                    relationships: [],
                    areas: [],
                },
            }),
            context,
            state: baseState({ diagram: baseDiagram }),
        });

        expect(result.status).toBe('success');
        expect(result.state.diagram.tables).toEqual([
            {
                ...users,
                fields: [...users.fields, addedField],
            },
            addedTable,
        ]);
        expect(result.undoCommand).toMatchObject({
            type: 'diagram.replace',
            payload: { diagram: baseDiagram },
        });
    });
});
