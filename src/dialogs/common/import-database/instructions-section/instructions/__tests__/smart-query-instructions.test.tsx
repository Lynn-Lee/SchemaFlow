import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import { SmartQueryInstructions } from '../smart-query-instructions';

vi.mock('@/components/code-snippet/code-snippet', () => ({
    CodeSnippet: ({
        code,
        codeToCopy,
        loading,
    }: {
        code: string;
        codeToCopy: string;
        loading: boolean;
    }) => (
        <div data-testid="code-snippet">
            {loading ? 'Loading query' : code || codeToCopy}
        </div>
    ),
}));

const translations: Record<string, string> = {
    'smart_query_wizard.title': 'Smart Query Wizard',
    'smart_query_wizard.description':
        'SchemaFlow never asks for your database password. You copy a read-only metadata query, run it locally, then paste the JSON output here.',
    'smart_query_wizard.steps.choose_database.title':
        'Choose this database type',
    'smart_query_wizard.steps.choose_database.description':
        'The query is generated for the selected database and client.',
    'smart_query_wizard.steps.copy_query.title': 'Copy the Smart Query',
    'smart_query_wizard.steps.copy_query.description':
        'Run it in your own database client. No database password is required in SchemaFlow.',
    'smart_query_wizard.steps.paste_json.title': 'Paste the JSON result',
    'smart_query_wizard.steps.paste_json.description':
        'Only paste the metadata JSON returned by the query, not a connection string or secret.',
    'smart_query_wizard.steps.preview.title':
        'Preview tables, relationships, and warnings',
    'smart_query_wizard.steps.preview.description':
        'SchemaFlow summarizes objects and dialect limitations before writing to the diagram.',
    'smart_query_wizard.steps.confirm.title': 'Confirm import',
    'smart_query_wizard.steps.confirm.description':
        'Nothing is added to IndexedDB until you confirm the preview.',
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => translations[key] ?? key,
    }),
}));

describe('SmartQueryInstructions', () => {
    it('presents Smart Query as a passwordless import wizard', async () => {
        render(
            <SmartQueryInstructions
                databaseType={DatabaseType.POSTGRESQL}
                showSSMSInfoDialog={false}
                setShowSSMSInfoDialog={vi.fn()}
            />
        );

        expect(
            screen.getByRole('heading', { name: 'Smart Query Wizard' })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/No database password is required/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Copy the Smart Query/i)).toBeInTheDocument();
        expect(screen.getByText(/Paste the JSON result/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Preview tables, relationships, and warnings/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Confirm import/i)).toBeInTheDocument();
    });
});
