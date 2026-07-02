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

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
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
