import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const postgresqlCapabilities = createDialectCapabilities({
    dialect: DatabaseType.POSTGRESQL,
    import: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'full',
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
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        customTypes: 'partial',
        comments: 'partial',
        checks: 'partial',
    },
    unsupportedSyntax: [
        'CREATE EXTENSION',
        'ALTER TABLE ... ENABLE ROW LEVEL SECURITY',
        'CREATE POLICY',
        'CREATE TRIGGER',
        'CREATE FUNCTION',
        'CREATE PROCEDURE',
    ],
    warningRules: [
        'Unsupported runtime objects are ignored and reported as warnings.',
        'Views are imported as read-only diagram tables without query bodies.',
        'Non-enum CREATE TYPE statements are ignored.',
    ],
});
