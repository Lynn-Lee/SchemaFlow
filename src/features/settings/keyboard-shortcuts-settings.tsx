import React from 'react';

const shortcuts = [
    ['Undo diagram change', 'Cmd/Ctrl Z'],
    ['Redo diagram change', 'Cmd/Ctrl Shift Z'],
    ['Open command actions', 'Cmd/Ctrl K'],
    ['Zoom canvas', 'Mouse wheel or toolbar controls'],
] as const;

export const KeyboardShortcutsSettings: React.FC = () => (
    <section className="grid gap-3" aria-labelledby="keyboard-settings">
        <div>
            <h3 id="keyboard-settings" className="text-sm font-semibold">
                Keyboard shortcuts
            </h3>
            <p className="text-sm text-muted-foreground">
                Core editor paths remain available without pointer-only
                controls.
            </p>
        </div>
        <dl className="grid gap-2 rounded-md border border-border p-3">
            {shortcuts.map(([label, keys]) => (
                <div
                    key={label}
                    className="grid gap-1 text-sm sm:grid-cols-[1fr_auto]"
                >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-mono text-xs text-foreground">
                        {keys}
                    </dd>
                </div>
            ))}
        </dl>
    </section>
);
