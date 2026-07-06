import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';
import { importPostgreSQLDiagram } from '@/dialects/postgresql/parser/legacy-parser';
import { cockroachDBCapabilities } from './capabilities';
import { extractCockroachDBUnsupportedObjects } from './warnings';

export { cockroachDBCapabilities };

export interface CockroachDBImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const cockroachDBSchemaImporter: SchemaImporter<CockroachDBImportInput> =
    {
        async importSchema({
            sql,
            targetDatabaseType = DatabaseType.COCKROACHDB,
        }) {
            const diagram = await importPostgreSQLDiagram({
                sql,
                targetDatabaseType,
            });
            const { warnings, unsupportedObjects } =
                extractCockroachDBUnsupportedObjects(sql);

            return createImportResult({
                diagram,
                sourceDialect: DatabaseType.COCKROACHDB,
                warnings,
                unsupportedObjects,
                sourceMap: {},
                confidence: unsupportedObjects.length > 0 ? 'medium' : 'high',
            });
        },
    };
