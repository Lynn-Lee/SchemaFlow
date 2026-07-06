import { describe, expect, it } from 'vitest';
import { readBooleanRuntimeConfig } from '../env';

describe('runtime environment rename compatibility', () => {
    it('prefers SchemaFlow env names and falls back to legacy ChartDB names', () => {
        expect(
            readBooleanRuntimeConfig({
                runtimeValue: undefined,
                legacyRuntimeValue: 'true',
                buildTimeValue: undefined,
                legacyBuildTimeValue: undefined,
            })
        ).toBe(true);

        expect(
            readBooleanRuntimeConfig({
                runtimeValue: undefined,
                legacyRuntimeValue: undefined,
                buildTimeValue: undefined,
                legacyBuildTimeValue: 'true',
            })
        ).toBe(true);

        expect(
            readBooleanRuntimeConfig({
                runtimeValue: 'false',
                legacyRuntimeValue: 'true',
                buildTimeValue: undefined,
                legacyBuildTimeValue: undefined,
            })
        ).toBe(false);
    });
});
