import React, { useCallback } from 'react';
import SchemaFlowLogo from '@/assets/logo-light.png';
import SchemaFlowDarkLogo from '@/assets/logo-dark.png';
import type { Example } from './examples-data/examples-data';
import { examples } from './examples-data/examples-data';
import { ExampleCard } from './example-card';
import { useTheme } from '@/hooks/use-theme';
import { LocalConfigProvider } from '@/context/local-config-context/local-config-provider';
import { StorageProvider } from '@/context/storage-context/storage-provider';
import { ThemeProvider } from '@/context/theme-context/theme-provider';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '@/hooks/use-storage';
import type { Diagram } from '@/lib/domain/diagram';
import { useTranslation } from 'react-i18next';

const ExamplesPageComponent: React.FC = () => {
    const { effectiveTheme } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addDiagram, deleteDiagram } = useStorage();
    const [loadingExampleId, setLoadingExampleId] = React.useState<string>();
    const utilizeExample = useCallback(
        async ({ example }: { example: Example }) => {
            if (loadingExampleId) {
                return;
            }
            setLoadingExampleId(example.id);
            const { diagram } = example;
            const { id } = diagram;

            await deleteDiagram(id);

            const now = new Date();
            const diagramToAdd: Diagram = {
                ...diagram,
                createdAt: now,
                updatedAt: now,
            };

            await addDiagram({ diagram: diagramToAdd });
            navigate(`/diagrams/${id}`);
        },
        [
            addDiagram,
            navigate,
            deleteDiagram,
            loadingExampleId,
            setLoadingExampleId,
        ]
    );

    return (
        <>
            <Helmet>
                <title>{t('examples_page.meta_title')}</title>
            </Helmet>
            <section className="flex w-screen flex-col bg-background">
                <nav className="flex h-12 flex-row items-center justify-between border-b px-4">
                    <div className="flex flex-1 justify-start gap-x-3">
                        <div className="flex items-center font-primary">
                            <a
                                href="https://github.com/Lynn-Lee/SchemaFlow"
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
                    <div className="group flex flex-1 flex-row items-center justify-center"></div>
                    <div className="hidden flex-1 justify-end sm:flex"></div>
                </nav>
                <div className="flex flex-col px-3 pt-3 text-center md:px-28 md:text-left">
                    <h1 className="font-primary text-2xl font-bold">
                        {t('examples_page.heading')}
                    </h1>
                    <h2 className="mt-1 font-primary text-base text-muted-foreground">
                        {t('examples_page.description')}
                    </h2>
                    <h2 className="mt-1 text-base font-semibold">
                        {t('examples_page.prompt')}
                    </h2>
                    <div className="mt-6 grid grid-flow-row grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {examples.map((example) => (
                            <ExampleCard
                                key={example.id}
                                example={example}
                                utilizeExample={() =>
                                    utilizeExample({ example })
                                }
                                loading={loadingExampleId === example.id}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export const ExamplesPage: React.FC = () => (
    <LocalConfigProvider>
        <StorageProvider>
            <ThemeProvider>
                <ExamplesPageComponent />
            </ThemeProvider>
        </StorageProvider>
    </LocalConfigProvider>
);
