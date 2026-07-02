import type { Diagram } from '@/lib/domain/diagram';
import { templateManifests, loadTemplateBySlug } from './template-manifest';

export interface Template {
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    image: string;
    imageDark: string;
    diagram: Diagram;
    tags: string[];
    featured: boolean;
    url?: string;
}

export { loadTemplateBySlug };

export const loadTemplates = async (): Promise<Template[]> =>
    Promise.all(templateManifests.map((template) => template.loadTemplate()));
