import { convertToChartDBDiagram } from '@/lib/data/sql-import/common';
import type { SQLParserResult } from '@/lib/data/sql-import/common';
import type { DatabaseType } from '@/lib/domain/database-type';
import { getTableIndexesWithPrimaryKey } from '@/lib/domain/db-index';
import { adjustTablePositions } from '@/lib/domain/db-table';
import type { Diagram } from '@/lib/domain/diagram';

export async function importLegacySQLDiagram({
    sql,
    sourceDatabaseType,
    targetDatabaseType = sourceDatabaseType,
    parse,
}: {
    sql: string;
    sourceDatabaseType: DatabaseType;
    targetDatabaseType?: DatabaseType;
    parse(sql: string): Promise<SQLParserResult> | SQLParserResult;
}): Promise<Diagram> {
    const parserResult = await parse(sql);

    return normalizeImportedDiagram(
        convertToChartDBDiagram(
            parserResult,
            sourceDatabaseType,
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

    return {
        ...diagram,
        tables: adjustedTables
            .map((table) => ({
                ...table,
                indexes: getTableIndexesWithPrimaryKey({ table }),
            }))
            .sort((a, b) => {
                if (a.isView === b.isView) {
                    return a.name.localeCompare(b.name);
                }

                return a.isView ? 1 : -1;
            }),
    };
}
