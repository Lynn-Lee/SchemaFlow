import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCanvasEdgeRefresh } from '../canvas-edge-refresh';
import type { EdgeType } from '../canvas-model';

describe('useCanvasEdgeRefresh', () => {
    it('re-registers table handles before rebuilding canvas edges', () => {
        vi.useFakeTimers();
        const updateNodeInternals = vi.fn();
        const setEdges = vi.fn();

        renderHook(() =>
            useCanvasEdgeRefresh({
                tables: [{ id: 'table-1' }, { id: 'table-2' }],
                relationships: [
                    {
                        id: 'rel-1',
                        name: 'table relationship',
                        sourceTableId: 'table-1',
                        targetTableId: 'table-2',
                        sourceFieldId: 'field-1',
                        targetFieldId: 'field-2',
                        sourceCardinality: 'one',
                        targetCardinality: 'many',
                        createdAt: 1,
                    },
                ],
                dependencies: [],
                showDBViews: true,
                updateNodeInternals,
                setEdges,
            })
        );

        expect(updateNodeInternals).toHaveBeenCalledWith([
            'table-1',
            'table-2',
        ]);
        expect(setEdges).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(100);
        });

        expect(setEdges).toHaveBeenCalledTimes(1);
        const edgeUpdater = setEdges.mock.calls[0][0] as (
            edges: EdgeType[]
        ) => EdgeType[];
        expect(edgeUpdater([])).toEqual([
            expect.objectContaining({
                id: 'rel-1',
                source: 'table-1',
                target: 'table-2',
            }),
        ]);

        vi.useRealTimers();
    });
});
