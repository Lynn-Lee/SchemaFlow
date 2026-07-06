import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

const expectedSmartQueryKeys = [
    'title',
    'description',
    'steps.choose_database.title',
    'steps.choose_database.description',
    'steps.copy_query.title',
    'steps.copy_query.description',
    'steps.paste_json.title',
    'steps.paste_json.description',
    'steps.preview.title',
    'steps.preview.description',
    'steps.confirm.title',
    'steps.confirm.description',
] as const;

const getValue = (source: unknown, key: string) =>
    key.split('.').reduce<unknown>((current, segment) => {
        if (typeof current !== 'object' || current === null) {
            return undefined;
        }

        return (current as Record<string, unknown>)[segment];
    }, source);

describe('Smart Query wizard i18n', () => {
    it('defines the wizard copy in the fallback locale', () => {
        const smartQueryWizard = en.translation.smart_query_wizard;

        for (const key of expectedSmartQueryKeys) {
            expect(getValue(smartQueryWizard, key)).toEqual(expect.any(String));
        }
    });

    it('defines the passwordless safety message in Simplified Chinese', () => {
        expect(zh_CN.translation.smart_query_wizard.description).toContain(
            '不会要求你的数据库密码'
        );
        expect(
            zh_CN.translation.smart_query_wizard.steps.paste_json.description
        ).toContain('不要粘贴连接串或密钥');
    });
});
