import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/button/button';
import { Spinner } from '@/components/spinner/spinner';
import type { ImportPreviewProgress } from './import-preview';

interface ImportPreviewProgressPanelProps {
    progress: ImportPreviewProgress;
    onCancel: () => void;
}

export const ImportPreviewProgressPanel: React.FC<
    ImportPreviewProgressPanelProps
> = ({ progress, onCancel }) => {
    return (
        <div
            role="status"
            className="mt-2 flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
        >
            <div className="flex min-w-0 items-center gap-2">
                <Spinner size="small" />
                <div className="min-w-0">
                    <div className="font-medium">Building import preview</div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {progress.message}
                    </div>
                </div>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Cancel import preview"
                onClick={onCancel}
            >
                <X className="size-4" />
            </Button>
        </div>
    );
};
