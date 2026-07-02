import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LocalConfigProvider } from '@/context/local-config-context/local-config-provider';
import { SettingsDialog } from '../settings-dialog';

const renderSettings = () =>
    render(
        <LocalConfigProvider>
            <SettingsDialog dialog={{ open: true }} />
        </LocalConfigProvider>
    );

describe('SettingsDialog', () => {
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
            screen.getByText(/ChartDB stores diagrams in this browser/)
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
        expect(localStorage.getItem('chartdb.ai.byok.key')).toBeNull();
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
});
