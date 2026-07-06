import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';

export function extractClickHouseUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const warnings: DialectWarning[] = [
        {
            code: 'clickhouse.ddl_import_unsupported',
            severity: 'warning',
            message:
                'ClickHouse DDL import is currently unsupported; use Smart Query metadata import instead.',
            statementType: 'dialect_unsupported',
        },
    ];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    addUnsupported({
        sql,
        pattern:
            /\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?((?:`[^`]+`|"[^"]+"|[\w]+)(?:\.(?:`[^`]+`|"[^"]+"|[\w]+))?)/gi,
        objectType: 'table',
        code: 'clickhouse.table_unsupported',
        reason: 'ClickHouse CREATE TABLE DDL is not imported by the diagram parser.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern:
            /\bCREATE\s+MATERIALIZED\s+VIEW\s+(?:IF\s+NOT\s+EXISTS\s+)?((?:`[^`]+`|"[^"]+"|[\w]+)(?:\.(?:`[^`]+`|"[^"]+"|[\w]+))?)/gi,
        objectType: 'materialized_view',
        code: 'clickhouse.materialized_view_unsupported',
        reason: 'ClickHouse materialized views are not imported by the diagram parser.',
        warnings,
        unsupportedObjects,
    });

    if (/\bENGINE\s*=/i.test(sql)) {
        warnings.push({
            code: 'clickhouse.engine_unsupported',
            severity: 'warning',
            message:
                'ClickHouse table engine semantics are not represented in the diagram model.',
            statementType: 'table_option',
        });
    }
    if (/\bPARTITION\s+BY\b/i.test(sql)) {
        warnings.push({
            code: 'clickhouse.partition_unsupported',
            severity: 'warning',
            message:
                'ClickHouse partition expressions are not represented in the diagram model.',
            statementType: 'table_option',
        });
    }
    if (/\bORDER\s+BY\b/i.test(sql)) {
        warnings.push({
            code: 'clickhouse.order_by_unsupported',
            severity: 'warning',
            message:
                'ClickHouse ORDER BY storage key semantics are not represented in the diagram model.',
            statementType: 'table_option',
        });
    }

    return { warnings, unsupportedObjects };
}

function addUnsupported({
    sql,
    pattern,
    objectType,
    code,
    reason,
    warnings,
    unsupportedObjects,
}: {
    sql: string;
    pattern: RegExp;
    objectType: string;
    code: string;
    reason: string;
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
}) {
    for (const match of sql.matchAll(pattern)) {
        unsupportedObjects.push({
            objectType,
            name: normalizeIdentifierPath(match[1]),
            reason,
            ignored: true,
        });
        warnings.push({
            code,
            severity: 'warning',
            message: reason,
            statementType: objectType,
        });
    }
}

function normalizeIdentifierPath(
    value: string | undefined
): string | undefined {
    return value?.replaceAll('`', '').replaceAll('"', '');
}
