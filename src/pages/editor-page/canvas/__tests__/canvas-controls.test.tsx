import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        ...props
    }: {
        children?: React.ReactNode;
        onClick?: () => void;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
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
    const renderControls = (
        props: Partial<React.ComponentProps<typeof CanvasControls>> = {}
    ) =>
        render(
            <CanvasControls
                readonly={false}
                isDesktop
                isLoadingDOM={false}
                isLostInCanvas={false}
                showMiniMapOnCanvas={false}
                snapToGridEnabled={false}
                shiftPressed={false}
                operatingSystem="mac"
                hasOverlappingTables={false}
                onToggleSnapToGrid={vi.fn()}
                onClearCustomTypeHighlight={vi.fn()}
                onPulseOverlappingTables={vi.fn()}
                showSidePanel={vi.fn()}
                {...props}
            />
        );

    it('renders desktop canvas controls and minimap sizes', () => {
        renderControls({
            isDesktop: true,
            isLostInCanvas: true,
            showMiniMapOnCanvas: true,
            shiftPressed: true,
            hasOverlappingTables: true,
            highlightedCustomType: { name: 'money' },
        });

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
        renderControls({
            isDesktop: false,
            isLoadingDOM: true,
            operatingSystem: 'windows',
        });

        expect(screen.getByText('loading_diagram')).toBeInTheDocument();
        expect(
            screen.getByText('snap_to_grid_tooltip:Shift')
        ).toBeInTheDocument();
        expect(screen.queryByTestId('mini-map')).not.toBeInTheDocument();
    });

    it('shows a dismissible mobile canvas notice only on mobile viewports', async () => {
        const user = userEvent.setup();

        renderControls({ isDesktop: false });

        expect(
            screen.getByText('canvas.mobile_notice.title')
        ).toBeInTheDocument();
        expect(
            screen.getByText('canvas.mobile_notice.description')
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole('button', {
                name: 'canvas.mobile_notice.dismiss',
            })
        );

        expect(
            screen.queryByText('canvas.mobile_notice.title')
        ).not.toBeInTheDocument();
        expect(
            localStorage.getItem('chartdb.mobileCanvasNoticeDismissed')
        ).toBe('true');
    });

    it('keeps the mobile canvas notice hidden after it is dismissed', () => {
        localStorage.setItem('chartdb.mobileCanvasNoticeDismissed', 'true');

        renderControls({ isDesktop: false });

        expect(
            screen.queryByText('canvas.mobile_notice.title')
        ).not.toBeInTheDocument();
    });

    it('does not show the mobile canvas notice on desktop viewports', () => {
        renderControls({ isDesktop: true });

        expect(
            screen.queryByText('canvas.mobile_notice.title')
        ).not.toBeInTheDocument();
    });
});
