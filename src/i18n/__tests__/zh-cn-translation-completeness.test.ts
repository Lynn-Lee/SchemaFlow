import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

// Dot-paths where the Simplified Chinese string is intentionally identical
// to English: proper nouns, format names, and single acronyms that stay in
// English per project convention, not missed translations.
const ALLOWED_IDENTICAL_PATHS = new Set([
    'export_sql_dialog.mode.ai',
    'export_diagram_dialog.format_json',
    'import_preview.errors.message',
]);

type Tree = { [key: string]: Tree | string };

const collectIdenticalLeaves = (
    enNode: Tree,
    zhNode: Tree,
    path: string[] = []
): string[] => {
    const identical: string[] = [];

    for (const key of Object.keys(enNode)) {
        const enValue = enNode[key];
        const zhValue = zhNode?.[key];
        const currentPath = [...path, key];

        if (typeof enValue === 'string') {
            if (
                typeof zhValue === 'string' &&
                zhValue === enValue &&
                !ALLOWED_IDENTICAL_PATHS.has(currentPath.join('.'))
            ) {
                identical.push(currentPath.join('.'));
            }
            continue;
        }

        if (enValue && typeof enValue === 'object') {
            identical.push(
                ...collectIdenticalLeaves(
                    enValue,
                    (zhValue as Tree) ?? {},
                    currentPath
                )
            );
        }
    }

    return identical;
};

describe('Simplified Chinese translation completeness', () => {
    it('does not leave any English string untranslated outside the allowlist', () => {
        const leftoverEnglish = collectIdenticalLeaves(
            en.translation,
            zh_CN.translation
        );

        expect(leftoverEnglish).toEqual([]);
    });

    it('fully translates the DBML import dialog', () => {
        expect(zh_CN.translation.import_dbml_dialog.title).not.toBe(
            en.translation.import_dbml_dialog.title
        );
        expect(zh_CN.translation.import_dbml_dialog.description).not.toBe(
            en.translation.import_dbml_dialog.description
        );
        expect(zh_CN.translation.import_dbml_dialog.error.description).not.toBe(
            en.translation.import_dbml_dialog.error.description
        );
    });

    it('translates the export diagram error copy instead of leaving a TODO', () => {
        const source = zh_CN.translation.export_diagram_dialog.error;

        expect(source.title).not.toBe(
            en.translation.export_diagram_dialog.error.title
        );
    });
});
