import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import { parseImportPreviewOnMainThread } from '@/features/import/import-preview-core';

describe('parseImportPreviewOnMainThread metadata validation', () => {
    it('rejects invalid Smart Query JSON before building a diagram preview', async () => {
        await expect(
            parseImportPreviewOnMainThread({
                importMethod: 'query',
                scriptResult: JSON.stringify({
                    tables: [],
                    columns: [],
                }),
                databaseType: DatabaseType.POSTGRESQL,
            })
        ).rejects.toThrow(/Invalid database metadata JSON/);
    });
});
