import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/dialog/dialog';
import { DatabaseType } from '@/lib/domain/database-type';
import { useStorage } from '@/hooks/use-storage';
import type { Diagram } from '@/lib/domain/diagram';
import { loadFromDatabaseMetadata } from '@/lib/data/import-metadata/import';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '@/hooks/use-config';
import type { DatabaseMetadata } from '@/lib/data/import-metadata/metadata-types/database-metadata';
import { loadDatabaseMetadata } from '@/lib/data/import-metadata/metadata-types/database-metadata';
import { generateDiagramId } from '@/lib/utils';
import { useChartDB } from '@/hooks/use-chartdb';
import { useDialog } from '@/hooks/use-dialog';
import type { DatabaseEdition } from '@/lib/domain/database-edition';
import { SelectDatabase } from './select-database/select-database';
import { CreateDiagramDialogStep } from './create-diagram-dialog-step';
import { ImportDatabase } from '../common/import-database/import-database';
import { SelectTables } from '../common/select-tables/select-tables';
import { useTranslation } from 'react-i18next';
import type { BaseDialogProps } from '../common/base-dialog-props';
import { sqlImportToDiagram } from '@/lib/data/sql-import';
import type { SelectedTable } from '@/lib/data/import-metadata/filter-metadata';
import { filterMetadataByTables } from '@/lib/data/import-metadata/filter-metadata';
import { MAX_TABLES_WITHOUT_SHOWING_FILTER } from '../common/select-tables/constants';
import {
    defaultDBMLDiagramName,
    importDBMLToDiagram,
} from '@/lib/dbml/dbml-import/dbml-import';
import type { ImportMethod } from '@/lib/import-method/import-method';
import {
    parseImportPreview,
    type ImportPreviewProgress,
    type ParsedImportPreview,
} from '@/features/import/import-preview';

export interface CreateDiagramDialogProps extends BaseDialogProps {}

function countMetadataTablesAndViews(metadata?: DatabaseMetadata): number {
    if (!metadata) {
        return 0;
    }

    return metadata.tables.length + (metadata.views?.length || 0);
}

export const CreateDiagramDialog: React.FC<CreateDiagramDialogProps> = ({
    dialog,
}) => {
    const { diagramId } = useChartDB();
    const { t } = useTranslation();
    const [importMethod, setImportMethod] = useState<ImportMethod>('query');
    const [databaseType, setDatabaseType] = useState<DatabaseType>(
        DatabaseType.GENERIC
    );
    const { closeCreateDiagramDialog } = useDialog();
    const { updateConfig } = useConfig();
    const [scriptResult, setScriptResult] = useState('');
    const [databaseEdition, setDatabaseEdition] = useState<
        DatabaseEdition | undefined
    >();
    const [step, setStep] = useState<CreateDiagramDialogStep>(
        CreateDiagramDialogStep.SELECT_DATABASE
    );
    const { listDiagrams, addDiagram } = useStorage();
    const [diagramNumber, setDiagramNumber] = useState<number>(1);
    const navigate = useNavigate();
    const [parsedMetadata, setParsedMetadata] = useState<DatabaseMetadata>();
    const [isParsingMetadata, setIsParsingMetadata] = useState(false);
    const [pendingImport, setPendingImport] =
        useState<ParsedImportPreview | null>(null);
    const [importError, setImportError] = useState('');
    const [isPreviewingImport, setIsPreviewingImport] = useState(false);
    const [importPreviewProgress, setImportPreviewProgress] =
        useState<ImportPreviewProgress | null>(null);
    const previewAbortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setDatabaseEdition(undefined);
        setImportMethod('query');
        setPendingImport(null);
        setImportError('');
        setIsPreviewingImport(false);
        setImportPreviewProgress(null);
        previewAbortControllerRef.current?.abort();
        previewAbortControllerRef.current = null;
    }, [databaseType]);

    useEffect(() => {
        const fetchDiagrams = async () => {
            const diagrams = await listDiagrams();
            setDiagramNumber(diagrams.length + 1);
        };
        fetchDiagrams();
    }, [listDiagrams, setDiagramNumber, dialog.open]);

    useEffect(() => {
        setStep(CreateDiagramDialogStep.SELECT_DATABASE);
        setDatabaseType(DatabaseType.GENERIC);
        setDatabaseEdition(undefined);
        setScriptResult('');
        setImportMethod('query');
        setParsedMetadata(undefined);
        setPendingImport(null);
        setImportError('');
        setIsPreviewingImport(false);
        setImportPreviewProgress(null);
        previewAbortControllerRef.current?.abort();
        previewAbortControllerRef.current = null;
    }, [dialog.open]);

    const hasExistingDiagram = (diagramId ?? '').trim().length !== 0;

    const importNewDiagram = useCallback(
        async ({
            selectedTables,
            databaseMetadata,
            preview,
        }: {
            selectedTables?: SelectedTable[];
            databaseMetadata?: DatabaseMetadata;
            preview?: ParsedImportPreview;
        } = {}) => {
            let diagram: Diagram | undefined;

            if (preview) {
                diagram = preview.result.diagram;
                if (!diagram.name || diagram.name === 'Preview') {
                    diagram.name = `Diagram ${diagramNumber}`;
                }
            } else if (importMethod === 'ddl') {
                diagram = await sqlImportToDiagram({
                    sqlContent: scriptResult,
                    sourceDatabaseType: databaseType,
                    targetDatabaseType: databaseType,
                });
            } else if (importMethod === 'dbml') {
                diagram = await importDBMLToDiagram(scriptResult, {
                    databaseType,
                });
                // Update the diagram name if it's the default
                if (diagram.name === defaultDBMLDiagramName) {
                    diagram.name = `Diagram ${diagramNumber}`;
                }
            } else {
                let metadata: DatabaseMetadata | undefined = databaseMetadata;

                if (!metadata) {
                    metadata = loadDatabaseMetadata(scriptResult);
                }

                if (selectedTables && selectedTables.length > 0) {
                    metadata = filterMetadataByTables({
                        metadata,
                        selectedTables,
                    });
                }

                diagram = await loadFromDatabaseMetadata({
                    databaseType,
                    databaseMetadata: metadata,
                    diagramNumber,
                    databaseEdition:
                        databaseEdition?.trim().length === 0
                            ? undefined
                            : databaseEdition,
                });
            }

            await addDiagram({ diagram });
            await updateConfig({
                config: { defaultDiagramId: diagram.id },
            });

            closeCreateDiagramDialog();
            setPendingImport(null);
            navigate(`/diagrams/${diagram.id}`);
        },
        [
            importMethod,
            databaseType,
            addDiagram,
            databaseEdition,
            closeCreateDiagramDialog,
            navigate,
            updateConfig,
            scriptResult,
            diagramNumber,
        ]
    );

    const createEmptyDiagram = useCallback(async () => {
        const diagram: Diagram = {
            id: generateDiagramId(),
            name: `Diagram ${diagramNumber}`,
            databaseType: databaseType ?? DatabaseType.GENERIC,
            databaseEdition:
                databaseEdition?.trim().length === 0
                    ? undefined
                    : databaseEdition,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await addDiagram({ diagram });
        await updateConfig({ config: { defaultDiagramId: diagram.id } });
        closeCreateDiagramDialog();
        navigate(`/diagrams/${diagram.id}`);
    }, [
        databaseType,
        addDiagram,
        databaseEdition,
        closeCreateDiagramDialog,
        navigate,
        updateConfig,
        diagramNumber,
    ]);

    const importNewDiagramOrFilterTables = useCallback(async () => {
        try {
            setIsParsingMetadata(true);
            setImportError('');

            if (!pendingImport) {
                setIsPreviewingImport(true);
                setImportPreviewProgress({
                    stage: 'queued',
                    message: 'Preparing import preview',
                });
                const abortController = new AbortController();
                previewAbortControllerRef.current = abortController;
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

                if (importMethod === 'query') {
                    setParsedMetadata(loadDatabaseMetadata(scriptResult));
                }

                setPendingImport(preview);
                return;
            }

            if (
                importMethod === 'query' &&
                countMetadataTablesAndViews(parsedMetadata) >
                    MAX_TABLES_WITHOUT_SHOWING_FILTER
            ) {
                setStep(CreateDiagramDialogStep.SELECT_TABLES);
                return;
            }

            await importNewDiagram({
                preview: pendingImport,
            });
        } catch (error) {
            if (previewAbortControllerRef.current?.signal.aborted) {
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
        } finally {
            previewAbortControllerRef.current = null;
            setIsPreviewingImport(false);
            setIsParsingMetadata(false);
        }
    }, [
        pendingImport,
        importMethod,
        scriptResult,
        databaseType,
        databaseEdition,
        parsedMetadata,
        importNewDiagram,
    ]);

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

    const cancelImportPreview = useCallback(() => {
        previewAbortControllerRef.current?.abort();
    }, []);

    return (
        <Dialog
            {...dialog}
            onOpenChange={(open) => {
                // Don't allow closing while parsing metadata
                if (isParsingMetadata) {
                    return;
                }

                if (!hasExistingDiagram) {
                    return;
                }

                if (!open) {
                    closeCreateDiagramDialog();
                }
            }}
        >
            <DialogContent
                className="flex max-h-dvh w-full flex-col md:max-w-[900px]"
                showClose={hasExistingDiagram}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {step === CreateDiagramDialogStep.SELECT_DATABASE ? (
                    <SelectDatabase
                        createNewDiagram={createEmptyDiagram}
                        databaseType={databaseType}
                        hasExistingDiagram={hasExistingDiagram}
                        setDatabaseType={setDatabaseType}
                        onContinue={() =>
                            setStep(CreateDiagramDialogStep.IMPORT_DATABASE)
                        }
                    />
                ) : step === CreateDiagramDialogStep.IMPORT_DATABASE ? (
                    <ImportDatabase
                        onImport={importNewDiagramOrFilterTables}
                        onCreateEmptyDiagram={createEmptyDiagram}
                        databaseEdition={databaseEdition}
                        databaseType={databaseType}
                        scriptResult={scriptResult}
                        setDatabaseEdition={setDatabaseEditionAndResetPreview}
                        goBack={() =>
                            setStep(CreateDiagramDialogStep.SELECT_DATABASE)
                        }
                        setScriptResult={setScriptResultAndResetPreview}
                        title={t('new_diagram_dialog.import_database.title')}
                        importMethod={importMethod}
                        setImportMethod={setImportMethodAndResetPreview}
                        keepDialogAfterImport={true}
                        importPreview={pendingImport?.preview ?? null}
                        enableImportPreview
                        importError={importError}
                        isPreviewingImport={isPreviewingImport}
                        importPreviewProgress={importPreviewProgress}
                        onCancelImportPreview={cancelImportPreview}
                    />
                ) : step === CreateDiagramDialogStep.SELECT_TABLES ? (
                    <SelectTables
                        isLoading={isParsingMetadata || !parsedMetadata}
                        databaseMetadata={parsedMetadata}
                        onImport={importNewDiagram}
                        onBack={() =>
                            setStep(CreateDiagramDialogStep.IMPORT_DATABASE)
                        }
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
};
