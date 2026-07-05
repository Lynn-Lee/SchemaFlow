import type { Node } from '@xyflow/react';
import type { SchemaFlowEvent } from '@/context/schemaflow-context/schemaflow-context';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { filterTable } from '@/lib/domain/diagram-filter/filter';
import type { Graph } from '@/lib/graph';
import { removeVertex } from '@/lib/graph';
import { defaultSchemas } from '@/lib/data/default-schemas';
import type { TableNodeType } from './table-node/table-node';
import type { NodeType } from './canvas-model';
import {
    calcTableHeight,
    findOverlappingTables,
    findTableOverlapping,
} from './canvas-utils';

type CanvasEventUpdate = {
    overlapGraph: Graph<string>;
    measuredNodeUpdate?: {
        id: string;
        measured: TableNodeType['measured'];
    };
};

const visibleTableNodes = (nodes: NodeType[]) =>
    nodes.filter(
        (node) => !node.hidden && node.type === 'table'
    ) as TableNodeType[];

export const buildCanvasEventUpdate = ({
    event,
    overlapGraph,
    nodes,
    getNode,
    filter,
    databaseType,
    showDBViews,
}: {
    event: SchemaFlowEvent;
    overlapGraph: Graph<string>;
    nodes: NodeType[];
    getNode: (id: string) => Node | undefined;
    filter?: DiagramFilter;
    databaseType: DatabaseType;
    showDBViews: boolean;
}): CanvasEventUpdate => {
    if (event.action === 'add_tables') {
        let newOverlappingGraph = overlapGraph;

        for (const table of event.data.tables) {
            newOverlappingGraph = findTableOverlapping(
                { node: getNode(table.id) as TableNodeType },
                { nodes: visibleTableNodes(nodes) },
                overlapGraph
            );
        }

        return { overlapGraph: newOverlappingGraph };
    }

    if (event.action === 'remove_tables') {
        let newOverlappingGraph = overlapGraph;

        for (const tableId of event.data.tableIds) {
            newOverlappingGraph = removeVertex(newOverlappingGraph, tableId);
        }

        return { overlapGraph: newOverlappingGraph };
    }

    if (event.action === 'update_table' && event.data.table.width) {
        const node = getNode(event.data.id) as TableNodeType;
        const measured = {
            ...node.measured,
            width: event.data.table.width,
        };

        return {
            overlapGraph: findTableOverlapping(
                {
                    node: {
                        ...node,
                        measured,
                    },
                },
                { nodes: visibleTableNodes(nodes) },
                overlapGraph
            ),
            measuredNodeUpdate: {
                id: event.data.id,
                measured,
            },
        };
    }

    if (event.action === 'add_field' || event.action === 'remove_field') {
        const node = getNode(event.data.tableId) as TableNodeType;
        const measured = {
            ...(node.measured ?? {}),
            height: calcTableHeight({
                ...node.data.table,
                fields: event.data.fields,
            }),
        };

        return {
            overlapGraph: findTableOverlapping(
                {
                    node: {
                        ...node,
                        measured,
                    },
                },
                { nodes: visibleTableNodes(nodes) },
                overlapGraph
            ),
        };
    }

    if (event.action === 'load_diagram') {
        const diagramTables = event.data.diagram.tables ?? [];

        return {
            overlapGraph: findOverlappingTables({
                tables: diagramTables.filter(
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
            }),
        };
    }

    return { overlapGraph };
};
