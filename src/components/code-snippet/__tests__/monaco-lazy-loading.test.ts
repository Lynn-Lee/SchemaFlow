import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('CodeSnippet Monaco lazy loading', () => {
    it('keeps Monaco runtime setup out of the outer CodeSnippet module', () => {
        const source = fs.readFileSync(
            path.join(
                process.cwd(),
                'src/components/code-snippet/code-snippet.tsx'
            ),
            'utf8'
        );

        expect(source).not.toMatch(
            /^import\s+(?!type\b).*from ['"]@monaco-editor\/react['"]/m
        );
        expect(source).not.toContain("import './config.ts'");
        expect(source).not.toMatch(/from ['"]\.\/themes\/(dark|light)['"]/);
    });

    it('keeps DBML highlight helpers type-only so editor pages do not load Monaco eagerly', () => {
        const source = fs.readFileSync(
            path.join(
                process.cwd(),
                'src/components/code-snippet/dbml/utils.ts'
            ),
            'utf8'
        );

        expect(source).not.toMatch(/^import\s+\*\s+as\s+monaco/m);
        expect(source).not.toMatch(
            /^import\s+(?!type\b).*from ['"]monaco-editor['"]/m
        );
    });

    it('keeps Monaco runtime and workers behind ensureMonaco', () => {
        const source = fs.readFileSync(
            path.join(process.cwd(), 'src/components/code-snippet/config.ts'),
            'utf8'
        );

        expect(source).toContain('ensureMonaco');
        expect(source).not.toMatch(/^import\s+\*\s+as\s+monaco/m);
        expect(source).not.toMatch(
            /^import\s+(?!type\b).*from ['"]monaco-editor['"]/m
        );
        expect(source).not.toMatch(/\?worker['"];?$/m);
    });

    it('initializes Monaco only when the editor component is rendered', () => {
        const source = fs.readFileSync(
            path.join(
                process.cwd(),
                'src/components/code-snippet/code-snippet-editor.tsx'
            ),
            'utf8'
        );

        expect(source).toContain('ensureMonaco');
        expect(source).not.toContain("import './config.ts'");
    });
});
