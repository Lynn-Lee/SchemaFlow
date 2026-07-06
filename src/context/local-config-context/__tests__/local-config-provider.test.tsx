import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLocalConfig } from '@/hooks/use-local-config';
import { LocalConfigProvider } from '../local-config-provider';

const Probe = () => {
    const { aiExportMode, aiGatewayEndpoint, aiGatewayModelName } =
        useLocalConfig();

    return (
        <dl>
            <dt>mode</dt>
            <dd>{aiExportMode}</dd>
            <dt>endpoint</dt>
            <dd>{aiGatewayEndpoint}</dd>
            <dt>model</dt>
            <dd>{aiGatewayModelName}</dd>
        </dl>
    );
};

describe('LocalConfigProvider rename compatibility', () => {
    it('migrates legacy ChartDB AI settings into SchemaFlow keys', () => {
        localStorage.setItem('chartdb.ai.mode', 'self-hosted-gateway');
        localStorage.setItem(
            'chartdb.ai.gateway.endpoint',
            'https://gateway.example.com'
        );
        localStorage.setItem('chartdb.ai.gateway.model', 'gpt-test');

        render(
            <LocalConfigProvider>
                <Probe />
            </LocalConfigProvider>
        );

        expect(screen.getByText('self-hosted-gateway')).toBeInTheDocument();
        expect(
            screen.getByText('https://gateway.example.com')
        ).toBeInTheDocument();
        expect(screen.getByText('gpt-test')).toBeInTheDocument();
        expect(localStorage.getItem('schemaflow.ai.mode')).toBe(
            'self-hosted-gateway'
        );
        expect(localStorage.getItem('schemaflow.ai.gateway.endpoint')).toBe(
            'https://gateway.example.com'
        );
        expect(localStorage.getItem('schemaflow.ai.gateway.model')).toBe(
            'gpt-test'
        );
    });
});
