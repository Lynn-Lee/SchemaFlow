import React from 'react';
import { AlertTriangle, Database, KeyRound } from 'lucide-react';
import { Button } from '@/components/button/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/alert/alert';
import { useDialog } from '@/hooks/use-dialog';
import { useLocalConfig } from '@/hooks/use-local-config';

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
    const [showClearWarning, setShowClearWarning] = React.useState(false);

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
                        onClick={() => setShowClearWarning(true)}
                    >
                        Clear local diagrams
                    </Button>
                </div>
                {showClearWarning ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4" />
                        <AlertTitle>
                            Clear local data needs confirmation
                        </AlertTitle>
                        <AlertDescription>
                            Export a backup first. Bulk clearing local diagrams
                            will be implemented as a separate destructive action
                            with repository-level confirmation.
                        </AlertDescription>
                    </Alert>
                ) : null}
            </div>
        </section>
    );
};
