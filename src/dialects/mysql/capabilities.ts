import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const mysqlCapabilities = createDialectCapabilities({
    dialect: DatabaseType.MYSQL,
    import: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'full',
        views: 'partial',
        comments: 'partial',
        checks: 'partial',
        triggers: 'unsupported',
        procedures: 'unsupported',
    },
    export: {
        tables: 'full',
        fields: 'full',
        relationships: 'full',
        indexes: 'partial',
        customTypes: 'partial',
        checks: 'partial',
    },
    unsupportedSyntax: [
        'CREATE TRIGGER',
        'CREATE PROCEDURE',
        'PARTITION BY',
        'GENERATED ALWAYS AS',
    ],
    warningRules: [
        'ENGINE and charset/collation metadata are preserved only as warnings.',
        'Generated columns, procedures, triggers, and partitions are reported as unsupported.',
    ],
});
