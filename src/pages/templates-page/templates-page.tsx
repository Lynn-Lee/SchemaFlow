import React from 'react';
import SchemaFlowLogo from '@/assets/logo-light.png';
import SchemaFlowDarkLogo from '@/assets/logo-dark.png';
import { useTheme } from '@/hooks/use-theme';
import { LocalConfigProvider } from '@/context/local-config-context/local-config-provider';
import { ThemeProvider } from '@/context/theme-context/theme-provider';
import { Component, Star } from 'lucide-react';
import { ListMenu } from '@/components/list-menu/list-menu';
import { TemplateCard } from './template-card/template-card';
import { useLoaderData, useMatches, useParams } from 'react-router-dom';
import type { TemplateManifest } from '@/templates-data/template-manifest';
import { Spinner } from '@/components/spinner/spinner';
import { TemplatesPageHelmet } from './templates-page-helmet';
import { useTranslation } from 'react-i18next';

export interface TemplatesPageLoaderData {
    templates: TemplateManifest[] | undefined;
    allTags: string[] | undefined;
}

const TemplatesPageComponent: React.FC = () => {
    const { t } = useTranslation();
    const { effectiveTheme } = useTheme();
    const data = useLoaderData() as TemplatesPageLoaderData;

    const { templates, allTags } = data ?? {};
    const { tag: tagParam } = useParams<{ tag: string }>();
    const matches = useMatches();
    const isFeatured = matches.some(
        (match) => match.id === 'templates_featured'
    );
    const isAllTemplates = matches.some((match) => match.id === 'templates');
    const tag = allTags?.find(
        (currentTag) =>
            tagParam?.toLowerCase().replace(/-/g, ' ') ===
            currentTag.toLowerCase()
    );

    return (
        <>
            <TemplatesPageHelmet tag={tag} isFeatured={isFeatured} />
            <section className="flex w-screen flex-col bg-background">
                <nav className="flex h-12 shrink-0 flex-row items-center justify-between border-b px-4">
                    <div className="flex flex-1 justify-start gap-x-3">
                        <div className="flex items-center font-primary">
                            <a
                                href="https://schemaflow.io"
                                className="cursor-pointer"
                                rel="noreferrer"
                            >
                                <img
                                    src={
                                        effectiveTheme === 'light'
                                            ? SchemaFlowLogo
                                            : SchemaFlowDarkLogo
                                    }
                                    alt="schemaFlow"
                                    className="h-4 max-w-fit"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-1 justify-end">
                        <iframe
                            src={`https://ghbtns.com/github-btn.html?user=schemaflow&repo=schemaflow&type=star&size=large&text=false`}
                            width="40"
                            height="30"
                            title="GitHub"
                        ></iframe>
                    </div>
                </nav>
                <div className="flex flex-col p-3 text-center md:px-28 md:text-left">
                    <h1 className="font-primary text-2xl font-bold">
                        {isFeatured
                            ? t('templates_page.heading_featured')
                            : tag
                              ? t('templates_page.heading_tagged', { tag })
                              : t('templates_page.heading_all')}
                    </h1>
                    <h2 className="mt-1 font-primary text-base text-muted-foreground">
                        {t(
                            tag
                                ? 'templates_page.description_tagged'
                                : 'templates_page.description',
                            { tag }
                        )}
                    </h2>
                    {!templates ? (
                        <Spinner
                            size={'large'}
                            className="mt-20 text-pink-600"
                        />
                    ) : (
                        <div className="mt-6 flex w-full flex-col-reverse gap-4 md:flex-row">
                            <div className="relative top-0 flex h-fit w-full shrink-0 flex-col md:sticky md:top-1 md:w-44">
                                <ListMenu
                                    items={[
                                        {
                                            title: t(
                                                'templates_page.navigation.featured'
                                            ),
                                            href: '/templates/featured',
                                            icon: Star,
                                            selected: isFeatured,
                                        },
                                        {
                                            title: t(
                                                'templates_page.navigation.all_templates'
                                            ),
                                            href: '/templates',
                                            icon: Component,
                                            selected: isAllTemplates,
                                        },
                                    ]}
                                />

                                <h4 className="mt-4 text-left text-sm font-semibold">
                                    {t('templates_page.navigation.tags')}
                                </h4>
                                {allTags ? (
                                    <ListMenu
                                        className="mt-1 shrink-0"
                                        items={allTags.map((currentTag) => ({
                                            title: currentTag,
                                            href: `/templates/tags/${currentTag.toLowerCase().replace(/ /g, '-')}`,
                                            selected: tag === currentTag,
                                        }))}
                                    />
                                ) : null}
                            </div>
                            <div className="grid flex-1 grid-flow-row grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
                                {templates.map((template) => (
                                    <TemplateCard
                                        key={`${template.slug}`}
                                        template={template}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export const TemplatesPage: React.FC = () => (
    <LocalConfigProvider>
        <ThemeProvider>
            <TemplatesPageComponent />
        </ThemeProvider>
    </LocalConfigProvider>
);
