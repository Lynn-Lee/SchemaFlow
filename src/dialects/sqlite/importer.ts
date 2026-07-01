import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { importLegacySQLDiagram } from '@/dialects/common/legacy-sql-importer';
import { DatabaseType } from '@/lib/domain/database-type';
import { fromSQLite } from '@/lib/data/sql-import/dialect-importers/sqlite/sqlite';
import { sqliteCapabilities } from './capabilities';
import { extractSQLiteUnsupportedObjects } from './warnings';

export { sqliteCapabilities };

export interface SQLiteImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const sqliteSchemaImporter: SchemaImporter<SQLiteImportInput> = {
    async importSchema({ sql, targetDatabaseType = DatabaseType.SQLITE }) {
        const diagram = await importLegacySQLDiagram({
            sql,
            sourceDatabaseType: DatabaseType.SQLITE,
            targetDatabaseType,
            parse: fromSQLite,
        });
        const { warnings, unsupportedObjects } =
            extractSQLiteUnsupportedObjects(sql);

        return createImportResult({
            diagram,
            sourceDialect: DatabaseType.SQLITE,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
