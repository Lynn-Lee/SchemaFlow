import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';
import { extractPostgreSQLUnsupportedObjects } from '@/dialects/postgresql/warnings';

export function extractCockroachDBUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const postgresqlFallback = extractPostgreSQLUnsupportedObjects(sql);
    const warnings: DialectWarning[] = [
        {
            code: 'cockroachdb.postgresql_fallback',
            severity: 'warning',
            message:
                'CockroachDB import currently uses the PostgreSQL parser fallback; CockroachDB-only semantics may be reduced.',
            statementType: 'dialect_fallback',
        },
        ...postgresqlFallback.warnings,
    ];
    const unsupportedObjects = [...postgresqlFallback.unsupportedObjects];

    addUnsupported({
        sql,
        pattern:
            /\b(?:ALTER\s+TABLE\s+)?((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))?)?\s*(?:SET\s+)?LOCALITY\s+(?:REGIONAL|GLOBAL|REGIONAL\s+BY\s+ROW)\b/gi,
        objectType: 'locality',
        code: 'cockroachdb.locality_unsupported',
        reason: 'CockroachDB locality placement is not represented in the diagram model.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern:
            /\bCREATE\s+CHANGEFEED(?:\s+FOR\s+(?:TABLE\s+)?((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))?))?/gi,
        objectType: 'changefeed',
        code: 'cockroachdb.changefeed_unsupported',
        reason: 'CockroachDB changefeeds are runtime replication behavior and are ignored by the diagram importer.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern:
            /\bINTERLEAVE\s+IN\s+PARENT\s+((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))?)/gi,
        objectType: 'interleave',
        code: 'cockroachdb.interleave_unsupported',
        reason: 'CockroachDB interleaved table locality is not represented in the diagram model.',
        warnings,
        unsupportedObjects,
    });
    addUnsupported({
        sql,
        pattern:
            /\bCONFIGURE\s+ZONE\b|\bALTER\s+(?:RANGE|DATABASE|TABLE|INDEX)\b[\s\S]*?\bCONFIGURE\s+ZONE\b/gi,
        objectType: 'zone_config',
        code: 'cockroachdb.zone_config_unsupported',
        reason: 'CockroachDB zone configuration is not represented in the diagram model.',
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
    return value?.replaceAll('"', '');
}
