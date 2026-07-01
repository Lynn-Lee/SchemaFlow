import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';

export function extractMySQLUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    if (
        /\bENGINE\s*=/i.test(sql) ||
        /\b(?:DEFAULT\s+)?CHARSET\s*=/i.test(sql)
    ) {
        warnings.push({
            code: 'mysql.engine_charset_metadata',
            severity: 'info',
            message:
                'MySQL ENGINE and charset/collation metadata are not represented in the diagram model.',
            statementType: 'table_option',
        });
    }

    addUnsupported({
        sql,
        pattern: /\bCREATE\s+TRIGGER\s+`?([\w.]+)`?/gi,
        objectType: 'trigger',
        code: 'mysql.trigger_unsupported',
        reason: 'MySQL trigger bodies are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bCREATE\s+PROCEDURE\s+`?([\w.]+)`?/gi,
        objectType: 'procedure',
        code: 'mysql.procedure_unsupported',
        reason: 'MySQL procedures are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bPARTITION\s+BY\b/gi,
        objectType: 'partition',
        code: 'mysql.partition_unsupported',
        reason: 'MySQL partition metadata is not represented in the diagram model.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bGENERATED\s+ALWAYS\s+AS\b/gi,
        objectType: 'generated_column',
        code: 'mysql.generated_column_partial',
        reason: 'Generated column expressions may be reduced to a plain column.',
        warnings,
        unsupportedObjects,
    });

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
