import { useEffect } from 'react';
import type { ChartDBContext } from '@/context/chartdb-context/chartdb-context';
import { debounce } from '@/lib/utils';
import type { NodeType } from './canvas-model';
import { buildParentAreaUpdates } from './canvas-parent-areas';

export interface UseCanvasParentAreaSyncParams {
    nodes: NodeType[];
    updateTablesState: ChartDBContext['updateTablesState'];
    debounceMs?: number;
}

export const useCanvasParentAreaSync = ({
    nodes,
    updateTablesState,
    debounceMs = 300,
}: UseCanvasParentAreaSyncParams) => {
    useEffect(() => {
        const syncParentAreas = () => {
            const needsUpdate = buildParentAreaUpdates(nodes);

            if (needsUpdate.length > 0) {
                updateTablesState(
                    (currentTables) =>
                        currentTables.map((table) => {
                            const update = needsUpdate.find(
                                (u) => u.id === table.id
                            );
                            if (update) {
                                return {
                                    id: table.id,
                                    parentAreaId: update.parentAreaId,
                                };
                            }
                            return table;
                        }),
                    { updateHistory: false }
                );
            }
        };

        if (debounceMs === 0) {
            syncParentAreas();
            return;
        }

        debounce(syncParentAreas, debounceMs)();
    }, [nodes, updateTablesState, debounceMs]);
};
