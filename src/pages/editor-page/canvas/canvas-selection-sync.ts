import { useEffect } from 'react';
import equal from 'fast-deep-equal';
import type { EdgeType, NodeType } from './canvas-model';
import { getHighlightedCanvasEdges } from './canvas-edges';
import {
    getSelectedCanvasEdgeIds,
    getSelectedCanvasNodeIds,
} from './canvas-selection';

type UseCanvasSelectionSyncParams = {
    nodes: NodeType[];
    edges: EdgeType[];
    selectedTableIds: string[];
    selectedRelationshipIds: string[];
    setSelectedTableIds: (ids: string[]) => void;
    setSelectedRelationshipIds: (ids: string[]) => void;
    setEdges: (updater: (edges: EdgeType[]) => EdgeType[]) => void;
};

export const useCanvasSelectionSync = ({
    nodes,
    edges,
    selectedTableIds,
    selectedRelationshipIds,
    setSelectedTableIds,
    setSelectedRelationshipIds,
    setEdges,
}: UseCanvasSelectionSyncParams) => {
    useEffect(() => {
        const selectedNodesIds = getSelectedCanvasNodeIds(nodes);

        if (!equal(selectedNodesIds, selectedTableIds)) {
            setSelectedTableIds(selectedNodesIds);
        }
    }, [nodes, selectedTableIds, setSelectedTableIds]);

    useEffect(() => {
        const selectedEdgesIds = getSelectedCanvasEdgeIds(edges);

        if (!equal(selectedEdgesIds, selectedRelationshipIds)) {
            setSelectedRelationshipIds(selectedEdgesIds);
        }
    }, [edges, selectedRelationshipIds, setSelectedRelationshipIds]);

    useEffect(() => {
        setEdges((prevEdges) =>
            getHighlightedCanvasEdges({
                edges: prevEdges,
                selectedRelationshipIds,
                selectedTableIds,
            })
        );
    }, [selectedRelationshipIds, selectedTableIds, setEdges]);
};
