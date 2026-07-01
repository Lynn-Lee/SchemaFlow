import { describe, expect, it } from 'vitest';
import {
    buildAIExportRequest,
    clearBYOKSessionKey,
    getBYOKSessionKey,
    setBYOKSessionKey,
    type AIExportMode,
} from '../ai-mode';

const schemaSummary = {
    tableCount: 2,
    fieldCount: 8,
    relationshipCount: 1,
};

describe('AI export mode gating', () => {
    it('keeps AI disabled by default and never builds a remote request', () => {
        expect(() =>
            buildAIExportRequest({
                mode: 'disabled',
                schemaSummary,
                confirmedSchemaTransfer: true,
            })
        ).toThrow('AI-assisted SQL export is disabled');
    });

    it('keeps BYOK keys only in session memory', () => {
        setBYOKSessionKey('sk-session-only');

        expect(getBYOKSessionKey()).toBe('sk-session-only');
        expect(localStorage.getItem('chartdb.ai.byok.key')).toBeNull();
        expect(sessionStorage.getItem('chartdb.ai.byok.key')).toBeNull();

        clearBYOKSessionKey();

        expect(getBYOKSessionKey()).toBeUndefined();
    });

    it('requires explicit schema transfer confirmation before BYOK requests', () => {
        setBYOKSessionKey('sk-session-only');

        expect(() =>
            buildAIExportRequest({
                mode: 'byok-session',
                schemaSummary,
                confirmedSchemaTransfer: false,
            })
        ).toThrow('Confirm schema transfer before AI-assisted export');
    });

    it('builds a BYOK request from the in-memory key after confirmation', () => {
        setBYOKSessionKey('sk-session-only');

        expect(
            buildAIExportRequest({
                mode: 'byok-session',
                schemaSummary,
                confirmedSchemaTransfer: true,
            })
        ).toEqual({
            mode: 'byok-session',
            endpoint: 'https://api.openai.com/v1',
            apiKey: 'sk-session-only',
            schemaSummary,
        });
    });

    it('builds a gateway request without requiring a browser-held secret', () => {
        const mode: AIExportMode = {
            type: 'self-hosted-gateway',
            endpoint: 'https://llm.internal.example/v1',
            modelName: 'qwen-local',
        };

        expect(
            buildAIExportRequest({
                mode,
                schemaSummary,
                confirmedSchemaTransfer: true,
            })
        ).toEqual({
            mode: 'self-hosted-gateway',
            endpoint: 'https://llm.internal.example/v1',
            modelName: 'qwen-local',
            schemaSummary,
        });
    });
});
