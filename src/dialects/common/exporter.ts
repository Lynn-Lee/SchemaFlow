import type { Diagram } from '@/lib/domain/diagram';
import type {
    DialectType,
    DialectRiskLevel,
    DialectWarning,
    UnsupportedDialectObject,
} from './importer';

export interface ExportResult {
    output: string;
    targetDialect: DialectType;
    warnings: DialectWarning[];
    unsupportedObjects: UnsupportedDialectObject[];
    riskLevel: DialectRiskLevel;
}

export interface SchemaExporter<TInput> {
    exportSchema(input: TInput): Promise<ExportResult>;
}

export function createExportResult({
    output,
    targetDialect,
    warnings = [],
    unsupportedObjects = [],
    riskLevel = 'low',
}: {
    output: string;
    targetDialect: DialectType;
    warnings?: DialectWarning[];
    unsupportedObjects?: UnsupportedDialectObject[];
    riskLevel?: DialectRiskLevel;
}): ExportResult {
    return {
        output,
        targetDialect,
        warnings,
        unsupportedObjects,
        riskLevel,
    };
}

export function wrapLegacySchemaExporter<TInput extends { diagram: Diagram }>({
    targetDialect,
    exportDiagram,
}: {
    targetDialect: DialectType;
    exportDiagram(input: TInput): Promise<string> | string;
}): SchemaExporter<TInput> {
    return {
        async exportSchema(input) {
            const output = await exportDiagram(input);

            return createExportResult({
                output,
                targetDialect,
            });
        },
    };
}
