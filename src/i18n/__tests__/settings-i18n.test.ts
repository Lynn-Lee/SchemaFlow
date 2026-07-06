import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

describe('settings dialog i18n', () => {
    it('defines settings copy in the fallback locale', () => {
        expect(en.translation.settings.dialog.title).toBe('Settings');
        expect(en.translation.settings.display.heading).toBe('Display');
        expect(en.translation.settings.privacy.ai_mode_heading).toBe('AI mode');
        expect(en.translation.settings.keyboard.heading).toBe(
            'Keyboard shortcuts'
        );
    });

    it('defines settings copy in Simplified Chinese, not left in English', () => {
        expect(zh_CN.translation.settings.dialog.title).toBe('设置');
        expect(zh_CN.translation.settings.display.heading).not.toBe(
            en.translation.settings.display.heading
        );
        expect(zh_CN.translation.settings.privacy.ai_mode_heading).not.toBe(
            en.translation.settings.privacy.ai_mode_heading
        );
        expect(zh_CN.translation.settings.keyboard.heading).not.toBe(
            en.translation.settings.keyboard.heading
        );
    });
});
