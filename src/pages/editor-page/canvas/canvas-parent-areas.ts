import { updateTablesParentAreas } from '@/lib/utils/area-utils';
import type { AreaNodeType } from './area-node/area-node';
import type { NodeType } from './canvas-model';
import type { TableNodeType } from './table-node/table-node';

export type ParentAreaUpdate = {
    id: string;
    parentAreaId: string | null;
};

export const buildParentAreaUpdates = (
    nodes: NodeType[]
): ParentAreaUpdate[] => {
    const visibleTables = nodes
        .filter((node) => node.type === 'table' && !node.hidden)
        .map((node) => (node as TableNodeType).data.table);
    const visibleAreas = nodes
        .filter((node) => node.type === 'area' && !node.hidden)
        .map((node) => (node as AreaNodeType).data.area);

    const updatedTables = updateTablesParentAreas(visibleTables, visibleAreas);

    return updatedTables.flatMap((newTable, index) => {
        const oldTable = visibleTables[index];
        if (
            oldTable &&
            (!!newTable.parentAreaId || !!oldTable.parentAreaId) &&
            newTable.parentAreaId !== oldTable.parentAreaId
        ) {
            return [
                {
                    id: newTable.id,
                    parentAreaId: newTable.parentAreaId || null,
                },
            ];
        }

        return [];
    });
};
