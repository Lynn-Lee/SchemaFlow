import { createDialectCapabilities } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';

export const clickHouseCapabilities = createDialectCapabilities({
    dialect: DatabaseType.CLICKHOUSE,
    import: {
        tables: 'unsupported',
        fields: 'unsupported',
        relationships: 'unsupported',
        indexes: 'unsupported',
        views: 'unsupported',
        schemas: 'unsupported',
        customTypes: 'unsupported',
        comments: 'unsupported',
        checks: 'unsupported',
        triggers: 'unsupported',
        procedures: 'unsupported',
    },
    export: {
        tables: 'unsupported',
        fields: 'unsupported',
        relationships: 'unsupported',
        indexes: 'unsupported',
        checks: 'unsupported',
    },
    unsupportedSyntax: [
        'CREATE TABLE ... ENGINE',
        'PARTITION BY',
        'ORDER BY',
        'CREATE MATERIALIZED VIEW',
        'CREATE DISTRIBUTED TABLE',
    ],
    warningRules: [
        'ClickHouse DDL import is currently unsupported; use Smart Query metadata import instead.',
        'ClickHouse engine, partition, order, materialized view, and distributed table syntax is reported as unsupported.',
    ],
});
