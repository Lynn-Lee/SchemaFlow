import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalConfig } from '@/hooks/use-local-config';
import { languages, i18n } from '@/i18n/i18n';

export const DisplaySettings: React.FC = () => {
    const { t } = useTranslation();
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
    const language = i18n.resolvedLanguage ?? i18n.language ?? 'zh_CN';

    return (
        <section className="grid gap-4" aria-labelledby="display-settings">
            <div>
                <h3 id="display-settings" className="text-sm font-semibold">
                    {t('settings.display.heading')}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {t('settings.display.description')}
                </p>
            </div>
            <label className="grid gap-1 text-sm">
                <span className="font-medium">
                    {t('settings.display.theme')}
                </span>
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={theme}
                    onChange={(event) =>
                        setTheme(event.target.value as typeof theme)
                    }
                >
                    <option value="system">
                        {t('settings.display.theme_system')}
                    </option>
                    <option value="light">
                        {t('settings.display.theme_light')}
                    </option>
                    <option value="dark">
                        {t('settings.display.theme_dark')}
                    </option>
                </select>
            </label>
            <label className="grid gap-1 text-sm">
                <span className="font-medium">
                    {t('settings.display.language')}
                </span>
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
                <span className="font-medium">
                    {t('settings.display.show_minimap')}
                </span>
                <input
                    type="checkbox"
                    checked={showMiniMapOnCanvas}
                    onChange={(event) =>
                        setShowMiniMapOnCanvas(event.target.checked)
                    }
                />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">
                    {t('settings.display.show_field_attributes')}
                </span>
                <input
                    type="checkbox"
                    checked={showFieldAttributes}
                    onChange={(event) =>
                        setShowFieldAttributes(event.target.checked)
                    }
                />
            </label>
            <label className="grid gap-1 text-sm">
                <span className="font-medium">
                    {t('settings.display.scroll_action')}
                </span>
                <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={scrollAction}
                    onChange={(event) =>
                        setScrollAction(
                            event.target.value as typeof scrollAction
                        )
                    }
                >
                    <option value="pan">
                        {t('settings.display.scroll_action_pan')}
                    </option>
                    <option value="zoom">
                        {t('settings.display.scroll_action_zoom')}
                    </option>
                </select>
            </label>
        </section>
    );
};
