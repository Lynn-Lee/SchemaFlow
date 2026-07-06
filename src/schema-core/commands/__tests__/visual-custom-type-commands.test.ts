import { describe, expect, it } from 'vitest';

import type { CommandContext, DiagramCommand } from '@/schema-core/commands';
import {
    applyAreaCommand,
    applyCustomTypeCommand,
    applyNoteCommand,
    createAddAreaCommand,
    createAddCustomTypeCommand,
    createDeleteAreaCommand,
    createDeleteCustomTypeCommand,
    createUpdateNoteCommand,
    type DiagramVisualCustomTypeCommandState,
} from '@/schema-core/commands';
import type { Area, DBTable, Note } from '@/schema-core/model';
import { DatabaseType, DBCustomTypeKind } from '@/schema-core/model';

describe('schema-core visual and custom type commands', () => {
    const context: CommandContext = {
        now: () => new Date('2026-07-01T00:00:00.000Z'),
        generateId: () => 'command-1',
    };

    const area: Area = {
        id: 'area-1',
        name: 'Core',
        x: 10,
        y: 20,
        width: 300,
        height: 200,
        color: '#00aaff',
        order: 0,
    };

    const note: Note = {
        id: 'note-1',
        content: 'Use **safe** markdown',
        x: 40,
        y: 50,
        width: 220,
        height: 160,
        color: '#ffe374',
        order: 0,
    };

    const tableUsingCustomType: DBTable = {
        id: 'table-1',
        name: 'users',
        x: 0,
        y: 0,
        fields: [
            {
                id: 'field-1',
                name: 'status',
                type: { id: 'status_type', name: 'status_type' },
                primaryKey: false,
                unique: false,
                nullable: false,
                createdAt: 1,
            },
        ],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
    };

    const baseState = (
        overrides: Partial<DiagramVisualCustomTypeCommandState> = {}
    ): DiagramVisualCustomTypeCommandState => ({
        databaseType: DatabaseType.POSTGRESQL,
        tables: [],
        areas: [],
        notes: [],
        customTypes: [],
        ...overrides,
    });

    it('adds and deletes areas with inverse commands for undo', () => {
        const addResult = applyAreaCommand({
            command: createAddAreaCommand({ context, area }),
            context,
            state: baseState(),
        });

        expect(addResult.status).toBe('success');
        expect(addResult.state.areas).toEqual([area]);
        expect(addResult.undoCommand).toMatchObject<
            Partial<DiagramCommand<'area.delete'>>
        >({
            type: 'area.delete',
            payload: { areaId: 'area-1' },
        });

        const deleteResult = applyAreaCommand({
            command: createDeleteAreaCommand({
                context,
                areaId: 'area-1',
            }),
            context,
            state: addResult.state,
        });

        expect(deleteResult.status).toBe('success');
        expect(deleteResult.state.areas).toEqual([]);
        expect(deleteResult.undoCommand).toMatchObject({
            type: 'area.add',
            payload: { area },
        });
    });

    it('updates notes as opaque markdown content and returns the previous note for undo', () => {
        const unsafeMarkdown =
            '<script>alert("x")</script> [x](javascript:bad)';

        const result = applyNoteCommand({
            command: createUpdateNoteCommand({
                context,
                noteId: 'note-1',
                note: { content: unsafeMarkdown },
            }),
            context,
            state: baseState({ notes: [note] }),
        });

        expect(result.status).toBe('success');
        expect(result.state.notes).toEqual([
            { ...note, content: unsafeMarkdown },
        ]);
        expect(result.undoCommand).toMatchObject({
            type: 'note.update',
            payload: { noteId: 'note-1', note },
        });
    });

    it('blocks deleting a custom type while table fields still reference it', () => {
        const customType = {
            id: 'status_type',
            name: 'status_type',
            kind: DBCustomTypeKind.enum,
            values: ['active', 'blocked'],
            fields: [],
        };
        const addResult = applyCustomTypeCommand({
            command: createAddCustomTypeCommand({ context, customType }),
            context,
            state: baseState(),
        });

        expect(addResult.status).toBe('success');

        const deleteResult = applyCustomTypeCommand({
            command: createDeleteCustomTypeCommand({
                context,
                customTypeId: 'status_type',
            }),
            context,
            state: {
                ...addResult.state,
                tables: [tableUsingCustomType],
            },
        });

        expect(deleteResult.status).toBe('validation_error');
        expect(deleteResult.state.customTypes).toEqual([customType]);
        expect(deleteResult.validationErrors).toEqual([
            {
                code: 'custom_type.in_use',
                message: 'Custom type is still used by table fields.',
                entityId: 'status_type',
                path: ['customTypes', 'status_type'],
            },
        ]);
        expect(deleteResult.affectedEntityIds).toEqual([
            'status_type',
            'field-1',
        ]);
    });
});
