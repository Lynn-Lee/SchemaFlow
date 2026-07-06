import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const radixIconPackage = `@radix-ui/${'react-icons'}`;

const collectSourceFiles = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap((entry) => {
        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return collectSourceFiles(entryPath);
        }

        if (!/\.(ts|tsx)$/.test(entry.name)) {
            return [];
        }

        return [entryPath];
    });
};

describe('icon library contract', () => {
    it('uses lucide-react instead of the legacy Radix icon package', () => {
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')
        ) as {
            dependencies?: Record<string, string>;
        };
        const sourceFiles = collectSourceFiles(srcDir);
        const radixIconImports = sourceFiles.filter((file) =>
            new RegExp(`from\\s+['"]${radixIconPackage}['"]`).test(
                fs.readFileSync(file, 'utf8')
            )
        );

        expect(packageJson.dependencies).not.toHaveProperty(radixIconPackage);
        expect(radixIconImports).toEqual([]);
    });
});
