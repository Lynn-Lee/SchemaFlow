import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCanvasRelationshipTargetHighlight } from '../canvas-relationship-target-highlight';
import type { NodeType } from '../canvas-model';

const tableNode = (
    id: string,
    isRelationshipCreatingTarget = false
): NodeType =>
    ({
        id,
        type: 'table',
        data: { isRelationshipCreatingTarget },
    }) as NodeType;

describe('useCanvasRelationshipTargetHighlight', () => {
    it('marks every other table as relationship target while a source table is active', () => {
        const setNodes = vi.fn();

        renderHook(() =>
            useCanvasRelationshipTargetHighlight({
                sourceNodeId: 'table-1',
                setNodes,
            })
        );

        const updateNodes = setNodes.mock.calls[0][0] as (
            nodes: NodeType[]
        ) => NodeType[];

        expect(
            updateNodes([
                tableNode('table-1'),
                tableNode('table-2'),
                { id: 'note-1', type: 'note', data: {} } as NodeType,
            ])
        ).toEqual([
            tableNode('table-1', false),
            tableNode('table-2', true),
            { id: 'note-1', type: 'note', data: {} },
        ]);
    });

    it('clears stale relationship target markers when there is no source table', () => {
        const setNodes = vi.fn();

        renderHook(() =>
            useCanvasRelationshipTargetHighlight({
                sourceNodeId: undefined,
                setNodes,
            })
        );

        const updateNodes = setNodes.mock.calls[0][0] as (
            nodes: NodeType[]
        ) => NodeType[];

        expect(updateNodes([tableNode('table-2', true)])).toEqual([
            tableNode('table-2', false),
        ]);
    });
});
