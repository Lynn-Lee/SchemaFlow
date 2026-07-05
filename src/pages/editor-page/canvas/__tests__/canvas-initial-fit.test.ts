import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { DBTable } from '@/lib/domain/db-table';
import { tableToTableNode } from '../canvas-model';
import { useCanvasInitialFit } from '../canvas-initial-fit';

const table = (overrides: Partial<DBTable> = {}): DBTable =>
    ({
        id: 'table-1',
        name: 'table_1',
        schema: 'public',
        x: 0,
        y: 0,
        fields: [],
        indexes: [],
        color: '#ffffff',
        isView: false,
        ...overrides,
    }) as DBTable;

describe('useCanvasInitialFit', () => {
    it('marks initial nodes loaded and fits the viewport once React Flow nodes match', async () => {
        const initialTables = [table()];
        const nodes = initialTables.map((initialTable) =>
            tableToTableNode(initialTable, {
                databaseType: DatabaseType.POSTGRESQL,
                filterLoading: false,
                showDBViews: true,
                forceShow: false,
                isRelationshipCreatingTarget: false,
            })
        );
        const fitView = vi.fn();

        const { result } = renderHook(() =>
            useCanvasInitialFit({
                initialTables,
                nodes,
                databaseType: DatabaseType.POSTGRESQL,
                filterLoading: false,
                showDBViews: true,
                shouldForceShowTable: () => false,
                fitView,
                debounceMs: 0,
            })
        );

        await waitFor(() => expect(result.current).toBe(false));

        expect(fitView).toHaveBeenCalledWith({
            duration: 200,
            padding: 0.1,
            maxZoom: 0.8,
        });
    });
});
