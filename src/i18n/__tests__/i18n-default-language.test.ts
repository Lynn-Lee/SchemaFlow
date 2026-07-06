import { describe, expect, it } from 'vitest';
import { i18n, languages } from '../i18n';

describe('i18n default language', () => {
    it('falls back to Simplified Chinese instead of English', () => {
        expect(i18n.options.fallbackLng).toEqual(['zh_CN']);
    });

    it('bundles Simplified Chinese eagerly instead of English', () => {
        expect(i18n.hasResourceBundle('zh_CN', 'translation')).toBe(true);
    });

    it('ignores browser/OS language so every first-time visitor sees Chinese', () => {
        const order = i18n.options.detection?.order ?? [];

        expect(order).not.toContain('navigator');
        expect(order).not.toContain('htmlTag');
    });

    it('still lets a user persist an explicit language choice across reloads', () => {
        const detectionOptions = i18n.options.detection;

        expect(detectionOptions?.order).toContain('localStorage');
        expect(detectionOptions?.caches).toContain('localStorage');
    });

    it('marks Simplified Chinese as a stable, non-experimental language', () => {
        const zhCN = languages.find((language) => language.code === 'zh_CN');

        expect(zhCN?.status).toBe('stable');
    });

    it('keeps the document language in sync with explicit language changes', async () => {
        await i18n.changeLanguage('en');
        expect(document.documentElement.lang).toBe('en');

        await i18n.changeLanguage('zh_CN');
        expect(document.documentElement.lang).toBe('zh-CN');
    });
});
