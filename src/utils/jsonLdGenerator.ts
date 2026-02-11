import type { Blog, News } from '../lib/microcms';

type SchemaType = 'website' | 'article' | 'product';

interface SiteConfig {
    name: string;
    url: string;
    logo: string;
    description: string;
    sameAs: string[];
}

// Default configuration - should be updated with real data
const SITE_CONFIG: SiteConfig = {
    name: 'RoboRAVE Nara',
    url: 'https://roborave-nara.org', // Placeholder, update in production
    logo: 'https://roborave-nara.org/logo.png', // Placeholder
    description: '奈良で開催される国際ロボット競技大会。創造性とエンジニアリングの祭典。',
    sameAs: [
        'https://twitter.com/roborave_nara',
        // Add other social profiles here
    ]
};

/**
 * Generates the base BreadcrumbList schema
 */
export const generateBreadcrumbSchema = (items: { name: string; item: string }[]) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item,
        })),
    };
};

/**
 * Generates the Organization schema
 */
export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: {
            '@type': 'ImageObject',
            url: SITE_CONFIG.logo,
        },
        sameAs: SITE_CONFIG.sameAs,
    };
};

/**
 * Generates the Article schema for Blog/News posts
 */
export const generateArticleSchema = (post: Blog | News, url: string) => {
    const imageUrl =
        'eyecatch' in post && post.eyecatch?.url
            ? post.eyecatch.url
            : `${SITE_CONFIG.url}/default-ogp.png`;

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        headline: post.title,
        image: [imageUrl],
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.revisedAt || post.updatedAt,
        author: {
            '@type': 'Organization',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_CONFIG.name,
            logo: {
                '@type': 'ImageObject',
                url: SITE_CONFIG.logo,
            },
        },
        description: post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...', // Simple strip tags
    };
};

/**
 * Generates the WebSite schema (for the home page)
 */
export const generateWebsiteSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };
};

/**
 * Generates a Speakable specification for AI assistants
 */
export const generateSpeakableSchema = (cssSelector: string[] = ['#main-content', 'h1']) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'SpeakableSpecification',
        cssSelector: cssSelector
    };
};

/**
 * Main generator function that combines schemas based on type
 */
export const generateJsonLd = (type: SchemaType, data?: Blog | News | any, url: string = SITE_CONFIG.url) => {
    const schemas: any[] = [
        generateOrganizationSchema(),
    ];

    if (type === 'website') {
        schemas.push(generateWebsiteSchema());
    } else if (type === 'article' && data) {
        schemas.push(generateArticleSchema(data, url));
        schemas.push(generateSpeakableSchema(['article h1', 'article p']));
    }

    // Return as string for injection
    return JSON.stringify(schemas);
};
