// src/lib/blog.ts
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: "gear" | "schedule" | "wellbeing" | "budget";
  readingTimeMinutes: number;
}

export type GearCategory =
  | "strollers"
  | "car-seats"
  | "feeding"
  | "carrying"
  | "nursery-setup"
  | "dont-buy-twice";

export const GEAR_CATEGORY: Record<string, GearCategory> = {
  "double-stroller-close-in-age": "strollers",
  "double-stroller-roundup": "strollers",
  "tandem-vs-side-by-side-stroller-2-under-2": "strollers",
  "car-seat-two-different-sizes": "car-seats",
  "convertible-car-seats-2026": "car-seats",
  "high-chair-roundup": "feeding",
  "baby-carriers-2026": "carrying",
  "crib-and-bassinet-setup-two-babies-one-room": "nursery-setup",
  "baby-gear-dont-buy-twice": "dont-buy-twice",
  "hand-me-down-sizing-cheat-sheet": "dont-buy-twice",
  "hand-me-down-clothes-timeline-close-in-age": "dont-buy-twice",
};

export const GEAR_CATEGORY_LABEL: Record<GearCategory, string> = {
  strollers: "Strollers",
  "car-seats": "Car Seats",
  feeding: "Feeding",
  carrying: "Carrying",
  "nursery-setup": "Nursery & Sleep Setup",
  "dont-buy-twice": "What Not to Buy Twice",
};

export const GEAR_GROUP_ORDER: GearCategory[] = [
  "strollers",
  "car-seats",
  "feeding",
  "carrying",
  "nursery-setup",
  "dont-buy-twice",
];

const GEAR_ADJACENCY: Record<GearCategory, GearCategory[]> = {
  strollers: ["carrying", "car-seats", "dont-buy-twice"],
  "car-seats": ["strollers", "carrying", "dont-buy-twice"],
  feeding: ["dont-buy-twice", "nursery-setup"],
  carrying: ["dont-buy-twice", "strollers", "car-seats"],
  "nursery-setup": ["dont-buy-twice", "feeding"],
  "dont-buy-twice": ["nursery-setup", "feeding", "strollers"],
};

export function isGearPost(slug: string): boolean {
  return slug in GEAR_CATEGORY;
}

export function gearCategoryOf(slug: string): GearCategory | undefined {
  return GEAR_CATEGORY[slug];
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
    category: "gear",
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
  {
    slug: "postpartum-recovery-pregnant-again",
    title: "Postpartum Recovery When You're Pregnant Again Right Away",
    description:
      "Being pregnant again before you've recovered from the last pregnancy is a specific, isolating experience. What's different physically and emotionally — and where to get answers specific to you.",
    publishedAt: "2026-09-01",
    category: "wellbeing",
    readingTimeMinutes: 5,
  },
  {
    slug: "quarantine-sick-toddler-newborn-small-apartment",
    title: "How to Quarantine a Sick Toddler From a Newborn in a Small Apartment",
    description:
      "You can't send a sick toddler to a guest room you don't have. Here's a realistic, low-space way to limit exposure to a newborn when your whole family lives in 900 square feet.",
    publishedAt: "2026-09-05",
    category: "wellbeing",
    readingTimeMinutes: 7,
  },
  {
    slug: "flying-alone-toddler-infant-packing-boarding-plan",
    title: "Flying Alone With a Toddler and an Infant: A Realistic Packing and Boarding Plan",
    description:
      "No second adult, one lap infant, one walking toddler, and a boarding gate. Here's the packing list, paperwork, and boarding order that actually gets you down the jet bridge in one piece.",
    publishedAt: "2026-09-05",
    category: "wellbeing",
    readingTimeMinutes: 8,
  },
];

const POST_TOPICS: Record<string, string[]> = {
  "double-stroller-close-in-age": ["double stroller", "stroller", "age gap"],
  "double-stroller-roundup": ["double stroller", "stroller"],
  "newborn-toddler-nap-schedule": ["naps", "sleep schedule", "newborn"],
  "feeding-schedule-two-different-ages": ["feeding", "mealtimes", "newborn"],
  "sibling-jealousy-close-age-gap": ["jealousy", "emotions", "age gap"],
  "high-chair-roundup": ["high chair", "feeding", "mealtimes"],
  "car-seat-two-different-sizes": ["car seat", "car safety"],
  "convertible-car-seats-2026": ["car seat", "car safety"],
  "baby-carriers-2026": ["carrier", "babywearing"],
  "baby-gear-dont-buy-twice": ["buy-twice", "hand-me-downs"],
  "hand-me-down-sizing-cheat-sheet": ["hand-me-downs", "clothes", "sizing"],
  "two-kids-in-diapers-realistic-budget": ["diapers", "budget", "monthly cost"],
  "crib-and-bassinet-setup-two-babies-one-room": ["sleep space", "room setup", "safe sleep"],
  "one-on-one-time-each-kid-close-in-age": ["one-on-one time", "attention", "age gap"],
  "milestones-10-month-age-gap": ["milestones", "development", "age gap"],
  "hand-me-down-clothes-timeline-close-in-age": ["hand-me-downs", "clothes", "sizing"],
  "daycare-cost-two-kids-under-two": ["daycare", "budget", "monthly cost"],
  "solo-bedtime-2-under-2-alone": ["bedtime", "night routine", "solo parenting"],
  "toddler-one-nap-transition-newborn": ["nap transition", "naps", "sleep schedule"],
  "stop-toddler-waking-sleeping-baby": ["sleep", "bedtime", "behavior"],
  "tandem-vs-side-by-side-stroller-2-under-2": ["stroller", "double stroller", "naps"],
  "feeding-newborn-entertaining-toddler-activities": ["feeding", "toddler activities", "newborn"],
  "nursing-while-pregnant-second-baby": ["nursing", "feeding", "pregnancy"],
  "postpartum-recovery-pregnant-again": ["postpartum", "pregnancy", "recovery"],
  "quarantine-sick-toddler-newborn-small-apartment": ["illness", "home setup", "newborn"],
  "flying-alone-toddler-infant-packing-boarding-plan": ["travel", "packing", "flying"],
};

export function getPost(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(
  slug: string,
  count = 2,
  scope: "all" | "gear" = "all"
): PostMeta[] {
  const current = getPost(slug);
  if (!current) return [];

  const candidates = posts.filter((p) => {
    if (p.slug === slug) return false;
    if (scope === "gear") return isGearPost(p.slug);
    return true;
  });

  const currentTopics = POST_TOPICS[current.slug] ?? [];
  const scored = candidates
    .map((p) => {
      const sharedTopics = (POST_TOPICS[p.slug] ?? []).filter((t) =>
        currentTopics.includes(t)
      ).length;
      const score = sharedTopics * 2 + (p.category === current.category ? 1 : 0);
      return { post: p, score, sharedTopics };
    })
    .filter((s) => s.sharedTopics >= 1)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.publishedAt.localeCompare(a.post.publishedAt);
    });

  const picked: PostMeta[] = scored.map((s) => s.post);
  if (scope === "gear") {
    const pickedSlugs = new Set(picked.map((p) => p.slug));
    const byRecency = (list: PostMeta[]) =>
      [...list].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
      );
    const currentGroup = gearCategoryOf(slug);

    const addGroup = (group: GearCategory) => {
      if (picked.length >= count) return;
      for (const p of byRecency(
        candidates.filter((c) => gearCategoryOf(c.slug) === group)
      )) {
        if (picked.length >= count) break;
        if (pickedSlugs.has(p.slug)) continue;
        picked.push(p);
        pickedSlugs.add(p.slug);
      }
    };

    if (currentGroup) addGroup(currentGroup);
    for (const group of GEAR_ADJACENCY[currentGroup ?? "dont-buy-twice"]) {
      if (picked.length >= count) break;
      addGroup(group);
    }
    for (const p of byRecency(candidates)) {
      if (picked.length >= count) break;
      if (pickedSlugs.has(p.slug)) continue;
      picked.push(p);
      pickedSlugs.add(p.slug);
    }
  }
  return picked.slice(0, count);
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
