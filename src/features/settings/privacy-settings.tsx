import React from 'react';
import { AlertTriangle, Database, KeyRound, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { i18n } from '@/i18n/i18n';
import {
    getBYOKSessionKey,
    setBYOKSessionKey,
    validateGatewayEndpoint,
} from '@/lib/ai/ai-mode';
import {
    parseBackupSummary,
    parseSchemaFlowBackup,
    restoreDiagramFromBackup,
    type SchemaFlowBackupSummary,
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

            reject(new Error(i18n.t('settings.privacy.read_failed_default')));
        };
        reader.onerror = () =>
            reject(new Error(i18n.t('settings.privacy.read_failed_default')));
        reader.readAsText(file);
    });

export const PrivacySettings: React.FC = () => {
    const { t } = useTranslation();
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
        SchemaFlowBackupSummary | undefined
    >();
    const [byokSessionKey, setByokSessionKey] = React.useState(
        () => getBYOKSessionKey() ?? ''
    );
    const [gatewayEndpointDraft, setGatewayEndpointDraft] =
        React.useState(aiGatewayEndpoint);
    const [gatewayEndpointError, setGatewayEndpointError] = React.useState<
        string | undefined
    >();

    React.useEffect(() => {
        setGatewayEndpointDraft(aiGatewayEndpoint);
        setGatewayEndpointError(undefined);
    }, [aiGatewayEndpoint]);

    const handleBYOKSessionKeyChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextKey = event.target.value;
            setByokSessionKey(nextKey);
            setBYOKSessionKey(nextKey);
        },
        []
    );

    const handleGatewayEndpointChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const nextEndpoint = event.target.value;
            setGatewayEndpointDraft(nextEndpoint);

            if (nextEndpoint.trim().length === 0) {
                setGatewayEndpointError(undefined);
                return;
            }

            setGatewayEndpointError(validateGatewayEndpoint(nextEndpoint));
        },
        []
    );

    const handleGatewayEndpointBlur = React.useCallback(() => {
        const trimmedEndpoint = gatewayEndpointDraft.trim();

        if (trimmedEndpoint.length === 0) {
            setGatewayEndpointError(undefined);
            setAIGatewayEndpoint('');
            return;
        }

        const validationError = validateGatewayEndpoint(trimmedEndpoint);
        setGatewayEndpointError(validationError);

        if (!validationError) {
            setGatewayEndpointDraft(trimmedEndpoint);
            setAIGatewayEndpoint(trimmedEndpoint);
        }
    }, [gatewayEndpointDraft, setAIGatewayEndpoint]);

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
                    : t('settings.privacy.clear_failed_default')
            );
        }
    }, [clearAllDiagrams, t]);

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
                        : t('settings.privacy.preview_failed_default')
                );
            }
        },
        [t]
    );

    const handleRestoreBackup = React.useCallback(async () => {
        if (!restoreJson) return;

        setRestoreStatus('restoring');
        setRestoreError(undefined);

        try {
            const backup = parseSchemaFlowBackup(restoreJson);
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
                    : t('settings.privacy.restore_failed_default')
            );
        }
    }, [addDiagram, navigate, restoreJson, t]);

    return (
        <section className="grid gap-5" aria-labelledby="privacy-settings">
            {!localStorageAvailable ? (
                <Alert>
                    <AlertTriangle className="size-4" />
                    <AlertTitle>
                        {t('settings.privacy.session_only_title')}
                    </AlertTitle>
                    <AlertDescription>
                        {t('settings.privacy.session_only_description')}
                    </AlertDescription>
                </Alert>
            ) : null}

            <div className="grid gap-3">
                <div>
                    <h3 id="privacy-settings" className="text-sm font-semibold">
                        {t('settings.privacy.ai_mode_heading')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.privacy.ai_mode_description')}
                    </p>
                </div>
                <label className="grid gap-1 text-sm">
                    <span className="font-medium">
                        {t('settings.privacy.ai_export_mode_label')}
                    </span>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={aiExportMode}
                        onChange={(event) =>
                            setAIExportMode(
                                event.target.value as typeof aiExportMode
                            )
                        }
                    >
                        <option value="disabled">
                            {t('settings.privacy.ai_export_mode_disabled')}
                        </option>
                        <option value="byok-session">
                            {t('settings.privacy.ai_export_mode_byok')}
                        </option>
                        <option value="self-hosted-gateway">
                            {t('settings.privacy.ai_export_mode_gateway')}
                        </option>
                    </select>
                </label>
                {aiExportMode === 'byok-session' ? (
                    <div className="grid gap-3 rounded-md border border-border p-3">
                        <Alert>
                            <KeyRound className="size-4" />
                            <AlertTitle>
                                {t('settings.privacy.byok_alert_title')}
                            </AlertTitle>
                            <AlertDescription>
                                <p>{t('settings.privacy.byok_alert_line_1')}</p>
                                <p>{t('settings.privacy.byok_alert_line_2')}</p>
                            </AlertDescription>
                        </Alert>
                        <label className="grid gap-1 text-sm">
                            <span className="font-medium">
                                {t('settings.privacy.byok_session_key_label')}
                            </span>
                            <input
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                type="password"
                                autoComplete="off"
                                value={byokSessionKey}
                                onChange={handleBYOKSessionKeyChange}
                                placeholder="sk-..."
                            />
                            <span className="text-xs text-muted-foreground">
                                {t('settings.privacy.byok_session_key_hint')}
                            </span>
                        </label>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        {t('settings.privacy.byok_never_saved')}
                    </p>
                )}
                {aiExportMode === 'self-hosted-gateway' ? (
                    <div className="grid gap-3 rounded-md border border-border p-3">
                        <label className="grid gap-1 text-sm">
                            <span className="font-medium">
                                {t('settings.privacy.gateway_endpoint_label')}
                            </span>
                            <input
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={gatewayEndpointDraft}
                                onChange={handleGatewayEndpointChange}
                                onBlur={handleGatewayEndpointBlur}
                                aria-invalid={
                                    gatewayEndpointError ? true : undefined
                                }
                                aria-describedby={
                                    gatewayEndpointError
                                        ? 'gateway-endpoint-error'
                                        : undefined
                                }
                                placeholder="https://gateway.example.com/v1"
                            />
                            {gatewayEndpointError ? (
                                <span
                                    id="gateway-endpoint-error"
                                    className="text-xs text-destructive"
                                >
                                    {gatewayEndpointError}
                                </span>
                            ) : null}
                        </label>
                        <label className="grid gap-1 text-sm">
                            <span className="font-medium">
                                {t('settings.privacy.gateway_model_label')}
                            </span>
                            <input
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={aiGatewayModelName}
                                onChange={(event) =>
                                    setAIGatewayModelName(event.target.value)
                                }
                                placeholder={t(
                                    'settings.privacy.gateway_model_placeholder'
                                )}
                            />
                        </label>
                    </div>
                ) : null}
            </div>

            <div className="grid gap-3">
                <div>
                    <h3 className="text-sm font-semibold">
                        {t('settings.privacy.data_management_heading')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t('settings.privacy.data_management_description')}
                    </p>
                </div>
                <div className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => openExportDiagramDialog({})}
                    >
                        <Database className="mr-2 size-4" />
                        {t('settings.privacy.export_backup_button')}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => restoreFileInputRef.current?.click()}
                    >
                        <Upload className="mr-2 size-4" />
                        {t('settings.privacy.restore_backup_button')}
                    </Button>
                    <input
                        ref={restoreFileInputRef}
                        id={restoreFileInputId}
                        className="sr-only"
                        type="file"
                        accept=".json,application/json"
                        aria-label={t('settings.privacy.backup_file_label')}
                        onChange={handleRestoreBackupFileChange}
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={clearStatus === 'clearing'}
                        onClick={() => setClearDialogOpen(true)}
                    >
                        {t('settings.privacy.clear_local_diagrams_button')}
                    </Button>
                </div>
                {restoreStatus === 'reading' ? (
                    <Alert>
                        <Upload className="size-4" />
                        <AlertTitle>
                            {t('settings.privacy.reading_backup_title')}
                        </AlertTitle>
                        <AlertDescription>
                            {t('settings.privacy.reading_backup_description')}
                        </AlertDescription>
                    </Alert>
                ) : null}
                {restoreStatus === 'success' ? (
                    <Alert>
                        <Database className="size-4" />
                        <AlertTitle>
                            {t('settings.privacy.backup_restored_title')}
                        </AlertTitle>
                        <AlertDescription>
                            {t('settings.privacy.backup_restored_description')}
                        </AlertDescription>
                    </Alert>
                ) : null}
                {restoreStatus === 'error' ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4" />
                        <AlertTitle>
                            {t('settings.privacy.restore_failed_title')}
                        </AlertTitle>
                        <AlertDescription>
                            {restoreError ??
                                t('settings.privacy.restore_failed_default')}
                        </AlertDescription>
                    </Alert>
                ) : null}
                {clearStatus === 'success' ? (
                    <Alert>
                        <Database className="size-4" />
                        <AlertTitle>
                            {t('settings.privacy.cleared_title')}
                        </AlertTitle>
                        <AlertDescription>
                            {t('settings.privacy.cleared_description')}
                        </AlertDescription>
                    </Alert>
                ) : null}
                {clearStatus === 'error' ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4" />
                        <AlertTitle>
                            {t('settings.privacy.clear_failed_title')}
                        </AlertTitle>
                        <AlertDescription>
                            {clearError ??
                                t('settings.privacy.clear_failed_default')}
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
                                {t('settings.privacy.clear_dialog_title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('settings.privacy.clear_dialog_description')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={clearStatus === 'clearing'}
                            >
                                {t('settings.privacy.cancel')}
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
                                    ? t('settings.privacy.deleting')
                                    : t(
                                          'settings.privacy.delete_local_diagrams'
                                      )}
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
                                {t('settings.privacy.restore_dialog_title')}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {t(
                                    'settings.privacy.restore_dialog_description'
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {restoreSummary ? (
                            <div className="grid gap-3 text-sm">
                                <p className="text-muted-foreground">
                                    {t(
                                        restoreSummary.diagramCount === 1
                                            ? 'settings.privacy.diagram_singular'
                                            : 'settings.privacy.diagram_plural',
                                        { count: restoreSummary.diagramCount }
                                    )}
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
                                                    {`${t(
                                                        diagram.tableCount === 1
                                                            ? 'settings.privacy.table_singular'
                                                            : 'settings.privacy.table_plural',
                                                        {
                                                            count: diagram.tableCount,
                                                        }
                                                    )} · ${t(
                                                        diagram.relationshipCount ===
                                                            1
                                                            ? 'settings.privacy.relationship_singular'
                                                            : 'settings.privacy.relationship_plural',
                                                        {
                                                            count: diagram.relationshipCount,
                                                        }
                                                    )}`}
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
                                {t('settings.privacy.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={restoreStatus === 'restoring'}
                                onClick={(event) => {
                                    event.preventDefault();
                                    void handleRestoreBackup();
                                }}
                            >
                                {restoreStatus === 'restoring'
                                    ? t('settings.privacy.restoring')
                                    : t(
                                          'settings.privacy.restore_backup_action'
                                      )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </section>
    );
};
