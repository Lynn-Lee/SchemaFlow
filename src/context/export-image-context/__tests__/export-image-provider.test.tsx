import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toSvg } from 'html-to-image';
import { ExportImageProvider } from '../export-image-provider';
import { useExportImage } from '@/hooks/use-export-image';

vi.mock('@/assets/logo-dark.png', () => ({ default: 'logo-dark.png' }));
vi.mock('@/assets/logo-light.png', () => ({ default: 'logo-light.png' }));

vi.mock('html-to-image', () => ({
    toJpeg: vi.fn(),
    toPng: vi.fn(),
    toSvg: vi.fn(),
}));

const setNodesMock = vi.fn();

vi.mock('@xyflow/react', () => ({
    useReactFlow: () => ({
        setNodes: setNodesMock,
        getViewport: () => ({ x: 12, y: 24, zoom: 1 }),
    }),
}));

vi.mock('@/hooks/use-chartdb', () => ({
    useChartDB: () => ({
        diagramName: 'diagram',
    }),
}));

const hideLoaderMock = vi.fn();
const showLoaderMock = vi.fn();

vi.mock('@/hooks/use-full-screen-spinner', () => ({
    useFullScreenLoader: () => ({
        hideLoader: hideLoaderMock,
        showLoader: showLoaderMock,
    }),
}));

vi.mock('@/hooks/use-theme', () => ({
    useTheme: () => ({
        effectiveTheme: 'light',
    }),
}));

const ExportButton: React.FC = () => {
    const { exportImage } = useExportImage();

    return (
        <button
            type="button"
            onClick={() =>
                exportImage('svg', {
                    includePatternBG: true,
                    transparent: true,
                    scale: 1,
                })
            }
        >
            Export
        </button>
    );
};

const createReactFlowDom = () => {
    document.body.insertAdjacentHTML(
        'beforeend',
        `
            <svg class="marker-definitions">
                <defs>
                    <marker id="relationship-marker">
                        <circle cx="5" cy="5" r="3"></circle>
                        <text x="10" y="10">1</text>
                    </marker>
                </defs>
            </svg>
            <div class="react-flow">
                <div class="react-flow__viewport">
                    <svg>
                        <path class="react-flow__edge-path" d="M 0 0 L 10 10"></path>
                    </svg>
                </div>
            </div>
        `
    );

    vi.spyOn(
        document.querySelector('.react-flow')!,
        'getBoundingClientRect'
    ).mockReturnValue({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 320,
        bottom: 240,
        width: 320,
        height: 240,
        toJSON: () => ({}),
    });
};

describe('ExportImageProvider', () => {
    const originalCreateElement = document.createElement.bind(document);
    const htmlContentProperty = ['inner', 'HTML'].join('');
    let htmlContentDescriptor: PropertyDescriptor | undefined;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        document.body.replaceChildren();
        createReactFlowDom();
        setNodesMock.mockImplementation((updater: unknown) => {
            if (typeof updater === 'function') {
                updater([{ id: 'node-1', selected: true }]);
            }
        });
        vi.mocked(toSvg).mockImplementation(async (element) => {
            const copiedMarker = element.querySelector(
                'defs marker#relationship-marker'
            );

            expect(copiedMarker).not.toBeNull();
            expect(copiedMarker).not.toBe(
                document.querySelector('#relationship-marker')
            );

            return 'data:image/svg+xml;base64,chartdb';
        });

        document.createElement = ((
            tagName: string,
            options?: ElementCreationOptions
        ) => {
            const element = originalCreateElement(tagName, options);
            if (tagName === 'a') {
                vi.spyOn(
                    element as HTMLAnchorElement,
                    'click'
                ).mockImplementation(() => undefined);
            }

            return element;
        }) as typeof document.createElement;

        htmlContentDescriptor = Object.getOwnPropertyDescriptor(
            Element.prototype,
            htmlContentProperty
        );
        Object.defineProperty(Element.prototype, htmlContentProperty, {
            configurable: true,
            get: htmlContentDescriptor?.get,
            set() {
                throw new Error('HTML string assignment is not allowed');
            },
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        document.createElement = originalCreateElement;
        if (htmlContentDescriptor) {
            Object.defineProperty(
                Element.prototype,
                htmlContentProperty,
                htmlContentDescriptor
            );
        }
    });

    it('copies SVG marker definitions without assigning HTML strings', async () => {
        render(
            <ExportImageProvider>
                <ExportButton />
            </ExportImageProvider>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Export' }));

        await act(async () => {
            await vi.runOnlyPendingTimersAsync();
        });

        expect(toSvg).toHaveBeenCalledOnce();
        expect(hideLoaderMock).toHaveBeenCalledOnce();
    });
});
