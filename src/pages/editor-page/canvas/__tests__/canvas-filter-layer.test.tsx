import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CanvasFilterLayer } from '../canvas-filter-layer';

vi.mock('@xyflow/react', () => ({
    Background: ({
        gap,
        size,
        variant,
    }: {
        gap?: number;
        size?: number;
        variant?: string;
    }) => (
        <div
            data-testid="canvas-background"
            data-gap={gap}
            data-size={size}
            data-variant={variant}
        />
    ),
    BackgroundVariant: {
        Dots: 'dots',
    },
}));

vi.mock('../canvas-filter/canvas-filter', () => ({
    CanvasFilter: ({ onClose }: { onClose: () => void }) => (
        <button onClick={onClose}>close filter</button>
    ),
}));

vi.mock('../canvas-empty-filter-overlay', () => ({
    CanvasEmptyFilterOverlay: ({
        onResetFilter,
    }: {
        onResetFilter: () => void;
    }) => <button onClick={onResetFilter}>reset hidden tables</button>,
}));

describe('CanvasFilterLayer', () => {
    it('renders the canvas background and closed filter state', () => {
        render(
            <CanvasFilterLayer
                allTablesHiddenByFilter={false}
                showFilter={false}
                onResetFilter={vi.fn()}
                onCloseFilter={vi.fn()}
            />
        );

        expect(screen.getByTestId('canvas-background')).toHaveAttribute(
            'data-variant',
            'dots'
        );
        expect(screen.getByTestId('canvas-background')).toHaveAttribute(
            'data-gap',
            '16'
        );
        expect(
            screen.queryByText('reset hidden tables')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('close filter')).not.toBeInTheDocument();
    });

    it('mounts the empty-filter overlay and filter panel callbacks', async () => {
        const resetFilter = vi.fn();
        const closeFilter = vi.fn();

        render(
            <CanvasFilterLayer
                allTablesHiddenByFilter
                showFilter
                onResetFilter={resetFilter}
                onCloseFilter={closeFilter}
            />
        );

        await userEvent.click(screen.getByText('reset hidden tables'));
        await userEvent.click(screen.getByText('close filter'));

        expect(resetFilter).toHaveBeenCalledTimes(1);
        expect(closeFilter).toHaveBeenCalledTimes(1);
    });
});
