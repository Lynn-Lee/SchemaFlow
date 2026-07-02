import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) =>
    fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('template lazy registry', () => {
    it('keeps the templates list on metadata-only manifest data', () => {
        const templateUtilsSource = readSource(
            'src/templates-data/template-utils.ts'
        );
        const routerSource = readSource('src/router.tsx');

        expect(templateUtilsSource).toContain('template-manifest');
        expect(templateUtilsSource).not.toContain(
            "import('@/templates-data/templates-data')"
        );
        expect(routerSource).not.toContain(
            "import('./templates-data/templates-data')"
        );
    });

    it('keeps full template modules behind dynamic per-template loaders', () => {
        const manifestSource = readSource(
            'src/templates-data/template-manifest.ts'
        );
        const templatesDataSource = readSource(
            'src/templates-data/templates-data.ts'
        );

        expect(manifestSource).not.toMatch(
            /^import\s+(?!type\b).*from ['"].\/templates\//m
        );
        expect(manifestSource).toMatch(/loadTemplate:\s*\(\)\s*=>\s*import\(/);
        expect(templatesDataSource).not.toMatch(
            /^import\s+(?!type\b).*from ['"].\/templates\//m
        );
    });
});
