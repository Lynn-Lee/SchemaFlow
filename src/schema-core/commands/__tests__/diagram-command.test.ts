import { describe, expect, it } from 'vitest';

import {
    createCommandRisk,
    createDiagramCommand,
    createSuccessResult,
    createValidationErrorResult,
    type CommandContext,
    type CommandRisk,
    type DiagramCommand,
    type ValidationIssue,
} from '@/schema-core/commands';

describe('schema-core command contract', () => {
    const context: CommandContext = {
        now: () => new Date('2026-07-01T00:00:00.000Z'),
        generateId: () => 'command-1',
    };

    it('creates diagram commands with stable id, type, payload, and timestamp fields', () => {
        const command = createDiagramCommand({
            context,
            type: 'table.create',
            payload: { tableId: 'table-1' },
        });

        expect(command).toEqual<DiagramCommand<'table.create'>>({
            id: 'command-1',
            type: 'table.create',
            payload: { tableId: 'table-1' },
            createdAt: '2026-07-01T00:00:00.000Z',
        });
    });

    it('represents successful command results with affected entities and undo commands', () => {
        const undoCommand = createDiagramCommand({
            context,
            id: 'undo-command-1',
            type: 'table.delete',
            payload: { tableId: 'table-1' },
        });

        const result = createSuccessResult({
            state: { tableIds: ['table-1'] },
            affectedEntityIds: ['table-1'],
            undoCommand,
        });

        expect(result).toEqual({
            status: 'success',
            state: { tableIds: ['table-1'] },
            affectedEntityIds: ['table-1'],
            undoCommand,
            risks: [],
            validationErrors: [],
        });
    });

    it('represents validation failures without throwing for normal business errors', () => {
        const validationError: ValidationIssue = {
            code: 'table.name.empty',
            message: 'Table name is required.',
            entityId: 'table-1',
            path: ['tables', 'table-1', 'name'],
        };

        const result = createValidationErrorResult({
            state: { tableIds: ['table-1'] },
            validationErrors: [validationError],
            affectedEntityIds: ['table-1'],
        });

        expect(result.status).toBe('validation_error');
        expect(result.validationErrors).toEqual([validationError]);
        expect(result.risks).toEqual([]);
    });

    it('attaches risk metadata to destructive command results', () => {
        const risk = createCommandRisk({
            level: 'high',
            code: 'table.delete.cascade',
            message: 'Deleting this table also removes relationships.',
            affectedEntityIds: ['table-1', 'relationship-1'],
        });

        expect(risk).toEqual<CommandRisk>({
            level: 'high',
            code: 'table.delete.cascade',
            message: 'Deleting this table also removes relationships.',
            affectedEntityIds: ['table-1', 'relationship-1'],
        });

        const result = createSuccessResult({
            state: { tableIds: [] },
            affectedEntityIds: ['table-1', 'relationship-1'],
            risks: [risk],
        });

        expect(result.status).toBe('success');
        expect(result.risks).toEqual([risk]);
    });
});
