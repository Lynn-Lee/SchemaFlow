import { describe, expect, it } from 'vitest';
import {
    getSelectedCanvasEdgeIds,
    getSelectedCanvasNodeIds,
} from '../canvas-selection';
import type { EdgeType, NodeType } from '../canvas-model';

describe('canvas selection mapping', () => {
    it('returns selected node and edge ids in React Flow order', () => {
        const nodes = [
            { id: 'table-1', type: 'table', selected: true },
            { id: 'table-2', type: 'table' },
            { id: 'note-1', type: 'note', selected: true },
        ] as NodeType[];
        const edges = [
            {
                id: 'rel-1',
                source: 'table-1',
                target: 'table-2',
                type: 'relationship-edge',
            },
            {
                id: 'dep-1',
                source: 'table-2',
                target: 'table-1',
                type: 'dependency-edge',
                selected: true,
            },
        ] as EdgeType[];

        expect(getSelectedCanvasNodeIds(nodes)).toEqual(['table-1', 'note-1']);
        expect(getSelectedCanvasEdgeIds(edges)).toEqual(['dep-1']);
    });
});
