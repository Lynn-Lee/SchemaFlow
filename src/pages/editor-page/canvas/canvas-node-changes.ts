import type {
    NodeChange,
    NodeDimensionChange,
    NodePositionChange,
    NodeRemoveChange,
} from '@xyflow/react';
import type { Area } from '@/lib/domain/area';
import type { DBTable } from '@/lib/domain/db-table';
import { getTablesInArea } from '@/lib/utils/area-utils';
import type { NodeType } from './canvas-model';

export type GetCanvasNode = (id: string) => NodeType | undefined;

export const getRelevantCanvasNodeChanges = (
    changes: NodeChange<NodeType>[],
    type: NodeType['type'],
    getNode: GetCanvasNode
) => {
    const relevantChanges = changes.filter((change) => {
        if (
            (change.type === 'position' &&
                !change.dragging &&
                change.position?.x !== undefined &&
                change.position?.y !== undefined &&
                !isNaN(change.position.x) &&
                !isNaN(change.position.y)) ||
            (change.type === 'dimensions' && change.resizing) ||
            change.type === 'remove'
        ) {
            return getNode(change.id)?.type === type;
        }

        return false;
    });

    const positionChanges = relevantChanges.filter(
        (change) =>
            change.type === 'position' &&
            !change.dragging &&
            change.position?.x !== undefined &&
            change.position?.y !== undefined &&
            !isNaN(change.position.x) &&
            !isNaN(change.position.y)
    ) as NodePositionChange[];

    const removeChanges = relevantChanges.filter(
        (change) => change.type === 'remove'
    ) as NodeRemoveChange[];

    const sizeChanges = relevantChanges.filter(
        (change) => change.type === 'dimensions' && change.resizing
    ) as NodeDimensionChange[];

    return {
        positionChanges,
        removeChanges,
        sizeChanges,
    };
};

export const getAreaDragChildTablePositionChanges = ({
    changes,
    areas,
    tables,
    getNode,
}: {
    changes: NodeChange<NodeType>[];
    areas: Area[];
    tables: DBTable[];
    getNode: GetCanvasNode;
}): NodePositionChange[] => {
    const areaDragChanges = changes.filter((change) => {
        if (change.type !== 'position') {
            return false;
        }

        return getNode(change.id)?.type === 'area' && change.dragging;
    }) as NodePositionChange[];

    return areaDragChanges.flatMap((areaChange) => {
        const currentArea = areas.find((area) => area.id === areaChange.id);
        if (!currentArea || !areaChange.position) {
            return [];
        }

        const deltaX = areaChange.position.x - currentArea.x;
        const deltaY = areaChange.position.y - currentArea.y;

        return tables
            .filter((table) => table.parentAreaId === areaChange.id)
            .map(
                (table): NodePositionChange => ({
                    id: table.id,
                    type: 'position',
                    position: {
                        x: table.x + deltaX,
                        y: table.y + deltaY,
                    },
                    dragging: true,
                })
            );
    });
};

export const buildCanvasNodeChangeSet = ({
    changes,
    readonly,
    areas,
    tables,
    getNode,
}: {
    changes: NodeChange<NodeType>[];
    readonly: boolean;
    areas: Area[];
    tables: DBTable[];
    getNode: GetCanvasNode;
}) => {
    let changesToApply = changes;

    if (readonly) {
        changesToApply = changesToApply.filter(
            (change) => change.type !== 'remove'
        );
    }

    const additionalChanges = getAreaDragChildTablePositionChanges({
        changes: changesToApply,
        areas,
        tables,
        getNode,
    });

    if (additionalChanges.length > 0) {
        changesToApply = [...changesToApply, ...additionalChanges];
    }

    const areaChanges = getRelevantCanvasNodeChanges(
        changesToApply,
        'area',
        getNode
    );
    const noteChanges = getRelevantCanvasNodeChanges(
        changesToApply,
        'note',
        getNode
    );
    const tableChanges = getRelevantCanvasNodeChanges(
        changesToApply,
        'table',
        getNode
    );
    const childTableMovements: Map<string, { deltaX: number; deltaY: number }> =
        new Map();

    if (
        areaChanges.positionChanges.length > 0 &&
        areaChanges.sizeChanges.length === 0
    ) {
        areaChanges.positionChanges.forEach((change) => {
            if (change.type !== 'position' || !change.position) {
                return;
            }

            const currentArea = areas.find((area) => area.id === change.id);
            if (!currentArea) {
                return;
            }

            const deltaX = change.position.x - currentArea.x;
            const deltaY = change.position.y - currentArea.y;

            getTablesInArea(change.id, tables).forEach((table) => {
                childTableMovements.set(table.id, { deltaX, deltaY });
            });
        });
    }

    return {
        changesToApply,
        areaChanges,
        noteChanges,
        tableChanges: {
            ...tableChanges,
            childTableMovements,
        },
    };
};
