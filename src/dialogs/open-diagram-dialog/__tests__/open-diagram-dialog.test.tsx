import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenDiagramDialog } from '../open-diagram-dialog';

const listDiagrams = vi.fn();
const closeOpenDiagramDialog = vi.fn();
const openCreateDiagramDialog = vi.fn();
const updateConfig = vi.fn();
const navigate = vi.fn();

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        listDiagrams,
    }),
}));

vi.mock('@/hooks/use-dialog', () => ({
    useDialog: () => ({
        closeOpenDiagramDialog,
        openCreateDiagramDialog,
    }),
}));

vi.mock('@/hooks/use-config', () => ({
    useConfig: () => ({
        updateConfig,
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => navigate,
    };
});

const renderOpenDiagramDialog = () =>
    render(
        <MemoryRouter>
            <OpenDiagramDialog dialog={{ open: true }} />
        </MemoryRouter>
    );

describe('OpenDiagramDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows a retryable error state when local diagram storage cannot be read', async () => {
        listDiagrams.mockRejectedValueOnce(new Error('IndexedDB blocked'));

        renderOpenDiagramDialog();

        expect(
            await screen.findByRole('alert', {
                name: 'Could not load local diagrams',
            })
        ).toBeInTheDocument();
        expect(screen.getByText('IndexedDB blocked')).toBeInTheDocument();

        listDiagrams.mockResolvedValueOnce([]);
        await userEvent.click(
            screen.getByRole('button', { name: 'Retry loading diagrams' })
        );

        await waitFor(() => {
            expect(listDiagrams).toHaveBeenCalledTimes(2);
        });
    });
});
