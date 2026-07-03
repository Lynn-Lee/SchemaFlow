import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const chartDBContextDir = path.resolve(
    process.cwd(),
    'src/context/chartdb-context'
);

describe('ChartDBProvider structure', () => {
    it('keeps the provider shell small and moves implementation into hooks', () => {
        const providerPath = path.join(
            chartDBContextDir,
            'chartdb-provider.tsx'
        );
        const providerSource = fs.readFileSync(providerPath, 'utf8');
        const providerLines = providerSource.split('\n').length;

        expect(providerLines).toBeLessThanOrEqual(800);
        expect(providerSource).toContain('useChartDBProviderValue');

        const hookPath = path.join(
            chartDBContextDir,
            'use-chartdb-provider-value.tsx'
        );
        expect(fs.existsSync(hookPath)).toBe(true);
    });
});
