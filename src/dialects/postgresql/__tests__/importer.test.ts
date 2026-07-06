import { describe, expect, it } from 'vitest';
import { DatabaseType } from '@/lib/domain/database-type';
import { postgresqlCapabilities, postgresqlSchemaImporter } from '../importer';
import { getCapabilitySupport } from '@/dialects/common';

describe('postgresql schema importer', () => {
    it('wraps the legacy parser in a dialect import result with unsupported warnings', async () => {
        const result = await postgresqlSchemaImporter.importSchema({
            sql: `
                CREATE EXTENSION IF NOT EXISTS postgis;

                CREATE TABLE public.accounts (
                    id uuid PRIMARY KEY,
                    email text NOT NULL
                );

                ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

                CREATE POLICY account_owner ON public.accounts
                    USING (id::text = current_user);
            `,
        });

        expect(result.sourceDialect).toBe(DatabaseType.POSTGRESQL);
        expect(result.diagram.databaseType).toBe(DatabaseType.POSTGRESQL);
        const tables = result.diagram.tables ?? [];
        expect(tables).toHaveLength(1);
        expect(tables[0].name).toBe('accounts');
        expect(result.unsupportedObjects).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    objectType: 'extension',
                    name: 'postgis',
                    ignored: true,
                }),
                expect.objectContaining({
                    objectType: 'row_level_security',
                    name: 'public.accounts',
                    ignored: true,
                }),
                expect.objectContaining({
                    objectType: 'policy',
                    name: 'account_owner',
                    ignored: true,
                }),
            ])
        );
        expect(result.warnings.map((warning) => warning.code)).toEqual(
            expect.arrayContaining([
                'postgresql.extension_unsupported',
                'postgresql.row_level_security_unsupported',
                'postgresql.policy_unsupported',
            ])
        );
        expect(result.sourceMap).toEqual({});
    });

    it('declares PostgreSQL importer capability levels', () => {
        expect(
            getCapabilitySupport(postgresqlCapabilities, 'import', 'tables')
        ).toBe('full');
        expect(
            getCapabilitySupport(postgresqlCapabilities, 'import', 'indexes')
        ).toBe('full');
        expect(
            getCapabilitySupport(postgresqlCapabilities, 'import', 'extensions')
        ).toBe('unsupported');
        expect(postgresqlCapabilities.unsupportedSyntax).toContain(
            'CREATE POLICY'
        );
    });
});
