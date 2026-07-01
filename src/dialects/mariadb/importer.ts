import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { importLegacySQLDiagram } from '@/dialects/common/legacy-sql-importer';
import { DatabaseType } from '@/lib/domain/database-type';
import { fromMySQL } from '@/lib/data/sql-import/dialect-importers/mysql/mysql';
import { mariadbCapabilities } from './capabilities';
import { extractMariaDBUnsupportedObjects } from './warnings';

export { mariadbCapabilities };

export interface MariaDBImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const mariadbSchemaImporter: SchemaImporter<MariaDBImportInput> = {
    async importSchema({ sql, targetDatabaseType = DatabaseType.MARIADB }) {
        const diagram = await importLegacySQLDiagram({
            sql,
            sourceDatabaseType: DatabaseType.MARIADB,
            targetDatabaseType,
            parse: fromMySQL,
        });
        const { warnings, unsupportedObjects } =
            extractMariaDBUnsupportedObjects(sql);

        return createImportResult({
            diagram,
            sourceDialect: DatabaseType.MARIADB,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
