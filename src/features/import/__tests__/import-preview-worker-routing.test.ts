import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import type { ParsedImportPreview } from '../import-preview-core';

const parseImportPreviewInWorker = vi.fn();

vi.mock('@/workers/import-worker/import-preview-client', () => ({
    parseImportPreviewInWorker,
}));

describe('parseImportPreview worker routing', () => {
    beforeEach(() => {
        parseImportPreviewInWorker.mockReset();
    });

    it('routes import preview parsing through the worker client with a fallback', async () => {
        const workerResult = {
            result: {
                sourceDialect: DatabaseType.POSTGRESQL,
                diagram: {
                    id: 'preview',
                    name: 'Preview',
                    databaseType: DatabaseType.POSTGRESQL,
                    createdAt: new Date('2026-07-02T00:00:00Z'),
                    updatedAt: new Date('2026-07-02T00:00:00Z'),
                    tables: [],
                    relationships: [],
                    customTypes: [],
                },
                confidence: 'medium',
                diagnostics: [],
                warnings: [],
                unsupportedObjects: [],
                sourceMap: {},
            },
            preview: {
                sourceDialect: DatabaseType.POSTGRESQL,
                confidence: 'medium',
                counts: {
                    tables: 0,
                    relationships: 0,
                    customTypes: 0,
                    warnings: 0,
                    unsupportedObjects: 0,
                },
                diagnostics: [],
                warnings: [],
                unsupportedObjects: [],
                hasImportableObjects: false,
            },
        } satisfies ParsedImportPreview;
        parseImportPreviewInWorker.mockResolvedValue(workerResult);

        const { parseImportPreview } = await import('../import-preview');
        const request = {
            importMethod: 'ddl' as const,
            scriptResult: 'create table users (id int);',
            databaseType: DatabaseType.POSTGRESQL,
        };

        await expect(parseImportPreview(request)).resolves.toBe(workerResult);
        expect(parseImportPreviewInWorker).toHaveBeenCalledWith({
            request,
            fallback: expect.any(Function),
        });
    });
});
