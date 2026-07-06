import React, { useState } from 'react';
import { Controls, MiniMap } from '@xyflow/react';
import { AlertTriangle, Highlighter, Magnet, Pencil, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '@/components/alert/alert';
import { Badge } from '@/components/badge/badge';
import { Button } from '@/components/button/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/tooltip/tooltip';
import { cn } from '@/lib/utils';
import { ShowAllButton } from './show-all-button';
import { Toolbar } from './toolbar/toolbar';

type CanvasControlsProps = {
    readonly?: boolean;
    isDesktop: boolean;
    isLoadingDOM: boolean;
    isLostInCanvas: boolean;
    showMiniMapOnCanvas: boolean;
    snapToGridEnabled: boolean;
    shiftPressed: boolean;
    operatingSystem: string;
    hasOverlappingTables: boolean;
    highlightedCustomType?: { name: string };
    onToggleSnapToGrid: () => void;
    onClearCustomTypeHighlight: () => void;
    onPulseOverlappingTables: () => void;
    showSidePanel: () => void;
};

const MOBILE_CANVAS_NOTICE_DISMISSED_KEY =
    'schemaflow.mobileCanvasNoticeDismissed';
const LEGACY_MOBILE_CANVAS_NOTICE_DISMISSED_KEY =
    'chartdb.mobileCanvasNoticeDismissed';

const getMobileCanvasNoticeDismissed = () => {
    try {
        if (
            localStorage.getItem(MOBILE_CANVAS_NOTICE_DISMISSED_KEY) === 'true'
        ) {
            return true;
        }

        if (
            localStorage.getItem(LEGACY_MOBILE_CANVAS_NOTICE_DISMISSED_KEY) ===
            'true'
        ) {
            localStorage.setItem(MOBILE_CANVAS_NOTICE_DISMISSED_KEY, 'true');
            return true;
        }

        return false;
    } catch {
        return false;
    }
};

export const CanvasControls: React.FC<CanvasControlsProps> = ({
    readonly,
    isDesktop,
    isLoadingDOM,
    isLostInCanvas,
    showMiniMapOnCanvas,
    snapToGridEnabled,
    shiftPressed,
    operatingSystem,
    hasOverlappingTables,
    highlightedCustomType,
    onToggleSnapToGrid,
    onClearCustomTypeHighlight,
    onPulseOverlappingTables,
    showSidePanel,
}) => {
    const { t } = useTranslation();
    const [mobileCanvasNoticeDismissed, setMobileCanvasNoticeDismissed] =
        useState(getMobileCanvasNoticeDismissed);

    const showMobileCanvasNotice = !isDesktop && !mobileCanvasNoticeDismissed;

    const dismissMobileCanvasNotice = () => {
        setMobileCanvasNoticeDismissed(true);
        try {
            localStorage.setItem(MOBILE_CANVAS_NOTICE_DISMISSED_KEY, 'true');
        } catch {
            // Ignore storage failures; the notice still closes for this render.
        }
    };

    return (
        <>
            {showMobileCanvasNotice ? (
                <Controls
                    position="top-right"
                    orientation="horizontal"
                    showZoom={false}
                    showFitView={false}
                    showInteractive={false}
                    className="!shadow-none"
                >
                    <Alert className="max-w-[min(22rem,calc(100vw-2rem))] border-amber-300 bg-amber-50 text-amber-950 shadow-sm dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
                        <AlertTriangle className="size-4" />
                        <div className="pr-7">
                            <AlertTitle>
                                {t('canvas.mobile_notice.title')}
                            </AlertTitle>
                            <AlertDescription>
                                {t('canvas.mobile_notice.description')}
                            </AlertDescription>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 size-7 text-amber-950 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900"
                            aria-label={t('canvas.mobile_notice.dismiss')}
                            onClick={dismissMobileCanvasNotice}
                        >
                            <X className="size-4" />
                        </Button>
                    </Alert>
                </Controls>
            ) : null}
            <Controls
                position="top-left"
                showZoom={false}
                showFitView={false}
                showInteractive={false}
                className="!shadow-none"
            >
                <div className="flex flex-col items-center gap-2 md:flex-row">
                    {!readonly ? (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <Button
                                            variant="secondary"
                                            className={cn(
                                                'size-8 p-1 shadow-none',
                                                snapToGridEnabled ||
                                                    shiftPressed
                                                    ? 'bg-pink-600 text-white hover:bg-pink-500 dark:hover:bg-pink-700 hover:text-white'
                                                    : ''
                                            )}
                                            onClick={onToggleSnapToGrid}
                                        >
                                            <Magnet className="size-4" />
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {t('snap_to_grid_tooltip', {
                                        key:
                                            operatingSystem === 'mac'
                                                ? '⇧'
                                                : 'Shift',
                                    })}
                                </TooltipContent>
                            </Tooltip>
                            {highlightedCustomType ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                variant="secondary"
                                                className="size-8 border border-yellow-400 bg-yellow-200 p-1 shadow-none hover:bg-yellow-300 dark:border-yellow-700 dark:bg-yellow-800 dark:hover:bg-yellow-700"
                                                onClick={
                                                    onClearCustomTypeHighlight
                                                }
                                            >
                                                <Highlighter className="size-4" />
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {t(
                                            'toolbar.custom_type_highlight_tooltip',
                                            {
                                                typeName:
                                                    highlightedCustomType.name,
                                            }
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            ) : null}
                        </>
                    ) : null}

                    <div
                        className={`transition-opacity duration-300 ease-in-out ${
                            hasOverlappingTables ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span>
                                    <Button
                                        variant="default"
                                        className="size-8 p-1 shadow-none"
                                        onClick={onPulseOverlappingTables}
                                    >
                                        <AlertTriangle className="size-4 text-white" />
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                {t('toolbar.highlight_overlapping_tables')}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </Controls>
            {isLoadingDOM ? (
                <Controls
                    position="top-center"
                    orientation="horizontal"
                    showZoom={false}
                    showFitView={false}
                    showInteractive={false}
                    className="!shadow-none"
                >
                    <Badge variant="default" className="bg-pink-600 text-white">
                        {t('loading_diagram')}
                    </Badge>
                </Controls>
            ) : null}

            {!isDesktop && !readonly ? (
                <Controls
                    position="bottom-left"
                    orientation="horizontal"
                    showZoom={false}
                    showFitView={false}
                    showInteractive={false}
                    className="!shadow-none"
                >
                    <Button
                        className="size-11 bg-pink-600 p-2 hover:bg-pink-500"
                        onClick={showSidePanel}
                    >
                        <Pencil />
                    </Button>
                </Controls>
            ) : null}
            {isLostInCanvas ? (
                <Controls
                    position={isDesktop ? 'bottom-center' : 'top-center'}
                    orientation="horizontal"
                    showZoom={false}
                    showFitView={false}
                    showInteractive={false}
                    className="!shadow-none"
                    style={{
                        [isDesktop ? 'bottom' : 'top']: isDesktop
                            ? '70px'
                            : '70px',
                    }}
                >
                    <ShowAllButton />
                </Controls>
            ) : null}
            <Controls
                position={isDesktop ? 'bottom-center' : 'top-center'}
                orientation="horizontal"
                showZoom={false}
                showFitView={false}
                showInteractive={false}
                className="!shadow-none"
            >
                <Toolbar readonly={readonly} />
            </Controls>
            {showMiniMapOnCanvas && (
                <MiniMap
                    style={{
                        width: isDesktop ? 100 : 60,
                        height: isDesktop ? 100 : 60,
                    }}
                />
            )}
        </>
    );
};
