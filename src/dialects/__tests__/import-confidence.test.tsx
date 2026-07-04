import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createImportResult } from '@/dialects/common';
import { buildImportPreview } from '@/features/import/import-preview';
import { ImportPreviewPanel } from '@/features/import/import-preview-panel';
import { DatabaseType } from '@/lib/domain/database-type';
import type { Diagram } from '@/lib/domain/diagram';

function createDiagram(): Diagram {
    return {
        id: 'diagram-1',
        name: 'Imported schema',
        databaseType: DatabaseType.POSTGRESQL,
        tables: [],
        relationships: [],
        createdAt: new Date('2026-07-04T00:00:00.000Z'),
        updatedAt: new Date('2026-07-04T00:00:00.000Z'),
    };
}

describe('import confidence contract', () => {
    it('defaults legacy import results to medium confidence without diagnostics', () => {
        const result = createImportResult({
            diagram: createDiagram(),
            sourceDialect: DatabaseType.POSTGRESQL,
        });

        expect(result.confidence).toBe('medium');
        expect(result.diagnostics).toEqual([]);
    });

    it('carries import confidence and diagnostics into the preview panel', () => {
        const preview = buildImportPreview(
            createImportResult({
                diagram: createDiagram(),
                sourceDialect: DatabaseType.POSTGRESQL,
                confidence: 'low',
                diagnostics: [
                    {
                        code: 'postgresql.partial_parse',
                        severity: 'warning',
                        message: 'Some statements require manual review.',
                    },
                ],
            })
        );

        expect(preview.confidence).toBe('low');
        expect(preview.diagnostics).toEqual([
            {
                code: 'postgresql.partial_parse',
                severity: 'warning',
                message: 'Some statements require manual review.',
            },
        ]);

        render(<ImportPreviewPanel preview={preview} />);

        expect(screen.getByText('Confidence: low')).toBeInTheDocument();
        expect(
            screen.getByText('Some statements require manual review.')
        ).toBeInTheDocument();
    });
});
