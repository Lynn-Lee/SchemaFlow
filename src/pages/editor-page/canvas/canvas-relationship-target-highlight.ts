import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { NodeType } from './canvas-model';

type UseCanvasRelationshipTargetHighlightParams = {
    sourceNodeId?: string;
    setNodes: Dispatch<SetStateAction<NodeType[]>>;
};

export const useCanvasRelationshipTargetHighlight = ({
    sourceNodeId,
    setNodes,
}: UseCanvasRelationshipTargetHighlightParams) => {
    useEffect(() => {
        setNodes((nodes) => {
            let hasChanges = false;
            const updatedNodes = nodes.map((node) => {
                if (node.type !== 'table') {
                    return node;
                }

                const shouldBeTarget =
                    !!sourceNodeId && node.id !== sourceNodeId;
                const isCurrentlyTarget =
                    node.data.isRelationshipCreatingTarget ?? false;

                if (shouldBeTarget !== isCurrentlyTarget) {
                    hasChanges = true;
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isRelationshipCreatingTarget: shouldBeTarget,
                        },
                    };
                }

                return node;
            });

            return hasChanges ? updatedNodes : nodes;
        });
    }, [sourceNodeId, setNodes]);
};
