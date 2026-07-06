import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

describe('examples page i18n', () => {
    it('defines examples page copy in the fallback locale', () => {
        expect(en.translation.examples_page.heading).toBe('Examples');
        expect(en.translation.examples_page.items['1'].name).toBe(
            'Employees schema'
        );
    });

    it('defines examples page copy in Simplified Chinese', () => {
        expect(zh_CN.translation.examples_page.heading).not.toBe(
            en.translation.examples_page.heading
        );
        expect(zh_CN.translation.examples_page.prompt).not.toBe(
            en.translation.examples_page.prompt
        );
        expect(zh_CN.translation.examples_page.items['1'].name).not.toBe(
            en.translation.examples_page.items['1'].name
        );
        expect(zh_CN.translation.examples_page.items['2'].description).not.toBe(
            en.translation.examples_page.items['2'].description
        );
    });
});
