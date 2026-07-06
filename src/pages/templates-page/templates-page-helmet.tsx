import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HOST_URL } from '@/lib/env';

export interface TemplatesPageHelmetProps {
    tag?: string;
    isFeatured: boolean;
}

const SCHEMAFLOW_HOST_URL = 'https://github.com/Lynn-Lee/SchemaFlow';
export const TemplatesPageHelmet: React.FC<TemplatesPageHelmetProps> = ({
    tag,
    isFeatured,
}) => {
    const { tag: tagParam } = useParams<{ tag: string }>();

    const formattedUrlTag = useMemo(
        () => tag?.toLowerCase().replace(/ /g, '-'),
        [tag]
    );

    const canonicalUrl = useMemo(() => {
        return SCHEMAFLOW_HOST_URL;
    }, []);

    const needCanonical =
        HOST_URL !== SCHEMAFLOW_HOST_URL ||
        (tag && formattedUrlTag !== tagParam);

    return (
        <Helmet>
            {needCanonical ? (
                <link rel="canonical" href={canonicalUrl} />
            ) : null}

            {tag ? (
                <title>{`${tag} database schema diagram templates | SchemaFlow`}</title>
            ) : isFeatured ? (
                <title>
                    Featured database schema diagram templates | SchemaFlow
                </title>
            ) : (
                <title>Database schema diagram templates | SchemaFlow</title>
            )}

            {tag ? (
                <meta
                    name="description"
                    content={`Discover a collection of real-world database schema diagrams for ${tag}, featuring example applications and popular open-source projects.`}
                />
            ) : (
                <meta
                    name="description"
                    content="Discover a collection of real-world database schema diagrams, featuring example applications and popular open-source projects."
                />
            )}

            {tag ? (
                <meta
                    property="og:title"
                    content={`${tag} database schema diagram templates | SchemaFlow`}
                />
            ) : isFeatured ? (
                <meta
                    property="og:title"
                    content="Featured database schema diagram templates | SchemaFlow"
                />
            ) : (
                <meta
                    property="og:title"
                    content="Database schema diagram templates | SchemaFlow"
                />
            )}

            {tag ? (
                <meta
                    property="og:url"
                    content={`${HOST_URL}/templates/${tagParam}`}
                />
            ) : isFeatured ? (
                <meta
                    property="og:url"
                    content={`${HOST_URL}/templates/featured`}
                />
            ) : (
                <meta property="og:url" content={`${HOST_URL}/templates`} />
            )}

            {tag ? (
                <meta
                    property="og:description"
                    content={`Discover a collection of real-world database schema diagrams for ${tag}, featuring example applications and popular open-source projects.`}
                />
            ) : (
                <meta
                    property="og:description"
                    content="Discover a collection of real-world database schema diagrams, featuring example applications and popular open-source projects."
                />
            )}
            <meta property="og:image" content={`${HOST_URL}/schemaflow.png`} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="SchemaFlow" />

            {tag ? (
                <meta
                    name="twitter:title"
                    content={`${tag} database schema diagram templates | SchemaFlow`}
                />
            ) : (
                <meta
                    name="twitter:title"
                    content="Database schema diagram templates | SchemaFlow"
                />
            )}

            {tag ? (
                <meta
                    name="twitter:description"
                    content={`Discover a collection of real-world database schema diagrams for ${tag}, featuring example applications and popular open-source projects.`}
                />
            ) : (
                <meta
                    name="twitter:description"
                    content="Discover a collection of real-world database schema diagrams, featuring example applications and popular open-source projects."
                />
            )}

            <meta name="twitter:image" content={`${HOST_URL}/schemaflow.png`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@SchemaFlow_io" />
            <meta name="twitter:creator" content="@SchemaFlow_io" />
        </Helmet>
    );
};
