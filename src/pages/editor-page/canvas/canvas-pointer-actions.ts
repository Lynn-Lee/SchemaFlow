import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';
import type { CanvasContext } from '@/context/canvas-context/canvas-context';

type CanvasPosition = {
    x: number;
    y: number;
};

type UseCanvasPointerActionsParams = {
    tempFloatingEdge: CanvasContext['tempFloatingEdge'];
    endFloatingEdgeCreation: CanvasContext['endFloatingEdgeCreation'];
    setCursorPosition: (position: CanvasPosition | null) => void;
    hideCreateRelationshipNode: CanvasContext['hideCreateRelationshipNode'];
    exitEditTableMode: () => void;
    closeRelationshipPopover: CanvasContext['closeRelationshipPopover'];
    screenToFlowPosition: (position: CanvasPosition) => CanvasPosition;
    canvasEvents: CanvasContext['events'];
};

export const useCanvasPointerActions = ({
    tempFloatingEdge,
    endFloatingEdgeCreation,
    setCursorPosition,
    hideCreateRelationshipNode,
    exitEditTableMode,
    closeRelationshipPopover,
    screenToFlowPosition,
    canvasEvents,
}: UseCanvasPointerActionsParams) => {
    const rafIdRef = useRef<number>();

    const clearFloatingEdge = useCallback(() => {
        if (!tempFloatingEdge) {
            return;
        }

        endFloatingEdgeCreation();
        setCursorPosition(null);
    }, [tempFloatingEdge, endFloatingEdgeCreation, setCursorPosition]);

    const closeCanvasOverlays = useCallback(() => {
        hideCreateRelationshipNode();
        exitEditTableMode();
        closeRelationshipPopover();
    }, [
        hideCreateRelationshipNode,
        exitEditTableMode,
        closeRelationshipPopover,
    ]);

    const handleMouseMove = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (!tempFloatingEdge || rafIdRef.current) {
                return;
            }

            rafIdRef.current = requestAnimationFrame(() => {
                const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
                setCursorPosition(position);
                rafIdRef.current = undefined;
            });
        },
        [tempFloatingEdge, screenToFlowPosition, setCursorPosition]
    );

    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') {
                return;
            }

            clearFloatingEdge();
            closeCanvasOverlays();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [clearFloatingEdge, closeCanvasOverlays]);

    const onPaneClickHandler = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            clearFloatingEdge();
            closeCanvasOverlays();

            canvasEvents.emit({
                action: 'pan_click',
                data: {
                    x: event.clientX,
                    y: event.clientY,
                },
            });
        },
        [canvasEvents, clearFloatingEdge, closeCanvasOverlays]
    );

    return {
        handleMouseMove,
        onPaneClickHandler,
    };
};
