import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { languages } from '../i18n';

describe('language metadata', () => {
    it('marks incomplete locales as experimental', () => {
        const experimentalCodes = new Set([
            'ar',
            'bn',
            'de',
            'es',
            'fr',
            'gu',
            'hi',
            'id_ID',
            'ja',
            'ko_KR',
            'mr',
            'ne',
            'pt_BR',
            'ru',
            'te',
            'tr',
            'uk',
            'vi',
            'zh_TW',
        ]);

        for (const language of languages) {
            expect(language.status).toBe(
                experimentalCodes.has(language.code) ? 'experimental' : 'stable'
            );
        }
    });

    it('does not leave translation TODO markers in locale source files', () => {
        for (const language of languages) {
            const localePath = join(
                process.cwd(),
                'src',
                'i18n',
                'locales',
                `${language.code}.ts`
            );
            const source = readFileSync(localePath, 'utf8');

            expect(source).not.toMatch(
                /TODO:\s*(Translate|Add translations)|\/\/TODO translate/
            );
        }
    });
});
