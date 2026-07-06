import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { i18n, languages } from '../i18n';

describe('i18n lazy loading', () => {
    it('does not statically import non-fallback locale translations', () => {
        const source = readFileSync(
            join(process.cwd(), 'src', 'i18n', 'i18n.ts'),
            'utf8'
        );

        for (const language of languages) {
            if (language.code === 'zh_CN') continue;

            expect(source).not.toContain(`from './locales/${language.code}'`);
        }
    });

    it('loads non-fallback locale resources when the language changes', async () => {
        expect(i18n.hasResourceBundle('fr', 'translation')).toBe(false);

        await i18n.changeLanguage('fr');

        expect(i18n.hasResourceBundle('fr', 'translation')).toBe(true);
        expect(i18n.t('menu.actions.new')).toBe('Nouveau...');
    });
});
