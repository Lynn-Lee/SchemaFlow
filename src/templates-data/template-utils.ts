import type { Diagram } from '@/lib/domain/diagram';
import type { Template } from './templates-data';
import { removeDups } from '@/lib/utils';
import { cloneDiagram } from '@/lib/clone';
import { templateManifests } from './template-manifest';
import type { TemplateManifest } from './template-manifest';

export const convertTemplateToNewDiagram = (template: Template): Diagram => {
    const diagramId = template.diagram.id;

    const clonedDiagram: Diagram = cloneDiagram(template.diagram).diagram;

    return {
        ...template.diagram,
        ...clonedDiagram,
        id: diagramId,
    };
};

export const getTemplatesAndAllTags = async ({
    featured,
    tag,
}: {
    featured?: boolean;
    tag?: string;
} = {}): Promise<{ templates: TemplateManifest[]; tags: string[] }> => {
    const allTags = removeDups(templateManifests.flatMap((t) => t.tags));

    if (featured) {
        return {
            templates: templateManifests.filter((t) => t.featured),
            tags: allTags,
        };
    }

    if (tag) {
        return {
            templates: templateManifests.filter((t) =>
                t.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
            ),
            tags: allTags,
        };
    }

    return { templates: templateManifests, tags: allTags };
};
