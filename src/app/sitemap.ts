import { posts } from "@/lib/blog";

const BASE = "https://siblingstack.com";

export default function sitemap() {
  const today = new Date().toISOString().split("T")[0];

  const blogPosts = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: BASE, lastModified: today, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: today, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/privacy`, lastModified: today, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: today, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return [...staticPages, ...blogPosts];
}
