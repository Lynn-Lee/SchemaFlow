import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) =>
    readFileSync(resolve(process.cwd(), path), 'utf8');

const buildTimeKeyName = 'VITE_OPENAI_API' + '_KEY';
const runtimeKeyName = 'OPENAI_API' + '_KEY';
const aiSdkImport = "import('" + 'ai' + "')";
const openAISdkPackage = '@ai-sdk/' + 'openai';

describe('browser API key exposure guardrails', () => {
    it('does not inject OpenAI API keys into Docker build or runtime config', () => {
        const dockerfile = readProjectFile('Dockerfile');
        const entrypoint = readProjectFile('entrypoint.sh');
        const nginxConfig = readProjectFile('default.conf.template');
        const envModule = readProjectFile('src/lib/env.ts');
        const sqlExport = readProjectFile(
            'src/lib/data/sql-export/export-sql-script.ts'
        );

        expect(dockerfile).not.toContain(buildTimeKeyName);
        expect(entrypoint).not.toContain(runtimeKeyName);
        expect(nginxConfig).not.toContain(runtimeKeyName);
        expect(envModule).not.toContain(runtimeKeyName);
        expect(sqlExport).not.toContain(aiSdkImport);
        expect(sqlExport).not.toContain(openAISdkPackage);
    });

    it('keeps legacy ChartDB cloud-hide env vars as compatibility fallbacks only', () => {
        const dockerfile = readProjectFile('Dockerfile');
        const entrypoint = readProjectFile('entrypoint.sh');
        const nginxConfig = readProjectFile('default.conf.template');
        const envModule = readProjectFile('src/lib/env.ts');

        expect(dockerfile).toContain('ARG VITE_HIDE_CHARTDB_CLOUD');
        expect(entrypoint).toContain('HIDE_CHARTDB_CLOUD');
        expect(nginxConfig).toContain('HIDE_SCHEMAFLOW_CLOUD');
        expect(envModule).toContain('VITE_HIDE_CHARTDB_CLOUD');
    });
});
