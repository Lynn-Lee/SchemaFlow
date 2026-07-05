import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../error-boundary';

const ThrowingChild = () => {
    throw new Error('render failed');
};

describe('ErrorBoundary', () => {
    it('renders a recovery fallback when a child throws during render', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        render(
            <ErrorBoundary>
                <ThrowingChild />
            </ErrorBoundary>
        );

        expect(
            screen.getByRole('heading', { name: /something went wrong/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /refresh page/i })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/schemaflow ran into an unexpected error/i)
        ).toBeInTheDocument();

        consoleError.mockRestore();
    });
});
