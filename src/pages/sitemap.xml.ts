import { getBlogs, getNews } from "../lib/microcms";

export async function GET() {
    const siteUrl = import.meta.env.SITE || "https://roborave-nara.org";

    // Fetch dynamic content
    const blogResponse = await getBlogs({ limit: 1000, fields: ["id", "publishedAt", "updatedAt"] });
    const newsResponse = await getNews({ limit: 1000, fields: ["id", "publishedAt", "updatedAt"] });

    // Define static pages
    const staticPages = [
        { url: "/", changefreq: "daily", priority: 1.0 },
        { url: "/competitions", changefreq: "weekly", priority: 0.8 },
        { url: "/blog", changefreq: "daily", priority: 0.8 },
        { url: "/news", changefreq: "daily", priority: 0.8 },
        { url: "/contact", changefreq: "monthly", priority: 0.5 },
    ];

    // Helper to format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return new Date().toISOString();
        return new Date(dateString).toISOString();
    };

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
            .map(
                (page) => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
            )
            .join("")}
  ${blogResponse.contents
            .map(
                (post) => `
  <url>
    <loc>${siteUrl}/blog/${post.id}</loc>
    <lastmod>${formatDate(post.updatedAt || post.publishedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
            )
            .join("")}
  ${newsResponse.contents
            .map(
                (item) => `
  <url>
    <loc>${siteUrl}/news/${item.id}</loc>
    <lastmod>${formatDate(item.updatedAt || item.publishedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
            )
            .join("")}
</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
