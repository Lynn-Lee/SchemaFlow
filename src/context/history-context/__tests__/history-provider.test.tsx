import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HistoryProvider } from '../history-provider';
import { useHistory } from '@/hooks/use-history';
import type { RedoUndoAction } from '../redo-undo-action';
import type { DBTable } from '@/schema-core/model';

const chartDB = {
    addTables: vi.fn(),
    removeTables: vi.fn(),
    updateTable: vi.fn(),
    updateDiagramName: vi.fn(),
    removeField: vi.fn(),
    addField: vi.fn(),
    updateField: vi.fn(),
    addRelationships: vi.fn(),
    addDependencies: vi.fn(),
    removeDependencies: vi.fn(),
    updateDependency: vi.fn(),
    updateRelationship: vi.fn(),
    updateTablesState: vi.fn(),
    addIndex: vi.fn(),
    removeIndex: vi.fn(),
    updateIndex: vi.fn(),
    addCheckConstraint: vi.fn(),
    removeCheckConstraint: vi.fn(),
    updateCheckConstraint: vi.fn(),
    removeRelationships: vi.fn(),
    addAreas: vi.fn(),
    removeAreas: vi.fn(),
    updateArea: vi.fn(),
    addCustomTypes: vi.fn(),
    removeCustomTypes: vi.fn(),
    updateCustomType: vi.fn(),
    addNotes: vi.fn(),
    removeNotes: vi.fn(),
    updateNote: vi.fn(),
};

const redoUndoStack = {
    addRedoAction: vi.fn(),
    addUndoAction: vi.fn(),
    undoStack: [] as RedoUndoAction[],
    redoStack: [] as RedoUndoAction[],
    hasRedo: false,
    hasUndo: false,
};

vi.mock('@/hooks/use-chartdb', () => ({
    useChartDB: () => chartDB,
}));

vi.mock('@/hooks/use-redo-undo-stack', () => ({
    useRedoUndoStack: () => redoUndoStack,
}));

function HistoryActionButton({
    action,
    children,
}: {
    action: 'undo' | 'redo';
    children: ReactNode;
}) {
    const history = useHistory();

    return <button onClick={() => void history[action]()}>{children}</button>;
}

function table(id: string): DBTable {
    return {
        id,
        name: id,
        x: 0,
        y: 0,
        fields: [],
        indexes: [],
        color: '#ffffff',
        isView: false,
        createdAt: 1,
    };
}

describe('HistoryProvider command history replay', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        for (const fn of Object.values(chartDB)) {
            fn.mockResolvedValue(undefined);
        }
        redoUndoStack.undoStack = [];
        redoUndoStack.redoStack = [];
    });

    it('uses commandHistory undo commands before legacy undo payloads', async () => {
        redoUndoStack.undoStack = [
            {
                action: 'addTables',
                redoData: { tables: [table('legacy-redo')] },
                undoData: { tableIds: ['legacy-undo'] },
                commandHistory: {
                    entries: [
                        {
                            redoCommand: {
                                id: 'redo-command',
                                type: 'table.add',
                                payload: { table: table('command-redo') },
                                createdAt: '2026-07-04T00:00:00.000Z',
                            },
                            undoCommand: {
                                id: 'undo-command',
                                type: 'table.delete',
                                payload: { tableId: 'command-undo' },
                                createdAt: '2026-07-04T00:00:00.000Z',
                            },
                            affectedEntityIds: ['command-undo'],
                            risks: [],
                        },
                    ],
                    affectedEntityIds: ['command-undo'],
                    risks: [],
                },
            },
        ];

        render(
            <HistoryProvider>
                <HistoryActionButton action="undo">Undo</HistoryActionButton>
            </HistoryProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Undo' }));

        await waitFor(() =>
            expect(chartDB.removeTables).toHaveBeenCalledWith(
                ['command-undo'],
                { updateHistory: false }
            )
        );
        expect(chartDB.removeTables).not.toHaveBeenCalledWith(
            ['legacy-undo'],
            expect.anything()
        );
        expect(redoUndoStack.addRedoAction).toHaveBeenCalledWith(
            expect.objectContaining({ action: 'addTables' })
        );
    });

    it('uses commandHistory redo commands before legacy redo payloads', async () => {
        redoUndoStack.redoStack = [
            {
                action: 'addTables',
                redoData: { tables: [table('legacy-redo')] },
                undoData: { tableIds: ['legacy-undo'] },
                commandHistory: {
                    entries: [
                        {
                            redoCommand: {
                                id: 'redo-command',
                                type: 'table.add',
                                payload: { table: table('command-redo') },
                                createdAt: '2026-07-04T00:00:00.000Z',
                            },
                            undoCommand: {
                                id: 'undo-command',
                                type: 'table.delete',
                                payload: { tableId: 'command-undo' },
                                createdAt: '2026-07-04T00:00:00.000Z',
                            },
                            affectedEntityIds: ['command-redo'],
                            risks: [],
                        },
                    ],
                    affectedEntityIds: ['command-redo'],
                    risks: [],
                },
            },
        ];

        render(
            <HistoryProvider>
                <HistoryActionButton action="redo">Redo</HistoryActionButton>
            </HistoryProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Redo' }));

        await waitFor(() =>
            expect(chartDB.addTables).toHaveBeenCalledWith(
                [expect.objectContaining({ id: 'command-redo' })],
                { updateHistory: false }
            )
        );
        expect(chartDB.addTables).not.toHaveBeenCalledWith(
            [expect.objectContaining({ id: 'legacy-redo' })],
            expect.anything()
        );
        expect(redoUndoStack.addUndoAction).toHaveBeenCalledWith(
            expect.objectContaining({ action: 'addTables' })
        );
    });

    it('falls back to legacy handlers when commandHistory is absent', async () => {
        redoUndoStack.undoStack = [
            {
                action: 'addTables',
                redoData: { tables: [table('legacy-redo')] },
                undoData: { tableIds: ['legacy-undo'] },
            },
        ];

        render(
            <HistoryProvider>
                <HistoryActionButton action="undo">Undo</HistoryActionButton>
            </HistoryProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: 'Undo' }));

        await waitFor(() =>
            expect(chartDB.removeTables).toHaveBeenCalledWith(['legacy-undo'], {
                updateHistory: false,
            })
        );
    });
});
