import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { en } from '../locales/en';
import { zh_CN } from '../locales/zh_CN';

const importPreviewKeys = [
    'ready',
    'confidence',
    'tables',
    'relationships',
    'custom_types',
    'warnings',
    'skipped',
] as const;

describe('import preview i18n', () => {
    it('defines import preview copy in Simplified Chinese', () => {
        for (const key of importPreviewKeys) {
            expect(zh_CN.translation.import_preview[key]).not.toBe(
                en.translation.import_preview[key]
            );
        }
    });

    it('defines import preview error copy in Simplified Chinese', () => {
        expect(
            zh_CN.translation.import_preview.errors.no_importable_objects
        ).not.toBe(en.translation.import_preview.errors.no_importable_objects);
        expect(zh_CN.translation.import_preview.errors.cancelled).not.toBe(
            en.translation.import_preview.errors.cancelled
        );
        expect(zh_CN.translation.import_preview.errors.parse_failed).not.toBe(
            en.translation.import_preview.errors.parse_failed
        );
        expect(zh_CN.translation.import_preview.errors.parse_default).not.toBe(
            en.translation.import_preview.errors.parse_default
        );
    });

    it('routes import preview UI copy through translation keys', () => {
        const panelSource = readFileSync(
            join(process.cwd(), 'src/features/import/import-preview-panel.tsx'),
            'utf8'
        );
        const dialogSource = readFileSync(
            join(
                process.cwd(),
                'src/dialogs/create-diagram-dialog/create-diagram-dialog.tsx'
            ),
            'utf8'
        );

        expect(panelSource).not.toContain('Import preview ready');
        expect(panelSource).not.toContain('was skipped');
        expect(dialogSource).not.toContain(
            'Preview found no importable tables'
        );
        expect(dialogSource).not.toContain('Import preview cancelled.');
        expect(dialogSource).not.toContain('Preview failed:');
    });
});
