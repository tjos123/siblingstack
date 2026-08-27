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
    title: "Best Double Stroller for Kids Close in Age (Who Aren't Twins)",
    description:
      "Most double stroller guides assume twins. If you've got a newborn and a toddler, the stroller has a harder job. Here's what actually matters for your age gap.",
    publishedAt: "2026-06-23",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "double-stroller-roundup",
    title: "Double Strollers That Work for Two Different-Sized Kids (2026)",
    description:
      "Current top picks for tandem and side-by-side strollers when your two kids are at different developmental stages — not the twin-stroller list.",
    publishedAt: "2026-06-23",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "newborn-toddler-nap-schedule",
    title: "Newborn and Toddler on the Same Nap Schedule: A Realistic Approach",
    description:
      "Perfect sync is unlikely, especially early on. Here's a realistic approach to building enough overlap that you actually get breaks — without fighting either kid's rhythm.",
    publishedAt: "2026-06-23",
    category: "schedule",
    readingTimeMinutes: 5,
  },
  {
    slug: "feeding-schedule-two-different-ages",
    title: "Managing a Feeding Schedule for Two Babies at Different Ages",
    description:
      "Feeding a newborn and a toddler who are on completely different feeding needs without losing your mind — or your break.",
    publishedAt: "2026-06-23",
    category: "schedule",
    readingTimeMinutes: 4,
  },
  {
    slug: "sibling-jealousy-close-age-gap",
    title: "Sibling Jealousy When the Age Gap Is Small",
    description:
      "With a small gap, jealousy often shows up as regression, not aggression. What to expect, and what actually helps.",
    publishedAt: "2026-06-23",
    category: "wellbeing",
    readingTimeMinutes: 5,
  },
  {
    slug: "high-chair-roundup",
    title: "High Chairs That Fit Both Kids — Including a Dual-Seat Model",
    description:
      "The Graco Blossom literally seats two kids at once. Here's the full landscape of high chairs for families with two kids at different stages.",
    publishedAt: "2026-06-23",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "car-seat-two-different-sizes",
    title: "A Car Seat That Fits Two Very Differently Sized Kids",
    description:
      "Why a single convertible seat rarely works for both kids — and how to choose two seats that make daily life easier instead of harder.",
    publishedAt: "2026-06-30",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "convertible-car-seats-2026",
    title: "Convertible Car Seats Worth Buying Twice (2026)",
    description:
      "Top-performing convertible car seats for families with two kids close in age — the Maxi-Cosi Pria, Chicco Fit360, Britax Poplar, and Graco SlimFit3 LX compared.",
    publishedAt: "2026-07-03",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "baby-carriers-2026",
    title: "Baby Carriers That Actually Span Newborn to Toddler (2026)",
    description:
      "Carriers that don't need a separate infant insert — the Ergobaby Embrace, Omni 360, Baby Tula Free-to-Grow, Infantino Flip, and Contours Journey compared for two-kid families.",
    publishedAt: "2026-07-10",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "baby-gear-dont-buy-twice",
    title: "Baby Gear You Don't Need to Buy Twice (Even With Two Kids Close in Age)",
    description:
      "Not every baby item needs a duplicate just because you have two kids close in age. Here's what you genuinely need two of, what you can stagger, and where people overspend.",
    publishedAt: "2026-07-17",
    category: "gear",
    readingTimeMinutes: 3,
  },
  {
    slug: "hand-me-down-sizing-cheat-sheet",
    title: "What Fits Both Kids: A Sizing and Hand-Me-Down Cheat Sheet",
    description:
      "When two kids are close in age, hand-me-downs sometimes work and sometimes cost you more in frustration than they save in money. Here's a practical breakdown by category.",
    publishedAt: "2026-07-17",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "two-kids-in-diapers-realistic-budget",
    title: "Two Kids in Diapers at Once: A Realistic Budget",
    description:
      "Newborn plus toddler means 12–18 diaper changes a day. Here's the actual budget math, where the real savings are, and what doesn't actually save money.",
    publishedAt: "2026-08-02",
    category: "budget",
    readingTimeMinutes: 3,
  },
  {
    slug: "crib-and-bassinet-setup-two-babies-one-room",
    title: "Crib and Bassinet Setup for Two Babies in One Room",
    description:
      "Room-sharing toddlers and newborns can genuinely interfere with each other's sleep. Here's a layout and transition plan that works — starting with safe sleep non-negotiables.",
    publishedAt: "2026-08-08",
    category: "schedule",
    readingTimeMinutes: 4,
  },
  {
    slug: "one-on-one-time-each-kid-close-in-age",
    title: "Getting One-on-One Time With Each Kid When They're Close in Age",
    description:
      "With a small age gap, one-on-one time doesn't happen naturally — it has to be built deliberately. What actually works in practice, and what to let go of.",
    publishedAt: "2026-08-08",
    category: "wellbeing",
    readingTimeMinutes: 4,
  },
  {
    slug: "milestones-10-month-age-gap",
    title: "What Milestones Actually Look Like With a 10-Month Age Gap",
    description:
      "A 10-month gap makes milestones feel like they're constantly resizing — huge at first, then briefly small, then big again. Here's what that timeline actually looks like.",
    publishedAt: "2026-08-15",
    category: "wellbeing",
    readingTimeMinutes: 5,
  },
  {
    slug: "hand-me-down-clothes-timeline-close-in-age",
    title: "The Hand-Me-Down Clothes Timeline When Siblings Are Close in Age",
    description:
      "With a small age gap, the standard box-it-and-forget-it approach to hand-me-down clothes doesn't work. Here's a system that does.",
    publishedAt: "2026-08-15",
    category: "gear",
    readingTimeMinutes: 5,
  },
  {
    slug: "daycare-cost-two-kids-under-two",
    title: "Daycare Cost for Two Kids Under Two: A Realistic Picture",
    description:
      "Two kids in daycare simultaneously is one of the few areas where the math genuinely is closer to double. Here's where the real savings are — and where they aren't.",
    publishedAt: "2026-08-15",
    category: "budget",
    readingTimeMinutes: 5,
  },
  {
    slug: "solo-bedtime-2-under-2-alone",
    title: "How to Manage Bedtime for 2 Under 2 Alone When Your Partner Works Late",
    description:
      "Solo bedtime with two kids under two doesn't have to be chaos. A realistic, step-by-step system for handling toddler + baby bedtime alone, night after night.",
    publishedAt: "2026-08-15",
    category: "wellbeing",
    readingTimeMinutes: 6,
  },
  {
    slug: "toddler-one-nap-transition-newborn",
    title: "How to Transition a Toddler to 1 Nap When You Have a Newborn",
    description:
      "Dropping to one nap is hard enough on its own. Doing it while a newborn is home adds a layer of chaos. A realistic, gradual plan to get through it.",
    publishedAt: "2026-08-15",
    category: "wellbeing",
    readingTimeMinutes: 5,
  },
  {
    slug: "stop-toddler-waking-sleeping-baby",
    title: "How to Stop a Toddler From Waking a Sleeping Baby",
    description:
      "Toddler stomping into the nursery mid-nap? Here's why it happens and a practical set of household rules, room setups, and scripts that actually reduce it.",
    publishedAt: "2026-08-15",
    category: "wellbeing",
    readingTimeMinutes: 5,
  },
  {
    slug: "tandem-vs-side-by-side-stroller-2-under-2",
    title: "2 Under 2 Stroller Setup: Tandem vs Side-by-Side for Naps on the Go",
    description:
      "Choosing between a tandem and side-by-side double stroller for two under two? Here's how each affects on-the-go naps, storage, doorways, and daily logistics.",
    publishedAt: "2026-08-15",
    category: "gear",
    readingTimeMinutes: 6,
  },
  {
    slug: "feeding-newborn-entertaining-toddler-activities",
    title: "Feeding a Newborn While Entertaining a Toddler: 10 Low-Prep Activities",
    description:
      "Stuck on the couch feeding a newborn with a toddler needing entertainment? These 10 low-prep activities keep toddlers busy for 15–30 minutes, hands-free.",
    publishedAt: "2026-08-15",
    category: "wellbeing",
    readingTimeMinutes: 6,
  },
  {
    slug: "nursing-while-pregnant-second-baby",
    title: "When Your Second Baby Is Coming Before You've Weaned the First",
    description:
      "Pregnant while still nursing? Continuing, weaning, or letting it resolve are all reasonable paths — here's what medically and practically matters, and what's genuinely your call.",
    publishedAt: "2026-08-27",
    category: "wellbeing",
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
