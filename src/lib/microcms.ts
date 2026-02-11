
import { createClient, type MicroCMSQueries, type MicroCMSImage, type MicroCMSDate } from "microcms-js-sdk";

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

let client: ReturnType<typeof createClient> | null = null;

if (serviceDomain && apiKey) {
  client = createClient({
    serviceDomain,
    apiKey,
  });
} else {
  console.warn("MicroCMS credentials (MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY) are missing. Running in mock mode.");
}

// Type Definitions
export type Blog = {
  id: string;
  title: string;
  content: string;
  eyecatch?: MicroCMSImage;
  category: Category;
  tags?: Tag[];
} & MicroCMSDate;

export type News = {
  id: string;
  title: string;
  content: string;
  category: Category;
  publishedAt: string; // Sometimes news have manual published date
} & MicroCMSDate;

export type Category = {
  id: string;
  name: string;
} & MicroCMSDate;

export type Tag = {
  id: string;
  name: string;
} & MicroCMSDate;

// API Fetch Functions
export const getBlogs = async (queries?: MicroCMSQueries) => {
  if (!client) {
    return { contents: [], totalCount: 0, offset: 0, limit: 10 };
  }
  return await client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  if (!client) {
    const now = new Date().toISOString();
    return {
      id: "mock-blog",
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      revisedAt: now,
      title: "Mock Blog Post",
      content: "<p>MicroCMS is not configured. This is a mock post.</p>",
      category: { id: "mock-cat", name: "Mock", createdAt: now, updatedAt: now, publishedAt: now, revisedAt: now }
    } as Blog;
  }
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

export const getNews = async (queries?: MicroCMSQueries) => {
  if (!client) {
    return { contents: [], totalCount: 0, offset: 0, limit: 10 };
  }
  return await client.getList<News>({ endpoint: "news", queries });
};

export const getNewsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  if (!client) {
    const now = new Date().toISOString();
    return {
      id: "mock-news",
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      revisedAt: now,
      title: "Mock News Article",
      content: "<p>MicroCMS is not configured. This is a mock news article.</p>",
      category: { id: "mock-cat", name: "Mock", createdAt: now, updatedAt: now, publishedAt: now, revisedAt: now }
    } as News;
  }
  return await client.getListDetail<News>({
    endpoint: "news",
    contentId,
    queries,
  });
};
