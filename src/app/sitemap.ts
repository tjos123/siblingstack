import { posts } from "@/lib/blog";
import { schedules } from "@/lib/schedules";

const BASE = "https://www.siblingstack.com";

export default function sitemap() {
  const today = new Date().toISOString().split("T")[0];

  const blogPosts = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const schedulePages = schedules.map((schedule) => ({
    url: `${BASE}/schedules/${schedule.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const extraSchedulePages = [
    { url: `${BASE}/schedules/newborn-and-2-year-old-routine`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/schedules/3-month-old-and-toddler-nap-schedule`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/schedules/twins-and-toddler-daily-routine`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const toolPages = [
    { url: `${BASE}/tools/calculator`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/tools/nap-sync-calculator`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/tools/bedtime-stagger-calculator`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const staticPages = [
    { url: BASE, lastModified: today, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: today, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/schedules`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/tools`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/irish-twins-guide`, lastModified: today, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified: today, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: today, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return [...staticPages, ...blogPosts, ...schedulePages, ...extraSchedulePages, ...toolPages];
}
