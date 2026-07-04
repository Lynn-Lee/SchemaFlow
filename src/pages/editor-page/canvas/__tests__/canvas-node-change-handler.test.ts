import { act, renderHook } from '@testing-library/react';
import type {
    NodeDimensionChange,
    NodePositionChange,
    NodeRemoveChange,
} from '@xyflow/react';
import { describe, expect, it, vi } from 'vitest';
import type { Area } from '@/lib/domain/area';
import type { DBTable } from '@/lib/domain/db-table';
import { useCanvasNodeChangeHandler } from '../canvas-node-change-handler';
import type { NodeType } from '../canvas-model';

describe('useCanvasNodeChangeHandler', () => {
    it('persists table, area, and note node changes before applying React Flow changes', () => {
        const tables = [
            { id: 'table-1', x: 10, y: 20, width: 120 },
        ] as DBTable[];
        const areas = [{ id: 'area-1', x: 0, y: 0 }] as Area[];
        const getNode = (id: string) =>
            (
                [
                    { id: 'table-1', type: 'table' },
                    { id: 'area-1', type: 'area' },
                    { id: 'note-1', type: 'note' },
                ] as NodeType[]
            ).find((node) => node.id === id);
        const updateTablesState = vi.fn();
        const updateOverlappingGraphOnChanges = vi.fn();
        const updateArea = vi.fn();
        const removeArea = vi.fn();
        const updateNote = vi.fn();
        const removeNote = vi.fn();
        const onNodesChange = vi.fn();
        const changes = [
            {
                id: 'table-1',
                type: 'position',
                position: { x: 30, y: 40 },
                dragging: false,
            } satisfies NodePositionChange,
            {
                id: 'area-1',
                type: 'dimensions',
                dimensions: { width: 400, height: 200 },
                resizing: true,
            } satisfies NodeDimensionChange,
            { id: 'note-1', type: 'remove' } satisfies NodeRemoveChange,
        ];

        const { result } = renderHook(() =>
            useCanvasNodeChangeHandler({
                readonly: false,
                tables,
                areas,
                getNode,
                onNodesChange,
                updateTablesState,
                updateOverlappingGraphOnChanges,
                updateArea,
                removeArea,
                updateNote,
                removeNote,
            })
        );

        act(() => result.current(changes));

        expect(updateTablesState).toHaveBeenCalledWith(expect.any(Function), {
            updateHistory: true,
        });
        const tableUpdater = updateTablesState.mock.calls[0][0] as (
            currentTables: DBTable[]
        ) => DBTable[];
        expect(tableUpdater(tables)).toEqual([
            { id: 'table-1', x: 30, y: 40, width: 120 },
        ]);
        expect(updateOverlappingGraphOnChanges).toHaveBeenCalledWith({
            positionChanges: [changes[0]],
            sizeChanges: [],
        });
        expect(updateArea).toHaveBeenCalledWith('area-1', {
            width: 400,
            height: 200,
        });
        expect(removeArea).not.toHaveBeenCalled();
        expect(removeNote).toHaveBeenCalledWith('note-1');
        expect(updateNote).not.toHaveBeenCalled();
        expect(onNodesChange).toHaveBeenCalledWith(changes);
    });
});
