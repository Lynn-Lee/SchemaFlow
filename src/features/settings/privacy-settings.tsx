import React from 'react';
import { AlertTriangle, Database, KeyRound } from 'lucide-react';
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

type ClearStatus = 'idle' | 'clearing' | 'success' | 'error';

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
    const { openExportDiagramDialog, openImportDiagramDialog } = useDialog();
    const { clearAllDiagrams } = useStorage();
    const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
    const [clearStatus, setClearStatus] = React.useState<ClearStatus>('idle');
    const [clearError, setClearError] = React.useState<string | undefined>();

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
                    <Alert>
                        <KeyRound className="size-4" />
                        <AlertTitle>Session-only BYOK</AlertTitle>
                        <AlertDescription>
                            <p>Paste the API key only when exporting SQL.</p>
                            <p>
                                BYOK keys are session-only and are never saved.
                            </p>
                        </AlertDescription>
                    </Alert>
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
                        onClick={() => openImportDiagramDialog({})}
                    >
                        Restore from backup
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={clearStatus === 'clearing'}
                        onClick={() => setClearDialogOpen(true)}
                    >
                        Clear local diagrams
                    </Button>
                </div>
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
            </div>
        </section>
    );
};
