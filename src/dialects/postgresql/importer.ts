import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';
import { postgresqlCapabilities } from './capabilities';
import { importPostgreSQLDiagram } from './parser/legacy-parser';
import { extractPostgreSQLUnsupportedObjects } from './warnings';

export { postgresqlCapabilities };

export interface PostgreSQLImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const postgresqlSchemaImporter: SchemaImporter<PostgreSQLImportInput> = {
    async importSchema({ sql, targetDatabaseType = DatabaseType.POSTGRESQL }) {
        const diagram = await importPostgreSQLDiagram({
            sql,
            targetDatabaseType,
        });
        const { warnings, unsupportedObjects } =
            extractPostgreSQLUnsupportedObjects(sql);

        return createImportResult({
            diagram,
            sourceDialect: DatabaseType.POSTGRESQL,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
