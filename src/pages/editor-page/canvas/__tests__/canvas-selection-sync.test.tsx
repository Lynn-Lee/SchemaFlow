import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCanvasSelectionSync } from '../canvas-selection-sync';
import type { EdgeType, NodeType } from '../canvas-model';

describe('useCanvasSelectionSync', () => {
    it('syncs selected node and edge ids from React Flow state', () => {
        const setSelectedTableIds = vi.fn();
        const setSelectedRelationshipIds = vi.fn();
        const setEdges = vi.fn();
        const nodes = [
            { id: 'table-1', type: 'table', selected: true },
            { id: 'table-2', type: 'table' },
        ] as NodeType[];
        const edges = [
            {
                id: 'rel-1',
                source: 'table-1',
                target: 'table-2',
                type: 'relationship-edge',
                selected: true,
            },
        ] as EdgeType[];

        renderHook(() =>
            useCanvasSelectionSync({
                nodes,
                edges,
                selectedTableIds: [],
                selectedRelationshipIds: [],
                setSelectedTableIds,
                setSelectedRelationshipIds,
                setEdges,
            })
        );

        expect(setSelectedTableIds).toHaveBeenCalledWith(['table-1']);
        expect(setSelectedRelationshipIds).toHaveBeenCalledWith(['rel-1']);
        expect(setEdges).toHaveBeenCalledTimes(1);
    });

    it('keeps state untouched when selected ids are already synchronized', () => {
        const setSelectedTableIds = vi.fn();
        const setSelectedRelationshipIds = vi.fn();
        const setEdges = vi.fn();
        const nodes = [
            { id: 'table-1', type: 'table', selected: true },
        ] as NodeType[];
        const edges = [
            {
                id: 'rel-1',
                source: 'table-1',
                target: 'table-2',
                type: 'relationship-edge',
                selected: true,
            },
        ] as EdgeType[];

        renderHook(() =>
            useCanvasSelectionSync({
                nodes,
                edges,
                selectedTableIds: ['table-1'],
                selectedRelationshipIds: ['rel-1'],
                setSelectedTableIds,
                setSelectedRelationshipIds,
                setEdges,
            })
        );

        expect(setSelectedTableIds).not.toHaveBeenCalled();
        expect(setSelectedRelationshipIds).not.toHaveBeenCalled();
        expect(setEdges).toHaveBeenCalledTimes(1);
    });
});
