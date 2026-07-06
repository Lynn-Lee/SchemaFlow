import { createImportResult, type SchemaImporter } from '@/dialects/common';
import { DatabaseType } from '@/lib/domain/database-type';
import { importDBMLToDiagram } from '@/lib/dbml/dbml-import/dbml-import';
import { DBML_DIALECT, dbmlCapabilities } from './capabilities';
import { extractDBMLImportWarnings } from './warnings';

export { dbmlCapabilities };

export interface DBMLImportInput {
    dbml: string;
    databaseType?: DatabaseType;
}

export const dbmlSchemaImporter: SchemaImporter<DBMLImportInput> = {
    async importSchema({ dbml, databaseType = DatabaseType.GENERIC }) {
        const diagram = await importDBMLToDiagram(dbml, { databaseType });
        const { warnings, unsupportedObjects } =
            extractDBMLImportWarnings(dbml);

        return createImportResult({
            diagram,
            sourceDialect: DBML_DIALECT,
            warnings,
            unsupportedObjects,
            sourceMap: {},
        });
    },
};
