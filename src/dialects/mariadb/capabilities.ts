import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const mariadbCapabilities = createDialectCapabilities({
    dialect: DatabaseType.MARIADB,
    import: {
        tables: 'experimental',
        fields: 'experimental',
        relationships: 'experimental',
        indexes: 'experimental',
        views: 'partial',
        comments: 'partial',
        checks: 'partial',
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
        'CREATE SEQUENCE',
        'CREATE TRIGGER',
        'CREATE PROCEDURE',
        'VIRTUAL COLUMN',
    ],
    warningRules: [
        'MariaDB currently uses the MySQL parser fallback and is marked experimental.',
        'MariaDB-only sequence, engine, and virtual column semantics are reported as warnings.',
    ],
});
