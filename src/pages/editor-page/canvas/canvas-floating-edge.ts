import {
    TABLE_RELATIONSHIP_SOURCE_HANDLE_ID_PREFIX,
    TABLE_RELATIONSHIP_TARGET_HANDLE_ID_PREFIX,
} from './table-node/table-node';
import {
    TEMP_CURSOR_HANDLE_ID,
    TEMP_CURSOR_NODE_ID,
} from './temp-cursor-node/temp-cursor-node';
import type { TempCursorNodeType } from './temp-cursor-node/temp-cursor-node';
import {
    TEMP_FLOATING_EDGE_ID,
    type TempFloatingEdgeType,
} from './temp-floating-edge/temp-floating-edge';
import type { EdgeType, NodeType } from './canvas-model';

type CanvasPosition = {
    x: number;
    y: number;
};

type FloatingEdgeState = {
    sourceNodeId: string;
    targetNodeId?: string;
} | null;

export const buildCanvasNodesWithCursor = ({
    nodes,
    tempFloatingEdge,
    cursorPosition,
}: {
    nodes: NodeType[];
    tempFloatingEdge: FloatingEdgeState;
    cursorPosition: CanvasPosition | null;
}) => {
    if (!tempFloatingEdge || !cursorPosition) {
        return nodes;
    }

    const tempNode: TempCursorNodeType = {
        id: TEMP_CURSOR_NODE_ID,
        type: 'temp-cursor',
        position: cursorPosition,
        data: {},
        draggable: false,
        selectable: false,
    };

    return [...nodes, tempNode];
};

export const buildCanvasEdgesWithFloatingEdge = ({
    edges,
    tempFloatingEdge,
    cursorPosition,
    hoveringTableId,
}: {
    edges: EdgeType[];
    tempFloatingEdge: FloatingEdgeState;
    cursorPosition: CanvasPosition | null;
    hoveringTableId?: string | null;
}) => {
    if (!tempFloatingEdge || !cursorPosition) {
        return edges;
    }

    let target = TEMP_CURSOR_NODE_ID;
    let targetHandle: string | undefined = TEMP_CURSOR_HANDLE_ID;

    if (tempFloatingEdge.targetNodeId) {
        target = tempFloatingEdge.targetNodeId;
        targetHandle = `${TABLE_RELATIONSHIP_TARGET_HANDLE_ID_PREFIX}${tempFloatingEdge.targetNodeId}`;
    } else if (
        hoveringTableId &&
        hoveringTableId !== tempFloatingEdge.sourceNodeId
    ) {
        target = hoveringTableId;
        targetHandle = `${TABLE_RELATIONSHIP_TARGET_HANDLE_ID_PREFIX}${hoveringTableId}`;
    }

    const tempEdge: TempFloatingEdgeType = {
        id: TEMP_FLOATING_EDGE_ID,
        source: tempFloatingEdge.sourceNodeId,
        sourceHandle: `${TABLE_RELATIONSHIP_SOURCE_HANDLE_ID_PREFIX}${tempFloatingEdge.sourceNodeId}`,
        target,
        targetHandle,
        type: 'temp-floating-edge',
    };

    return [...edges, tempEdge];
};
