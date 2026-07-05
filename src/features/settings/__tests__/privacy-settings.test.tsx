import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearBYOKSessionKey, getBYOKSessionKey } from '@/lib/ai/ai-mode';
import { PrivacySettings } from '../privacy-settings';

const setAIExportMode = vi.fn();
const setAIGatewayEndpoint = vi.fn();
const setAIGatewayModelName = vi.fn();
let aiExportMode = 'byok-session';
let aiGatewayEndpoint = '';

vi.mock('@/hooks/use-dialog', () => ({
    useDialog: () => ({
        openExportDiagramDialog: vi.fn(),
        openImportDiagramDialog: vi.fn(),
    }),
}));

vi.mock('@/hooks/use-local-config', () => ({
    useLocalConfig: () => ({
        localStorageAvailable: true,
        aiExportMode,
        setAIExportMode,
        aiGatewayEndpoint,
        setAIGatewayEndpoint,
        aiGatewayModelName: '',
        setAIGatewayModelName,
    }),
}));

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        addDiagram: vi.fn(),
        clearAllDiagrams: vi.fn(),
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe('PrivacySettings', () => {
    beforeEach(() => {
        clearBYOKSessionKey();
        localStorage.removeItem('chartdb.ai.byok.key');
        sessionStorage.removeItem('chartdb.ai.byok.key');
        aiExportMode = 'byok-session';
        aiGatewayEndpoint = '';
        setAIExportMode.mockClear();
        setAIGatewayEndpoint.mockClear();
        setAIGatewayModelName.mockClear();
    });

    it('stores BYOK keys only in the in-memory session from settings', async () => {
        render(<PrivacySettings />);
        const user = userEvent.setup();
        const sessionKeyInput = screen.getByLabelText(/^Session API key/);

        await user.type(sessionKeyInput, 'sk-session-only');

        expect(getBYOKSessionKey()).toBe('sk-session-only');
        expect(localStorage.getItem('chartdb.ai.byok.key')).toBeNull();
        expect(sessionStorage.getItem('chartdb.ai.byok.key')).toBeNull();

        await user.clear(sessionKeyInput);

        expect(getBYOKSessionKey()).toBeUndefined();
        expect(localStorage.getItem('chartdb.ai.byok.key')).toBeNull();
        expect(sessionStorage.getItem('chartdb.ai.byok.key')).toBeNull();
    });

    it('rejects unsafe gateway endpoints before saving settings', async () => {
        aiExportMode = 'self-hosted-gateway';
        render(<PrivacySettings />);
        const user = userEvent.setup();

        await user.type(
            screen.getByLabelText(/^Gateway endpoint/),
            'https://169.254.169.254/latest/meta-data'
        );
        await user.tab();

        expect(setAIGatewayEndpoint).not.toHaveBeenCalled();
        expect(
            screen.getByText(/must be a public HTTPS endpoint/)
        ).toBeInTheDocument();
    });

    it('saves public HTTPS gateway endpoints from settings', async () => {
        aiExportMode = 'self-hosted-gateway';
        render(<PrivacySettings />);
        const user = userEvent.setup();

        await user.type(
            screen.getByLabelText(/^Gateway endpoint/),
            'https://gateway.example.com/v1'
        );
        await user.tab();

        expect(setAIGatewayEndpoint).toHaveBeenCalledOnce();
        expect(setAIGatewayEndpoint).toHaveBeenCalledWith(
            'https://gateway.example.com/v1'
        );
        expect(
            screen.queryByText(/must be a public HTTPS endpoint/)
        ).not.toBeInTheDocument();
    });
});
