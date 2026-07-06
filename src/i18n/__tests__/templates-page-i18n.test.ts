import { describe, expect, it } from 'vitest';
import { i18n } from '../i18n';

const expectedTemplatePageKeys = [
    'templates_page.heading_featured',
    'templates_page.heading_tagged',
    'templates_page.heading_all',
    'templates_page.description',
    'templates_page.description_tagged',
    'templates_page.navigation.featured',
    'templates_page.navigation.all_templates',
    'templates_page.navigation.tags',
    'templates_page.breadcrumb',
    'templates_page.detail_subtitle',
    'templates_page.detail_meta_title',
];

describe('templates page i18n', () => {
    it('defines the templates page copy in the fallback locale', () => {
        for (const key of expectedTemplatePageKeys) {
            expect(i18n.exists(key)).toBe(true);
        }
    });

    it('supports tag interpolation in templates page headings', () => {
        expect(
            i18n.t('templates_page.heading_tagged', { tag: 'PostgreSQL' })
        ).toBe('Database schema templates for PostgreSQL');
    });

    it('supports template name interpolation in template detail metadata', () => {
        expect(
            i18n.t('templates_page.detail_meta_title', { name: 'BookStack' })
        ).toBe('Database schema diagram for BookStack | SchemaFlow');
    });
});
