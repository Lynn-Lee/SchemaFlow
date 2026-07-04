import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CanvasControls } from '../canvas-controls';

vi.mock('@xyflow/react', () => ({
    Controls: ({
        children,
        position,
    }: {
        children?: React.ReactNode;
        position?: string;
    }) => <div data-testid={`controls-${position}`}>{children}</div>,
    MiniMap: ({ style }: { style?: React.CSSProperties }) => (
        <div
            data-testid="mini-map"
            data-width={style?.width}
            data-height={style?.height}
        />
    ),
}));

vi.mock('@/components/tooltip/tooltip', () => ({
    Tooltip: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TooltipTrigger: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TooltipContent: ({ children }: { children?: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

vi.mock('@/components/button/button', () => ({
    Button: ({
        children,
        onClick,
    }: {
        children?: React.ReactNode;
        onClick?: () => void;
    }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('../toolbar/toolbar', () => ({
    Toolbar: ({ readonly }: { readonly?: boolean }) => (
        <div data-testid="toolbar" data-readonly={String(!!readonly)} />
    ),
}));

vi.mock('../show-all-button', () => ({
    ShowAllButton: () => <button>show all</button>,
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, values?: Record<string, string>) =>
            values?.key ? `${key}:${values.key}` : key,
    }),
}));

describe('CanvasControls', () => {
    it('renders desktop canvas controls and minimap sizes', () => {
        render(
            <CanvasControls
                readonly={false}
                isDesktop
                isLoadingDOM={false}
                isLostInCanvas
                showMiniMapOnCanvas
                snapToGridEnabled={false}
                shiftPressed
                operatingSystem="mac"
                hasOverlappingTables
                onToggleSnapToGrid={vi.fn()}
                onClearCustomTypeHighlight={vi.fn()}
                onPulseOverlappingTables={vi.fn()}
                showSidePanel={vi.fn()}
                highlightedCustomType={{ name: 'money' }}
            />
        );

        expect(screen.getByText('snap_to_grid_tooltip:⇧')).toBeInTheDocument();
        expect(
            screen.getByText('toolbar.highlight_overlapping_tables')
        ).toBeInTheDocument();
        expect(screen.getByTestId('toolbar')).toHaveAttribute(
            'data-readonly',
            'false'
        );
        expect(screen.getByText('show all')).toBeInTheDocument();
        expect(screen.getByTestId('mini-map')).toHaveAttribute(
            'data-width',
            '100'
        );
        expect(screen.getByTestId('mini-map')).toHaveAttribute(
            'data-height',
            '100'
        );
    });

    it('renders mobile loading and side panel controls only when editable', () => {
        render(
            <CanvasControls
                readonly={false}
                isDesktop={false}
                isLoadingDOM
                isLostInCanvas={false}
                showMiniMapOnCanvas={false}
                snapToGridEnabled={false}
                shiftPressed={false}
                operatingSystem="windows"
                hasOverlappingTables={false}
                onToggleSnapToGrid={vi.fn()}
                onClearCustomTypeHighlight={vi.fn()}
                onPulseOverlappingTables={vi.fn()}
                showSidePanel={vi.fn()}
            />
        );

        expect(screen.getByText('loading_diagram')).toBeInTheDocument();
        expect(
            screen.getByText('snap_to_grid_tooltip:Shift')
        ).toBeInTheDocument();
        expect(screen.queryByTestId('mini-map')).not.toBeInTheDocument();
    });
});
