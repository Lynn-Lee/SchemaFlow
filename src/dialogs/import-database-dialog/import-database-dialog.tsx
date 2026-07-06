import { Dialog, DialogContent } from '@/components/dialog/dialog';
import { useDialog } from '@/hooks/use-dialog';
import { DatabaseType } from '@/lib/domain/database-type';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImportDatabase } from '../common/import-database/import-database';
import type { DatabaseEdition } from '@/lib/domain/database-edition';
import type { Diagram } from '@/lib/domain/diagram';
import { useSchemaFlow } from '@/hooks/use-schemaflow';
import { useRedoUndoStack } from '@/hooks/use-redo-undo-stack';
import { useTranslation } from 'react-i18next';
import type { BaseDialogProps } from '../common/base-dialog-props';
import type { ImportMethod } from '@/lib/import-method/import-method';
import {
    parseImportPreview,
    type ImportPreviewProgress,
    type ParsedImportPreview,
} from '@/features/import/import-preview';

export interface ImportDatabaseDialogProps extends BaseDialogProps {
    databaseType: DatabaseType;
    importMethods?: ImportMethod[];
    initialImportMethod?: ImportMethod;
}

const defaultImportMethods: ImportMethod[] = ['query', 'ddl', 'dbml'];

export const ImportDatabaseDialog: React.FC<ImportDatabaseDialogProps> = ({
    dialog,
    databaseType,
    importMethods = defaultImportMethods,
    initialImportMethod,
}) => {
    const [importMethod, setImportMethod] = useState<ImportMethod>(
        initialImportMethod ?? importMethods[0]
    );
    const { closeImportDatabaseDialog } = useDialog();
    const {
        addTables,
        addRelationships,
        diagramName,
        databaseType: currentDatabaseType,
        updateDatabaseType,
        tables: existingTables,
        addCustomTypes,
    } = useSchemaFlow();
    const [scriptResult, setScriptResult] = useState('');
    const { resetRedoStack, resetUndoStack } = useRedoUndoStack();
    const { t } = useTranslation();
    const [databaseEdition, setDatabaseEdition] = useState<
        DatabaseEdition | undefined
    >();
    const [pendingImport, setPendingImport] =
        useState<ParsedImportPreview | null>(null);
    const [importError, setImportError] = useState('');
    const [isPreviewingImport, setIsPreviewingImport] = useState(false);
    const [importPreviewProgress, setImportPreviewProgress] =
        useState<ImportPreviewProgress | null>(null);
    const previewAbortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setDatabaseEdition(undefined);
        setPendingImport(null);
        setIsPreviewingImport(false);
        setImportPreviewProgress(null);
        previewAbortControllerRef.current?.abort();
        previewAbortControllerRef.current = null;
    }, [databaseType]);

    useEffect(() => {
        if (!dialog.open) return;
        setDatabaseEdition(undefined);
        setScriptResult('');
        setImportMethod(initialImportMethod ?? importMethods[0]);
        setPendingImport(null);
        setImportError('');
        setIsPreviewingImport(false);
        setImportPreviewProgress(null);
        previewAbortControllerRef.current?.abort();
        previewAbortControllerRef.current = null;
    }, [dialog.open, importMethods, initialImportMethod]);

    const setScriptResultAndResetPreview = useCallback<
        React.Dispatch<React.SetStateAction<string>>
    >((value) => {
        setPendingImport(null);
        setImportError('');
        setImportPreviewProgress(null);
        setScriptResult(value);
    }, []);

    const setImportMethodAndResetPreview = useCallback(
        (method: ImportMethod) => {
            setPendingImport(null);
            setImportError('');
            setImportPreviewProgress(null);
            setImportMethod(method);
        },
        []
    );

    const setDatabaseEditionAndResetPreview = useCallback<
        React.Dispatch<React.SetStateAction<DatabaseEdition | undefined>>
    >((value) => {
        setPendingImport(null);
        setImportError('');
        setImportPreviewProgress(null);
        setDatabaseEdition(value);
    }, []);

    const applyImportedDiagram = useCallback(
        async (diagram: Diagram) => {
            // Skip if nothing to import
            const newTablesNumber = diagram.tables?.length ?? 0;
            const newRelationshipsNumber = diagram.relationships?.length ?? 0;
            const newCustomTypesNumber = diagram.customTypes?.length ?? 0;
            if (
                newTablesNumber === 0 &&
                newRelationshipsNumber === 0 &&
                newCustomTypesNumber === 0
            ) {
                return;
            }

            // Close dialog immediately to prevent re-render blocking
            closeImportDatabaseDialog();

            // Calculate position offset for new tables to avoid overlap
            let offsetX = 0;
            if (existingTables.length > 0) {
                // Find the rightmost table
                const rightmostTable = existingTables.reduce((max, table) => {
                    const tableRight = table.x + (table.width ?? 250);
                    const maxRight = max.x + (max.width ?? 250);
                    return tableRight > maxRight ? table : max;
                });
                // Position new tables 150px to the right of the rightmost table
                offsetX =
                    rightmostTable.x + (rightmostTable.width ?? 250) + 150;
            }

            // Apply offset to imported tables
            const positionedTables =
                diagram.tables?.map((table) => ({
                    ...table,
                    x: table.x + offsetX,
                })) ?? [];

            // Use queueMicrotask to defer work after dialog closes but before next paint
            queueMicrotask(async () => {
                // Add tables, relationships and custom types
                await Promise.all([
                    addTables(positionedTables, { updateHistory: false }),
                    addRelationships(diagram.relationships ?? [], {
                        updateHistory: false,
                    }),
                    addCustomTypes(diagram.customTypes ?? [], {
                        updateHistory: false,
                    }),
                ]);

                if (currentDatabaseType === DatabaseType.GENERIC) {
                    await updateDatabaseType(databaseType);
                }

                // Reset undo/redo stacks
                resetRedoStack();
                resetUndoStack();
                setPendingImport(null);
            });
        },
        [
            addCustomTypes,
            addRelationships,
            addTables,
            closeImportDatabaseDialog,
            currentDatabaseType,
            databaseType,
            existingTables,
            resetRedoStack,
            resetUndoStack,
            updateDatabaseType,
        ]
    );

    const importDatabase = useCallback(async () => {
        if (!pendingImport) {
            setImportError('');
            setIsPreviewingImport(true);
            setImportPreviewProgress({
                stage: 'queued',
                message: 'Preparing import preview',
            });
            const abortController = new AbortController();
            previewAbortControllerRef.current = abortController;
            try {
                const preview = await parseImportPreview(
                    {
                        importMethod,
                        scriptResult,
                        databaseType,
                        databaseEdition,
                    },
                    {
                        signal: abortController.signal,
                        onProgress: setImportPreviewProgress,
                    }
                );

                if (!preview.preview.hasImportableObjects) {
                    setImportError(
                        'Preview found no importable tables, relationships, or custom types. Check the pasted Smart Query JSON or the selected database dialect.'
                    );
                    return;
                }

                setPendingImport(preview);
                return;
            } catch (error) {
                if (abortController.signal.aborted) {
                    setImportError('Import preview cancelled.');
                    return;
                }
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Unable to parse the import input.';
                setImportError(
                    `Preview failed: ${message}. Check the Smart Query JSON, SQL syntax, or dialect limitations before trying again.`
                );
                return;
            } finally {
                if (previewAbortControllerRef.current === abortController) {
                    previewAbortControllerRef.current = null;
                }
                setIsPreviewingImport(false);
            }
        }

        await applyImportedDiagram(pendingImport.result.diagram);
    }, [
        importMethod,
        databaseEdition,
        databaseType,
        scriptResult,
        pendingImport,
        applyImportedDiagram,
    ]);

    const cancelImportPreview = useCallback(() => {
        previewAbortControllerRef.current?.abort();
    }, []);

    return (
        <Dialog
            {...dialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeImportDatabaseDialog();
                }
            }}
        >
            <DialogContent
                className="flex max-h-screen w-full flex-col md:max-w-[900px]"
                showClose
            >
                <ImportDatabase
                    databaseType={databaseType}
                    databaseEdition={databaseEdition}
                    setDatabaseEdition={setDatabaseEditionAndResetPreview}
                    onImport={importDatabase}
                    scriptResult={scriptResult}
                    setScriptResult={setScriptResultAndResetPreview}
                    keepDialogAfterImport
                    title={t('import_database_dialog.title', { diagramName })}
                    importMethod={importMethod}
                    setImportMethod={setImportMethodAndResetPreview}
                    importMethods={importMethods}
                    importPreview={pendingImport?.preview ?? null}
                    enableImportPreview
                    importError={importError}
                    isPreviewingImport={isPreviewingImport}
                    importPreviewProgress={importPreviewProgress}
                    onCancelImportPreview={cancelImportPreview}
                />
            </DialogContent>
        </Dialog>
    );
};
