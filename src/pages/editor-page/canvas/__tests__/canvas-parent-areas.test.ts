import { describe, expect, it } from 'vitest';
import type { Area } from '@/lib/domain/area';
import type { DBTable } from '@/lib/domain/db-table';
import { buildParentAreaUpdates } from '../canvas-parent-areas';
import type { NodeType } from '../canvas-model';

const tableNode = (
    table: Partial<DBTable> & Pick<DBTable, 'id' | 'x' | 'y'>,
    hidden = false
) =>
    ({
        id: table.id,
        type: 'table',
        hidden,
        data: { table: { fields: [], ...table } },
    }) as NodeType;

const areaNode = (
    area: Partial<Area> & Pick<Area, 'id' | 'x' | 'y' | 'width' | 'height'>,
    hidden = false
) =>
    ({
        id: area.id,
        type: 'area',
        hidden,
        data: { area },
    }) as NodeType;

describe('canvas parent area updates', () => {
    it('returns parentAreaId updates only for visible tables whose containing area changed', () => {
        const nodes = [
            tableNode({ id: 'inside', x: 20, y: 20, parentAreaId: null }),
            tableNode({
                id: 'unchanged',
                x: 30,
                y: 30,
                parentAreaId: 'area-1',
            }),
            tableNode({
                id: 'outside',
                x: 400,
                y: 400,
                parentAreaId: 'area-1',
            }),
            tableNode(
                { id: 'hidden-table', x: 40, y: 40, parentAreaId: null },
                true
            ),
            areaNode({ id: 'area-1', x: 0, y: 0, width: 300, height: 300 }),
            areaNode(
                { id: 'hidden-area', x: 0, y: 0, width: 300, height: 300 },
                true
            ),
        ];

        expect(buildParentAreaUpdates(nodes)).toEqual([
            { id: 'inside', parentAreaId: 'area-1' },
            { id: 'outside', parentAreaId: null },
        ]);
    });
});
