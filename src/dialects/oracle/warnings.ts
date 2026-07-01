import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';

export function extractOracleUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    addUnsupported({
        sql,
        pattern: /\bCREATE\s+SEQUENCE\s+"?([\w.]+)"?/gi,
        objectType: 'sequence',
        code: 'oracle.sequence_unsupported',
        reason: 'Oracle sequences are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bCREATE\s+(?:OR\s+REPLACE\s+)?PACKAGE\s+"?([\w.]+)"?/gi,
        objectType: 'package',
        code: 'oracle.package_unsupported',
        reason: 'Oracle packages are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bCREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER\s+"?([\w.]+)"?/gi,
        objectType: 'trigger',
        code: 'oracle.trigger_unsupported',
        reason: 'Oracle triggers are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bCREATE\s+(?:OR\s+REPLACE\s+)?SYNONYM\s+"?([\w.]+)"?/gi,
        objectType: 'synonym',
        code: 'oracle.synonym_unsupported',
        reason: 'Oracle synonyms are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern: /\bCREATE\s+MATERIALIZED\s+VIEW\s+"?([\w.]+)"?/gi,
        objectType: 'materialized_view',
        code: 'oracle.materialized_view_unsupported',
        reason: 'Oracle materialized views are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });

    if (/\bTABLESPACE\s+\w+/i.test(sql)) {
        warnings.push({
            code: 'oracle.tablespace_partial',
            severity: 'warning',
            message:
                'Oracle tablespace placement is not represented in the diagram model.',
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
