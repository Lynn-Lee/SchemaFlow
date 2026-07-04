import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import type { Area } from '@/lib/domain/area';
import type { Note } from '@/lib/domain/note';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { Graph } from '@/lib/graph';
import type { NodeType } from './canvas-model';
import {
    areaToAreaNode,
    noteToNoteNode,
    tableToTableNode,
} from './canvas-model';

export const buildTargetEdgeCountsByField = (
    relationships: DBRelationship[]
): Record<string, number> => {
    return relationships.reduce<Record<string, number>>((counts, rel) => {
        counts[rel.targetFieldId] = (counts[rel.targetFieldId] ?? 0) + 1;
        return counts;
    }, {});
};

export const buildCanvasNodes = ({
    tables,
    areas,
    notes,
    previousNodes,
    relationships,
    overlapGraph,
    filter,
    databaseType,
    filterLoading,
    showDBViews,
    shouldForceShowTable,
    highlightOverlappingTables,
    highlightedCustomType,
}: {
    tables: DBTable[];
    areas: Area[];
    notes: Note[];
    previousNodes: NodeType[];
    relationships: DBRelationship[];
    overlapGraph: Graph<string>;
    filter?: DiagramFilter;
    databaseType: DatabaseType;
    filterLoading: boolean;
    showDBViews?: boolean;
    shouldForceShowTable: (tableId: string) => boolean;
    highlightOverlappingTables: boolean;
    highlightedCustomType?: DBCustomType;
}): NodeType[] => {
    const targetEdgeCountsByField = buildTargetEdgeCountsByField(relationships);

    return [
        ...tables.map((table) => {
            const targetEdgeCounts: Record<string, number> = {};
            table.fields.forEach((field) => {
                const count = targetEdgeCountsByField[field.id];
                if (count) {
                    targetEdgeCounts[field.id] = count;
                }
            });

            const node = tableToTableNode(table, {
                filter,
                databaseType,
                filterLoading,
                showDBViews,
                forceShow: shouldForceShowTable(table.id),
                isRelationshipCreatingTarget: false,
                targetEdgeCounts,
            });

            return {
                ...node,
                data: {
                    ...node.data,
                    isOverlapping:
                        (overlapGraph.graph.get(table.id) ?? []).length > 0,
                    highlightOverlappingTables,
                    hasHighlightedCustomType: highlightedCustomType
                        ? table.fields.some(
                              (field) =>
                                  field.type.name === highlightedCustomType.name
                          )
                        : false,
                },
            };
        }),
        ...areas.map((area) =>
            areaToAreaNode(area, {
                tables,
                filter,
                databaseType,
                filterLoading,
            })
        ),
        ...notes.map((note) => noteToNoteNode(note)),
        ...previousNodes.filter(
            (node) =>
                node.type === 'temp-cursor' ||
                node.type === 'create-relationship'
        ),
    ];
};
