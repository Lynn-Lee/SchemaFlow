import { useSchemaFlow } from '@/hooks/use-schemaflow';
import { useConfig } from '@/hooks/use-config';
import { useDialog } from '@/hooks/use-dialog';
import { useFullScreenLoader } from '@/hooks/use-full-screen-spinner';
import { useRedoUndoStack } from '@/hooks/use-redo-undo-stack';
import { useStorage } from '@/hooks/use-storage';
import type { Diagram } from '@/lib/domain/diagram';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const getErrorMessage = (error: unknown) =>
    error instanceof Error
        ? error.message
        : 'Local diagram storage could not be read.';

export const useDiagramLoader = () => {
    const [initialDiagram, setInitialDiagram] = useState<Diagram | undefined>();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [loadError, setLoadError] = useState<string | undefined>();
    const [reloadAttempt, setReloadAttempt] = useState(0);
    const { diagramId } = useParams<{ diagramId: string }>();
    const { config } = useConfig();
    const { loadDiagram, currentDiagram } = useSchemaFlow();
    const { resetRedoStack, resetUndoStack } = useRedoUndoStack();
    const { showLoader, hideLoader } = useFullScreenLoader();
    const { openOpenDiagramDialog } = useDialog();
    const navigate = useNavigate();
    const { listDiagrams } = useStorage();

    const currentDiagramLoadingRef = useRef<string | undefined>(undefined);
    const retryLoadDiagram = useCallback(() => {
        currentDiagramLoadingRef.current = undefined;
        setLoadError(undefined);
        setReloadAttempt((attempt) => attempt + 1);
    }, []);

    useEffect(() => {
        if (!config) {
            return;
        }

        if (currentDiagram?.id === diagramId) {
            return;
        }

        const loadDefaultDiagram = async () => {
            let isFullScreenLoaderVisible = false;

            try {
                setLoadError(undefined);

                if (diagramId) {
                    setInitialDiagram(undefined);
                    showLoader();
                    isFullScreenLoaderVisible = true;
                    resetRedoStack();
                    resetUndoStack();
                    const diagram = await loadDiagram(diagramId);
                    if (!diagram) {
                        openOpenDiagramDialog({ canClose: false });
                        hideLoader();
                        isFullScreenLoaderVisible = false;
                        return;
                    }

                    setInitialDiagram(diagram);
                    hideLoader();
                    isFullScreenLoaderVisible = false;

                    return;
                } else if (!diagramId && config.defaultDiagramId) {
                    const diagram = await loadDiagram(config.defaultDiagramId);
                    if (diagram) {
                        navigate(`/diagrams/${config.defaultDiagramId}`);

                        return;
                    }
                }
                const diagrams = await listDiagrams();

                if (diagrams.length > 0) {
                    openOpenDiagramDialog({ canClose: false });
                } else {
                    setShowOnboarding(true);
                }
            } catch (error) {
                if (isFullScreenLoaderVisible) {
                    hideLoader();
                }
                currentDiagramLoadingRef.current = undefined;
                setLoadError(getErrorMessage(error));
            }
        };

        if (
            currentDiagramLoadingRef.current === (diagramId ?? '') &&
            currentDiagramLoadingRef.current !== undefined
        ) {
            return;
        }
        currentDiagramLoadingRef.current = diagramId ?? '';

        loadDefaultDiagram();
    }, [
        diagramId,
        config,
        reloadAttempt,
        navigate,
        listDiagrams,
        loadDiagram,
        resetRedoStack,
        resetUndoStack,
        hideLoader,
        showLoader,
        currentDiagram?.id,
        openOpenDiagramDialog,
    ]);

    return {
        initialDiagram,
        loadError,
        retryLoadDiagram,
        showOnboarding,
        setShowOnboarding,
    };
};
