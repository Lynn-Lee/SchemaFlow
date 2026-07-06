import { useCallback } from 'react';
import type {
    NodeDimensionChange,
    NodePositionChange,
    OnNodesChange,
} from '@xyflow/react';
import type { Area } from '@/lib/domain/area';
import type { DBTable } from '@/lib/domain/db-table';
import type { Note } from '@/lib/domain/note';
import {
    buildCanvasNodeChangeSet,
    type GetCanvasNode,
} from './canvas-node-changes';
import {
    buildAreaStorageChanges,
    buildNoteStorageChanges,
    buildTableStorageChanges,
} from './canvas-node-storage-updates';
import type { NodeType } from './canvas-model';

export const useCanvasNodeChangeHandler = ({
    readonly,
    tables,
    areas,
    getNode,
    onNodesChange,
    updateTablesState,
    updateOverlappingGraphOnChanges,
    updateArea,
    removeArea,
    updateNote,
    removeNote,
}: {
    readonly: boolean;
    tables: DBTable[];
    areas: Area[];
    getNode: GetCanvasNode;
    onNodesChange: OnNodesChange<NodeType>;
    updateTablesState: (
        updater: (currentTables: DBTable[]) => DBTable[],
        options: { updateHistory: boolean }
    ) => void;
    updateOverlappingGraphOnChanges: (changes: {
        positionChanges: NodePositionChange[];
        sizeChanges: NodeDimensionChange[];
    }) => void;
    updateArea: (id: string, updates: Partial<Area>) => void;
    removeArea: (id: string) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    removeNote: (id: string) => void;
}) =>
    useCallback<OnNodesChange<NodeType>>(
        (changes) => {
            const { changesToApply, areaChanges, noteChanges, tableChanges } =
                buildCanvasNodeChangeSet({
                    changes,
                    readonly,
                    areas,
                    tables,
                    getNode,
                });

            const {
                positionChanges,
                removeChanges,
                sizeChanges,
                childTableMovements,
            } = tableChanges;
            const {
                positionChanges: areaPositionChanges,
                removeChanges: areaRemoveChanges,
                sizeChanges: areaSizeChanges,
            } = areaChanges;
            const {
                positionChanges: notePositionChanges,
                removeChanges: noteRemoveChanges,
                sizeChanges: noteSizeChanges,
            } = noteChanges;

            if (
                positionChanges.length > 0 ||
                removeChanges.length > 0 ||
                sizeChanges.length > 0 ||
                childTableMovements.size > 0 ||
                areaRemoveChanges.length > 0
            ) {
                const tableStorageChanges = buildTableStorageChanges({
                    tables,
                    positionChanges,
                    removeChanges,
                    sizeChanges,
                    areaRemoveChanges,
                    childTableMovements,
                });

                updateTablesState(
                    (currentTables) =>
                        buildTableStorageChanges({
                            tables: currentTables,
                            positionChanges,
                            removeChanges,
                            sizeChanges,
                            areaRemoveChanges,
                            childTableMovements,
                        }).tables,
                    { updateHistory: tableStorageChanges.updateHistory }
                );
            }

            updateOverlappingGraphOnChanges({
                positionChanges,
                sizeChanges,
            });

            if (
                areaPositionChanges.length > 0 ||
                areaRemoveChanges.length > 0 ||
                areaSizeChanges.length > 0
            ) {
                const areaStorageChanges = buildAreaStorageChanges({
                    positionChanges: areaPositionChanges,
                    removeChanges: areaRemoveChanges,
                    sizeChanges: areaSizeChanges,
                });

                areaStorageChanges.removeIds.forEach((id) => removeArea(id));
                areaStorageChanges.updates.forEach(({ id, updates }) =>
                    updateArea(id, updates)
                );
            }

            if (
                notePositionChanges.length > 0 ||
                noteRemoveChanges.length > 0 ||
                noteSizeChanges.length > 0
            ) {
                const noteStorageChanges = buildNoteStorageChanges({
                    positionChanges: notePositionChanges,
                    removeChanges: noteRemoveChanges,
                    sizeChanges: noteSizeChanges,
                });

                noteStorageChanges.removeIds.forEach((id) => removeNote(id));
                noteStorageChanges.updates.forEach(({ id, updates }) =>
                    updateNote(id, updates)
                );
            }

            return onNodesChange(changesToApply);
        },
        [
            onNodesChange,
            updateTablesState,
            updateOverlappingGraphOnChanges,
            updateArea,
            removeArea,
            updateNote,
            removeNote,
            readonly,
            tables,
            areas,
            getNode,
        ]
    );
