import type { NodeDimensionChange, NodePositionChange } from '@xyflow/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { addEdge, createGraph } from '@/lib/graph';
import type { TableNodeType } from '../table-node/table-node';
import { useCanvasOverlapChangeHandler } from '../canvas-overlap-change-handler';

const tableNode = (overrides: Partial<TableNodeType>): TableNodeType =>
    ({
        id: 'table-1',
        type: 'table',
        position: { x: 0, y: 0 },
        measured: { width: 100, height: 100 },
        data: {
            table: { id: 'table-1', x: 0, y: 0, width: 100 },
            isOverlapping: false,
        },
        ...overrides,
    }) as TableNodeType;

describe('useCanvasOverlapChangeHandler', () => {
    it('debounces overlap graph updates for node position changes', () => {
        vi.useFakeTimers();
        const overlapGraph = addEdge(
            createGraph<string>(),
            'table-1',
            'table-2'
        );
        const nodes = [
            tableNode({ id: 'table-1', position: { x: 300, y: 300 } }),
            tableNode({ id: 'table-2', position: { x: 0, y: 0 } }),
        ];
        const setOverlapGraph = vi.fn();

        const { result } = renderHook(() =>
            useCanvasOverlapChangeHandler({
                nodes,
                overlapGraph,
                setOverlapGraph,
                getNode: (id) => nodes.find((node) => node.id === id),
                debounceMs: 200,
            })
        );

        result.current({
            positionChanges: [
                { id: 'table-1', type: 'position' },
            ] as NodePositionChange[],
            sizeChanges: [] as NodeDimensionChange[],
        });

        expect(setOverlapGraph).not.toHaveBeenCalled();

        vi.advanceTimersByTime(200);

        expect(setOverlapGraph).toHaveBeenCalledOnce();
        expect(setOverlapGraph.mock.calls[0][0].graph.get('table-1')).toEqual(
            []
        );
        vi.useRealTimers();
    });

    it('ignores empty change sets', () => {
        const setOverlapGraph = vi.fn();
        const { result } = renderHook(() =>
            useCanvasOverlapChangeHandler({
                nodes: [],
                overlapGraph: createGraph<string>(),
                setOverlapGraph,
                getNode: () => undefined,
                debounceMs: 0,
            })
        );

        result.current({
            positionChanges: [],
            sizeChanges: [],
        });

        expect(setOverlapGraph).not.toHaveBeenCalled();
    });
});
