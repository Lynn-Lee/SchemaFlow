import type {
    NodeDimensionChange,
    NodePositionChange,
    NodeRemoveChange,
} from '@xyflow/react';
import type { Area } from '@/lib/domain/area';
import type { DBTable } from '@/lib/domain/db-table';
import type { Note } from '@/lib/domain/note';

type NodeMovement = { deltaX: number; deltaY: number };

export const buildTableStorageChanges = ({
    tables,
    positionChanges,
    sizeChanges,
    removeChanges,
    areaRemoveChanges,
    childTableMovements,
}: {
    tables: DBTable[];
    positionChanges: NodePositionChange[];
    sizeChanges: NodeDimensionChange[];
    removeChanges: NodeRemoveChange[];
    areaRemoveChanges: NodeRemoveChange[];
    childTableMovements: Map<string, NodeMovement>;
}) => {
    const updatedTables = tables
        .map((currentTable) => {
            const removedArea = areaRemoveChanges.find(
                (change) => change.id === currentTable.parentAreaId
            );

            const tableWithAreaCleanup = removedArea
                ? { ...currentTable, parentAreaId: null }
                : currentTable;

            const positionChange = positionChanges.find(
                (change) => change.id === currentTable.id
            );
            const sizeChange = sizeChanges.find(
                (change) => change.id === currentTable.id
            );
            const areaMovement = childTableMovements.get(currentTable.id);

            if (!positionChange && !sizeChange && !areaMovement) {
                return tableWithAreaCleanup;
            }

            const x = positionChange?.position?.x;
            const y = positionChange?.position?.y;

            return {
                ...tableWithAreaCleanup,
                ...(positionChange &&
                x !== undefined &&
                y !== undefined &&
                !isNaN(x) &&
                !isNaN(y)
                    ? { x, y }
                    : {}),
                ...(areaMovement && !positionChange
                    ? {
                          x: tableWithAreaCleanup.x + areaMovement.deltaX,
                          y: tableWithAreaCleanup.y + areaMovement.deltaY,
                      }
                    : {}),
                ...(sizeChange
                    ? {
                          width:
                              sizeChange.dimensions?.width ??
                              tableWithAreaCleanup.width,
                      }
                    : {}),
            };
        })
        .filter(
            (table) => !removeChanges.some((change) => change.id === table.id)
        );

    return {
        tables: updatedTables,
        updateHistory:
            positionChanges.length > 0 ||
            removeChanges.length > 0 ||
            sizeChanges.length > 0,
    };
};

const buildNodeStorageChanges = <T extends Area | Note>({
    positionChanges,
    sizeChanges,
    removeChanges,
}: {
    positionChanges: NodePositionChange[];
    sizeChanges: NodeDimensionChange[];
    removeChanges: NodeRemoveChange[];
}): {
    updates: { id: string; updates: Partial<T> }[];
    removeIds: string[];
} => {
    const updates: Record<string, Partial<T>> = {};

    positionChanges.forEach((change) => {
        if (change.type === 'position' && change.position) {
            updates[change.id] = {
                ...updates[change.id],
                x: change.position.x,
                y: change.position.y,
            } as Partial<T>;
        }
    });

    sizeChanges.forEach((change) => {
        if (change.type === 'dimensions' && change.dimensions) {
            updates[change.id] = {
                ...updates[change.id],
                width: change.dimensions.width,
                height: change.dimensions.height,
            } as Partial<T>;
        }
    });

    const removeIds = removeChanges.map((change) => {
        delete updates[change.id];
        return change.id;
    });

    return {
        updates: Object.entries(updates).map(([id, nodeUpdates]) => ({
            id,
            updates: nodeUpdates,
        })),
        removeIds,
    };
};

export const buildAreaStorageChanges = (changes: {
    positionChanges: NodePositionChange[];
    sizeChanges: NodeDimensionChange[];
    removeChanges: NodeRemoveChange[];
}) => buildNodeStorageChanges<Area>(changes);

export const buildNoteStorageChanges = (changes: {
    positionChanges: NodePositionChange[];
    sizeChanges: NodeDimensionChange[];
    removeChanges: NodeRemoveChange[];
}) => buildNodeStorageChanges<Note>(changes);
