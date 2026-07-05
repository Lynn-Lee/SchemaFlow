import { useEffect } from 'react';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { DBTable } from '@/lib/domain/db-table';
import { buildCanvasEdges } from './canvas-edges';
import type { EdgeType } from './canvas-model';

type UseCanvasEdgeRefreshParams = {
    tables: Pick<DBTable, 'id'>[];
    relationships: DBRelationship[];
    dependencies: DBDependency[];
    showDBViews: boolean;
    updateNodeInternals: (ids: string[]) => void;
    setEdges: (updater: (edges: EdgeType[]) => EdgeType[]) => void;
};

export const useCanvasEdgeRefresh = ({
    tables,
    relationships,
    dependencies,
    showDBViews,
    updateNodeInternals,
    setEdges,
}: UseCanvasEdgeRefreshParams) => {
    useEffect(() => {
        const tableNodeIds = tables.map((table) => table.id);
        if (tableNodeIds.length > 0) {
            updateNodeInternals(tableNodeIds);
        }

        const timeoutId = setTimeout(() => {
            setEdges((previousEdges) =>
                buildCanvasEdges({
                    relationships,
                    dependencies,
                    previousEdges,
                    showDBViews,
                })
            );
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [
        relationships,
        dependencies,
        setEdges,
        showDBViews,
        tables,
        updateNodeInternals,
    ]);
};
