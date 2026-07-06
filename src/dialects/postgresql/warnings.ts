import type {
    DialectWarning,
    UnsupportedDialectObject,
} from '@/dialects/common';

const UNSUPPORTED_PATTERNS: Array<{
    objectType: string;
    code: string;
    statementType: string;
    reason: string;
    regex: RegExp;
    getName(match: RegExpMatchArray): string | undefined;
}> = [
    {
        objectType: 'extension',
        code: 'postgresql.extension_unsupported',
        statementType: 'CREATE EXTENSION',
        reason: 'PostgreSQL extensions affect runtime behavior and have no diagram shape.',
        regex: /\bCREATE\s+EXTENSION(?:\s+IF\s+NOT\s+EXISTS)?\s+"?([\w.-]+)"?/gi,
        getName: (match) => match[1],
    },
    {
        objectType: 'row_level_security',
        code: 'postgresql.row_level_security_unsupported',
        statementType: 'ALTER TABLE',
        reason: 'Row level security policy state is outside the local diagram model.',
        regex: /\bALTER\s+TABLE\s+(?:ONLY\s+)?((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))?)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY\b/gi,
        getName: (match) => normalizeIdentifierPath(match[1]),
    },
    {
        objectType: 'policy',
        code: 'postgresql.policy_unsupported',
        statementType: 'CREATE POLICY',
        reason: 'PostgreSQL policies require database runtime semantics and are not represented in diagrams.',
        regex: /\bCREATE\s+POLICY\s+"?([\w.-]+)"?\s+ON\s+((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))?)/gi,
        getName: (match) => match[1],
    },
    {
        objectType: 'trigger',
        code: 'postgresql.trigger_unsupported',
        statementType: 'CREATE TRIGGER',
        reason: 'Triggers are executable database behavior and are not represented in diagrams.',
        regex: /\bCREATE\s+TRIGGER\s+"?([\w.-]+)"?/gi,
        getName: (match) => match[1],
    },
    {
        objectType: 'function',
        code: 'postgresql.function_unsupported',
        statementType: 'CREATE FUNCTION',
        reason: 'Functions are executable database behavior and are not represented in diagrams.',
        regex: /\bCREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+((?:"[^"]+"|[\w]+)(?:\.(?:"[^"]+"|[\w]+))?)/gi,
        getName: (match) => normalizeIdentifierPath(match[1]),
    },
];

export function extractPostgreSQLUnsupportedObjects(sql: string): {
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
} {
    const warnings: DialectWarning[] = [];
    const unsupportedObjects: UnsupportedDialectObject[] = [];

    for (const pattern of UNSUPPORTED_PATTERNS) {
        for (const match of sql.matchAll(pattern.regex)) {
            const name = pattern.getName(match);
            unsupportedObjects.push({
                objectType: pattern.objectType,
                name,
                reason: pattern.reason,
                ignored: true,
            });
            warnings.push({
                code: pattern.code,
                severity: 'warning',
                message: name
                    ? `${pattern.statementType} ${name} is not imported. ${pattern.reason}`
                    : `${pattern.statementType} is not imported. ${pattern.reason}`,
                statementType: pattern.statementType,
                sourceRange: getSourceRange(sql, match.index ?? 0),
            });
        }
    }

    return { warnings, unsupportedObjects };
}

function getSourceRange(
    sql: string,
    index: number
): {
    startLine: number;
    endLine: number;
} {
    const startLine = sql.slice(0, index).split('\n').length;

    return {
        startLine,
        endLine: startLine,
    };
}

function normalizeIdentifierPath(
    value: string | undefined
): string | undefined {
    return value?.replaceAll('"', '');
}
