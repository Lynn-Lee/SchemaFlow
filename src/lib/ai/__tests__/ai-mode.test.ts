import { describe, expect, it } from 'vitest';
import {
    buildAIExportRequest,
    clearBYOKSessionKey,
    getBYOKSessionKey,
    setBYOKSessionKey,
    validateGatewayEndpoint,
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
        expect(localStorage.getItem('schemaflow.ai.byok.key')).toBeNull();
        expect(sessionStorage.getItem('schemaflow.ai.byok.key')).toBeNull();

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

    it('rejects unsafe self-hosted gateway endpoint URLs', () => {
        expect(validateGatewayEndpoint('https://gateway.example.com/v1')).toBe(
            undefined
        );

        for (const endpoint of [
            'file:///etc/passwd',
            'http://gateway.example.com/v1',
            'https://localhost:8080/v1',
            'https://127.0.0.1:8080/v1',
            'https://10.0.0.2/v1',
            'https://172.16.0.2/v1',
            'https://192.168.1.10/v1',
            'https://169.254.169.254/latest/meta-data',
        ]) {
            expect(validateGatewayEndpoint(endpoint)).toMatch(
                /public HTTPS endpoint/
            );
        }
    });

    it('validates gateway endpoints before building a self-hosted request', () => {
        const mode: AIExportMode = {
            type: 'self-hosted-gateway',
            endpoint: 'https://169.254.169.254/latest/meta-data',
        };

        expect(() =>
            buildAIExportRequest({
                mode,
                schemaSummary,
                confirmedSchemaTransfer: true,
            })
        ).toThrow(
            'Self-hosted Gateway endpoint must be a public HTTPS endpoint'
        );
    });
});
