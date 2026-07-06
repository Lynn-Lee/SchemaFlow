import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const cockroachDBCapabilities = createDialectCapabilities({
    dialect: DatabaseType.COCKROACHDB,
    import: {
        tables: 'experimental',
        fields: 'experimental',
        relationships: 'experimental',
        indexes: 'partial',
        views: 'partial',
        schemas: 'partial',
        customTypes: 'partial',
        comments: 'partial',
        checks: 'partial',
        extensions: 'unsupported',
        triggers: 'unsupported',
        procedures: 'unsupported',
    },
    export: {
        tables: 'experimental',
        fields: 'experimental',
        relationships: 'experimental',
        indexes: 'partial',
        checks: 'partial',
    },
    unsupportedSyntax: [
        'LOCALITY',
        'INTERLEAVE IN PARENT',
        'CREATE CHANGEFEED',
        'ALTER TABLE ... SET LOCALITY',
        'ZONE CONFIGURATION',
    ],
    warningRules: [
        'CockroachDB currently uses the PostgreSQL parser fallback and is marked experimental.',
        'CockroachDB-only locality, interleave, zone config, and changefeed syntax is reported as warnings.',
    ],
});
