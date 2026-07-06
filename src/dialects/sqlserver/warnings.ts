import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';

export function extractSQLServerUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    addUnsupported({
        sql,
        pattern:
            /\bCREATE\s+(?:OR\s+ALTER\s+)?PROCEDURE\s+(?:\[?[\w]+\]?\.)?\[?([\w]+)\]?/gi,
        objectType: 'procedure',
        code: 'sqlserver.procedure_unsupported',
        reason: 'SQL Server stored procedures are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern:
            /\bCREATE\s+(?:OR\s+ALTER\s+)?TRIGGER\s+(?:\[?[\w]+\]?\.)?\[?([\w]+)\]?/gi,
        objectType: 'trigger',
        code: 'sqlserver.trigger_unsupported',
        reason: 'SQL Server triggers are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });

    if (/\bTEXTIMAGE_ON\b|\bON\s+\[[\w]+\]\s*(?:;|$)/i.test(sql)) {
        warnings.push({
            code: 'sqlserver.filegroup_partial',
            severity: 'warning',
            message:
                'SQL Server filegroup placement is not represented in the diagram model.',
            statementType: 'table_option',
        });
    }

    if (/\bAS\s*\([^)]*\)\s*PERSISTED\b/i.test(sql)) {
        warnings.push({
            code: 'sqlserver.computed_column_partial',
            severity: 'warning',
            message:
                'SQL Server computed column expressions may be reduced to plain column metadata.',
            statementType: 'column',
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
            name: match[1],
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
