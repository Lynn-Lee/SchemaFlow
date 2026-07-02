import { createDialectCapabilities } from '@/dialects/common';

export const DBML_DIALECT = 'dbml' as const;

export const dbmlCapabilities = createDialectCapabilities({
    dialect: DBML_DIALECT,
    import: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        schemas: 'partial',
        customTypes: 'full',
        comments: 'partial',
        checks: 'partial',
        views: 'unsupported',
    },
    export: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        schemas: 'partial',
        customTypes: 'full',
        comments: 'partial',
        checks: 'partial',
        views: 'unsupported',
    },
    unsupportedSyntax: ['TableGroup', 'Note block', 'View'],
    warningRules: [
        'TableGroup and Note blocks are ignored by the legacy DBML parser.',
        'Empty or duplicate tables are skipped during DBML export.',
    ],
});
