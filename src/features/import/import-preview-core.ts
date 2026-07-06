import { createImportResult, type ImportResult } from '@/dialects/common';
import { dbmlSchemaImporter } from '@/dialects/dbml';
import { mariadbSchemaImporter } from '@/dialects/mariadb';
import { mysqlSchemaImporter } from '@/dialects/mysql';
import { oracleSchemaImporter } from '@/dialects/oracle';
import { postgresqlSchemaImporter } from '@/dialects/postgresql';
import { sqlServerSchemaImporter } from '@/dialects/sqlserver';
import { sqliteSchemaImporter } from '@/dialects/sqlite';
import { loadDatabaseMetadata } from '@/lib/data/import-metadata/metadata-types/database-metadata';
import { loadFromDatabaseMetadata } from '@/lib/data/import-metadata/import';
import { sqlImportToDiagram } from '@/lib/data/sql-import';
import type { DatabaseEdition } from '@/lib/domain/database-edition';
import { DatabaseType } from '@/lib/domain/database-type';
import type { Diagram } from '@/lib/domain/diagram';
import type { ImportMethod } from '@/lib/import-method/import-method';

export interface ImportPreviewWarning {
    code: string;
    severity: ImportResult['warnings'][number]['severity'];
    message: string;
    location?: string;
}

export interface ImportPreviewSummary {
    sourceDialect: ImportResult['sourceDialect'];
    confidence: ImportResult['confidence'];
    counts: {
        tables: number;
        relationships: number;
        customTypes: number;
        warnings: number;
        unsupportedObjects: number;
    };
    diagnostics: ImportResult['diagnostics'];
    warnings: ImportPreviewWarning[];
    unsupportedObjects: ImportResult['unsupportedObjects'];
    hasImportableObjects: boolean;
}

export interface ParsedImportPreview {
    result: ImportResult;
    preview: ImportPreviewSummary;
}

export interface ImportPreviewRequest {
    importMethod: ImportMethod;
    scriptResult: string;
    databaseType: DatabaseType;
    databaseEdition?: DatabaseEdition;
}

function formatSourceRange(
    warning: ImportResult['warnings'][number]
): string | undefined {
    if (!warning.sourceRange) {
        return undefined;
    }

    if (warning.sourceRange.startLine === warning.sourceRange.endLine) {
        return `line ${warning.sourceRange.startLine}`;
    }

    return `lines ${warning.sourceRange.startLine}-${warning.sourceRange.endLine}`;
}

export function buildImportPreview(result: ImportResult): ImportPreviewSummary {
    const tableCount = result.diagram.tables?.length ?? 0;
    const relationshipCount = result.diagram.relationships?.length ?? 0;
    const customTypeCount = result.diagram.customTypes?.length ?? 0;

    return {
        sourceDialect: result.sourceDialect,
        confidence: result.confidence,
        counts: {
            tables: tableCount,
            relationships: relationshipCount,
            customTypes: customTypeCount,
            warnings: result.warnings.length,
            unsupportedObjects: result.unsupportedObjects.length,
        },
        diagnostics: result.diagnostics,
        warnings: result.warnings.map((warning) => ({
            code: warning.code,
            severity: warning.severity,
            message: warning.message,
            location: formatSourceRange(warning),
        })),
        unsupportedObjects: result.unsupportedObjects,
        hasImportableObjects:
            tableCount > 0 || relationshipCount > 0 || customTypeCount > 0,
    };
}

function createDiagramImportResult({
    diagram,
    sourceDialect,
}: {
    diagram: Diagram;
    sourceDialect: ImportResult['sourceDialect'];
}): ImportResult {
    return createImportResult({
        diagram,
        sourceDialect,
    });
}

async function importSQLPreview({
    sql,
    databaseType,
}: {
    sql: string;
    databaseType: DatabaseType;
}): Promise<ImportResult> {
    switch (databaseType) {
        case DatabaseType.POSTGRESQL:
        case DatabaseType.COCKROACHDB:
            return postgresqlSchemaImporter.importSchema({
                sql,
                targetDatabaseType: databaseType,
            });
        case DatabaseType.MYSQL:
            return mysqlSchemaImporter.importSchema({
                sql,
                targetDatabaseType: databaseType,
            });
        case DatabaseType.MARIADB:
            return mariadbSchemaImporter.importSchema({
                sql,
                targetDatabaseType: databaseType,
            });
        case DatabaseType.SQLITE:
            return sqliteSchemaImporter.importSchema({
                sql,
                targetDatabaseType: databaseType,
            });
        case DatabaseType.SQL_SERVER:
            return sqlServerSchemaImporter.importSchema({
                sql,
                targetDatabaseType: databaseType,
            });
        case DatabaseType.ORACLE:
            return oracleSchemaImporter.importSchema({
                sql,
                targetDatabaseType: databaseType,
            });
        default: {
            const diagram = await sqlImportToDiagram({
                sqlContent: sql,
                sourceDatabaseType: databaseType,
                targetDatabaseType: databaseType,
            });

            return createDiagramImportResult({
                diagram,
                sourceDialect: databaseType,
            });
        }
    }
}

export async function parseImportPreviewOnMainThread({
    importMethod,
    scriptResult,
    databaseType,
    databaseEdition,
}: ImportPreviewRequest): Promise<ParsedImportPreview> {
    let result: ImportResult;

    if (importMethod === 'ddl') {
        result = await importSQLPreview({
            sql: scriptResult,
            databaseType,
        });
    } else if (importMethod === 'dbml') {
        result = await dbmlSchemaImporter.importSchema({
            dbml: scriptResult,
            databaseType,
        });
    } else {
        const databaseMetadata = loadDatabaseMetadata(scriptResult);
        const diagram = await loadFromDatabaseMetadata({
            databaseType,
            databaseMetadata,
            databaseEdition:
                databaseEdition?.trim().length === 0
                    ? undefined
                    : databaseEdition,
        });

        result = createDiagramImportResult({
            diagram,
            sourceDialect: databaseType,
        });
    }

    return {
        result,
        preview: buildImportPreview(result),
    };
}
