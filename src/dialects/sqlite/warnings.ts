import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';

export function extractSQLiteUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    for (const match of sql.matchAll(
        /\bCREATE\s+VIRTUAL\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([\w.]+)["`]?/gi
    )) {
        unsupportedObjects.push({
            objectType: 'virtual_table',
            name: match[1],
            reason: 'SQLite virtual tables are ignored by the diagram importer.',
            ignored: true,
        });
        warnings.push({
            code: 'sqlite.virtual_table_unsupported',
            severity: 'warning',
            message:
                'SQLite virtual tables are ignored by the diagram importer.',
            statementType: 'virtual_table',
        });
    }

    if (/\bWITHOUT\s+ROWID\b/i.test(sql)) {
        warnings.push({
            code: 'sqlite.without_rowid_partial',
            severity: 'warning',
            message:
                'SQLite WITHOUT ROWID storage semantics are not represented in the diagram model.',
            statementType: 'table_option',
        });
    }

    if (/\bCREATE\s+(?:UNIQUE\s+)?INDEX\b[\s\S]*?\bWHERE\b/i.test(sql)) {
        warnings.push({
            code: 'sqlite.partial_index_unsupported',
            severity: 'warning',
            message:
                'SQLite partial index predicates are not represented in the diagram model.',
            statementType: 'index',
        });
    }

    return { warnings, unsupportedObjects };
}
