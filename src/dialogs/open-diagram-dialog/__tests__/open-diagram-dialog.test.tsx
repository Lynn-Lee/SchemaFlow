import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenDiagramDialog } from '../open-diagram-dialog';

const mocks = vi.hoisted(() => ({
    listDiagrams: vi.fn(),
    closeOpenDiagramDialog: vi.fn(),
    openCreateDiagramDialog: vi.fn(),
    updateConfig: vi.fn(),
    navigate: vi.fn(),
    t: vi.fn((key: string) => key),
}));

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        listDiagrams: mocks.listDiagrams,
    }),
}));

vi.mock('@/hooks/use-dialog', () => ({
    useDialog: () => ({
        closeOpenDiagramDialog: mocks.closeOpenDiagramDialog,
        openCreateDiagramDialog: mocks.openCreateDiagramDialog,
    }),
}));

vi.mock('@/hooks/use-config', () => ({
    useConfig: () => ({
        updateConfig: mocks.updateConfig,
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: mocks.t,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => mocks.navigate,
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
        vi.resetAllMocks();
        mocks.t.mockImplementation((key: string) => key);
    });

    it('shows a retryable error state when local diagram storage cannot be read', async () => {
        mocks.listDiagrams.mockRejectedValue(new Error('IndexedDB blocked'));

        renderOpenDiagramDialog();

        expect(
            await screen.findByText('open_diagram_dialog.load_error.title')
        ).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(
            screen.getByText('open_diagram_dialog.load_error.description')
        ).toBeInTheDocument();

        const callsBeforeRetry = mocks.listDiagrams.mock.calls.length;
        mocks.listDiagrams.mockResolvedValueOnce([]);
        await userEvent.click(
            screen.getByRole('button', {
                name: 'open_diagram_dialog.load_error.retry',
            })
        );

        await waitFor(() => {
            expect(mocks.listDiagrams.mock.calls.length).toBeGreaterThan(
                callsBeforeRetry
            );
        });
    });
});
