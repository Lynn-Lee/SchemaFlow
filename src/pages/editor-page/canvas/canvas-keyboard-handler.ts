import { useCallback } from 'react';
import type React from 'react';
import type { NodeChange } from '@xyflow/react';
import type { NodeType } from './canvas-model';
import {
    getCanvasKeyboardNodeChanges,
    isCanvasKeyboardActionKey,
    isCanvasKeyboardInputTarget,
} from './canvas-keyboard-actions';

type UseCanvasKeyboardHandlerParams = {
    nodes: NodeType[];
    readonly: boolean;
    onNodesChange: (changes: NodeChange<NodeType>[]) => void;
};

export const useCanvasKeyboardHandler = ({
    nodes,
    readonly,
    onNodesChange,
}: UseCanvasKeyboardHandlerParams) => {
    return useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (
                event.defaultPrevented ||
                !isCanvasKeyboardActionKey(event.key) ||
                isCanvasKeyboardInputTarget(event.target)
            ) {
                return;
            }

            const keyboardChanges = getCanvasKeyboardNodeChanges({
                key: event.key,
                nodes,
                readonly,
            }) as NodeChange<NodeType>[];

            if (keyboardChanges.length === 0) {
                return;
            }

            event.preventDefault();
            onNodesChange(keyboardChanges);
        },
        [nodes, readonly, onNodesChange]
    );
};
