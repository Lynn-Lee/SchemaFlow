import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { importLegacySQLDiagram } from '@/dialects/common/legacy-sql-importer';
import { DatabaseType } from '@/lib/domain/database-type';
import { fromSQLServer } from '@/lib/data/sql-import/dialect-importers/sqlserver/sqlserver';
import { sqlServerCapabilities } from './capabilities';
import { extractSQLServerUnsupportedObjects } from './warnings';

export { sqlServerCapabilities };

export interface SQLServerImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const sqlServerSchemaImporter: SchemaImporter<SQLServerImportInput> = {
    async importSchema({ sql, targetDatabaseType = DatabaseType.SQL_SERVER }) {
        const diagram = await importLegacySQLDiagram({
            sql,
            sourceDatabaseType: DatabaseType.SQL_SERVER,
            targetDatabaseType,
            parse: fromSQLServer,
        });
        const { warnings, unsupportedObjects } =
            extractSQLServerUnsupportedObjects(sql);

        return createImportResult({
            diagram,
            sourceDialect: DatabaseType.SQL_SERVER,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
