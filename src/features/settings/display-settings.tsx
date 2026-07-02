import React from 'react';
import { useLocalConfig } from '@/hooks/use-local-config';
import { languages, i18n } from '@/i18n/i18n';

export const DisplaySettings: React.FC = () => {
    const {
        theme,
        setTheme,
        showMiniMapOnCanvas,
        setShowMiniMapOnCanvas,
        showFieldAttributes,
        setShowFieldAttributes,
        scrollAction,
        setScrollAction,
    } = useLocalConfig();
    const language = i18n.resolvedLanguage ?? i18n.language ?? 'en';

    return (
        <section className="grid gap-4" aria-labelledby="display-settings">
            <div>
                <h3 id="display-settings" className="text-sm font-semibold">
                    Display
                </h3>
                <p className="text-sm text-muted-foreground">
                    Keep editor preferences in this browser.
                </p>
            </div>
            <label className="grid gap-1 text-sm">
                <span className="font-medium">Theme</span>
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={theme}
                    onChange={(event) =>
                        setTheme(event.target.value as typeof theme)
                    }
                >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </label>
            <label className="grid gap-1 text-sm">
                <span className="font-medium">Language</span>
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={language}
                    onChange={(event) => {
                        void i18n.changeLanguage(event.target.value);
                    }}
                >
                    {languages.map((item) => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">Show mini map</span>
                <input
                    type="checkbox"
                    checked={showMiniMapOnCanvas}
                    onChange={(event) =>
                        setShowMiniMapOnCanvas(event.target.checked)
                    }
                />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">Show field attributes</span>
                <input
                    type="checkbox"
                    checked={showFieldAttributes}
                    onChange={(event) =>
                        setShowFieldAttributes(event.target.checked)
                    }
                />
            </label>
            <label className="grid gap-1 text-sm">
                <span className="font-medium">Canvas scroll action</span>
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={scrollAction}
                    onChange={(event) =>
                        setScrollAction(
                            event.target.value as typeof scrollAction
                        )
                    }
                >
                    <option value="pan">Pan canvas</option>
                    <option value="zoom">Zoom canvas</option>
                </select>
            </label>
        </section>
    );
};
