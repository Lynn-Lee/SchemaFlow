import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { importLegacySQLDiagram } from '@/dialects/common/legacy-sql-importer';
import { DatabaseType } from '@/lib/domain/database-type';
import { fromMySQL } from '@/lib/data/sql-import/dialect-importers/mysql/mysql';
import { mysqlCapabilities } from './capabilities';
import { extractMySQLUnsupportedObjects } from './warnings';

export { mysqlCapabilities };

export interface MySQLImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const mysqlSchemaImporter: SchemaImporter<MySQLImportInput> = {
    async importSchema({ sql, targetDatabaseType = DatabaseType.MYSQL }) {
        const diagram = await importLegacySQLDiagram({
            sql,
            sourceDatabaseType: DatabaseType.MYSQL,
            targetDatabaseType,
            parse: fromMySQL,
        });
        const { warnings, unsupportedObjects } =
            extractMySQLUnsupportedObjects(sql);

        return createImportResult({
            diagram,
            sourceDialect: DatabaseType.MYSQL,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
