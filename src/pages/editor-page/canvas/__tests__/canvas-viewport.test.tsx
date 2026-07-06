import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CanvasViewport } from '../canvas-viewport';

vi.mock('../canvas-context-menu', () => ({
    CanvasContextMenu: ({ children }: { children: React.ReactNode }) => (
        <section data-testid="canvas-context-menu">{children}</section>
    ),
}));

vi.mock('../marker-definitions', () => ({
    MarkerDefinitions: () => <svg data-testid="marker-definitions" />,
}));

describe('CanvasViewport', () => {
    it('renders the accessible canvas container and static marker definitions', () => {
        const handleMouseMove = vi.fn();
        const handleKeyDown = vi.fn();
        const containerRef = React.createRef<HTMLDivElement>();

        render(
            <CanvasViewport
                containerRef={containerRef}
                onMouseMove={handleMouseMove}
                onKeyDown={handleKeyDown}
            >
                <div>flow layers</div>
            </CanvasViewport>
        );

        const canvas = screen.getByRole('application', {
            name: 'Diagram canvas',
        });

        expect(screen.getByTestId('canvas-context-menu')).toContainElement(
            canvas
        );
        expect(canvas).toHaveAttribute('id', 'canvas');
        expect(canvas).toHaveAttribute('tabIndex', '0');
        expect(canvas).toHaveClass('relative', 'flex', 'h-full');
        expect(containerRef.current).toBe(canvas);
        expect(screen.getByText('flow layers')).toBeInTheDocument();
        expect(screen.getByTestId('marker-definitions')).toBeInTheDocument();

        fireEvent.mouseMove(canvas);
        fireEvent.keyDown(canvas, { key: 'Escape' });

        expect(handleMouseMove).toHaveBeenCalledTimes(1);
        expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
});
