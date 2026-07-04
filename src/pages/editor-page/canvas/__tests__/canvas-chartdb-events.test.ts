import { describe, expect, it } from 'vitest';
import { addEdge, createGraph } from '@/lib/graph';
import { DatabaseType } from '@/lib/domain/database-type';
import { buildCanvasEventUpdate } from '../canvas-chartdb-events';
import type { ChartDBEvent } from '@/context/chartdb-context/chartdb-context';

describe('canvas ChartDB events', () => {
    it('removes deleted tables from the overlap graph', () => {
        const overlapGraph = addEdge(
            addEdge(createGraph<string>(), 'table-1', 'table-2'),
            'table-2',
            'table-3'
        );

        const result = buildCanvasEventUpdate({
            event: {
                action: 'remove_tables',
                data: { tableIds: ['table-2'] },
            } as ChartDBEvent,
            overlapGraph,
            nodes: [],
            getNode: () => undefined,
            filter: {},
            databaseType: DatabaseType.POSTGRESQL,
            showDBViews: true,
        });

        expect(result.overlapGraph.graph.has('table-2')).toBe(false);
        expect(result.overlapGraph.graph.get('table-1')).toEqual([]);
        expect(result.overlapGraph.graph.get('table-3')).toEqual([]);
    });
});
