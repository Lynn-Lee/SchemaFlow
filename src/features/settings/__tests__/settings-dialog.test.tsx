import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalConfigProvider } from '@/context/local-config-context/local-config-provider';
import { DatabaseType } from '@/lib/domain/database-type';
import type { Diagram } from '@/lib/domain/diagram';
import { clearBYOKSessionKey } from '@/lib/ai/ai-mode';
import { createSchemaFlowBackup } from '@/storage/backup';
import { SettingsDialog } from '../settings-dialog';

const clearAllDiagramsMock = vi.fn();
const addDiagramMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        clearAllDiagrams: clearAllDiagramsMock,
        addDiagram: addDiagramMock,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

const renderSettings = () =>
    render(
        <LocalConfigProvider>
            <SettingsDialog dialog={{ open: true }} />
        </LocalConfigProvider>
    );

const createDiagram = (): Diagram => ({
    id: 'diagram-1',
    name: 'Storefront',
    databaseType: DatabaseType.POSTGRESQL,
    createdAt: new Date('2026-07-01T10:00:00.000Z'),
    updatedAt: new Date('2026-07-01T10:05:00.000Z'),
    tables: [
        {
            id: 'table-1',
            name: 'customers',
            x: 10,
            y: 20,
            fields: [],
            indexes: [],
            color: '#f8fafc',
            isView: false,
            createdAt: 1782938400000,
        },
    ],
    relationships: [],
    dependencies: [],
    areas: [],
    customTypes: [],
    notes: [],
});

describe('SettingsDialog', () => {
    beforeEach(() => {
        clearAllDiagramsMock.mockReset();
        addDiagramMock.mockReset();
        addDiagramMock.mockResolvedValue(undefined);
        navigateMock.mockReset();
        clearBYOKSessionKey();
        localStorage.removeItem('schemaflow.ai.mode');
        localStorage.removeItem('schemaflow.ai.byok.key');
        sessionStorage.removeItem('schemaflow.ai.byok.key');
    });

    it('centralizes display, AI mode, export, and local data controls', () => {
        renderSettings();

        expect(
            screen.getByRole('heading', { name: 'Settings' })
        ).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Display' })).toBeVisible();
        expect(screen.getByLabelText('Theme')).toBeInTheDocument();
        expect(screen.getByLabelText('Language')).toBeInTheDocument();
        expect(screen.getByLabelText('Show mini map')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Show field attributes')
        ).toBeInTheDocument();

        expect(screen.getByRole('heading', { name: 'AI mode' })).toBeVisible();
        expect(screen.getByLabelText('AI-assisted export mode')).toHaveValue(
            'disabled'
        );
        expect(
            screen.getByText('BYOK keys are session-only and are never saved.')
        ).toBeInTheDocument();

        expect(
            screen.getByRole('heading', { name: 'Data management' })
        ).toBeVisible();
        expect(
            screen.getByText(/SchemaFlow stores diagrams in this browser/)
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Export diagram backup' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Restore from backup' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Clear local diagrams' })
        ).toBeInTheDocument();
    });

    it('switches AI mode without persisting provider secrets', async () => {
        renderSettings();
        const user = userEvent.setup();

        await user.selectOptions(
            screen.getByLabelText('AI-assisted export mode'),
            'byok-session'
        );

        expect(screen.getByLabelText('AI-assisted export mode')).toHaveValue(
            'byok-session'
        );
        expect(localStorage.getItem('schemaflow.ai.byok.key')).toBeNull();
        expect(
            localStorage.getItem(['OPENAI', 'API', 'KEY'].join('_'))
        ).toBeNull();
        expect(
            screen.getByText('Paste the API key only when exporting SQL.')
        ).toBeInTheDocument();
    });

    it('shows a degraded storage notice when localStorage is unavailable', () => {
        const original = globalThis.localStorage;
        const throwingStorage = {
            getItem: () => {
                throw new Error('blocked');
            },
            setItem: () => {
                throw new Error('blocked');
            },
            removeItem: () => {
                throw new Error('blocked');
            },
            clear: () => {
                throw new Error('blocked');
            },
            key: () => null,
            length: 0,
        } as Storage;

        Object.defineProperty(globalThis, 'localStorage', {
            configurable: true,
            value: throwingStorage,
        });

        try {
            renderSettings();
        } finally {
            Object.defineProperty(globalThis, 'localStorage', {
                configurable: true,
                value: original,
            });
        }

        expect(
            screen.getByText(
                'Browser settings are unavailable. Changes work for this session only.'
            )
        ).toBeInTheDocument();
    });

    it('confirms before clearing local diagrams and reports success', async () => {
        const user = userEvent.setup();
        renderSettings();

        await user.click(
            screen.getByRole('button', { name: 'Clear local diagrams' })
        );

        expect(
            screen.getByRole('alertdialog', {
                name: 'Delete all local diagrams?',
            })
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', { name: 'Delete local diagrams' })
        );

        await waitFor(() =>
            expect(clearAllDiagramsMock).toHaveBeenCalledOnce()
        );
        expect(
            screen.getByText('All local diagrams have been deleted.')
        ).toBeInTheDocument();
    });

    it('previews a backup summary before restoring diagrams', async () => {
        const user = userEvent.setup();
        renderSettings();
        const backup = createSchemaFlowBackup({
            diagrams: [createDiagram()],
            now: new Date('2026-07-01T12:00:00.000Z'),
            appVersion: '1.20.1-test',
        });

        await user.upload(
            screen.getByLabelText('Backup file'),
            new File([JSON.stringify(backup)], 'schemaflow-backup.json', {
                type: 'application/json',
            })
        );

        expect(
            await screen.findByRole('alertdialog', {
                name: 'Restore backup preview?',
            })
        ).toBeInTheDocument();
        expect(screen.getByText('Storefront')).toBeInTheDocument();
        expect(screen.getByText(/1 table/)).toBeInTheDocument();
        expect(screen.getByText(/0 relationships/)).toBeInTheDocument();
        expect(addDiagramMock).not.toHaveBeenCalled();

        await user.click(
            screen.getByRole('button', { name: 'Restore backup' })
        );

        await waitFor(() => expect(addDiagramMock).toHaveBeenCalledOnce());
        expect(navigateMock).toHaveBeenCalledWith(
            expect.stringMatching(/^\/diagrams\//)
        );
    });
});
