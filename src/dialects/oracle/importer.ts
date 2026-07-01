import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { importLegacySQLDiagram } from '@/dialects/common/legacy-sql-importer';
import { DatabaseType } from '@/lib/domain/database-type';
import { fromOracle } from '@/lib/data/sql-import/dialect-importers/oracle/oracle';
import { oracleCapabilities } from './capabilities';
import { extractOracleUnsupportedObjects } from './warnings';

export { oracleCapabilities };

export interface OracleImportInput {
    sql: string;
    targetDatabaseType?: DatabaseType;
}

export const oracleSchemaImporter: SchemaImporter<OracleImportInput> = {
    async importSchema({ sql, targetDatabaseType = DatabaseType.ORACLE }) {
        const diagram = await importLegacySQLDiagram({
            sql,
            sourceDatabaseType: DatabaseType.ORACLE,
            targetDatabaseType,
            parse: fromOracle,
        });
        const { warnings, unsupportedObjects } =
            extractOracleUnsupportedObjects(sql);

        return createImportResult({
            diagram,
            sourceDialect: DatabaseType.ORACLE,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
