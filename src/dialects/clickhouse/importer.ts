import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { CURRENT_DIAGRAM_VERSION, type Diagram } from '@/lib/domain/diagram';
import { DatabaseType } from '@/lib/domain/database-type';
import { clickHouseCapabilities } from './capabilities';
import { extractClickHouseUnsupportedObjects } from './warnings';

export { clickHouseCapabilities };

export interface ClickHouseImportInput {
    sql: string;
}

export const clickHouseSchemaImporter: SchemaImporter<ClickHouseImportInput> = {
    async importSchema({ sql }) {
        const { warnings, unsupportedObjects } =
            extractClickHouseUnsupportedObjects(sql);

        return createImportResult({
            diagram: createEmptyClickHouseDiagram(),
            sourceDialect: DatabaseType.CLICKHOUSE,
            warnings,
            unsupportedObjects,
            sourceMap: {},
            confidence: 'low',
            diagnostics: warnings.map((warning) => ({
                code: warning.code,
                severity: warning.severity,
                message: warning.message,
                statementType: warning.statementType,
                sourceRange: warning.sourceRange,
            })),
        });
    },
};

function createEmptyClickHouseDiagram(): Diagram {
    const now = new Date();

    return {
        id: `clickhouse-unsupported-${now.getTime()}`,
        version: CURRENT_DIAGRAM_VERSION,
        name: 'ClickHouse import unsupported',
        databaseType: DatabaseType.CLICKHOUSE,
        tables: [],
        relationships: [],
        dependencies: [],
        areas: [],
        customTypes: [],
        notes: [],
        createdAt: now,
        updatedAt: now,
    };
}
