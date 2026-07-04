import type { Diagram } from '@/lib/domain/diagram';
export { loadTemplateBySlug } from './template-manifest';

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
