import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DiffProvider } from '@/context/diff-context/diff-provider';
import type { DBTable } from '@/lib/domain/db-table';
import { ChartDBProvider } from '../chartdb-provider';
import { useChartDBSelector } from '../chartdb-context';

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

const ForceOverrideHarness: React.FC<{
    onError: (message: string) => void;
    nextTables: unknown[];
}> = ({ onError, nextTables }) => {
    const tables = useChartDBSelector((chartDB) => chartDB.tables);
    const addTable = useChartDBSelector((chartDB) => chartDB.addTable);
    const updateTablesState = useChartDBSelector(
        (chartDB) => chartDB.updateTablesState
    );

    return (
        <div>
            <div data-testid="table-count">{tables.length}</div>
            <div data-testid="table-name">{tables[0]?.name ?? 'none'}</div>
            <button
                type="button"
                onClick={() =>
                    void addTable(createTable(), { updateHistory: false })
                }
            >
                add table
            </button>
            <button
                type="button"
                onClick={async () => {
                    try {
                        await updateTablesState(() => nextTables as DBTable[], {
                            updateHistory: false,
                            forceOverride: true,
                        });
                    } catch (error) {
                        onError(
                            error instanceof Error
                                ? error.message
                                : String(error)
                        );
                    }
                }}
            >
                force override
            </button>
        </div>
    );
};

describe('updateTablesState forceOverride validation', () => {
    it('replaces the tables snapshot when the override payload is a valid tables array', async () => {
        render(
            <DiffProvider>
                <ChartDBProvider readonly>
                    <ForceOverrideHarness
                        onError={vi.fn()}
                        nextTables={[createTable({ name: 'accounts' })]}
                    />
                </ChartDBProvider>
            </DiffProvider>
        );

        await act(async () => {
            screen.getByText('force override').click();
        });

        expect(screen.getByTestId('table-count').textContent).toBe('1');
        expect(screen.getByTestId('table-name').textContent).toBe('accounts');
    });

    it('rejects a malformed override payload instead of silently corrupting state', async () => {
        const onError = vi.fn();

        render(
            <DiffProvider>
                <ChartDBProvider readonly>
                    <ForceOverrideHarness
                        onError={onError}
                        nextTables={[{ id: 'broken-table' }]}
                    />
                </ChartDBProvider>
            </DiffProvider>
        );

        await act(async () => {
            screen.getByText('add table').click();
        });
        expect(screen.getByTestId('table-count').textContent).toBe('1');

        await act(async () => {
            screen.getByText('force override').click();
        });

        expect(onError).toHaveBeenCalledOnce();
        expect(onError.mock.calls[0][0]).toContain(
            'updateTablesState forceOverride received an invalid tables snapshot'
        );
        expect(screen.getByTestId('table-count').textContent).toBe('1');
        expect(screen.getByTestId('table-name').textContent).toBe('users');
    });
});
