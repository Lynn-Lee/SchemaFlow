import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const sqlServerCapabilities = createDialectCapabilities({
    dialect: DatabaseType.SQL_SERVER,
    import: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        views: 'partial',
        schemas: 'partial',
        checks: 'partial',
        triggers: 'unsupported',
        procedures: 'unsupported',
    },
    export: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        schemas: 'partial',
        checks: 'partial',
    },
    unsupportedSyntax: [
        'CREATE PROCEDURE',
        'CREATE FUNCTION',
        'CREATE TRIGGER',
        'FILEGROUP',
        'PERSISTED computed column',
    ],
    warningRules: [
        'Stored procedures, triggers, filegroups, and computed column expressions are reported as unsupported.',
        'Clustered/nonclustered and index option semantics may be reduced to basic index metadata.',
    ],
});
