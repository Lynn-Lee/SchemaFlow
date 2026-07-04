import { describe, expect, it } from 'vitest';
import {
    TEMP_CURSOR_HANDLE_ID,
    TEMP_CURSOR_NODE_ID,
} from '../temp-cursor-node/temp-cursor-node';
import { TEMP_FLOATING_EDGE_ID } from '../temp-floating-edge/temp-floating-edge';
import { TABLE_RELATIONSHIP_TARGET_HANDLE_ID_PREFIX } from '../table-node/table-node';
import {
    buildCanvasEdgesWithFloatingEdge,
    buildCanvasNodesWithCursor,
} from '../canvas-floating-edge';
import type { EdgeType, NodeType } from '../canvas-model';

describe('canvas floating edge', () => {
    it('keeps existing nodes when the floating edge has no cursor position', () => {
        const nodes = [{ id: 'table-1', type: 'table' }] as NodeType[];

        expect(
            buildCanvasNodesWithCursor({
                nodes,
                tempFloatingEdge: { sourceNodeId: 'table-1' },
                cursorPosition: null,
            })
        ).toBe(nodes);
    });

    it('adds an invisible cursor node while a floating edge is active', () => {
        const nodes = [{ id: 'table-1', type: 'table' }] as NodeType[];

        expect(
            buildCanvasNodesWithCursor({
                nodes,
                tempFloatingEdge: { sourceNodeId: 'table-1' },
                cursorPosition: { x: 10, y: 20 },
            })
        ).toEqual([
            nodes[0],
            {
                id: TEMP_CURSOR_NODE_ID,
                type: 'temp-cursor',
                position: { x: 10, y: 20 },
                data: {},
                draggable: false,
                selectable: false,
            },
        ]);
    });

    it('targets the cursor when no hover target is available', () => {
        const edges = [
            { id: 'edge-1', type: 'relationship-edge' },
        ] as EdgeType[];

        expect(
            buildCanvasEdgesWithFloatingEdge({
                edges,
                tempFloatingEdge: { sourceNodeId: 'table-1' },
                cursorPosition: { x: 10, y: 20 },
                hoveringTableId: undefined,
            })
        ).toEqual([
            edges[0],
            expect.objectContaining({
                id: TEMP_FLOATING_EDGE_ID,
                source: 'table-1',
                target: TEMP_CURSOR_NODE_ID,
                targetHandle: TEMP_CURSOR_HANDLE_ID,
                type: 'temp-floating-edge',
            }),
        ]);
    });

    it('targets the hovered table unless it is the source table', () => {
        const edges = [
            { id: 'edge-1', type: 'relationship-edge' },
        ] as EdgeType[];

        const targetEdge = buildCanvasEdgesWithFloatingEdge({
            edges,
            tempFloatingEdge: { sourceNodeId: 'table-1' },
            cursorPosition: { x: 10, y: 20 },
            hoveringTableId: 'table-2',
        }).at(-1);

        const sourceEdge = buildCanvasEdgesWithFloatingEdge({
            edges,
            tempFloatingEdge: { sourceNodeId: 'table-1' },
            cursorPosition: { x: 10, y: 20 },
            hoveringTableId: 'table-1',
        }).at(-1);

        expect(targetEdge).toEqual(
            expect.objectContaining({
                target: 'table-2',
                targetHandle: `${TABLE_RELATIONSHIP_TARGET_HANDLE_ID_PREFIX}table-2`,
            })
        );
        expect(sourceEdge).toEqual(
            expect.objectContaining({
                target: TEMP_CURSOR_NODE_ID,
                targetHandle: TEMP_CURSOR_HANDLE_ID,
            })
        );
    });
});
