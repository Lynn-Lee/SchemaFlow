import type { Graph } from '@/lib/graph';
import { defaultSchemas } from '@/lib/data/default-schemas';
import type { DBTable } from '@/lib/domain/db-table';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { filterTable } from '@/lib/domain/diagram-filter/filter';

export const buildCanvasVisibilityState = ({
    overlapGraph,
    hasActiveFilter,
    tables,
    filter,
    databaseType,
    filterLoading,
}: {
    overlapGraph: Graph<string>;
    hasActiveFilter: boolean;
    tables: DBTable[];
    filter?: DiagramFilter;
    databaseType: DatabaseType;
    filterLoading: boolean;
}) => {
    const hasOverlappingTables = Array.from(overlapGraph.graph).some(
        ([, value]) => value.length > 0
    );

    if (!hasActiveFilter || tables.length === 0 || filterLoading) {
        return {
            hasOverlappingTables,
            allTablesHiddenByFilter: false,
        };
    }

    const visibleTableCount = tables.filter((table) =>
        filterTable({
            table: { id: table.id, schema: table.schema },
            filter,
            options: { defaultSchema: defaultSchemas[databaseType] },
        })
    ).length;

    return {
        hasOverlappingTables,
        allTablesHiddenByFilter: visibleTableCount === 0,
    };
};

export const pulseOverlappingTablesHighlight = ({
    setHighlightOverlappingTables,
    durationMs = 600,
}: {
    setHighlightOverlappingTables: (highlighted: boolean) => void;
    durationMs?: number;
}) => {
    setHighlightOverlappingTables(true);
    setTimeout(() => setHighlightOverlappingTables(false), durationMs);
};
