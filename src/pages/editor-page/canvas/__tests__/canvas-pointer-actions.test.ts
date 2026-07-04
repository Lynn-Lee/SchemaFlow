import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCanvasPointerActions } from '../canvas-pointer-actions';

describe('useCanvasPointerActions', () => {
    const setup = ({
        hasFloatingEdge = true,
    }: { hasFloatingEdge?: boolean } = {}) => {
        const requestAnimationFrameSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback) => {
                callback(1);
                return 1;
            });
        const cancelAnimationFrameSpy = vi
            .spyOn(window, 'cancelAnimationFrame')
            .mockImplementation(() => undefined);

        const params = {
            tempFloatingEdge: hasFloatingEdge
                ? {
                      sourceNodeId: 'table-1',
                  }
                : null,
            endFloatingEdgeCreation: vi.fn(),
            setCursorPosition: vi.fn(),
            hideCreateRelationshipNode: vi.fn(),
            exitEditTableMode: vi.fn(),
            closeRelationshipPopover: vi.fn(),
            screenToFlowPosition: vi.fn(() => ({ x: 12, y: 34 })),
            canvasEvents: {
                emit: vi.fn(),
            } as unknown as Parameters<
                typeof useCanvasPointerActions
            >[0]['canvasEvents'],
        };

        const hook = renderHook(() => useCanvasPointerActions(params));

        return {
            ...params,
            hook,
            requestAnimationFrameSpy,
            cancelAnimationFrameSpy,
        };
    };

    it('updates the floating edge cursor position from mouse movement', () => {
        const { hook, screenToFlowPosition, setCursorPosition } = setup();

        act(() => {
            hook.result.current.handleMouseMove({
                clientX: 100,
                clientY: 200,
            } as React.MouseEvent<HTMLDivElement>);
        });

        expect(screenToFlowPosition).toHaveBeenCalledWith({
            x: 100,
            y: 200,
        });
        expect(setCursorPosition).toHaveBeenCalledWith({ x: 12, y: 34 });
    });

    it('ignores mouse movement when no floating edge is active', () => {
        const { hook, screenToFlowPosition, setCursorPosition } = setup({
            hasFloatingEdge: false,
        });

        act(() => {
            hook.result.current.handleMouseMove({
                clientX: 100,
                clientY: 200,
            } as React.MouseEvent<HTMLDivElement>);
        });

        expect(screenToFlowPosition).not.toHaveBeenCalled();
        expect(setCursorPosition).not.toHaveBeenCalled();
    });

    it('closes floating edge and canvas overlays on pane click', () => {
        const {
            hook,
            endFloatingEdgeCreation,
            setCursorPosition,
            hideCreateRelationshipNode,
            exitEditTableMode,
            closeRelationshipPopover,
            canvasEvents,
        } = setup();

        act(() => {
            hook.result.current.onPaneClickHandler({
                clientX: 20,
                clientY: 30,
            } as React.MouseEvent<Element, MouseEvent>);
        });

        expect(endFloatingEdgeCreation).toHaveBeenCalledTimes(1);
        expect(setCursorPosition).toHaveBeenCalledWith(null);
        expect(hideCreateRelationshipNode).toHaveBeenCalledTimes(1);
        expect(exitEditTableMode).toHaveBeenCalledTimes(1);
        expect(closeRelationshipPopover).toHaveBeenCalledTimes(1);
        expect(canvasEvents.emit).toHaveBeenCalledWith({
            action: 'pan_click',
            data: { x: 20, y: 30 },
        });
    });

    it('closes floating edge and canvas overlays on Escape', () => {
        const {
            endFloatingEdgeCreation,
            setCursorPosition,
            hideCreateRelationshipNode,
            exitEditTableMode,
            closeRelationshipPopover,
        } = setup();

        act(() => {
            document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape' })
            );
        });

        expect(endFloatingEdgeCreation).toHaveBeenCalledTimes(1);
        expect(setCursorPosition).toHaveBeenCalledWith(null);
        expect(hideCreateRelationshipNode).toHaveBeenCalledTimes(1);
        expect(exitEditTableMode).toHaveBeenCalledTimes(1);
        expect(closeRelationshipPopover).toHaveBeenCalledTimes(1);
    });
});
