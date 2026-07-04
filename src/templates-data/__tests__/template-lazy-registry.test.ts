import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) =>
    fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

const listTemplateModules = () =>
    fs
        .readdirSync(path.join(process.cwd(), 'src/templates-data/templates'))
        .filter((fileName) => fileName.endsWith('.ts'))
        .sort();

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
        expect(templatesDataSource).not.toContain('loadTemplates');
        expect(templatesDataSource).not.toContain('templateManifests');
    });

    it('registers every template module through a dynamic manifest loader only', () => {
        const manifestSource = readSource(
            'src/templates-data/template-manifest.ts'
        );
        const templateModules = listTemplateModules();

        for (const templateModule of templateModules) {
            const modulePath = `./templates/${templateModule.replace(/\.ts$/, '')}`;

            expect(manifestSource).toContain(`import('${modulePath}')`);
        }

        const sourceFiles = fs
            .readdirSync(path.join(process.cwd(), 'src/templates-data'), {
                recursive: true,
            })
            .filter(
                (fileName): fileName is string =>
                    typeof fileName === 'string' &&
                    fileName.endsWith('.ts') &&
                    !fileName.startsWith('templates/') &&
                    !fileName.startsWith('__tests__/')
            );

        for (const sourceFile of sourceFiles) {
            const source = readSource(`src/templates-data/${sourceFile}`);
            const relativeImport = /from ['"]\.\/templates\//;
            const dynamicImport = /import\(['"]\.\/templates\//;

            if (sourceFile === 'template-manifest.ts') {
                expect(source).not.toMatch(relativeImport);
                continue;
            }

            expect(source).not.toMatch(relativeImport);
            expect(source).not.toMatch(dynamicImport);
        }
    });
});
