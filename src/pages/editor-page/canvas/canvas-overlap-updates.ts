import type { NodeDimensionChange, NodePositionChange } from '@xyflow/react';
import { defaultSchemas } from '@/lib/data/default-schemas';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DBTable } from '@/lib/domain/db-table';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { filterTable } from '@/lib/domain/diagram-filter/filter';
import type { Graph } from '@/lib/graph';
import { findOverlappingTables, findTableOverlapping } from './canvas-utils';
import type { NodeType } from './canvas-model';
import type { TableNodeType } from './table-node/table-node';

export const buildVisibleTableOverlapGraph = ({
    tables,
    filter,
    databaseType,
    showDBViews,
}: {
    tables: DBTable[];
    filter: DiagramFilter | undefined;
    databaseType: DatabaseType;
    showDBViews: boolean;
}) => {
    return findOverlappingTables({
        tables: tables.filter(
            (table) =>
                filterTable({
                    table: {
                        id: table.id,
                        schema: table.schema,
                    },
                    filter,
                    options: {
                        defaultSchema: defaultSchemas[databaseType],
                    },
                }) && (showDBViews ? true : !table.isView)
        ),
    });
};

export const buildUpdatedOverlapGraphForNodeChanges = ({
    overlapGraph,
    nodes,
    positionChanges,
    sizeChanges,
    getNode,
}: {
    overlapGraph: Graph<string>;
    nodes: NodeType[];
    positionChanges: NodePositionChange[];
    sizeChanges: NodeDimensionChange[];
    getNode: (id: string) => NodeType | undefined;
}) => {
    const visibleTableNodes = nodes.filter(
        (node) => !node.hidden && node.type === 'table'
    ) as TableNodeType[];

    return [...positionChanges, ...sizeChanges].reduce((graph, change) => {
        const node = getNode(change.id);
        if (!node || node.hidden || node.type !== 'table') {
            return graph;
        }

        return findTableOverlapping(
            { node: node as TableNodeType },
            { nodes: visibleTableNodes },
            graph
        );
    }, overlapGraph);
};
