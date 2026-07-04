import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearBYOKSessionKey, getBYOKSessionKey } from '@/lib/ai/ai-mode';
import { PrivacySettings } from '../privacy-settings';

vi.mock('@/hooks/use-dialog', () => ({
    useDialog: () => ({
        openExportDiagramDialog: vi.fn(),
        openImportDiagramDialog: vi.fn(),
    }),
}));

vi.mock('@/hooks/use-local-config', () => ({
    useLocalConfig: () => ({
        localStorageAvailable: true,
        aiExportMode: 'byok-session',
        setAIExportMode: vi.fn(),
        aiGatewayEndpoint: '',
        setAIGatewayEndpoint: vi.fn(),
        aiGatewayModelName: '',
        setAIGatewayModelName: vi.fn(),
    }),
}));

vi.mock('@/hooks/use-storage', () => ({
    useStorage: () => ({
        clearAllDiagrams: vi.fn(),
    }),
}));

describe('PrivacySettings', () => {
    beforeEach(() => {
        clearBYOKSessionKey();
        localStorage.removeItem('chartdb.ai.byok.key');
        sessionStorage.removeItem('chartdb.ai.byok.key');
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
});
