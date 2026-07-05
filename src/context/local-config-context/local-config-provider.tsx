import React, { useEffect } from 'react';
import type { LocalAIExportMode, ScrollAction } from './local-config-context';
import { LocalConfigContext } from './local-config-context';
import type { Theme } from '../theme-context/theme-context';
import { validateGatewayEndpoint } from '@/lib/ai/ai-mode';

const themeKey = 'theme';
const scrollActionKey = 'scroll_action';
const showCardinalityKey = 'show_cardinality';
const showFieldAttributesKey = 'show_field_attributes';
const githubRepoOpenedKey = 'github_repo_opened';
const starUsDialogLastOpenKey = 'star_us_dialog_last_open';
const showMiniMapOnCanvasKey = 'show_minimap_on_canvas';
const showDBViewsKey = 'show_db_views';
const aiExportModeKey = 'chartdb.ai.mode';
const aiGatewayEndpointKey = 'chartdb.ai.gateway.endpoint';
const aiGatewayModelNameKey = 'chartdb.ai.gateway.model';

const safeGetItem = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeSetItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Settings still work in memory for this session.
    }
};

const canUseLocalStorage = () => {
    try {
        const probeKey = 'chartdb.local_storage_probe';
        localStorage.setItem(probeKey, '1');
        localStorage.removeItem(probeKey);
        return true;
    } catch {
        return false;
    }
};

export const LocalConfigProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [localStorageAvailable] = React.useState(canUseLocalStorage);

    const [theme, setTheme] = React.useState<Theme>(
        (safeGetItem(themeKey) as Theme) || 'system'
    );

    const [scrollAction, setScrollAction] = React.useState<ScrollAction>(
        (safeGetItem(scrollActionKey) as ScrollAction) || 'pan'
    );

    const [showDBViews, setShowDBViews] = React.useState<boolean>(
        (safeGetItem(showDBViewsKey) || 'false') === 'true'
    );

    const [showCardinality, setShowCardinality] = React.useState<boolean>(
        (safeGetItem(showCardinalityKey) || 'true') === 'true'
    );

    const [showFieldAttributes, setShowFieldAttributes] =
        React.useState<boolean>(
            (safeGetItem(showFieldAttributesKey) || 'true') === 'true'
        );

    const [githubRepoOpened, setGithubRepoOpened] = React.useState<boolean>(
        (safeGetItem(githubRepoOpenedKey) || 'false') === 'true'
    );

    const [starUsDialogLastOpen, setStarUsDialogLastOpen] =
        React.useState<number>(
            parseInt(safeGetItem(starUsDialogLastOpenKey) || '0')
        );

    const [showMiniMapOnCanvas, setShowMiniMapOnCanvas] =
        React.useState<boolean>(
            (safeGetItem(showMiniMapOnCanvasKey) || 'true') === 'true'
        );

    const [aiExportMode, setAIExportMode] = React.useState<LocalAIExportMode>(
        (safeGetItem(aiExportModeKey) as LocalAIExportMode) || 'disabled'
    );
    const [aiGatewayEndpoint, setAIGatewayEndpoint] = React.useState(() => {
        const storedEndpoint = safeGetItem(aiGatewayEndpointKey) || '';
        return validateGatewayEndpoint(storedEndpoint)
            ? ''
            : storedEndpoint.trim();
    });
    const [aiGatewayModelName, setAIGatewayModelName] = React.useState(
        safeGetItem(aiGatewayModelNameKey) || ''
    );

    const setValidatedAIGatewayEndpoint = React.useCallback(
        (endpoint: string) => {
            const trimmedEndpoint = endpoint.trim();
            if (
                trimmedEndpoint.length === 0 ||
                !validateGatewayEndpoint(trimmedEndpoint)
            ) {
                setAIGatewayEndpoint(trimmedEndpoint);
            }
        },
        []
    );

    useEffect(() => {
        safeSetItem(starUsDialogLastOpenKey, starUsDialogLastOpen.toString());
    }, [starUsDialogLastOpen]);

    useEffect(() => {
        safeSetItem(githubRepoOpenedKey, githubRepoOpened.toString());
    }, [githubRepoOpened]);

    useEffect(() => {
        safeSetItem(themeKey, theme);
    }, [theme]);

    useEffect(() => {
        safeSetItem(scrollActionKey, scrollAction);
    }, [scrollAction]);

    useEffect(() => {
        safeSetItem(showDBViewsKey, showDBViews.toString());
    }, [showDBViews]);

    useEffect(() => {
        safeSetItem(showCardinalityKey, showCardinality.toString());
    }, [showCardinality]);

    useEffect(() => {
        safeSetItem(showFieldAttributesKey, showFieldAttributes.toString());
    }, [showFieldAttributes]);

    useEffect(() => {
        safeSetItem(showMiniMapOnCanvasKey, showMiniMapOnCanvas.toString());
    }, [showMiniMapOnCanvas]);

    useEffect(() => {
        safeSetItem(aiExportModeKey, aiExportMode);
    }, [aiExportMode]);

    useEffect(() => {
        safeSetItem(aiGatewayEndpointKey, aiGatewayEndpoint);
    }, [aiGatewayEndpoint]);

    useEffect(() => {
        safeSetItem(aiGatewayModelNameKey, aiGatewayModelName);
    }, [aiGatewayModelName]);

    return (
        <LocalConfigContext.Provider
            value={{
                localStorageAvailable,
                theme,
                setTheme,
                scrollAction,
                setScrollAction,
                showDBViews,
                setShowDBViews,
                showCardinality,
                setShowCardinality,
                showFieldAttributes,
                setShowFieldAttributes,
                setGithubRepoOpened,
                githubRepoOpened,
                starUsDialogLastOpen,
                setStarUsDialogLastOpen,
                showMiniMapOnCanvas,
                setShowMiniMapOnCanvas,
                aiExportMode,
                setAIExportMode,
                aiGatewayEndpoint,
                setAIGatewayEndpoint: setValidatedAIGatewayEndpoint,
                aiGatewayModelName,
                setAIGatewayModelName,
            }}
        >
            {children}
        </LocalConfigContext.Provider>
    );
};
