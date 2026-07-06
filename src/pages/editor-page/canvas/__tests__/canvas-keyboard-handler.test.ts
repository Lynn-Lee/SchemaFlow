import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NodeType } from '../canvas-model';
import { useCanvasKeyboardHandler } from '../canvas-keyboard-handler';

const node = (id: string, selected: boolean): NodeType =>
    ({
        id,
        type: 'table',
        selected,
        position: { x: 100, y: 200 },
        data: {},
    }) as NodeType;

const keyboardEvent = ({
    key,
    target = document.createElement('div'),
}: {
    key: string;
    target?: EventTarget;
}) =>
    ({
        key,
        target,
        defaultPrevented: false,
        preventDefault: vi.fn(),
    }) as unknown as React.KeyboardEvent<HTMLDivElement>;

describe('useCanvasKeyboardHandler', () => {
    it('converts canvas keyboard actions into node changes', () => {
        const onNodesChange = vi.fn();
        const { result } = renderHook(() =>
            useCanvasKeyboardHandler({
                nodes: [node('table-1', true), node('table-2', false)],
                readonly: false,
                onNodesChange,
            })
        );
        const event = keyboardEvent({ key: 'ArrowRight' });

        act(() => {
            result.current(event);
        });

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        expect(onNodesChange).toHaveBeenCalledWith([
            {
                id: 'table-1',
                type: 'position',
                position: { x: 120, y: 200 },
                dragging: false,
            },
        ]);
    });

    it('ignores editable targets and non-action keys', () => {
        const onNodesChange = vi.fn();
        const input = document.createElement('input');
        const { result } = renderHook(() =>
            useCanvasKeyboardHandler({
                nodes: [node('table-1', true)],
                readonly: false,
                onNodesChange,
            })
        );
        const inputEvent = keyboardEvent({ key: 'Delete', target: input });
        const nonActionEvent = keyboardEvent({ key: 'Enter' });

        act(() => {
            result.current(inputEvent);
            result.current(nonActionEvent);
        });

        expect(inputEvent.preventDefault).not.toHaveBeenCalled();
        expect(nonActionEvent.preventDefault).not.toHaveBeenCalled();
        expect(onNodesChange).not.toHaveBeenCalled();
    });
});
