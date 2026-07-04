import React from 'react';
import { AlertTriangle, Database, KeyRound, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/button/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/alert/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/alert-dialog/alert-dialog';
import { useDialog } from '@/hooks/use-dialog';
import { useLocalConfig } from '@/hooks/use-local-config';
import { useStorage } from '@/hooks/use-storage';
import { getBYOKSessionKey, setBYOKSessionKey } from '@/lib/ai/ai-mode';
import {
    parseBackupSummary,
    parseChartDBBackup,
    restoreDiagramFromBackup,
    type ChartDBBackupSummary,
} from '@/storage/backup';

type ClearStatus = 'idle' | 'clearing' | 'success' | 'error';
type RestoreStatus =
    | 'idle'
    | 'reading'
    | 'ready'
    | 'restoring'
    | 'success'
    | 'error';

const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                resolve(result);
                return;
            }

            reject(new Error('Backup file could not be read.'));
        };
        reader.onerror = () =>
            reject(new Error('Backup file could not be read.'));
        reader.readAsText(file);
    });

export const PrivacySettings: React.FC = () => {
    const {
        localStorageAvailable,
        aiExportMode,
        setAIExportMode,
        aiGatewayEndpoint,
        setAIGatewayEndpoint,
        aiGatewayModelName,
        setAIGatewayModelName,
    } = useLocalConfig();
    const { openExportDiagramDialog } = useDialog();
    const { addDiagram, clearAllDiagrams } = useStorage();
    const navigate = useNavigate();
    const restoreFileInputId = React.useId();
    const restoreFileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
    const [clearStatus, setClearStatus] = React.useState<ClearStatus>('idle');
    const [clearError, setClearError] = React.useState<string | undefined>();
    const [restoreDialogOpen, setRestoreDialogOpen] = React.useState(false);
    const [restoreStatus, setRestoreStatus] =
        React.useState<RestoreStatus>('idle');
    const [restoreError, setRestoreError] = React.useState<
        string | undefined
    >();
    const [restoreJson, setRestoreJson] = React.useState<string | undefined>();
    const [restoreSummary, setRestoreSummary] = React.useState<
        ChartDBBackupSummary | undefined
    >();
    const [byokSessionKey, setByokSessionKey] = React.useState(
        () => getBYOKSessionKey() ?? ''
    );

    const handleBYOKSessionKeyChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextKey = event.target.value;
            setByokSessionKey(nextKey);
            setBYOKSessionKey(nextKey);
        },
        []
    );

    const handleClearLocalDiagrams = React.useCallback(async () => {
        setClearStatus('clearing');
        setClearError(undefined);

        try {
            await clearAllDiagrams();
            setClearStatus('success');
            setClearDialogOpen(false);
        } catch (error) {
            setClearStatus('error');
            setClearError(
                error instanceof Error
                    ? error.message
                    : 'Local diagrams could not be deleted.'
            );
        }
    }, [clearAllDiagrams]);

    const handleRestoreBackupFileChange = React.useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            event.target.value = '';

            if (!file) return;

            setRestoreStatus('reading');
            setRestoreError(undefined);

            try {
                const json = await readFileAsText(file);
                const summary = parseBackupSummary(json);
                setRestoreJson(json);
                setRestoreSummary(summary);
                setRestoreStatus('ready');
                setRestoreDialogOpen(true);
            } catch (error) {
                setRestoreJson(undefined);
                setRestoreSummary(undefined);
                setRestoreStatus('error');
                setRestoreError(
                    error instanceof Error
                        ? error.message
                        : 'Backup file could not be previewed.'
                );
            }
        },
        []
    );

    const handleRestoreBackup = React.useCallback(async () => {
        if (!restoreJson) return;

        setRestoreStatus('restoring');
        setRestoreError(undefined);

        try {
            const backup = parseChartDBBackup(restoreJson);
            const restoredDiagrams = backup.diagrams.map((_, diagramIndex) =>
                restoreDiagramFromBackup({
                    backup,
                    diagramIndex,
                })
            );

            await Promise.all(
                restoredDiagrams.map((diagram) => addDiagram({ diagram }))
            );

            setRestoreStatus('success');
            setRestoreDialogOpen(false);
            setRestoreJson(undefined);
            setRestoreSummary(undefined);

            const firstDiagram = restoredDiagrams[0];
            if (firstDiagram) {
                navigate(`/diagrams/${firstDiagram.id}`);
            }
        } catch (error) {
            setRestoreStatus('error');
            setRestoreError(
                error instanceof Error
                    ? error.message
                    : 'Backup file could not be restored.'
            );
        }
    }, [addDiagram, navigate, restoreJson]);

    return (
        <section className="grid gap-5" aria-labelledby="privacy-settings">
            {!localStorageAvailable ? (
                <Alert>
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Session-only settings</AlertTitle>
                    <AlertDescription>
                        Browser settings are unavailable. Changes work for this
                        session only.
                    </AlertDescription>
                </Alert>
            ) : null}

            <div className="grid gap-3">
                <div>
                    <h3 id="privacy-settings" className="text-sm font-semibold">
                        AI mode
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Control whether SQL export can use AI assistance.
                    </p>
                </div>
                <label className="grid gap-1 text-sm">
                    <span className="font-medium">AI-assisted export mode</span>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={aiExportMode}
                        onChange={(event) =>
                            setAIExportMode(
                                event.target.value as typeof aiExportMode
                            )
                        }
                    >
                        <option value="disabled">Disabled</option>
                        <option value="byok-session">BYOK session</option>
                        <option value="self-hosted-gateway">
                            Self-hosted gateway
                        </option>
                    </select>
                </label>
                {aiExportMode === 'byok-session' ? (
                    <div className="grid gap-3 rounded-md border border-border p-3">
                        <Alert>
                            <KeyRound className="size-4" />
                            <AlertTitle>Session-only BYOK</AlertTitle>
                            <AlertDescription>
                                <p>
                                    Paste the API key only when exporting SQL.
                                </p>
                                <p>
                                    BYOK keys are session-only and are never
                                    saved.
                                </p>
                            </AlertDescription>
                        </Alert>
                        <label className="grid gap-1 text-sm">
                            <span className="font-medium">Session API key</span>
                            <input
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                type="password"
                                autoComplete="off"
                                value={byokSessionKey}
                                onChange={handleBYOKSessionKeyChange}
                                placeholder="sk-..."
                            />
                            <span className="text-xs text-muted-foreground">
                                Stored in memory only. Refreshing the page
                                clears this key.
                            </span>
                        </label>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        BYOK keys are session-only and are never saved.
                    </p>
                )}
                {aiExportMode === 'self-hosted-gateway' ? (
                    <div className="grid gap-3 rounded-md border border-border p-3">
                        <label className="grid gap-1 text-sm">
                            <span className="font-medium">
                                Gateway endpoint
                            </span>
                            <input
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={aiGatewayEndpoint}
                                onChange={(event) =>
                                    setAIGatewayEndpoint(event.target.value)
                                }
                                placeholder="https://gateway.example.com/v1"
                            />
                        </label>
                        <label className="grid gap-1 text-sm">
                            <span className="font-medium">Model name</span>
                            <input
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={aiGatewayModelName}
                                onChange={(event) =>
                                    setAIGatewayModelName(event.target.value)
                                }
                                placeholder="Optional"
                            />
                        </label>
                    </div>
                ) : null}
            </div>

            <div className="grid gap-3">
                <div>
                    <h3 className="text-sm font-semibold">Data management</h3>
                    <p className="text-sm text-muted-foreground">
                        ChartDB stores diagrams in this browser with IndexedDB
                        and localStorage. No account or cloud workspace is
                        required.
                    </p>
                </div>
                <div className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => openExportDiagramDialog({})}
                    >
                        <Database className="mr-2 size-4" />
                        Export diagram backup
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => restoreFileInputRef.current?.click()}
                    >
                        <Upload className="mr-2 size-4" />
                        Restore from backup
                    </Button>
                    <input
                        ref={restoreFileInputRef}
                        id={restoreFileInputId}
                        className="sr-only"
                        type="file"
                        accept=".json,application/json"
                        aria-label="Backup file"
                        onChange={handleRestoreBackupFileChange}
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={clearStatus === 'clearing'}
                        onClick={() => setClearDialogOpen(true)}
                    >
                        Clear local diagrams
                    </Button>
                </div>
                {restoreStatus === 'reading' ? (
                    <Alert>
                        <Upload className="size-4" />
                        <AlertTitle>Reading backup</AlertTitle>
                        <AlertDescription>
                            ChartDB is building a restore preview.
                        </AlertDescription>
                    </Alert>
                ) : null}
                {restoreStatus === 'success' ? (
                    <Alert>
                        <Database className="size-4" />
                        <AlertTitle>Backup restored</AlertTitle>
                        <AlertDescription>
                            The selected backup has been restored as local
                            diagram data.
                        </AlertDescription>
                    </Alert>
                ) : null}
                {restoreStatus === 'error' ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4" />
                        <AlertTitle>Could not restore backup</AlertTitle>
                        <AlertDescription>
                            {restoreError ??
                                'Backup file could not be restored.'}
                        </AlertDescription>
                    </Alert>
                ) : null}
                {clearStatus === 'success' ? (
                    <Alert>
                        <Database className="size-4" />
                        <AlertTitle>Local diagrams cleared</AlertTitle>
                        <AlertDescription>
                            All local diagrams have been deleted.
                        </AlertDescription>
                    </Alert>
                ) : null}
                {clearStatus === 'error' ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4" />
                        <AlertTitle>Could not clear local diagrams</AlertTitle>
                        <AlertDescription>
                            {clearError ??
                                'Local diagrams could not be deleted.'}
                        </AlertDescription>
                    </Alert>
                ) : null}
                <AlertDialog
                    open={clearDialogOpen}
                    onOpenChange={setClearDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete all local diagrams?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This deletes every diagram stored in this
                                browser, including tables, relationships, notes,
                                areas, custom types, and filters. Export a
                                backup first if you need to keep a copy.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={clearStatus === 'clearing'}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={clearStatus === 'clearing'}
                                onClick={(event) => {
                                    event.preventDefault();
                                    void handleClearLocalDiagrams();
                                }}
                            >
                                {clearStatus === 'clearing'
                                    ? 'Deleting...'
                                    : 'Delete local diagrams'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog
                    open={restoreDialogOpen}
                    onOpenChange={setRestoreDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Restore backup preview?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Review the diagrams in this backup before
                                restoring them into local browser storage.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {restoreSummary ? (
                            <div className="grid gap-3 text-sm">
                                <p className="text-muted-foreground">
                                    {restoreSummary.diagramCount}{' '}
                                    {restoreSummary.diagramCount === 1
                                        ? 'diagram'
                                        : 'diagrams'}{' '}
                                    in this backup.
                                </p>
                                <ul className="grid max-h-48 gap-2 overflow-auto rounded-md border border-border p-3">
                                    {restoreSummary.diagrams.map(
                                        (diagram, index) => (
                                            <li
                                                key={`${diagram.name}-${index}`}
                                                className="grid gap-1"
                                            >
                                                <span className="font-medium">
                                                    {diagram.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {`${diagram.tableCount} ${
                                                        diagram.tableCount === 1
                                                            ? 'table'
                                                            : 'tables'
                                                    } · ${
                                                        diagram.relationshipCount
                                                    } ${
                                                        diagram.relationshipCount ===
                                                        1
                                                            ? 'relationship'
                                                            : 'relationships'
                                                    }`}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ) : null}
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={restoreStatus === 'restoring'}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={restoreStatus === 'restoring'}
                                onClick={(event) => {
                                    event.preventDefault();
                                    void handleRestoreBackup();
                                }}
                            >
                                {restoreStatus === 'restoring'
                                    ? 'Restoring...'
                                    : 'Restore backup'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </section>
    );
};
