import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const sqliteCapabilities = createDialectCapabilities({
    dialect: DatabaseType.SQLITE,
    import: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        views: 'partial',
        checks: 'partial',
        triggers: 'unsupported',
    },
    export: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        checks: 'partial',
        schemas: 'unsupported',
        customTypes: 'unsupported',
    },
    unsupportedSyntax: [
        'CREATE VIRTUAL TABLE',
        'CREATE TRIGGER',
        'WITHOUT ROWID',
        'CREATE INDEX ... WHERE',
    ],
    warningRules: [
        'Virtual tables, trigger bodies, and partial indexes are ignored and reported as warnings.',
        'Complex CHECK expressions may be simplified by the legacy parser.',
    ],
});
