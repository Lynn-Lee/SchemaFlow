import { describe, expect, it } from 'vitest';
import type { Node } from '@xyflow/react';
import {
    CANVAS_KEYBOARD_MOVE_STEP,
    getCanvasKeyboardNodeChanges,
} from '../canvas-keyboard-actions';

const node = (
    id: string,
    selected: boolean,
    type: 'table' | 'area' | 'note' | 'temp-cursor' = 'table'
): Node =>
    ({
        id,
        type,
        selected,
        position: { x: 100, y: 200 },
        data: {},
    }) as Node;

describe('canvas keyboard actions', () => {
    it('moves selected editable nodes with arrow keys', () => {
        expect(
            getCanvasKeyboardNodeChanges({
                key: 'ArrowRight',
                nodes: [node('table-1', true), node('table-2', false)],
                readonly: false,
            })
        ).toEqual([
            {
                id: 'table-1',
                type: 'position',
                position: {
                    x: 100 + CANVAS_KEYBOARD_MOVE_STEP,
                    y: 200,
                },
                dragging: false,
            },
        ]);
    });

    it('removes selected editable nodes with delete keys', () => {
        expect(
            getCanvasKeyboardNodeChanges({
                key: 'Delete',
                nodes: [
                    node('table-1', true),
                    node('cursor', true, 'temp-cursor'),
                ],
                readonly: false,
            })
        ).toEqual([
            {
                id: 'table-1',
                type: 'remove',
            },
        ]);
    });

    it('does not change nodes when the canvas is readonly', () => {
        expect(
            getCanvasKeyboardNodeChanges({
                key: 'ArrowDown',
                nodes: [node('table-1', true)],
                readonly: true,
            })
        ).toEqual([]);
    });
});
