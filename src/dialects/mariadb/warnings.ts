import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';
import { extractMySQLUnsupportedObjects } from '@/dialects/mysql/warnings';

export function extractMariaDBUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const mysqlFallback = extractMySQLUnsupportedObjects(sql);
    const warnings: DialectWarning[] = [
        {
            code: 'mariadb.mysql_fallback',
            severity: 'warning',
            message:
                'MariaDB import currently uses the MySQL parser fallback; MariaDB-only semantics may be reduced.',
            statementType: 'dialect_fallback',
        },
        ...mysqlFallback.warnings,
    ];
    const unsupportedObjects = [...mysqlFallback.unsupportedObjects];

    for (const match of sql.matchAll(/\bCREATE\s+SEQUENCE\s+`?([\w.]+)`?/gi)) {
        unsupportedObjects.push({
            objectType: 'sequence',
            name: match[1],
            reason: 'MariaDB sequences are ignored by the MySQL parser fallback.',
            ignored: true,
        });
        warnings.push({
            code: 'mariadb.sequence_unsupported',
            severity: 'warning',
            message:
                'MariaDB sequences are ignored by the diagram importer fallback.',
            statementType: 'sequence',
        });
    }

    if (/\bENGINE\s*=\s*(Aria|MyISAM|CONNECT|S3)\b/i.test(sql)) {
        warnings.push({
            code: 'mariadb.engine_semantics_partial',
            severity: 'warning',
            message:
                'MariaDB-specific storage engine semantics are not represented in the diagram model.',
            statementType: 'table_option',
        });
    }

    return { warnings, unsupportedObjects };
}
