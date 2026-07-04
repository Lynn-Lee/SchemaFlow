import type { Node, NodeChange } from '@xyflow/react';

export const CANVAS_KEYBOARD_MOVE_STEP = 20;

const EDITABLE_NODE_TYPES = new Set(['table', 'area', 'note']);
const DELETE_KEYS = new Set(['Backspace', 'Delete']);
const ARROW_KEY_DELTAS: Record<string, { x: number; y: number }> = {
    ArrowUp: { x: 0, y: -CANVAS_KEYBOARD_MOVE_STEP },
    ArrowRight: { x: CANVAS_KEYBOARD_MOVE_STEP, y: 0 },
    ArrowDown: { x: 0, y: CANVAS_KEYBOARD_MOVE_STEP },
    ArrowLeft: { x: -CANVAS_KEYBOARD_MOVE_STEP, y: 0 },
};

export const isCanvasKeyboardActionKey = (key: string) =>
    DELETE_KEYS.has(key) || key in ARROW_KEY_DELTAS;

const isEditableCanvasNode = (node: Node) =>
    typeof node.type === 'string' && EDITABLE_NODE_TYPES.has(node.type);

export const getCanvasKeyboardNodeChanges = ({
    key,
    nodes,
    readonly,
}: {
    key: string;
    nodes: Node[];
    readonly: boolean;
}): NodeChange<Node>[] => {
    if (readonly) {
        return [];
    }

    const selectedNodes = nodes.filter(
        (node) => node.selected && isEditableCanvasNode(node)
    );

    if (selectedNodes.length === 0) {
        return [];
    }

    if (DELETE_KEYS.has(key)) {
        return selectedNodes.map((node) => ({
            id: node.id,
            type: 'remove',
        }));
    }

    const delta = ARROW_KEY_DELTAS[key];
    if (!delta) {
        return [];
    }

    return selectedNodes.map((node) => ({
        id: node.id,
        type: 'position',
        position: {
            x: node.position.x + delta.x,
            y: node.position.y + delta.y,
        },
        dragging: false,
    }));
};

export const isCanvasKeyboardInputTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    return !!target.closest(
        'input, textarea, select, button, [contenteditable="true"], [role="textbox"]'
    );
};
