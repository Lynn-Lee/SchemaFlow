import { useCallback, useMemo } from 'react';
import type { NodeDimensionChange, NodePositionChange } from '@xyflow/react';
import type { Graph } from '@/lib/graph';
import { debounce } from '@/lib/utils';
import { buildUpdatedOverlapGraphForNodeChanges } from './canvas-overlap-updates';
import type { NodeType } from './canvas-model';

export const useCanvasOverlapChangeHandler = ({
    nodes,
    overlapGraph,
    setOverlapGraph,
    getNode,
    debounceMs = 200,
}: {
    nodes: NodeType[];
    overlapGraph: Graph<string>;
    setOverlapGraph: (overlapGraph: Graph<string>) => void;
    getNode: (id: string) => NodeType | undefined;
    debounceMs?: number;
}) => {
    const updateOverlappingGraphOnChanges = useCallback(
        ({
            positionChanges,
            sizeChanges,
        }: {
            positionChanges: NodePositionChange[];
            sizeChanges: NodeDimensionChange[];
        }) => {
            if (positionChanges.length === 0 && sizeChanges.length === 0) {
                return;
            }

            setOverlapGraph(
                buildUpdatedOverlapGraphForNodeChanges({
                    overlapGraph,
                    nodes,
                    positionChanges,
                    sizeChanges,
                    getNode,
                })
            );
        },
        [nodes, overlapGraph, setOverlapGraph, getNode]
    );

    return useMemo(
        () => debounce(updateOverlappingGraphOnChanges, debounceMs),
        [updateOverlappingGraphOnChanges, debounceMs]
    );
};
