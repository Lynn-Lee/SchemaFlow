import { describe, expect, it } from 'vitest';
import { examples } from '../examples-data/examples-data';
import { createExampleDiagram } from '../examples-data/create-example-diagram';

describe('createExampleDiagram', () => {
    it('clones a sample diagram with fresh ids before storing it', () => {
        let nextId = 0;
        const generatedIds = [
            'new-diagram',
            ...Array.from({ length: 200 }, (_, index) => `new-id-${index}`),
        ];
        const originalDiagram = examples[1].diagram;

        const diagram = createExampleDiagram({
            example: examples[1],
            now: new Date('2026-07-06T00:00:00Z'),
            generateId: () => generatedIds[nextId++],
        });

        expect(diagram.id).toBe('new-diagram');
        expect(diagram.id).not.toBe(originalDiagram.id);
        expect(diagram.tables?.[0]?.id).not.toBe(
            originalDiagram.tables?.[0]?.id
        );
        expect(diagram.createdAt).toEqual(new Date('2026-07-06T00:00:00Z'));
        expect(diagram.updatedAt).toEqual(new Date('2026-07-06T00:00:00Z'));
    });
});
