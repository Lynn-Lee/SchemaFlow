import { createContext } from 'react';
import { emptyFn } from '@/lib/utils';
import type { Theme } from '../theme-context/theme-context';

export type ScrollAction = 'pan' | 'zoom';
export type LocalAIExportMode =
    | 'disabled'
    | 'byok-session'
    | 'self-hosted-gateway';

export interface LocalConfigContext {
    localStorageAvailable: boolean;

    theme: Theme;
    setTheme: (theme: Theme) => void;

    scrollAction: ScrollAction;
    setScrollAction: (action: ScrollAction) => void;

    showDBViews: boolean;
    setShowDBViews: (showViews: boolean) => void;

    showCardinality: boolean;
    setShowCardinality: (showCardinality: boolean) => void;

    showFieldAttributes: boolean;
    setShowFieldAttributes: (showFieldAttributes: boolean) => void;

    githubRepoOpened: boolean;
    setGithubRepoOpened: (githubRepoOpened: boolean) => void;

    starUsDialogLastOpen: number;
    setStarUsDialogLastOpen: (lastOpen: number) => void;

    showMiniMapOnCanvas: boolean;
    setShowMiniMapOnCanvas: (showMiniMapOnCanvas: boolean) => void;

    aiExportMode: LocalAIExportMode;
    setAIExportMode: (mode: LocalAIExportMode) => void;

    aiGatewayEndpoint: string;
    setAIGatewayEndpoint: (endpoint: string) => void;

    aiGatewayModelName: string;
    setAIGatewayModelName: (modelName: string) => void;
}

export const LocalConfigContext = createContext<LocalConfigContext>({
    localStorageAvailable: true,

    theme: 'system',
    setTheme: emptyFn,

    scrollAction: 'pan',
    setScrollAction: emptyFn,

    showDBViews: false,
    setShowDBViews: emptyFn,

    showCardinality: true,
    setShowCardinality: emptyFn,

    showFieldAttributes: true,
    setShowFieldAttributes: emptyFn,

    githubRepoOpened: false,
    setGithubRepoOpened: emptyFn,

    starUsDialogLastOpen: 0,
    setStarUsDialogLastOpen: emptyFn,

    showMiniMapOnCanvas: false,
    setShowMiniMapOnCanvas: emptyFn,

    aiExportMode: 'disabled',
    setAIExportMode: emptyFn,
    aiGatewayEndpoint: '',
    setAIGatewayEndpoint: emptyFn,
    aiGatewayModelName: '',
    setAIGatewayModelName: emptyFn,
});
