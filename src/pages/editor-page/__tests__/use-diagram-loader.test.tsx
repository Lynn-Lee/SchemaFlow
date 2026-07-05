import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useDiagramLoader } from '../use-diagram-loader';

const loadDiagram = vi.fn();
const listDiagrams = vi.fn();
const showLoader = vi.fn();
const hideLoader = vi.fn();
const openOpenDiagramDialog = vi.fn();
const navigate = vi.fn();
const resetRedoStack = vi.fn();
const resetUndoStack = vi.fn();
const config = {
    defaultDiagramId: undefined,
};

vi.mock('@/hooks/use-config', () => ({
    useConfig: () => ({
        config,
    }),
}));

vi.mock('@/hooks/use-schemaflow', () => ({
    useSchemaFlow: () => ({
        currentDiagram: undefined,
        loadDiagram,
    }),
}));

vi.mock('@/hooks/use-redo-undo-stack', () => ({
    useRedoUndoStack: () => ({
        resetRedoStack,
        resetUndoStack,
    }),
}));

vi.mock('@/hooks/use-full-screen-spinner', () => ({
    useFullScreenLoader: () => ({
        showLoader,
        hideLoader,
    }),
}));

vi.mock('@/hooks/use-dialog', () => ({
    useDialog: () => ({
        openOpenDiagramDialog,
    }),
}));

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        listDiagrams,
    }),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => navigate,
    useParams: () => ({
        diagramId: 'diagram-1',
    }),
}));

const TestLoader = () => {
    const { loadError, retryLoadDiagram } = useDiagramLoader();

    return loadError ? (
        <section role="alert">
            <h1>Diagram could not be loaded</h1>
            <p>{loadError}</p>
            <button type="button" onClick={retryLoadDiagram}>
                Retry loading diagram
            </button>
        </section>
    ) : null;
};

describe('useDiagramLoader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        listDiagrams.mockResolvedValue([]);
    });

    it('hides the loader and exposes a retryable error when storage loading fails', async () => {
        loadDiagram.mockRejectedValue(new Error('IndexedDB blocked'));

        render(<TestLoader />);

        await waitFor(() => {
            expect(hideLoader).toHaveBeenCalled();
        });

        expect(
            await screen.findByRole('heading', {
                name: 'Diagram could not be loaded',
            })
        ).toBeInTheDocument();
        expect(screen.getByText('IndexedDB blocked')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Retry loading diagram' })
        ).toBeInTheDocument();
        expect(openOpenDiagramDialog).not.toHaveBeenCalled();
    });
});
