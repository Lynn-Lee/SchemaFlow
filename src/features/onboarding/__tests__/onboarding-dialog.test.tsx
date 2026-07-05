import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import { CreateDiagramDialogStep } from '@/dialogs/create-diagram-dialog/create-diagram-dialog-step';
import { OnboardingDialog } from '../onboarding-dialog';

const addDiagram = vi.fn();
const deleteDiagram = vi.fn();
const updateConfig = vi.fn();
const navigate = vi.fn();
const openCreateDiagramDialog = vi.fn();
const openImportDiagramDialog = vi.fn();

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        addDiagram,
        deleteDiagram,
    }),
}));

vi.mock('@/hooks/use-config', () => ({
    useConfig: () => ({
        updateConfig,
    }),
}));

vi.mock('@/hooks/use-dialog', () => ({
    useDialog: () => ({
        openCreateDiagramDialog,
        openImportDiagramDialog,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => navigate,
    };
});

const renderDialog = () =>
    render(
        <MemoryRouter>
            <OnboardingDialog open onClose={vi.fn()} />
        </MemoryRouter>
    );

describe('OnboardingDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        addDiagram.mockResolvedValue(undefined);
        deleteDiagram.mockResolvedValue(undefined);
        updateConfig.mockResolvedValue(undefined);
    });

    it('shows the three first-run start options before creating anything', () => {
        renderDialog();

        expect(
            screen.getByRole('heading', { name: 'Start a SchemaFlow diagram' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('radio', { name: /PostgreSQL/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Import existing database/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /New blank diagram/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Browse templates/i })
        ).toBeInTheDocument();
        expect(addDiagram).not.toHaveBeenCalled();
    });

    it('does not offer ClickHouse as a DDL import database option', () => {
        renderDialog();

        expect(
            screen.queryByRole('radio', { name: /ClickHouse/i })
        ).not.toBeInTheDocument();
    });

    it('explains why continue cannot create a blank diagram without a database', async () => {
        renderDialog();
        const user = userEvent.setup();

        await user.click(
            screen.getByRole('button', { name: /New blank diagram/i })
        );
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(
            screen.getByText(
                'Choose a database before creating or importing a diagram.'
            )
        ).toBeInTheDocument();
        expect(addDiagram).not.toHaveBeenCalled();
    });

    it('creates a blank diagram only after database and start option are selected', async () => {
        renderDialog();
        const user = userEvent.setup();

        await user.click(screen.getByRole('radio', { name: /PostgreSQL/i }));
        await user.click(
            screen.getByRole('button', { name: /New blank diagram/i })
        );
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(addDiagram).toHaveBeenCalledWith({
            diagram: expect.objectContaining({
                databaseType: DatabaseType.POSTGRESQL,
                name: 'Diagram 1',
            }),
        });
        expect(updateConfig).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith(
            expect.stringMatching(/^\/diagrams\//)
        );
    });

    it('opens the import path with the selected database ready for import', async () => {
        renderDialog();
        const user = userEvent.setup();

        await user.click(screen.getByRole('radio', { name: /MySQL/i }));
        await user.click(
            screen.getByRole('button', { name: /Import existing database/i })
        );
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(openCreateDiagramDialog).toHaveBeenCalledWith({
            initialDatabaseType: DatabaseType.MYSQL,
            initialStep: CreateDiagramDialogStep.IMPORT_DATABASE,
        });
        expect(addDiagram).not.toHaveBeenCalled();
    });

    it('opens the template path without creating a diagram', async () => {
        renderDialog();
        const user = userEvent.setup();

        await user.click(screen.getByRole('radio', { name: /PostgreSQL/i }));
        await user.click(
            screen.getByRole('button', { name: /Browse templates/i })
        );
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(navigate).toHaveBeenCalledWith('/templates/featured');
        expect(addDiagram).not.toHaveBeenCalled();
    });
});
