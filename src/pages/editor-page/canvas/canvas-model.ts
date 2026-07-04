import type { EdgeTypes, NodeTypes } from '@xyflow/react';
import type { TableNodeType } from './table-node/table-node';
import { TableNode } from './table-node/table-node';
import type { RelationshipEdgeType } from './relationship-edge/relationship-edge';
import { RelationshipEdge } from './relationship-edge/relationship-edge';
import type { DBTable } from '@/lib/domain/db-table';
import { MIN_TABLE_SIZE } from '@/lib/domain/db-table';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import type { DatabaseType } from '@/lib/domain/database-type';
import { filterTable } from '@/lib/domain/diagram-filter/filter';
import { defaultSchemas } from '@/lib/data/default-schemas';
import type { DependencyEdgeType } from './dependency-edge/dependency-edge';
import { DependencyEdge } from './dependency-edge/dependency-edge';
import type { AreaNodeType } from './area-node/area-node';
import { AreaNode } from './area-node/area-node';
import type { Area } from '@/lib/domain/area';
import type { NoteNodeType } from './note-node/note-node';
import { NoteNode } from './note-node/note-node';
import type { Note } from '@/lib/domain/note';
import type { TempCursorNodeType } from './temp-cursor-node/temp-cursor-node';
import { TempCursorNode } from './temp-cursor-node/temp-cursor-node';
import type { TempFloatingEdgeType } from './temp-floating-edge/temp-floating-edge';
import { TempFloatingEdge } from './temp-floating-edge/temp-floating-edge';
import type { CreateRelationshipNodeType } from './create-relationship-node/create-relationship-node';
import { CreateRelationshipNode } from './create-relationship-node/create-relationship-node';

export type EdgeType =
    | RelationshipEdgeType
    | DependencyEdgeType
    | TempFloatingEdgeType;

export type NodeType =
    | TableNodeType
    | AreaNodeType
    | NoteNodeType
    | TempCursorNodeType
    | CreateRelationshipNodeType;

export const edgeTypes: EdgeTypes = {
    'relationship-edge': RelationshipEdge,
    'dependency-edge': DependencyEdge,
    'temp-floating-edge': TempFloatingEdge,
};

export const nodeTypes: NodeTypes = {
    table: TableNode,
    area: AreaNode,
    note: NoteNode,
    'temp-cursor': TempCursorNode,
    'create-relationship': CreateRelationshipNode,
};

export const initialEdges: EdgeType[] = [];

export const tableToTableNode = (
    table: DBTable,
    {
        filter,
        databaseType,
        filterLoading,
        showDBViews,
        forceShow,
        isRelationshipCreatingTarget = false,
        targetEdgeCounts,
    }: {
        filter?: DiagramFilter;
        databaseType: DatabaseType;
        filterLoading: boolean;
        showDBViews?: boolean;
        forceShow?: boolean;
        isRelationshipCreatingTarget?: boolean;
        targetEdgeCounts?: Record<string, number>;
    }
): TableNodeType => {
    const position = { x: table.x, y: table.y };

    let hidden = false;

    if (forceShow) {
        hidden = false;
    } else {
        hidden =
            !filterTable({
                table: { id: table.id, schema: table.schema },
                filter,
                options: { defaultSchema: defaultSchemas[databaseType] },
            }) ||
            filterLoading ||
            (!showDBViews && table.isView);
    }

    return {
        id: table.id,
        type: 'table',
        position,
        data: {
            table,
            isOverlapping: false,
            isRelationshipCreatingTarget,
            targetEdgeCounts,
        },
        width: table.width ?? MIN_TABLE_SIZE,
        hidden,
    };
};

export const areaToAreaNode = (
    area: Area,
    {
        tables,
        filter,
        databaseType,
        filterLoading,
    }: {
        tables: DBTable[];
        filter?: DiagramFilter;
        databaseType: DatabaseType;
        filterLoading: boolean;
    }
): AreaNodeType => {
    const tablesInArea = tables.filter((t) => t.parentAreaId === area.id);

    const hasVisibleTable =
        tablesInArea.length === 0 ||
        tablesInArea.some((table) =>
            filterTable({
                table: { id: table.id, schema: table.schema },
                filter,
                options: {
                    defaultSchema: defaultSchemas[databaseType],
                },
            })
        );

    return {
        id: area.id,
        type: 'area',
        position: { x: area.x, y: area.y },
        data: { area },
        width: area.width,
        height: area.height,
        zIndex: -10,
        style: {
            zIndex: -10,
        },
        hidden: !hasVisibleTable || filterLoading,
    };
};

export const noteToNoteNode = (note: Note): NoteNodeType => {
    return {
        id: note.id,
        type: 'note',
        position: { x: note.x, y: note.y },
        data: { note },
        width: note.width,
        height: note.height,
        zIndex: 50,
        style: {
            zIndex: 50,
        },
    };
};
