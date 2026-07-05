import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCanvasParentAreaSync } from '../canvas-parent-area-sync';
import type { NodeType } from '../canvas-model';

describe('useCanvasParentAreaSync', () => {
    it('syncs changed parent area ids without adding history', () => {
        const updateTablesState = vi.fn();
        const nodes = [
            {
                id: 'table-1',
                type: 'table',
                data: {
                    table: {
                        id: 'table-1',
                        x: 20,
                        y: 20,
                        parentAreaId: null,
                        fields: [],
                    },
                },
            },
            {
                id: 'area-1',
                type: 'area',
                data: {
                    area: {
                        id: 'area-1',
                        x: 0,
                        y: 0,
                        width: 300,
                        height: 300,
                    },
                },
            },
        ] as NodeType[];

        renderHook(() =>
            useCanvasParentAreaSync({
                nodes,
                updateTablesState,
                debounceMs: 0,
            })
        );

        expect(updateTablesState).toHaveBeenCalledWith(expect.any(Function), {
            updateHistory: false,
        });

        const updater = updateTablesState.mock.calls[0][0] as Parameters<
            typeof updateTablesState
        >[0];
        expect(updater([{ id: 'table-1' }])).toEqual([
            { id: 'table-1', parentAreaId: 'area-1' },
        ]);
    });
});
