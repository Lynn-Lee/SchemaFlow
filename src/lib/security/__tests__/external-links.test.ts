import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) =>
    readFileSync(resolve(process.cwd(), path), 'utf8');

describe('SchemaFlow external links', () => {
    it('does not publish unverified SchemaFlow domains or organization links', () => {
        const files = [
            'src/pages/editor-page/editor-sidebar/editor-sidebar.tsx',
            'src/pages/editor-page/top-navbar/menu/menu.tsx',
            'src/dialogs/star-us-dialog/star-us-dialog.tsx',
            'src/helmet/helmet-data.tsx',
            'src/pages/templates-page/templates-page.tsx',
            'src/pages/examples-page/examples-page.tsx',
            'src/pages/template-page/template-page.tsx',
            'src/dialogs/export-sql-dialog/export-sql-dialog.tsx',
            'index.html',
            'public/robots.txt',
            'public/sitemap.xml',
        ];
        const publishedUi = files.map(readProjectFile).join('\n');

        expect(publishedUi).not.toContain('https://schemaflow.io');
        expect(publishedUi).not.toContain('https://docs.schemaflow.io');
        expect(publishedUi).not.toContain(
            'https://github.com/schemaflow/schemaflow'
        );
        expect(publishedUi).not.toContain('support@schemaflow.io');
        expect(publishedUi).not.toContain(
            'https://github.com/Lynn-Lee/SchemaFlow/tree/main/docs'
        );
        expect(publishedUi).not.toContain('https://discord.gg/');
        expect(publishedUi).not.toContain('https://x.com/intent/follow');
        expect(publishedUi).toContain('https://github.com/Lynn-Lee/SchemaFlow');
    });
});
