import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const oracleCapabilities = createDialectCapabilities({
    dialect: DatabaseType.ORACLE,
    import: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        schemas: 'partial',
        checks: 'partial',
        triggers: 'unsupported',
        procedures: 'unsupported',
    },
    export: {
        tables: 'unsupported',
        fields: 'unsupported',
        relationships: 'unsupported',
        indexes: 'unsupported',
    },
    unsupportedSyntax: [
        'CREATE SEQUENCE',
        'CREATE TRIGGER',
        'CREATE PACKAGE',
        'CREATE SYNONYM',
        'CREATE MATERIALIZED VIEW',
        'TABLESPACE',
    ],
    warningRules: [
        'Sequences, triggers, packages, synonyms, materialized views, and tablespace metadata are reported as unsupported.',
        'Sequence plus trigger identity patterns are not inferred as auto increment.',
    ],
});
