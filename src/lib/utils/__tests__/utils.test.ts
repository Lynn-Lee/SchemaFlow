import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deepCopy } from '../utils';

describe('utils module purity', () => {
    it('does not depend on browser globals', () => {
        const source = readFileSync(
            join(process.cwd(), 'src/lib/utils/utils.ts'),
            'utf8'
        );

        expect(source).not.toMatch(/\bwindow\./);
        expect(source).not.toMatch(/\blocalStorage\b/);
    });
});

describe('deepCopy', () => {
    it('preserves Date instances in nested objects and arrays', () => {
        const createdAt = new Date('2026-07-05T04:00:00.000Z');
        const updatedAt = new Date('2026-07-05T04:30:00.000Z');

        const diagram = {
            id: 'diagram-1',
            createdAt,
            metadata: {
                updatedAt,
                history: [createdAt],
            },
        };
        const copy = deepCopy(diagram);

        expect(copy).not.toBe(diagram);
        expect(copy.metadata).not.toBe(diagram.metadata);
        expect(copy.metadata.history).not.toBe(diagram.metadata.history);
        expect(copy.createdAt).toBeInstanceOf(Date);
        expect(copy.createdAt).not.toBe(createdAt);
        expect(copy.createdAt.toISOString()).toBe(createdAt.toISOString());
        expect(copy.metadata.updatedAt).toBeInstanceOf(Date);
        expect(copy.metadata.history[0]).toBeInstanceOf(Date);
    });
});
