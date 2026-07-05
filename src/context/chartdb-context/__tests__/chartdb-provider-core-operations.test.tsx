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

const ProviderTableHarness: React.FC<{
    onEvent: (eventName: string) => void;
}> = ({ onEvent }) => {
    const tables = useChartDBSelector((chartDB) => chartDB.tables);
    const events = useChartDBSelector((chartDB) => chartDB.events);
    const addTable = useChartDBSelector((chartDB) => chartDB.addTable);
    const updateTable = useChartDBSelector((chartDB) => chartDB.updateTable);
    const removeTable = useChartDBSelector((chartDB) => chartDB.removeTable);

    events.useSubscription((event) => {
        onEvent(event.action);
    });

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
                onClick={() =>
                    void updateTable(
                        'table-1',
                        { name: 'accounts' },
                        { updateHistory: false }
                    )
                }
            >
                update table
            </button>
            <button
                type="button"
                onClick={() =>
                    void removeTable('table-1', { updateHistory: false })
                }
            >
                remove table
            </button>
        </div>
    );
};

describe('ChartDBProvider core table operations', () => {
    it('updates table state and emits events for add, update, and remove', async () => {
        const onEvent = vi.fn();

        render(
            <DiffProvider>
                <ChartDBProvider readonly>
                    <ProviderTableHarness onEvent={onEvent} />
                </ChartDBProvider>
            </DiffProvider>
        );

        expect(screen.getByTestId('table-count')).toHaveTextContent('0');
        expect(screen.getByTestId('table-name')).toHaveTextContent('none');

        await act(async () => {
            screen.getByRole('button', { name: 'add table' }).click();
        });

        expect(screen.getByTestId('table-count')).toHaveTextContent('1');
        expect(screen.getByTestId('table-name')).toHaveTextContent('users');
        expect(onEvent).toHaveBeenLastCalledWith('add_tables');

        await act(async () => {
            screen.getByRole('button', { name: 'update table' }).click();
        });

        expect(screen.getByTestId('table-count')).toHaveTextContent('1');
        expect(screen.getByTestId('table-name')).toHaveTextContent('accounts');
        expect(onEvent).toHaveBeenLastCalledWith('update_table');

        await act(async () => {
            screen.getByRole('button', { name: 'remove table' }).click();
        });

        expect(screen.getByTestId('table-count')).toHaveTextContent('0');
        expect(screen.getByTestId('table-name')).toHaveTextContent('none');
        expect(onEvent).toHaveBeenLastCalledWith('remove_tables');
    });
});
