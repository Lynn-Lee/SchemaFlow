import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBTable } from '@/lib/domain/db-table';
import type { createGraph } from '@/lib/graph';
import { useCanvasFilterViewportSync } from '../canvas-filter-viewport-sync';

const table = (overrides: Partial<DBTable>): DBTable =>
    ({
        id: 'table-1',
        name: 'table_1',
        schema: 'public',
        x: 0,
        y: 0,
        width: 100,
        fields: [],
        indexes: [],
        color: '',
        isView: false,
        ...overrides,
    }) as DBTable;

describe('useCanvasFilterViewportSync', () => {
    it('rebuilds visible overlap graph and refits when filter settings change', () => {
        const setOverlapGraph = vi.fn();
        const fitView = vi.fn();
        const tables = [
            table({ id: 'visible-1', x: 0, y: 0, schema: 'public' }),
            table({ id: 'visible-2', x: 40, y: 40, schema: 'public' }),
            table({
                id: 'hidden-view',
                x: 45,
                y: 45,
                schema: 'public',
                isView: true,
            }),
        ];

        const { rerender } = renderHook(
            ({ showDBViews }) =>
                useCanvasFilterViewportSync({
                    tables,
                    filter: { schemaIds: ['public'] },
                    databaseType: DatabaseType.POSTGRESQL,
                    showDBViews,
                    setOverlapGraph,
                    fitView,
                    debounceMs: 0,
                }),
            { initialProps: { showDBViews: false } }
        );

        expect(setOverlapGraph).toHaveBeenCalledTimes(0);

        rerender({ showDBViews: true });

        expect(setOverlapGraph).toHaveBeenCalledWith(
            expect.objectContaining({ graph: expect.any(Map) })
        );
        const graph = setOverlapGraph.mock.calls[0][0] as ReturnType<
            typeof createGraph<string>
        >;
        expect(graph.graph.get('visible-1')).toContain('visible-2');
        expect(graph.graph.has('hidden-view')).toBe(true);
        expect(fitView).toHaveBeenCalledWith({
            duration: 500,
            padding: 0.1,
            maxZoom: 0.8,
        });
    });
});
