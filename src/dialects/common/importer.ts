import type { DatabaseType } from '@/lib/domain/database-type';
import type { Diagram } from '@/lib/domain/diagram';

export type DialectType = DatabaseType | 'dbml';
export type DialectWarningSeverity = 'info' | 'warning' | 'error';
export type DialectRiskLevel = 'low' | 'medium' | 'high';
export type ImportConfidence = 'high' | 'medium' | 'low';

export interface DialectSourceRange {
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
}

export interface DialectWarning {
    code: string;
    severity: DialectWarningSeverity;
    message: string;
    statementType?: string;
    sourceRange?: DialectSourceRange;
}

export interface ImportDiagnostic {
    code: string;
    severity: DialectWarningSeverity;
    message: string;
    statementType?: string;
    sourceRange?: DialectSourceRange;
}

export interface UnsupportedDialectObject {
    objectType: string;
    name?: string;
    reason: string;
    ignored: boolean;
}

export interface DialectSourceMapEntry extends DialectSourceRange {
    statementIndex?: number;
}

export interface DialectSourceMap {
    tables?: Record<string, DialectSourceMapEntry>;
    fields?: Record<string, DialectSourceMapEntry>;
    relationships?: Record<string, DialectSourceMapEntry>;
    indexes?: Record<string, DialectSourceMapEntry>;
    customTypes?: Record<string, DialectSourceMapEntry>;
}

export interface ImportResult {
    diagram: Diagram;
    sourceDialect: DialectType;
    confidence: ImportConfidence;
    diagnostics: ImportDiagnostic[];
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
    sourceMap: DialectSourceMap;
}

export interface SchemaImporter<TInput> {
    importSchema(input: TInput): Promise<ImportResult>;
}

export function createImportResult({
    diagram,
    sourceDialect,
    confidence = 'medium',
    diagnostics = [],
    warnings = [],
    unsupportedObjects = [],
    sourceMap = {},
}: {
    diagram: Diagram;
    sourceDialect: DialectType;
    confidence?: ImportConfidence;
    diagnostics?: ImportDiagnostic[];
    warnings?: DialectWarning[];
    unsupportedObjects?: UnsupportedDialectObject[];
    sourceMap?: DialectSourceMap;
}): ImportResult {
    return {
        diagram,
        sourceDialect,
        confidence,
        diagnostics,
        warnings,
        unsupportedObjects,
        sourceMap,
    };
}

export function wrapLegacySchemaImporter<TInput>({
    sourceDialect,
    importDiagram,
}: {
    sourceDialect: DialectType;
    importDiagram(input: TInput): Promise<Diagram> | Diagram;
}): SchemaImporter<TInput> {
    return {
        async importSchema(input) {
            const diagram = await importDiagram(input);

            return createImportResult({
                diagram,
                sourceDialect,
            });
        },
    };
}
