import { useEffect, useState } from 'react';
import equal from 'fast-deep-equal';
import { debounce } from '@/lib/utils';
import type { DBTable } from '@/lib/domain/db-table';
import type { DatabaseType } from '@/lib/domain/database-type';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { tableToTableNode, type NodeType } from './canvas-model';

type UseCanvasInitialFitParams = {
    initialTables: DBTable[];
    nodes: NodeType[];
    filter?: DiagramFilter;
    databaseType: DatabaseType;
    filterLoading: boolean;
    showDBViews: boolean;
    shouldForceShowTable: (tableId: string) => boolean;
    fitView: (options: {
        duration: number;
        padding: number;
        maxZoom: number;
    }) => void;
    debounceMs?: number;
};

export const useCanvasInitialFit = ({
    initialTables,
    nodes,
    filter,
    databaseType,
    filterLoading,
    showDBViews,
    shouldForceShowTable,
    fitView,
    debounceMs = 500,
}: UseCanvasInitialFitParams) => {
    const [isInitialLoadingNodes, setIsInitialLoadingNodes] = useState(true);

    useEffect(() => {
        setIsInitialLoadingNodes(true);
    }, [initialTables]);

    useEffect(() => {
        const initialNodes = initialTables.map((table) =>
            tableToTableNode(table, {
                filter,
                databaseType,
                filterLoading,
                showDBViews,
                forceShow: shouldForceShowTable(table.id),
                isRelationshipCreatingTarget: false,
            })
        );

        if (equal(initialNodes, nodes)) {
            setIsInitialLoadingNodes(false);
        }
    }, [
        initialTables,
        nodes,
        filter,
        databaseType,
        filterLoading,
        showDBViews,
        shouldForceShowTable,
    ]);

    useEffect(() => {
        if (isInitialLoadingNodes) {
            return;
        }

        const fitInitialView = () => {
            fitView({
                duration: 200,
                padding: 0.1,
                maxZoom: 0.8,
            });
        };

        if (debounceMs === 0) {
            fitInitialView();
        } else {
            debounce(fitInitialView, debounceMs)();
        }
    }, [isInitialLoadingNodes, fitView, debounceMs]);

    return isInitialLoadingNodes;
};
