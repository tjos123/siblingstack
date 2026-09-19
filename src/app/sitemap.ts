import { execSync } from "child_process";
import { posts, isGearPost } from "@/lib/blog";
import type { PostMeta } from "@/lib/blog";
import { schedules } from "@/lib/schedules";

const BASE = "https://www.siblingstack.com";

/**
 * lastmod policy
 * --------------
 * MDX posts (blog + gear): lastmod = the file's last git commit date, so it only
 * changes when that file's content actually changes. Files with no commit yet
 * (untracked/first-published) fall back to publishedAt.
 *
 * Everything else (schedule/tool/static pages) lives in hardcoded data or component
 * files, so lastmod comes from MANUAL_LAST_MODIFIED below. Update those dates by hand
 * ONLY when the page's content genuinely changes — never for deploys, refactors,
 * formatting-only commits, or unrelated touches.
 */

const gitCache = new Map<string, string | null>();

function gitLastModified(mdxRelativePath: string): string | null {
  if (gitCache.has(mdxRelativePath)) return gitCache.get(mdxRelativePath)!;
  let date: string | null = null;
  try {
    const out = execSync(`git log -1 --format=%aI -- ${mdxRelativePath}`, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
      timeout: 10_000,
    }).trim();
    if (out) date = out.slice(0, 10); // YYYY-MM-DD
  } catch {
    // No git boundary in the build env, or the file is uncommitted -> fall back.
  }
  gitCache.set(mdxRelativePath, date);
  return date;
}

function postLastModified(post: PostMeta): string {
  const dir = isGearPost(post.slug) ? "gear" : "blog";
  const gitDate = gitLastModified(`src/content/${dir}/${post.slug}.mdx`);
  return gitDate && gitDate >= post.publishedAt ? gitDate : post.publishedAt;
}

// Manually maintained per-route last-edited dates (see policy comment above).
const MANUAL_LAST_MODIFIED: Record<string, string> = {
  "/": "2026-09-10",
  "/blog": "2026-09-09",
  "/gear": "2026-09-09",
  "/schedules": "2026-09-08",
  "/tools": "2026-09-08",
  "/irish-twins-guide": "2026-09-19",
  "/privacy": "2026-09-02",
  "/terms": "2026-09-02",

  "/schedules/2-under-2-schedule": "2026-09-08",
  "/schedules/two-toddlers-sync": "2026-09-08",
  "/schedules/dueling-naps": "2026-09-08",
  "/schedules/quiet-time-sync": "2026-09-08",
  "/schedules/3-month-old-and-toddler-nap-schedule": "2026-09-08",
  "/schedules/twins-and-toddler-daily-routine": "2026-09-08",
  "/schedules/bedtime-stagger-guide": "2026-09-09",
  "/schedules/newborn-and-preschooler": "2026-09-09",

  "/tools/wake-window-calculator": "2026-09-08",
  "/tools/nap-sync-calculator": "2026-09-10",
  "/tools/bedtime-stagger-calculator": "2026-09-08",
  "/tools/feeding-offset-calculator": "2026-09-09",
  "/tools/nap-transition-quiz": "2026-09-08",
};

function manualRow(
  path: string,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number
) {
  const lastModified = MANUAL_LAST_MODIFIED[path];
  if (!lastModified) {
    throw new Error(`sitemap: missing MANUAL_LAST_MODIFIED for "${path}"`);
  }
  return {
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap() {
  const blogPosts = posts
    .filter((post) => !isGearPost(post.slug))
    .map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const gearPosts = posts
    .filter((post) => isGearPost(post.slug))
    .map((post) => ({
      url: `${BASE}/gear/${post.slug}`,
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const schedulePages = schedules.map((schedule) =>
    manualRow(`/schedules/${schedule.slug}`, "monthly", 0.7)
  );

  const extraSchedulePages = [
    manualRow("/schedules/3-month-old-and-toddler-nap-schedule", "monthly", 0.7),
    manualRow("/schedules/twins-and-toddler-daily-routine", "monthly", 0.7),
    manualRow("/schedules/bedtime-stagger-guide", "monthly", 0.7),
    manualRow("/schedules/newborn-and-preschooler", "monthly", 0.7),
  ];

  const toolPages = [
    manualRow("/tools/wake-window-calculator", "monthly", 0.8),
    manualRow("/tools/nap-sync-calculator", "monthly", 0.8),
    manualRow("/tools/bedtime-stagger-calculator", "monthly", 0.8),
    manualRow("/tools/feeding-offset-calculator", "monthly", 0.8),
    manualRow("/tools/nap-transition-quiz", "monthly", 0.8),
  ];

  const staticPages = [
    manualRow("/", "weekly", 1.0),
    manualRow("/blog", "weekly", 0.9),
    manualRow("/gear", "weekly", 0.9),
    manualRow("/schedules", "monthly", 0.9),
    manualRow("/tools", "monthly", 0.9),
    manualRow("/irish-twins-guide", "monthly", 0.8),
    manualRow("/privacy", "yearly", 0.3),
    manualRow("/terms", "yearly", 0.3),
  ];

  return [
    ...staticPages,
    ...gearPosts,
    ...blogPosts,
    ...schedulePages,
    ...extraSchedulePages,
    ...toolPages,
  ];
}