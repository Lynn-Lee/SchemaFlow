import React from 'react';
import { useTranslation } from 'react-i18next';

const shortcuts = [
    { labelKey: 'settings.keyboard.undo', keys: 'Cmd/Ctrl Z' },
    { labelKey: 'settings.keyboard.redo', keys: 'Cmd/Ctrl Shift Z' },
    { labelKey: 'settings.keyboard.command_actions', keys: 'Cmd/Ctrl K' },
    {
        labelKey: 'settings.keyboard.zoom_canvas',
        keysKey: 'settings.keyboard.zoom_canvas_keys',
    },
] as const;

export const KeyboardShortcutsSettings: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="grid gap-3" aria-labelledby="keyboard-settings">
            <div>
                <h3 id="keyboard-settings" className="text-sm font-semibold">
                    {t('settings.keyboard.heading')}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {t('settings.keyboard.description')}
                </p>
            </div>
            <dl className="grid gap-2 rounded-md border border-border p-3">
                {shortcuts.map((shortcut) => (
                    <div
                        key={shortcut.labelKey}
                        className="grid gap-1 text-sm sm:grid-cols-[1fr_auto]"
                    >
                        <dt className="text-muted-foreground">
                            {t(shortcut.labelKey)}
                        </dt>
                        <dd className="font-mono text-xs text-foreground">
                            {'keysKey' in shortcut
                                ? t(shortcut.keysKey)
                                : shortcut.keys}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
};
