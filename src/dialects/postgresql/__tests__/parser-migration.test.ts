import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('PostgreSQL parser migration boundary', () => {
    it('keeps PostgreSQL parser implementation under the dialect package', () => {
        const dialectParser = readFileSync(
            'src/dialects/postgresql/parser/legacy-parser.ts',
            'utf8'
        );
        const legacyImporter = readFileSync(
            'src/lib/data/sql-import/dialect-importers/postgresql/postgresql.ts',
            'utf8'
        );
        const legacyDumpImporter = readFileSync(
            'src/lib/data/sql-import/dialect-importers/postgresql/postgresql-dump.ts',
            'utf8'
        );
        const legacyCommon = readFileSync(
            'src/lib/data/sql-import/dialect-importers/postgresql/postgresql-common.ts',
            'utf8'
        );

        expect(dialectParser).not.toContain(
            '@/lib/data/sql-import/dialect-importers/postgresql/postgresql'
        );
        expect(legacyImporter.trim()).toBe(
            "export { fromPostgres } from '@/dialects/postgresql/parser/postgresql';"
        );
        expect(legacyDumpImporter.trim()).toBe(
            "export { fromPostgresDump } from '@/dialects/postgresql/parser/postgresql-dump';"
        );
        expect(legacyCommon.trim()).toBe(
            "export * from '@/dialects/postgresql/parser/postgresql-common';"
        );
    });
});
