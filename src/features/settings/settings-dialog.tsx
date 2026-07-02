import React from 'react';
import type { BaseDialogProps } from '@/dialogs/common/base-dialog-props';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/dialog/dialog';
import { useDialog } from '@/hooks/use-dialog';
import { DisplaySettings } from './display-settings';
import { PrivacySettings } from './privacy-settings';
import { KeyboardShortcutsSettings } from './keyboard-shortcuts-settings';

export interface SettingsDialogProps extends BaseDialogProps {}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ dialog }) => {
    const { closeSettingsDialog } = useDialog();

    return (
        <Dialog
            {...dialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeSettingsDialog();
                }
            }}
        >
            <DialogContent
                className="flex max-h-[min(720px,92dvh)] max-w-3xl flex-col overflow-hidden p-0"
                showClose
            >
                <DialogHeader className="border-b border-border px-6 py-5">
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Manage local editor preferences, AI export mode, and
                        browser-stored diagram data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 overflow-y-auto px-6 py-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    <DisplaySettings />
                    <div className="grid gap-6">
                        <PrivacySettings />
                        <KeyboardShortcutsSettings />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
