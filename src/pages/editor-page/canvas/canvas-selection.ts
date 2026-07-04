import type { EdgeType, NodeType } from './canvas-model';

export const getSelectedCanvasNodeIds = (nodes: NodeType[]): string[] =>
    nodes.filter((node) => node.selected).map((node) => node.id);

export const getSelectedCanvasEdgeIds = (edges: EdgeType[]): string[] =>
    edges.filter((edge) => edge.selected).map((edge) => edge.id);
