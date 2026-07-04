import type { NodeChange } from '@xyflow/react';
import { describe, expect, it } from 'vitest';
import type { Area } from '@/lib/domain/area';
import type { DBTable } from '@/lib/domain/db-table';
import {
    getAreaDragChildTablePositionChanges,
    getRelevantCanvasNodeChanges,
} from '../canvas-node-changes';
import type { NodeType } from '../canvas-model';

const getNode = (nodes: NodeType[]) => (id: string) =>
    nodes.find((node) => node.id === id);

describe('canvas node changes', () => {
    it('groups relevant changes for a requested node type', () => {
        const nodes = [
            { id: 'table-1', type: 'table' },
            { id: 'area-1', type: 'area' },
        ] as NodeType[];

        const changes = [
            {
                id: 'table-1',
                type: 'position',
                position: { x: 10, y: 20 },
                dragging: false,
            },
            {
                id: 'table-1',
                type: 'dimensions',
                dimensions: { width: 200, height: 100 },
                resizing: true,
            },
            { id: 'area-1', type: 'remove' },
        ] as NodeChange<NodeType>[];

        expect(
            getRelevantCanvasNodeChanges(changes, 'table', getNode(nodes))
        ).toMatchObject({
            positionChanges: [{ id: 'table-1' }],
            removeChanges: [],
            sizeChanges: [{ id: 'table-1' }],
        });
    });

    it('creates visual child table movement changes while an area is dragged', () => {
        const area = { id: 'area-1', x: 10, y: 20 } as Area;
        const tables = [
            { id: 'table-1', x: 15, y: 25, parentAreaId: 'area-1' },
            { id: 'table-2', x: 50, y: 60, parentAreaId: null },
        ] as DBTable[];
        const nodes = [{ id: 'area-1', type: 'area' }] as NodeType[];

        const changes = getAreaDragChildTablePositionChanges({
            changes: [
                {
                    id: 'area-1',
                    type: 'position',
                    position: { x: 13, y: 24 },
                    dragging: true,
                },
            ] as NodeChange<NodeType>[],
            areas: [area],
            tables,
            getNode: getNode(nodes),
        });

        expect(changes).toEqual([
            {
                id: 'table-1',
                type: 'position',
                position: { x: 18, y: 29 },
                dragging: true,
            },
        ]);
    });
});
