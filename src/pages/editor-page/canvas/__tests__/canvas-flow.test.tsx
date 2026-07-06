import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CanvasFlow } from '../canvas-flow';
import type { EdgeType, NodeType } from '../canvas-model';

vi.mock('@xyflow/react', () => ({
    ReactFlow: ({
        children,
        className,
        colorMode,
        connectionLineComponent,
        defaultEdgeOptions,
        edges,
        edgeTypes,
        fitView,
        maxZoom,
        minZoom,
        multiSelectionKeyCode,
        nodes,
        nodeTypes,
        onConnect,
        onEdgesChange,
        onNodesChange,
        onPaneClick,
        panOnScroll,
        proOptions,
        selectionMode,
        snapGrid,
        snapToGrid,
        deleteKeyCode,
        onlyRenderVisibleElements,
        nodesFocusable,
    }: {
        children?: React.ReactNode;
        className?: string;
        colorMode?: string;
        connectionLineComponent?: unknown;
        defaultEdgeOptions?: { animated?: boolean; type?: string };
        edges?: unknown[];
        edgeTypes?: unknown;
        fitView?: boolean;
        maxZoom?: number;
        minZoom?: number;
        multiSelectionKeyCode?: string[];
        nodes?: unknown[];
        nodeTypes?: unknown;
        onConnect?: () => void;
        onEdgesChange?: () => void;
        onNodesChange?: () => void;
        onPaneClick?: () => void;
        panOnScroll?: boolean;
        proOptions?: { hideAttribution?: boolean };
        selectionMode?: string;
        snapGrid?: number[];
        snapToGrid?: boolean;
        deleteKeyCode?: string[];
        onlyRenderVisibleElements?: boolean;
        nodesFocusable?: boolean;
    }) => (
        <div
            data-testid="react-flow"
            data-class-name={className}
            data-color-mode={colorMode}
            data-connection-line={String(!!connectionLineComponent)}
            data-default-edge-type={defaultEdgeOptions?.type}
            data-default-edge-animated={String(defaultEdgeOptions?.animated)}
            data-edges={edges?.length}
            data-edge-types={String(!!edgeTypes)}
            data-fit-view={String(fitView)}
            data-max-zoom={maxZoom}
            data-min-zoom={minZoom}
            data-multi-selection-key-code={multiSelectionKeyCode?.join(',')}
            data-nodes={nodes?.length}
            data-node-types={String(!!nodeTypes)}
            data-on-connect={String(!!onConnect)}
            data-on-edges-change={String(!!onEdgesChange)}
            data-on-nodes-change={String(!!onNodesChange)}
            data-on-pane-click={String(!!onPaneClick)}
            data-only-visible={String(onlyRenderVisibleElements)}
            data-pan-on-scroll={String(panOnScroll)}
            data-pro-hide-attribution={String(proOptions?.hideAttribution)}
            data-selection-mode={selectionMode}
            data-snap-grid={snapGrid?.join(',')}
            data-snap-to-grid={String(snapToGrid)}
            data-delete-key-code={deleteKeyCode?.join(',')}
            data-nodes-focusable={String(nodesFocusable)}
        >
            {children}
        </div>
    ),
    SelectionMode: {
        Full: 'full',
    },
}));

vi.mock('../canvas-model', () => ({
    edgeTypes: { relationship: 'edge-type' },
    nodeTypes: { table: 'node-type' },
}));

vi.mock('../connection-line/connection-line', () => ({
    ConnectionLine: () => null,
}));

describe('CanvasFlow', () => {
    it('applies stable React Flow configuration and renders child layers', () => {
        render(
            <CanvasFlow
                colorMode="dark"
                nodes={[
                    {
                        id: 'table-1',
                        type: 'table',
                        position: { x: 0, y: 0 },
                        data: {},
                    } as unknown as NodeType,
                ]}
                edges={[
                    {
                        id: 'edge-1',
                        type: 'relationship-edge',
                        source: 'table-1',
                        target: 'table-2',
                        data: {},
                    } as unknown as EdgeType,
                ]}
                onNodesChange={vi.fn()}
                onEdgesChange={vi.fn()}
                onConnect={vi.fn()}
                onPaneClick={vi.fn()}
                panOnScroll
                snapToGrid
                shiftPressed
            >
                <div>canvas child layer</div>
            </CanvasFlow>
        );

        const flow = screen.getByTestId('react-flow');

        expect(flow).toHaveAttribute(
            'data-class-name',
            'nodes-animated canvas-cursor-multi-select'
        );
        expect(flow).toHaveAttribute('data-color-mode', 'dark');
        expect(flow).toHaveAttribute('data-nodes', '1');
        expect(flow).toHaveAttribute('data-edges', '1');
        expect(flow).toHaveAttribute('data-on-nodes-change', 'true');
        expect(flow).toHaveAttribute('data-on-edges-change', 'true');
        expect(flow).toHaveAttribute('data-on-connect', 'true');
        expect(flow).toHaveAttribute('data-on-pane-click', 'true');
        expect(flow).toHaveAttribute('data-only-visible', 'true');
        expect(flow).toHaveAttribute('data-fit-view', 'false');
        expect(flow).toHaveAttribute('data-max-zoom', '5');
        expect(flow).toHaveAttribute('data-min-zoom', '0.1');
        expect(flow).toHaveAttribute(
            'data-default-edge-type',
            'relationship-edge'
        );
        expect(flow).toHaveAttribute('data-default-edge-animated', 'false');
        expect(flow).toHaveAttribute('data-pan-on-scroll', 'true');
        expect(flow).toHaveAttribute('data-snap-to-grid', 'true');
        expect(flow).toHaveAttribute('data-snap-grid', '20,20');
        expect(flow).toHaveAttribute('data-selection-mode', 'full');
        expect(flow).toHaveAttribute('data-nodes-focusable', 'true');
        expect(flow).toHaveAttribute('data-connection-line', 'true');
        expect(flow).toHaveAttribute(
            'data-delete-key-code',
            'Backspace,Delete'
        );
        expect(flow).toHaveAttribute(
            'data-multi-selection-key-code',
            'Shift,Meta,Control'
        );
        expect(flow).toHaveAttribute('data-pro-hide-attribution', 'true');
        expect(screen.getByText('canvas child layer')).toBeInTheDocument();
    });

    it('uses the default cursor class when shift is not pressed', () => {
        render(
            <CanvasFlow
                colorMode="light"
                nodes={[]}
                edges={[]}
                onNodesChange={vi.fn()}
                onEdgesChange={vi.fn()}
                onConnect={vi.fn()}
                onPaneClick={vi.fn()}
                panOnScroll={false}
                snapToGrid={false}
                shiftPressed={false}
            />
        );

        expect(screen.getByTestId('react-flow')).toHaveAttribute(
            'data-class-name',
            'nodes-animated canvas-cursor-default'
        );
    });
});
