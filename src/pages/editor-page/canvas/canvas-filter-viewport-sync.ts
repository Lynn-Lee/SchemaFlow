import { useEffect, useRef } from 'react';
import equal from 'fast-deep-equal';
import type { Graph } from '@/lib/graph';
import { debounce } from '@/lib/utils';
import type { DBTable } from '@/lib/domain/db-table';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { buildVisibleTableOverlapGraph } from './canvas-overlap-updates';

export interface UseCanvasFilterViewportSyncParams {
    tables: DBTable[];
    filter: DiagramFilter | undefined;
    databaseType: DatabaseType;
    showDBViews: boolean;
    setOverlapGraph: (overlapGraph: Graph<string>) => void;
    fitView: (options: {
        duration: number;
        padding: number;
        maxZoom: number;
    }) => void;
    debounceMs?: number;
}

export const useCanvasFilterViewportSync = ({
    tables,
    filter,
    databaseType,
    showDBViews,
    setOverlapGraph,
    fitView,
    debounceMs = 500,
}: UseCanvasFilterViewportSyncParams) => {
    const prevFilter = useRef<DiagramFilter | undefined>(filter);
    const prevShowDBViews = useRef<boolean>(showDBViews);

    useEffect(() => {
        if (
            equal(filter, prevFilter.current) &&
            showDBViews === prevShowDBViews.current
        ) {
            return;
        }

        const syncViewport = () => {
            const overlappingTablesInDiagram = buildVisibleTableOverlapGraph({
                tables,
                filter,
                databaseType,
                showDBViews,
            });
            setOverlapGraph(overlappingTablesInDiagram);
            fitView({
                duration: 500,
                padding: 0.1,
                maxZoom: 0.8,
            });
        };

        if (debounceMs === 0) {
            syncViewport();
        } else {
            debounce(syncViewport, debounceMs)();
        }

        prevFilter.current = filter;
        prevShowDBViews.current = showDBViews;
    }, [
        filter,
        fitView,
        tables,
        setOverlapGraph,
        databaseType,
        showDBViews,
        debounceMs,
    ]);
};
