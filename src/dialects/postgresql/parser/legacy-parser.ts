import { DatabaseType } from '@/lib/domain/database-type';
import { adjustTablePositions } from '@/lib/domain/db-table';
import { getTableIndexesWithPrimaryKey } from '@/lib/domain/db-index';
import type { Diagram } from '@/lib/domain/diagram';
import { convertToSchemaFlowDiagram } from '@/lib/data/sql-import/common';
import { fromPostgres } from './postgresql';

export async function importPostgreSQLDiagram({
    sql,
    targetDatabaseType = DatabaseType.POSTGRESQL,
}: {
    sql: string;
    targetDatabaseType?: DatabaseType;
}): Promise<Diagram> {
    const parserResult = await fromPostgres(sql);

    return normalizeImportedDiagram(
        convertToSchemaFlowDiagram(
            parserResult,
            DatabaseType.POSTGRESQL,
            targetDatabaseType
        )
    );
}

function normalizeImportedDiagram(diagram: Diagram): Diagram {
    const adjustedTables = adjustTablePositions({
        tables: diagram.tables ?? [],
        relationships: diagram.relationships ?? [],
        mode: 'perSchema',
    });

    const sortedTables = adjustedTables
        .map((table) => ({
            ...table,
            indexes: getTableIndexesWithPrimaryKey({ table }),
        }))
        .sort((a, b) => {
            if (a.isView === b.isView) {
                return a.name.localeCompare(b.name);
            }

            return a.isView ? 1 : -1;
        });

    return {
        ...diagram,
        tables: sortedTables,
    };
}
