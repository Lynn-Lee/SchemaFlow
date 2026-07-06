import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { SchemaFlowProvider } from '../schemaflow-provider';
import { useSchemaFlowSelector } from '../schemaflow-context';
import type { DBTable } from '@/lib/domain/db-table';
import { DiffProvider } from '@/context/diff-context/diff-provider';

const createTable = (id: string, name: string): DBTable => ({
    id,
    name,
    x: 0,
    y: 0,
    fields: [],
    indexes: [],
    color: '#ffffff',
    isView: false,
    createdAt: Date.now(),
});

const renderCounts = {
    diagramName: 0,
    tables: 0,
};

const DiagramNameSubscriber: React.FC = React.memo(() => {
    renderCounts.diagramName += 1;
    const diagramName = useSchemaFlowSelector(
        (schemaFlow) => schemaFlow.diagramName
    );

    return <div data-testid="diagram-name">{diagramName}</div>;
});
DiagramNameSubscriber.displayName = 'DiagramNameSubscriber';

const TablesSubscriber: React.FC = () => {
    renderCounts.tables += 1;
    const tables = useSchemaFlowSelector((schemaFlow) => schemaFlow.tables);
    const addTables = useSchemaFlowSelector(
        (schemaFlow) => schemaFlow.addTables
    );

    return (
        <button
            type="button"
            onClick={() =>
                void addTables([createTable('table-1', 'users')], {
                    updateHistory: false,
                })
            }
        >
            tables: {tables.length}
        </button>
    );
};

describe('useSchemaFlowSelector', () => {
    it('does not rerender a selector subscriber when an unrelated slice changes', async () => {
        renderCounts.diagramName = 0;
        renderCounts.tables = 0;

        render(
            <DiffProvider>
                <SchemaFlowProvider readonly>
                    <DiagramNameSubscriber />
                    <TablesSubscriber />
                </SchemaFlowProvider>
            </DiffProvider>
        );

        expect(screen.getByTestId('diagram-name')).toHaveTextContent('');
        expect(renderCounts.diagramName).toBe(1);
        expect(renderCounts.tables).toBe(1);

        await act(async () => {
            screen.getByRole('button', { name: 'tables: 0' }).click();
        });

        expect(screen.getByRole('button', { name: 'tables: 1' })).toBeVisible();
        expect(renderCounts.diagramName).toBe(1);
        expect(renderCounts.tables).toBeGreaterThan(1);
    });
});
