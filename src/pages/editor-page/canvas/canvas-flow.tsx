import React from 'react';
import type { ReactFlowProps } from '@xyflow/react';
import { ReactFlow, SelectionMode } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { ConnectionLine } from './connection-line/connection-line';
import {
    edgeTypes,
    nodeTypes,
    type EdgeType,
    type NodeType,
} from './canvas-model';

type CanvasFlowProps = Pick<
    ReactFlowProps<NodeType, EdgeType>,
    | 'colorMode'
    | 'nodes'
    | 'edges'
    | 'onNodesChange'
    | 'onEdgesChange'
    | 'onConnect'
    | 'onPaneClick'
    | 'panOnScroll'
    | 'snapToGrid'
    | 'children'
> & {
    shiftPressed: boolean;
};

export const CanvasFlow: React.FC<CanvasFlowProps> = ({
    colorMode,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onPaneClick,
    panOnScroll,
    snapToGrid,
    shiftPressed,
    children,
}) => {
    return (
        <ReactFlow
            onlyRenderVisibleElements
            colorMode={colorMode}
            className={cn('nodes-animated', {
                'canvas-cursor-multi-select': shiftPressed,
                'canvas-cursor-default': !shiftPressed,
            })}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            maxZoom={5}
            minZoom={0.1}
            onConnect={onConnect}
            proOptions={{
                hideAttribution: true,
            }}
            fitView={false}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{
                animated: false,
                type: 'relationship-edge',
            }}
            panOnScroll={panOnScroll}
            snapToGrid={snapToGrid}
            snapGrid={[20, 20]}
            selectionMode={SelectionMode.Full}
            nodesFocusable
            onPaneClick={onPaneClick}
            connectionLineComponent={ConnectionLine}
            deleteKeyCode={['Backspace', 'Delete']}
            multiSelectionKeyCode={['Shift', 'Meta', 'Control']}
        >
            {children}
        </ReactFlow>
    );
};
