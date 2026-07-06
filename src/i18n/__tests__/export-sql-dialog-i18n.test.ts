import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

describe('export SQL dialog i18n', () => {
    it('defines export mode labels in the fallback locale', () => {
        expect(en.translation.export_sql_dialog.mode.deterministic).toBe(
            'Deterministic'
        );
        expect(en.translation.export_sql_dialog.mode.ai).toBe('AI');
    });

    it('defines export mode labels in Simplified Chinese', () => {
        expect(zh_CN.translation.export_sql_dialog.mode.deterministic).toBe(
            '确定性'
        );
        expect(zh_CN.translation.export_sql_dialog.mode.ai).toBe('AI');
    });
});
