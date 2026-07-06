import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CanvasEmptyFilterOverlay } from '../canvas-empty-filter-overlay';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('CanvasEmptyFilterOverlay', () => {
    it('renders the hidden tables message and resets the filter', async () => {
        const resetFilter = vi.fn();

        render(<CanvasEmptyFilterOverlay onResetFilter={resetFilter} />);

        expect(
            screen.getByText('canvas.all_tables_hidden')
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole('button', { name: 'canvas.show_all_tables' })
        );

        expect(resetFilter).toHaveBeenCalledTimes(1);
    });
});
