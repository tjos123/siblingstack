// src/lib/blog.ts
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: "gear" | "schedule" | "wellbeing" | "budget";
  readingTimeMinutes: number;
}

export const posts: PostMeta[] = [
  {
    slug: "double-stroller-close-in-age",
    title: "The Best Double Stroller for Kids Close in Age (Who Aren't Twins)",
    description:
      "Most double stroller guides assume twins. If you've got a newborn and a toddler, the stroller has a harder job. Here's what actually matters for your age gap.",
    publishedAt: "2026-07-01",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "double-stroller-roundup",
    title: "Double Strollers That Actually Work for Two Different-Sized Kids (2026)",
    description:
      "Current top picks for tandem and side-by-side strollers when your two kids are at different developmental stages — not the twin-stroller list.",
    publishedAt: "2026-07-01",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "newborn-toddler-nap-schedule",
    title: "Newborn and Toddler on the Same Nap Schedule: A Realistic Approach",
    description:
      "Perfect sync is unlikely, especially early on. Here's a realistic approach to building enough overlap that you actually get breaks — without fighting either kid's rhythm.",
    publishedAt: "2026-07-01",
    category: "schedule",
    readingTimeMinutes: 5,
  },
  {
    slug: "feeding-schedule-two-different-ages",
    title: "Managing a Feeding Schedule for Two Babies at Different Ages",
    description:
      "Feeding a newborn and a toddler who are on completely different feeding needs without losing your mind — or your break.",
    publishedAt: "2026-07-01",
    category: "schedule",
    readingTimeMinutes: 4,
  },
  {
    slug: "sibling-jealousy-close-age-gap",
    title: "Sibling Jealousy When the Age Gap Is Small",
    description:
      "With a small gap, jealousy often shows up as regression, not aggression. What to expect, and what actually helps.",
    publishedAt: "2026-07-01",
    category: "wellbeing",
    readingTimeMinutes: 5,
  },
  {
    slug: "high-chair-roundup",
    title: "High Chairs That Fit Both Kids — Including One That Seats Them Simultaneously",
    description:
      "The Graco Blossom literally seats two kids at once. Here's the full landscape of high chairs for families with two kids at different stages.",
    publishedAt: "2026-07-01",
    category: "gear",
    readingTimeMinutes: 4,
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 2): PostMeta[] {
  const current = getPost(slug);
  if (!current) return [];
  const sameCategory = posts.filter(
    (p) => p.slug !== slug && p.category === current.category
  );
  const others = posts.filter(
    (p) => p.slug !== slug && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, count);
}

export const CATEGORY_LABEL: Record<PostMeta["category"], string> = {
  gear: "Gear",
  schedule: "Schedule",
  wellbeing: "Wellbeing",
  budget: "Budget",
};

export const CATEGORY_COLOR: Record<PostMeta["category"], string> = {
  gear: "#D98C5F",
  schedule: "#5FA39A",
  wellbeing: "#9A7EC8",
  budget: "#7EC89A",
};
