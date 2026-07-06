import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { RouteErrorBoundary } from './components/route-error-boundary/route-error-boundary';
import type { TemplatePageLoaderData } from './pages/template-page/template-page';
import type { TemplatesPageLoaderData } from './pages/templates-page/templates-page';
import { getTemplatesAndAllTags } from './templates-data/template-utils';

const routeErrorElement = <RouteErrorBoundary />;

export const routes: RouteObject[] = [
    ...['', 'diagrams/:diagramId'].map((path) => ({
        path,
        errorElement: routeErrorElement,
        async lazy() {
            const { EditorPage } =
                await import('./pages/editor-page/editor-page');

            return {
                element: <EditorPage />,
            };
        },
    })),
    {
        path: 'examples',
        errorElement: routeErrorElement,
        async lazy() {
            const { ExamplesPage } =
                await import('./pages/examples-page/examples-page');
            return {
                element: <ExamplesPage />,
            };
        },
    },
    {
        id: 'templates',
        path: 'templates',
        errorElement: routeErrorElement,
        async lazy() {
            const { TemplatesPage } =
                await import('./pages/templates-page/templates-page');
            return {
                element: <TemplatesPage />,
            };
        },

        loader: async (): Promise<TemplatesPageLoaderData> => {
            const { tags, templates } = await getTemplatesAndAllTags();

            return {
                allTags: tags,
                templates,
            };
        },
    },
    {
        id: 'templates_featured',
        path: 'templates/featured',
        errorElement: routeErrorElement,
        async lazy() {
            const { TemplatesPage } =
                await import('./pages/templates-page/templates-page');
            return {
                element: <TemplatesPage />,
            };
        },
        loader: async (): Promise<TemplatesPageLoaderData> => {
            const { tags, templates } = await getTemplatesAndAllTags({
                featured: true,
            });

            return {
                allTags: tags,
                templates,
            };
        },
    },
    {
        id: 'templates_tags',
        path: 'templates/tags/:tag',
        errorElement: routeErrorElement,
        async lazy() {
            const { TemplatesPage } =
                await import('./pages/templates-page/templates-page');
            return {
                element: <TemplatesPage />,
            };
        },
        loader: async ({ params }): Promise<TemplatesPageLoaderData> => {
            const { tags, templates } = await getTemplatesAndAllTags({
                tag: params.tag?.replace(/-/g, ' '),
            });

            return {
                allTags: tags,
                templates,
            };
        },
    },
    {
        id: 'templates_templateSlug',
        path: 'templates/:templateSlug',
        errorElement: routeErrorElement,
        async lazy() {
            const { TemplatePage } =
                await import('./pages/template-page/template-page');
            return {
                element: <TemplatePage />,
            };
        },
        loader: async ({ params }): Promise<TemplatePageLoaderData> => {
            return {
                template:
                    await import('./templates-data/template-manifest').then(
                        ({ loadTemplateBySlug }) =>
                            loadTemplateBySlug(params.templateSlug)
                    ),
            };
        },
    },
    {
        id: 'templates_load',
        path: 'templates/clone/:templateSlug',
        errorElement: routeErrorElement,
        async lazy() {
            const { CloneTemplatePage } =
                await import('./pages/clone-template-page/clone-template-page');
            return {
                element: <CloneTemplatePage />,
            };
        },
        loader: async ({ params }) => {
            return {
                template:
                    await import('./templates-data/template-manifest').then(
                        ({ loadTemplateBySlug }) =>
                            loadTemplateBySlug(params.templateSlug)
                    ),
            };
        },
    },
    {
        path: '*',
        errorElement: routeErrorElement,
        async lazy() {
            const { NotFoundPage } =
                await import('./pages/not-found-page/not-found-page');
            return {
                element: <NotFoundPage />,
            };
        },
    },
];

export const router = createBrowserRouter(routes);
