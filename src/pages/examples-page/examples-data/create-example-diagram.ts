import { cloneDiagram } from '@/lib/clone';
import type { Diagram } from '@/lib/domain/diagram';
import type { Example } from './examples-data';

export const createExampleDiagram = ({
    example,
    generateId,
    now = new Date(),
}: {
    example: Example;
    generateId?: () => string;
    now?: Date;
}): Diagram => {
    const { diagram } = generateId
        ? cloneDiagram(example.diagram, { generateId })
        : cloneDiagram(example.diagram);

    return {
        ...diagram,
        createdAt: new Date(now),
        updatedAt: new Date(now),
    };
};
