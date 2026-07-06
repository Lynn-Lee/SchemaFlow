import React from 'react';
import { CanvasContextMenu } from './canvas-context-menu';
import { MarkerDefinitions } from './marker-definitions';

export interface CanvasViewportProps {
    containerRef: React.RefObject<HTMLDivElement>;
    onMouseMove: React.MouseEventHandler<HTMLDivElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
    children?: React.ReactNode;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
    containerRef,
    onMouseMove,
    onKeyDown,
    children,
}) => {
    return (
        <CanvasContextMenu>
            <div
                className="relative flex h-full"
                id="canvas"
                ref={containerRef}
                onMouseMove={onMouseMove}
                onKeyDown={onKeyDown}
                role="application"
                aria-label="Diagram canvas"
                tabIndex={0}
            >
                {children}
                <MarkerDefinitions />
            </div>
        </CanvasContextMenu>
    );
};
