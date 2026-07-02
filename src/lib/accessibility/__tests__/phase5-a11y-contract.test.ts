import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const readSource = (path: string) => readFileSync(path, 'utf8');

describe('Phase 5 accessibility contracts', () => {
    it('names core icon-only controls and Monaco editor purposes', () => {
        const codeSnippet = readSource(
            'src/components/code-snippet/code-snippet.tsx'
        );
        const codeSnippetEditor = readSource(
            'src/components/code-snippet/code-snippet-editor.tsx'
        );
        const dialog = readSource('src/components/dialog/dialog.tsx');
        const toolbar = readSource(
            'src/pages/editor-page/canvas/toolbar/toolbar.tsx'
        );
        const importDatabase = readSource(
            'src/dialogs/common/import-database/import-database.tsx'
        );
        const tableDbml = readSource(
            'src/pages/editor-page/side-panel/dbml-section/table-dbml/table-dbml.tsx'
        );

        expect(codeSnippet).toContain('aria-label={copyButtonLabel}');
        expect(codeSnippet).toMatch(/aria-label=\{\s*action\.label\s*\}/);
        expect(codeSnippetEditor).toContain('ariaLabel: editorAriaLabel');

        expect(dialog).toContain('aria-label="Go back"');

        for (const label of [
            'Filter diagram',
            'Show all tables',
            'Zoom out',
            'Reset zoom',
            'Zoom in',
            'Reorder diagram',
            'Undo diagram change',
            'Redo diagram change',
        ]) {
            expect(toolbar).toMatch(
                new RegExp(
                    `aria-label=(?:\\{['"]${label}['"]\\}|${JSON.stringify(label)})`
                )
            );
        }

        expect(importDatabase).toContain('ariaLabel: editorAriaLabel');
        expect(importDatabase).toContain('Smart Query output editor');
        expect(importDatabase).toContain('DBML editor');
        expect(importDatabase).toContain('SQL query editor');

        expect(tableDbml).toContain("ariaLabel: 'DBML editor'");
    });
});
