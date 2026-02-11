
export const GET = () => {
    const siteUrl = import.meta.env.SITE || "https://roborave-nara.org";
    const sitemapUrl = new URL("sitemap.xml", siteUrl).href;

    const robotsTxt = `
User-agent: *
Allow: /

# Block AI crawlers if desired, but for AIO we want them to read our optimized content
# However, we can block specific bad bots if needed.
# For now, we allow everything to maximize visibility.

Sitemap: ${sitemapUrl}
    `.trim();

    return new Response(robotsTxt, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
};
