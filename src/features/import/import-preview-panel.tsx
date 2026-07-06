import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/scroll-area/scroll-area';
import type { ImportPreviewSummary } from './import-preview';
import { useTranslation } from 'react-i18next';

interface ImportPreviewPanelProps {
    preview: ImportPreviewSummary;
}

export const ImportPreviewPanel: React.FC<ImportPreviewPanelProps> = ({
    preview,
}) => {
    const { t } = useTranslation();

    return (
        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-400" />
                <div className="min-w-0 flex-1">
                    <div className="font-medium">
                        {t('import_preview.ready')}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        <span>
                            {t('import_preview.confidence', {
                                confidence: preview.confidence,
                            })}
                        </span>
                        <span>
                            {t('import_preview.tables', {
                                count: preview.counts.tables,
                            })}
                        </span>
                        <span>
                            {t('import_preview.relationships', {
                                count: preview.counts.relationships,
                            })}
                        </span>
                        <span>
                            {t('import_preview.custom_types', {
                                count: preview.counts.customTypes,
                            })}
                        </span>
                        <span>
                            {t('import_preview.warnings', {
                                count: preview.counts.warnings,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {preview.diagnostics.length > 0 ||
            preview.warnings.length > 0 ||
            preview.unsupportedObjects.length > 0 ? (
                <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                    <ScrollArea className="h-fit max-h-28">
                        <div className="space-y-2 p-2 text-xs text-amber-800 dark:text-amber-200">
                            {preview.diagnostics
                                .slice(0, 4)
                                .map((diagnostic) => (
                                    <div
                                        key={`${diagnostic.code}-${diagnostic.message}`}
                                        className="flex items-start gap-2"
                                    >
                                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                                        <span>{diagnostic.message}</span>
                                    </div>
                                ))}
                            {preview.warnings.slice(0, 4).map((warning) => (
                                <div
                                    key={`${warning.code}-${warning.message}`}
                                    className="flex items-start gap-2"
                                >
                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                                    <span>
                                        {warning.location
                                            ? `${warning.location}: `
                                            : ''}
                                        {warning.message}
                                    </span>
                                </div>
                            ))}
                            {preview.unsupportedObjects
                                .slice(0, 3)
                                .map((object) => (
                                    <div
                                        key={`${object.objectType}-${object.name}-${object.reason}`}
                                        className="flex items-start gap-2"
                                    >
                                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                                        <span>
                                            {t('import_preview.skipped', {
                                                objectType: object.objectType,
                                                name: object.name
                                                    ? ` "${object.name}"`
                                                    : '',
                                                reason: object.reason,
                                            })}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            ) : null}
        </div>
    );
};
