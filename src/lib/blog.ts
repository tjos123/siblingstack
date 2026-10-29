// src/lib/blog.ts
export interface PostMeta {
  slug: string;
  title: string;
  /** Optional SEO/meta title used for <title> and og:title when it differs from the on-page H1. */
  metaTitle?: string;
  description: string;
  /** Optional target keywords for the page metadata. */
  keywords?: string[];
  publishedAt: string;
  category:
    | "gear"
    | "schedule"
    | "wellbeing"
    | "budget"
    | "safety"
    | "bonding"
    | "sleep"
    | "discipline"
    | "errands"
    | "health";
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

export const FEATURED_SLUG = "newborn-toddler-nap-schedule";

export function gearCategoryOf(slug: string): GearCategory | undefined {
  return GEAR_CATEGORY[slug];
}

export const posts: PostMeta[] = [
  {
    slug: "double-stroller-close-in-age",
    title: "Best Double Stroller for Kids Close in Age (Not Twins)",
    description:
      "Most double stroller guides assume twins. If you've got a newborn and a toddler, the stroller has a harder job. Here's what actually matters for your age gap.",
    publishedAt: "2026-06-23",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "double-stroller-roundup",
    title: "Double Strollers for Two Different-Sized Kids (2026)",
    description:
      "Current top picks for tandem and side-by-side strollers when your two kids are at different developmental stages — not the twin-stroller list.",
    publishedAt: "2026-06-23",
    category: "gear",
    readingTimeMinutes: 4,
  },
  {
    slug: "newborn-toddler-nap-schedule",
    title: "Newborn and Toddler Nap Schedule: A Realistic Approach",
    description:
      "Perfect sync is unlikely, especially early on. Here's a realistic approach to building enough overlap that you actually get breaks — without fighting either kid's rhythm.",
    publishedAt: "2026-06-23",
    category: "schedule",
    readingTimeMinutes: 5,
  },
  {
    slug: "feeding-schedule-two-different-ages",
    title: "A Feeding Schedule for Two Babies at Different Ages",
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
    title: "High Chairs That Fit Both Kids & a Dual-Seat Model",
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
    title: "Baby Gear You Don't Need to Buy Twice (Close in Age)",
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
    title: "One-on-One Time With Each Kid When They're Close in Age",
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
    title: "The Hand-Me-Down Clothes Timeline for Siblings Close in Age",
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
    title: "Bedtime for 2 Under 2 Alone When Your Partner Works Late",
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
    title: "2 Under 2 Stroller: Tandem vs Side-by-Side for Naps",
    description:
      "Choosing between a tandem and side-by-side double stroller for two under two? Here's how each affects on-the-go naps, storage, doorways, and daily logistics.",
    publishedAt: "2026-08-15",
    category: "gear",
    readingTimeMinutes: 6,
  },
  {
    slug: "feeding-newborn-entertaining-toddler-activities",
    title: "Feeding a Newborn & Entertaining a Toddler: 10 Activities",
    description:
      "Stuck on the couch feeding a newborn with a toddler needing entertainment? These 10 low-prep activities keep toddlers busy for 15–30 minutes, hands-free.",
    publishedAt: "2026-08-15",
    category: "wellbeing",
    readingTimeMinutes: 6,
  },
  {
    slug: "nursing-while-pregnant-second-baby",
    title: "Nursing While Pregnant When Baby #2 Is on the Way",
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
    title: "Quarantine a Sick Toddler From a Newborn (Small Apartment)",
    description:
      "You can't send a sick toddler to a guest room you don't have. Here's a realistic, low-space way to limit exposure to a newborn when your whole family lives in 900 square feet.",
    publishedAt: "2026-09-05",
    category: "wellbeing",
    readingTimeMinutes: 7,
  },
  {
    slug: "flying-alone-toddler-infant-packing-boarding-plan",
    title: "Flying Alone With Toddler & Infant: Packing & Boarding Plan",
    description:
      "No second adult, one lap infant, one walking toddler, and a boarding gate. Here's the packing list, paperwork, and boarding order that actually gets you down the jet bridge in one piece.",
    publishedAt: "2026-09-05",
    category: "wellbeing",
    readingTimeMinutes: 8,
  },
  {
    slug: "starting-solids-second-baby-while-nursing-toddler",
    title: "Starting Solids for Kid #2 While Still Nursing the First",
    description:
      "Starting solids with baby number two is nothing like the first time — because this time you're also still nursing a toddler. Here's how the two feeding tracks actually fit together, safely.",
    publishedAt: "2026-09-09",
    category: "wellbeing",
    readingTimeMinutes: 8,
  },
  {
    slug: "returning-to-work-newborn-toddler-still-in-diapers",
    title: "Returning to Work With a Newborn & Toddler Still in Diapers",
    description:
      "Going back to work with an infant and a toddler in diapers at the same time means two drop-offs, two bags, and a morning that has to work every single day. Here's how to build one that actually holds — plus the legal, childcare, and backup-plan pieces most guides skip.",
    publishedAt: "2026-09-10",
    category: "wellbeing",
    readingTimeMinutes: 8,
  },
  {
    slug: "lovevery-hub-complete-guide",
    title: "Lovevery for Two Under Two: The Complete Guide",
    description:
      "Twenty-three guides, built around one real question — is a Lovevery subscription worth it for a household with two kids close in age — answered from every angle: the core financial math, gift-giving, registry planning, and the family situations that don't fit the standard two-under-two mold.",
    publishedAt: "2026-09-19",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-vs-amazon-diy-montessori-12-month-experiment",
    title: "Lovevery vs. Amazon DIY Montessori: 12-Month Cost Experiment",
    description:
      "Across a full 12 months, Lovevery recovers more of its cost through resale and takes up less shelf and floor space than a self-assembled Amazon collection — but the DIY route still wins on raw flexibility. Run against real resale listings, not a marketing number.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-two-under-two-box-by-box-audit",
    title: "Lovevery Two Under Two: Box-by-Box Audit & Pass-Down Value",
    description:
      "A box-by-box audit of Lovevery's 0–24 month lineup: which kits pass down cleanly to sibling #2 and which barely pass down at all. Budget from the real 45–65% recovery number, not the 'half the cost' headline.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "lovevery-portal-skip-pause-calibration-blueprint",
    title: "Lovevery Portal: Skip, Pause & Calibrate Shipments",
    description:
      "The click-by-click walkthrough of Lovevery's skip, delay, and cancel-and-reactivate tools — plus calibrated subscription timelines for 10-, 14-, and 18-month age gaps, and when a prepaid plan works against you.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 14,
  },
  {
    slug: "beyond-lovevery-monti-kids-hoppi-box-kiwico-panda-crates",
    title: "Beyond Lovevery: Monti Kids, Hoppi Box & KiwiCo Panda Crate",
    description:
      "Monti Kids costs nearly four times more, KiwiCo Panda Crate sits closest to Lovevery on price and cadence with Seattle Children's research backing, and Hoppi Box stays the budget option. The encyclopedic head-to-head for sibling playrooms.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "clean-sanitize-used-lovevery-toys-sibling-hygiene-guide",
    title: "Clean and Sanitize Used Lovevery Toys Without Ruining Wood",
    description:
      "Lovevery's own guidance says not to sanitize its products — so what do you actually do with a secondhand kit before it reaches a second child? The full material-by-material cleaning checklist plus a sibling handoff protocol.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "lovevery-babbler-slide-seek-ball-run-vs-amazon",
    title: "Lovevery Babbler vs. Amazon: The Slide & Seek Ball Run Cost",
    description:
      "The Slide & Seek Ball Run retails around $80 standalone; Amazon knockoffs run $15–25. The exact cost comparison — and the durability, safety-design, and kit-math reasons the cheap version isn't the obvious win it looks like.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-for-twins-two-full-subscriptions-or-one-kit",
    title: "Lovevery for Twins: Two Full Subscriptions or One Kit?",
    description:
      "Twins break the sibling pass-down math at the root — they need a stage at the exact same time. Three real financial models for twin households, with the honest cost and friction tradeoffs of each.",
    publishedAt: "2026-09-15",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "lovevery-play-gym-two-under-two-one-gym-two-babies",
    title: "The Lovevery Play Gym for Two Under Two: One Gym, Two Babies",
    description:
      "One Play Gym costs $150 new and is a genuine two-baby question: true twins may need tight spacing, supervision, or a second unit, while staggered siblings get one of the cleanest pass-down cases in the entire series. The real dimensions, weight limit, and math.",
    publishedAt: "2026-09-17",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-negative-reviews-two-under-two-household",
    title: "What Lovevery's Negative Reviews Mean for Two Under Two",
    description:
      "Lovevery's recurring complaints — overpriced, kids engage with 1-2 items, toys outgrown fast — change meaning once a second child is in the picture. An honest reframing that separates what sibling math fixes from what it doesn't.",
    publishedAt: "2026-09-17",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-vs-kiwico-switch-at-two-younger-sibling",
    title: "When Your Older Kid Turns 2: Lovevery vs KiwiCo for Siblings",
    description:
      "Lovevery now runs through age four, so switching at two is a format judgment, not a catalog gap: Lovevery stays independent open-ended play while KiwiCo's Koala Crate becomes parent-guided monthly craft projects. For two under two, the real cost is parental bandwidth.",
    publishedAt: "2026-09-17",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-preschool-lineup-past-age-two-second-kid",
    title: "Lovevery Past Age 2: Is the Preschool Lineup Worth It?",
    description:
      "Lovevery's 2-4 preschool boxes are well-made and well-reviewed, but the pass-down math this cluster is built on mostly stops applying there — the younger sibling is still a baby when the older child outgrows them. The honest opportunity-cost question for continuing past two.",
    publishedAt: "2026-09-17",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-premature-babies-nicu-twins-adjusted-age",
    title: "Lovevery for Preemies & NICU Twins: Adjusted-Age Box Timing",
    description: "Pediatric guidance calls for tracking adjusted age for a defined window after birth. For NICU twins specifically, twins can leave the NICU with meaningfully different developmental starting points.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "lovevery-storage-rotation-room-by-room-guide",
    title: "Lovevery Storage & Rotation for Two Kids Under Two",
    description: "The three-tier storage framework introduced in our box-by-box durability audit works, but it's not a room plan on its own. This guide takes that framework and puts it somewhere specific.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-items-worth-buying-individually",
    title: "Lovevery Items Worth Buying Individually: The 6 Best",
    description: "Not every Lovevery favorite is available the same way. This guide covers six of the most frequently sought-after individual items across the Lovevery lineup.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-grandparents-gift-guide-two-grandkids",
    title: "Lovevery for Grandkids Close in Age: A Grandparents' Guide",
    description: "The hardest question, especially with two grandkids close in age, isn't logistics — it's whether to buy two separate gifts or put your budget toward one that works with how their parents are sharing.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 9,
  },
  {
    slug: "lovevery-full-time-daycare-worth-it",
    title: "Is a Lovevery Subscription Worth It for Full-Time Daycare?",
    description: "It depends less on daycare itself and more on two things: how much developmental material your specific daycare already provides, and how much of the subscription's real value depends on a parent being present.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 11,
  },
  {
    slug: "lovevery-two-households-coparenting-logistics",
    title: "Lovevery Across Two Households: A Co-Parenting Guide",
    description: "A two-household family has to actively choose one of a few real approaches: a single subscription with a fixed \"home base\", manual address updates, two separate subscriptions, or a hybrid.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-baby-registry-two-kids-close-in-age",
    title: "Lovevery on Your Baby Registry for Two Kids Close in Age",
    description: "Yes, with a specific strategic twist most registry advice won't tell you — registering generously for your first child's Play Kits is functionally a two-child investment.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 9,
  },
  {
    slug: "lovevery-pre-loved-resale-listing-guide",
    title: "Lovevery Pre-Loved: Buying & Selling Used Kits",
    description: "How to actually prep and list your items to maximize recovery value, and what to look for when buying to ensure you're getting what you expect.",
    publishedAt: "2026-09-18",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-blended-families-merging-collections",
    title: "Blended Families & Lovevery: Merging Two Kids' Collections",
    description: "When two families combine, you're not starting the sibling-math journey from scratch — you're merging two already-existing collections. Here's how to inventory and consolidate them.",
    publishedAt: "2026-09-19",
    category: "budget",
    readingTimeMinutes: 11,
  },
  {
    slug: "lovevery-end-of-journey-collection-exit-guide",
    title: "Done Having Kids? A Lovevery Collection Exit Guide",
    description: "A full exit is a single, larger event than rolling resale. Deciding what to do with an entire multi-year collection depends on your certainty, patience, and time budget.",
    publishedAt: "2026-09-19",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-international-buyers-guide",
    title: "Lovevery for International Families: Ordering Guide",
    description: "Lovevery operates four regional storefronts. For international buyers, the official Pre-Loved marketplace is unavailable, which significantly impacts the resale math.",
    publishedAt: "2026-09-19",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "lovevery-adoptive-foster-families-guide",
    title: "Lovevery for Adoptive & Foster Families: Start-Date Guide",
    description: "When a child's birthdate is uncertain, use observed skills to match their Lovevery stage. Here is a practical checklist and approach for stage-matching.",
    publishedAt: "2026-09-19",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "little-spoon-two-under-two-master-review",
    title: "Little Spoon for Two Under Two: A Cost-Per-Bite Review",
    description:
      "A realistic combined Little Spoon bill for an infant on Babyblends and a toddler on Plates lands between $280 and $520 a month. The full cost-per-bite ledger against homemade — including the time-arbitrage math most budget comparisons skip.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 15,
  },
  {
    slug: "once-upon-a-farm-sibling-milestones",
    title: "Once Upon a Farm Stages for Overlapping Sibling Milestones",
    description:
      "Running a 6-month-old just starting solids and an 18-month-old with opinions is a logistics problem, not a feeding one. How to map Once Upon a Farm's stage-based lineup to two overlapping sibling milestones — plus the two-under-two combined budget.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 14,
  },
  {
    slug: "tiny-organics-vs-nurture-life",
    title: "Tiny Organics vs. Nurture Life for Close-Age Siblings",
    description:
      "Tiny Organics and Nurture Life aren't really competing for the same job — BLW-first purée-to-finger-food for the younger sibling, protein-forward toddler-and-big-kid meals for the older. The full audit for close-age siblings.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 15,
  },
  {
    slug: "true-cost-of-toddler-food-strikes",
    title: "The True Cost of Toddler Food Strikes (Supermarket Waste)",
    description:
      "The comparison every meal-subscription review runs ignores the largest hidden cost in a toddler household: food served, rejected, and thrown away. The mathematical case for portion-controlled kids' meals against supermarket waste.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "freeze-little-spoon-plates",
    title: "Can You Freeze Little Spoon Toddler Plates? Reheating Guide",
    description:
      "Yes, Little Spoon Plates can be frozen — but not every dish holds up equally. The food science of starch retrogradation, syneresis, and broken emulsions, plus the reheating adjustments that recover most of the quality gap.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 15,
  },
  {
    slug: "baby-toddler-meal-subscriptions-hub",
    title: "Baby & Toddler Meal Kit Delivery for Close-Age Siblings",
    description:
      "There is no single best baby and toddler meal-delivery service for a close-age-sibling household. The complete 19-part cluster: the financial, logistical, and health questions two-under-two households actually face across five brands.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "baby-food-digestive-comfort",
    title: "Baby Food for Digestive Comfort: Fruit & Fiber Options",
    description:
      "The two most useful dietary tools for supporting comfortable digestion during the solids transition — fiber-rich fruits and the sorbitol-driven effect of prune-based products — mapped to real products for each sibling's stage.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 14,
  },
  {
    slug: "feeding-twins-subscription",
    title: "Feeding Twins on a Baby Food Subscription: One Box or Two?",
    description:
      "Twins aren't priced as two unrelated customers, and they also aren't a staggered-age problem. The multiples discount, the doubled-volume pricing math, and why frozen-volume capacity changes the answer.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "allergy-mismatched-siblings",
    title: "One Sibling Has a Food Allergy, the Other Doesn't",
    description:
      "The biggest allergen risk in a close-age-sibling household usually isn't the allergic child's own meal — it's cross-contact from the sibling's. What each company actually discloses, and the kitchen-logistics fixes.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 15,
  },
  {
    slug: "daycare-coordination",
    title: "Meal Subscriptions When Only One Sibling Is in Daycare",
    description:
      "When one child is in daycare and the other is home, the combined subscription budget changes meaningfully. Recalculating order volume, billing models, and what travels well in a lunchbox.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 16,
  },
  {
    slug: "cerebelly-vs-little-spoon",
    title: "Cerebelly vs. Little Spoon for Close-Age Siblings",
    description:
      "The honest answer for most close-age-sibling households is both, for different roles. Cerebelly's shelf-stable format solves the cold-storage crunch; Little Spoon's staged ecosystem covers primary daily meals at a lower per-unit cost.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "delivery-zone-comparison",
    title: "Is Your Zip Covered? Baby & Toddler Meal Delivery Zones",
    description:
      "Alaska, Hawaii, and territory residents: four of five companies in this cluster explicitly don't ship to you. The confirmed shipping footprints, why cold-chain drives the exclusion, and the retail-available fallbacks.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "switching-subscriptions-playbook",
    title: "Switching Baby Food Subscriptions Without a Supply Gap",
    description:
      "The real risk in switching isn't choosing the wrong brand — it's your old cutoff overlapping your new lead time with nothing arriving. Confirmed cutoffs, the stuck-shipment risk, and a five-step overlap-week timeline.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 15,
  },
  {
    slug: "adult-meal-kit-combination",
    title: "Combining a Kids' Meal Subscription with an Adult Meal Kit",
    description:
      "Feeding yourself matters too. What adult meal kits actually cost on top of a kids' subscription, which format fits your kitchen-time reality, and how to stagger two delivery schedules.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 14,
  },
  {
    slug: "ultra-processed-food-debate",
    title: "Is Subscription Baby Food Ultra-Processed? The NOVA Debate",
    description:
      "A February 2026 study found 71% of U.S. baby food is ultra-processed under NOVA — but the category is more varied than the headline. The real science, the genuine debate, and a two-step check for any label.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 17,
  },
  {
    slug: "packaging-bpa-phthalates-microplastics",
    title: "Are Baby Food Trays & Pouches Safe? What Testing Found",
    description:
      "Consumer Reports found detectable phthalates and microplastics in Little Spoon and Cerebelly samples. What was actually tested, what BPA-free does and doesn't tell you, and practical steps that reduce exposure.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 15,
  },
  {
    slug: "baby-led-weaning-starter-guide",
    title: "Baby-Led Weaning First Foods: A Beginner's Starter Guide",
    description:
      "BLW safety starts with food shape, size, and texture, not method. The gagging-vs-choking distinction, what the randomized trials actually found, hazard foods, and the under-discussed iron gap.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 13,
  },
  {
    slug: "cheapest-subscriptions-ranked",
    title: "The Cheapest Baby & Toddler Meal Subscriptions, Ranked",
    description:
      "Lowest advertised per-unit price and lowest actual monthly bill are different rankings, because minimum order sizes and shipping change the real entry cost. Both dimensions, ranked honestly.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "label-certification-glossary",
    title: "Baby Food Label Terms Decoded: What Certifications Mean",
    description:
      "USDA Organic, Non-GMO Project Verified, and Clean Label Project each audit a narrow, different dimension — and none of them measure whether a product is ultra-processed. What each seal actually checks, and what it doesn't.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 13,
  },
  {
    slug: "review-sentiment-aggregation",
    title: "What Real Parents Say: 5 Baby Food Subscription Brands",
    description:
      "Nurture Life and Little Spoon consistently lead hands-on comparisons; Cerebelly draws praise and consistent critique. Platform ratings, editorial reviews, and the cross-brand themes that matter most.",
    publishedAt: "2026-09-22",
    category: "budget",
    readingTimeMinutes: 14,
  },
  {
    slug: "diaper-delivery-subscriptions-hub",
    title:
      "Diaper Delivery Subscriptions for Small-Age-Gap Households",
    description:
      "There is no single best diaper subscription for a household with two kids in diapers at once. The complete 15-part cluster: mixing sizes inside one bundle, the real volume math, brand showdowns, potty-training transitions, and PFAS test results.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 10,
  },
  {
    slug: "diaper-bundle-portal-mixing-sizes-blueprint",
    title: "Diaper Bundle Dashboard: How to Mix Sizes for Two Under Two",
    description: "How to mix diaper sizes within one Hello Bello or Honest Company subscription bundle for two children.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 18,
  },
  {
    slug: "hello-bello-vs-dyper-showdown",
    title: "Hello Bello vs. Dyper for Multi-Diapering Households",
    description: "A full cost-per-diaper, materials, and shipping comparison between Hello Bello and Dyper subscriptions.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 19,
  },
  {
    slug: "kudos-cotton-premium-economics",
    title: "Is a Kudos Cotton Subscription Worth It for Two Kids?",
    description: "Whether Kudos' 100% cotton-lined diaper subscription is worth its price premium for a two-child household.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 18,
  },
  {
    slug: "diaper-to-pull-up-transition-subscription",
    title: "Subscription Strategy for the Diaper-to-Pull-Up Transition",
    description: "How to manage a diaper subscription through the potty-training transition without overpaying or under-ordering.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "heavy-wetter-overnight-sibling-protocol",
    title: "Heavy-Wetter Toddler? Hello Bello Overnight vs. Dyper Bamboo",
    description: "Comparing Hello Bello's dedicated overnight diaper against Dyper's standard diaper for households managing two concurrent heavy overnight wetters.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 17,
  },
  {
    slug: "hello-bello-cancellation-exit-strategy",
    title: "How to Cancel a Hello Bello Subscription Safely",
    description: "A risk-mitigation walkthrough for cancelling a Hello Bello diaper subscription without an unexpected extra charge.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "kudos-2026-manufacturing-investigation",
    title: "Kudos Diapers in 2026: What Actually Changed",
    description: "An evidence-based investigation into reported 2026 manufacturing and quality changes to Kudos diapers, separating confirmed facts from unverified claims.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 19,
  },
  {
    slug: "eco-subscription-vs-bulk-buying-cost-reality",
    title: "Eco-Diaper Subscription vs. Costco & Amazon: The Real Math",
    description: "A real cost comparison between eco-friendly diaper subscriptions and mainstream bulk-buying, including the 2024-2025 Kirkland manufacturing controversy.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "diaper-subscriptions-twins-multiples",
    title: "Diaper Subscriptions for Twins and Multiples: Size Math",
    description: "A dedicated guide to same-size, doubled-volume diaper subscription needs for twins and multiples, including a fifth brand, Abby & Finn, not covered elsewhere in this cluster.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "preemie-nicu-diaper-sizing-gap",
    title: "Preemie & NICU Diaper Sizing: Why No Subscription Fits",
    description: "An honest look at why no major eco-subscription diaper brand currently serves preemie or micro-preemie sizing, and what to do during that gap.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "honest-vs-kudos-comparison",
    title: "Honest Company vs. Kudos: The Direct Comparison (2026)",
    description: "A direct, evidence-based comparison of Honest Company and Kudos diapers, including how Kudos's reported 2026 redesign may have narrowed its previously-verified performance edge.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "coterie-vs-kudos-comparison",
    title: "Coterie vs. Kudos: The Premium Diaper Showdown",
    description: "A direct comparison of Coterie and Kudos diapers revealing that Coterie's confirmed ingredient list contains plastic at the skin-contact layer, unlike Kudos's cotton topsheet.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "diaper-pfas-lab-testing-review",
    title: "Which Diaper Subscriptions Contain PFAS? Lab Test Results",
    description: "An independent EPA-certified lab testing review finding Kudos diapers showed PFAS indications despite OEKO-TEX certification, while Hello Bello, Honest, Dyper, Abby & Finn, and Coterie tested clean.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 14,
  },
  {
    slug: "baby-wipes-pfas-testing-review",
    title: "Are Diaper Subscription Wipes Safe? Consumer Reports 2026",
    description: "Consumer Reports' June 2026 PFAS testing of 18 baby wipe brands, including Hello Bello, Honest, Dyper, and Coterie, all clean, with Kudos and Abby & Finn not included in the study.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 12,
  },
  {
    slug: "dyper-vs-kudos-comparison",
    title: "Dyper vs. Kudos: When a Ranking and Lab Testing Disagree",
    description: "A comparison of Dyper and Kudos showing a materials-category ranking favors Kudos's cotton topsheet while independent PFAS testing favors Dyper's clean result.",
    publishedAt: "2026-09-25",
    category: "budget",
    readingTimeMinutes: 11,
  },
  {
    slug: "babyproofing-toddler-toys-choking-hazard-baby",
    title: "Babyproofing When a Toddler's Toys Are a Choking Hazard for the Baby",
    description:
      "Standard babyproofing assumes the house is baby-only. When a toddler with small-parts toys shares the floor with a crawling infant, the real hazard is the toy bin, not the outlets. Here's how to manage it, and what to do if the worst happens.",
    publishedAt: "2026-09-30",
    category: "safety",
    readingTimeMinutes: 7,
  },
  {
    slug: "involve-toddler-newborn-care-without-resentment",
    title: "Age-Appropriate Ways to Involve a Toddler in Newborn Care (Without Resentment)",
    description:
      "How to involve a toddler in newborn care in ways that build connection instead of resentment — and how to recognize normal jealousy when it shows up anyway.",
    publishedAt: "2026-10-02",
    category: "bonding",
    readingTimeMinutes: 7,
  },
  {
    slug: "huckleberry-multi-child-sleep-tracker-review",
    title:
      "Can You Track Two Sleep Schedules in Huckleberry Premium? An Honest Multi-Child UI/UX and Algorithm Review",
    description:
      "A technical, feature-specific review of how Huckleberry's SweetSpot algorithm and multi-child profile system handle an infant and a toddler on one account, with real subscription and sleep-consultant cost comparisons.",
    publishedAt: "2026-09-15",
    category: "schedule",
    readingTimeMinutes: 18,
  },
  {
    slug: "yoto-vs-tonies-screen-free-audio-comparison",
    title:
      "Yoto Club vs. Tonies Subscription: The Real Cost-Per-Minute Screen-Free Babysitter Guide for Sibling Playrooms",
    description:
      "A full cost, durability, and independent-play comparison of Yoto Club and Tonies' subscription programs for households with an infant and a toddler.",
    publishedAt: "2026-09-17",
    category: "budget",
    readingTimeMinutes: 16,
  },
  {
    slug: "blueberry-pediatrics-cost-review",
    title:
      "Is a Blueberry Pediatrics Membership Worth the Monthly Cost If Both Kids Get Sick at Once? An Exact Urgent Care Cost Matrix",
    description:
      "A financial and logistical breakdown of Blueberry Pediatrics' flat-rate telehealth membership versus per-incident urgent care and ER costs for a multi-child household.",
    publishedAt: "2026-09-19",
    category: "budget",
    readingTimeMinutes: 17,
  },
  {
    slug: "shared-audio-library-infant-toddler",
    title: "Bridging the Audio Gap: Curating a Shared Subscription Library for an Infant and a Toddler",
    description:
      "How to curate a single screen-free audio subscription library that serves both an infant's sensory needs and a toddler's vocabulary development, plus household audio-safety guidance.",
    publishedAt: "2026-09-22",
    category: "wellbeing",
    readingTimeMinutes: 17,
  },
  {
    slug: "yoto-two-bedroom-bluetooth-range-test",
    title: "Can You Use One Yoto Player for Two Separate Bedrooms? The Bluetooth & App Range Test",
    description:
      "A technical breakdown of Yoto's Bluetooth and Wi-Fi architecture, real range limitations, and the most cost-effective hardware setups for two children in separate rooms.",
    publishedAt: "2026-09-24",
    category: "gear",
    readingTimeMinutes: 17,
  },
  {
    slug: "blueberry-hsa-fsa-eligibility",
    title:
      "Blueberry Pediatrics HSA/FSA Eligibility: How to Pay for Your Telehealth Membership With Pre-Tax Dollars",
    description:
      "A factual walkthrough of the 2026 Direct Primary Care tax law change, how it applies to Blueberry Pediatrics, and the exact documentation process for HSA/FSA reimbursement.",
    publishedAt: "2026-09-26",
    category: "budget",
    readingTimeMinutes: 18,
  },
  {
    slug: "hatch-vs-yoto-tonies-infant-room",
    title: "Hatch Rest vs. Yoto and Tonies for the Infant's Room: The Real Decibel Safety and Cost Comparison",
    description:
      "A safety-first comparison of Hatch Rest, Yoto, and Tonies for infant ambient sound, grounded in AAP decibel guidance and independent lab testing, plus a full first-year cost breakdown.",
    publishedAt: "2026-09-29",
    category: "safety",
    readingTimeMinutes: 15,
  },
  {
    slug: "baby-monitors-two-rooms",
    title:
      "Video and Audio Baby Monitors for Two Kids in Separate Rooms: The Real Multi-Camera, Cost, and Privacy Comparison",
    description:
      "A comparison of dedicated non-Wi-Fi and smart Wi-Fi baby monitors for two-room households, covering true multi-camera support, documented security history, Owlet's real FDA regulatory timeline, and full first-year costs.",
    publishedAt: "2026-10-01",
    category: "gear",
    readingTimeMinutes: 15,
  },
  {
    slug: "total-household-cost-hub",
    title: "The Real Monthly Cost of Running a Digital-First Household With Two Kids Under Two: A Full Budget Breakdown",
    description:
      "A hub page aggregating verified pricing across sleep tracking, screen-free audio, telehealth, ambient sound, and video monitoring into three real household budget scenarios, with correct HSA/FSA tax treatment applied only where it genuinely qualifies.",
    publishedAt: "2026-10-03",
    category: "budget",
    readingTimeMinutes: 11,
  },
  {
    slug: "blueberry-vs-summer-health",
    title:
      "Blueberry Pediatrics vs. Summer Health: Flat-Rate Membership vs. Pay-Per-Visit — The Real Math for a Two-Kid Household",
    description:
      "A cost, modality, and tax-treatment comparison of Blueberry Pediatrics' flat-fee household membership against Summer Health's pay-per-visit pediatric telehealth model, with real break-even math for two-child households.",
    publishedAt: "2026-10-06",
    category: "budget",
    readingTimeMinutes: 13,
  },
  {
    slug: "caregiver-access-permission-models",
    title:
      "Caregiver Access and Permission Models: What Actually Happens When You Add a Nanny or Grandparent to Your Baby App",
    description:
      "A comparison of caregiver-sharing permission models across baby-specific trackers and general household apps, covering access revocation, per-caregiver identity, and a real naming-collision warning across the Cradle/Cradlo/Cradly/Cradlet app family.",
    publishedAt: "2026-10-08",
    category: "wellbeing",
    readingTimeMinutes: 11,
  },
  {
    slug: "postpartum-mental-health-telehealth",
    title:
      "Postpartum Mental Health Support: Free Helplines, Text-Based Platforms, and Clinical Telehealth Compared",
    description:
      "A cost and access-structure comparison across four tiers of postpartum mental health support, from free national helplines to licensed clinical telehealth and higher-acuity programs, with real crisis resources included.",
    publishedAt: "2026-10-10",
    category: "wellbeing",
    readingTimeMinutes: 12,
  },
  {
    slug: "taking-cara-babies-vs-huckleberry",
    title:
      "Taking Cara Babies vs. Huckleberry for a Two-Kid Household: Course vs. App, and Why You Might Need to Buy the Course Twice",
    description:
      "A structural and cost comparison of Taking Cara Babies' stage-specific one-time courses against Huckleberry's all-ages subscription, with real math for a household needing sleep help across two developmental stages at once.",
    publishedAt: "2026-10-13",
    category: "schedule",
    readingTimeMinutes: 10,
  },
  {
    slug: "daycare-apps-two-platforms",
    title: "When Your Two Kids Are on Different Daycare Apps: Brightwheel, Lillio, and Tadpoles for Parents Juggling Two Programs",
    description:
      "A guide to daycare and preschool communication app fragmentation for small-age-gap households, covering Brightwheel's real cross-program sibling unification and practical strategies for when two kids land on two different platforms entirely.",
    publishedAt: "2026-10-15",
    category: "wellbeing",
    readingTimeMinutes: 9,
  },
  {
    slug: "virtual-lactation-consultants",
    title:
      "Virtual Lactation Consultants: The One Telehealth Category That's Usually Free, and How to Actually Use It",
    description:
      "A coverage and platform comparison for telehealth lactation consultations, grounded in the ACA's no-cost-share preventive services mandate, with real visit-limit caveats and a dedicated look at tandem-feeding support.",
    publishedAt: "2026-10-17",
    category: "wellbeing",
    readingTimeMinutes: 9,
  },
  {
    slug: "toddler-bed-transition-timing-new-baby-needs-crib",
    title: "Toddler Bed Transition Timing When a New Baby Needs the Crib",
    description:
      "Moving a toddler out of the crib because the new baby needs it is the one reason not to do it. Here's how to time the transition, read real readiness signs, and set up the new bed safely — so it doesn't read as a demotion.",
    publishedAt: "2026-10-08",
    category: "sleep",
    readingTimeMinutes: 8,
  },
  {
    slug: "discipline-consistency-two-kids-different-stages",
    title:
      "Discipline Consistency With Two Kids at Very Different Developmental Stages",
    description:
      "The same rule can't be enforced the same way for a toddler and an infant who isn't even mobile yet. Here's how to keep discipline consistent in spirit, respond safely when a toddler gets physical with the baby, and stay aligned with a co-parent — without pretending the kids are at the same stage.",
    publishedAt: "2026-10-19",
    category: "discipline",
    readingTimeMinutes: 8,
  },
  {
    slug: "grocery-shopping-alone-toddler-infant",
    title: "Grocery Shopping Alone With a Toddler and an Infant: A Realistic System",
    description:
      "One cart, one infant carrier, one toddler who wants to walk. Here's a grocery run system that actually works solo — the cart setup, the safety rules that matter, and the timing that keeps it from falling apart at checkout.",
    publishedAt: "2026-10-26",
    category: "errands",
    readingTimeMinutes: 7,
  },
  {
    slug: "free-nara-baby-alternative",
    title:
      "Free Nara Baby Alternative: Sprout Baby Tracker (Free, Offline, Shared Care)",
    metaTitle: "Free Nara Baby Alternative (2026): Sprout Baby Tracker",
    description:
      "Nara Baby now needs a subscription after a 7-day trial. Sprout is a free baby tracker with offline logging and live sharing between parents and caregivers.",
    keywords: [
      "free Nara Baby alternative",
      "Nara Baby free alternative",
      "baby tracker no subscription",
      "free baby tracker Android",
      "offline baby tracker",
      "newborn feeding sleep diaper log",
    ],
    publishedAt: "2026-10-21",
    category: "budget",
    readingTimeMinutes: 6,
  },
  {
    slug: "how-to-tell-toddler-new-baby-is-coming",
    title:
      "How to Tell a Toddler a New Baby Is Coming: Age-Appropriate Scripts",
    description:
      "A toddler doesn't need the full pregnancy timeline, just enough truth to feel included and not blindsided. Here's how to actually say it, by age, with scripts that hold up when they ask follow-up questions — and how to involve them in the months before the baby actually arrives.",
    keywords: [
      "how to tell toddler new baby is coming",
      "telling toddler about new baby",
      "pregnancy announcement to toddler",
      "big brother big sister preparation",
      "toddler new sibling",
    ],
    publishedAt: "2026-10-21",
    category: "bonding",
    readingTimeMinutes: 7,
  },
  {
    slug: "diaper-bag-setup-two-kids-in-diapers",
    title: "Diaper Bag Setup for Two Kids in Diapers at Once",
    description:
      "One bag, two sizes of diapers, two sets of wipes, and no room left for anything else. Here's how to actually organize a diaper bag when both kids still need changing — the full packing list, not just the diapers.",
    keywords: [
      "diaper bag setup for two kids in diapers",
      "two kid diaper bag",
      "diaper bag organization",
      "tandem diaper bag packing list",
      "diaper bag for two under two",
    ],
    publishedAt: "2026-10-21",
    category: "gear",
    readingTimeMinutes: 7,
  },
  {
    slug: "toy-rotation-storage-toddler-baby-playroom",
    title: "Toy Rotation and Storage for a Toddler and Baby Sharing a Playroom",
    description:
      "A shared playroom for a toddler and a baby has two different toy vocabularies competing for the same shelf. Here's a rotation and storage system that keeps both kids engaged without constant sorting.",
    keywords: [
      "toy rotation storage toddler and baby playroom",
      "toy rotation for two kids",
      "shared playroom storage",
      "toddler baby toy storage",
      "playroom organization two kids",
    ],
    publishedAt: "2026-10-28",
    category: "gear",
    readingTimeMinutes: 7,
  },
  {
    slug: "toddler-fever-newborn-still-nursing-what-to-do-first",
    title: "Fever in the Toddler, Newborn Still Nursing: What to Actually Do First",
    description:
      "A feverish toddler and a nursing newborn at the same time raises two separate questions at once — what the toddler needs, and what it means for the baby. Here's how to think through both, with the actual numbers that matter, without panicking.",
    keywords: [
      "toddler fever newborn still nursing what to do first",
      "toddler fever and breastfeeding newborn",
      "fever toddler nursing baby",
      "newborn exposure to toddler fever",
      "febrile seizure toddler",
    ],
    publishedAt: "2026-10-30",
    category: "health",
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
  "starting-solids-second-baby-while-nursing-toddler": ["solids", "feeding", "nursing"],
  "returning-to-work-newborn-toddler-still-in-diapers": ["daycare", "diapers", "illness", "pumping", "work return"],
  "lovevery-hub-complete-guide": ["lovevery", "two under two", "subscription", "budget"],
  "lovevery-vs-amazon-diy-montessori-12-month-experiment": ["lovevery", "resale", "toys", "diy"],
  "lovevery-two-under-two-box-by-box-audit": ["lovevery", "pass-down", "box-by-box", "toys"],
  "lovevery-portal-skip-pause-calibration-blueprint": ["lovevery", "skip schedule", "portal", "age gap"],
  "beyond-lovevery-monti-kids-hoppi-box-kiwico-panda-crates": ["montessori", "toys", "subscription", "lovevery"],
  "clean-sanitize-used-lovevery-toys-sibling-hygiene-guide": ["hygiene", "cleaning", "lovevery"],
  "lovevery-babbler-slide-seek-ball-run-vs-amazon": ["lovevery", "toys", "babbler kit", "amazon"],
  "lovevery-for-twins-two-full-subscriptions-or-one-kit": ["lovevery", "twins", "pass-down", "subscription"],
  "lovevery-play-gym-two-under-two-one-gym-two-babies": ["lovevery", "play gym", "toys", "twins"],
  "lovevery-negative-reviews-two-under-two-household": ["lovevery", "reviews", "pass-down", "toys"],
  "lovevery-vs-kiwico-switch-at-two-younger-sibling": ["lovevery", "kiwico", "age 2", "subscription"],
  "lovevery-preschool-lineup-past-age-two-second-kid": ["lovevery", "preschool", "age 2", "pass-down"],
  "lovevery-premature-babies-nicu-twins-adjusted-age": ["lovevery", "nicu", "twins", "adjusted age", "premature"],
  "lovevery-storage-rotation-room-by-room-guide": ["lovevery", "storage", "organization", "pass-down"],
  "lovevery-items-worth-buying-individually": ["lovevery", "toys", "object permanence box", "buy individual"],
  "lovevery-grandparents-gift-guide-two-grandkids": ["lovevery", "gifting", "grandparents", "gifts"],
  "lovevery-full-time-daycare-worth-it": ["lovevery", "daycare", "working parents"],
  "lovevery-two-households-coparenting-logistics": ["lovevery", "co-parenting", "logistics", "two households"],
  "lovevery-baby-registry-two-kids-close-in-age": ["lovevery", "baby registry", "pass-down"],
  "lovevery-pre-loved-resale-listing-guide": ["lovevery", "resale", "pre-loved", "budget"],
  "lovevery-blended-families-merging-collections": ["lovevery", "blended families", "merging", "co-parenting", "pass-down"],
  "lovevery-end-of-journey-collection-exit-guide": ["lovevery", "resale", "collection exit", "donation", "budget"],
  "lovevery-international-buyers-guide": ["lovevery", "international", "shipping", "resale", "budget"],
  "lovevery-adoptive-foster-families-guide": ["lovevery", "adoption", "foster", "milestones", "stage-matching"],
  "little-spoon-two-under-two-master-review": ["little spoon", "meal subscription", "baby food", "cost", "budget"],
  "once-upon-a-farm-sibling-milestones": ["once upon a farm", "meal subscription", "feeding", "milestones", "wellbeing"],
  "tiny-organics-vs-nurture-life": ["tiny organics", "nurture life", "meal subscription", "baby food", "budget"],
  "true-cost-of-toddler-food-strikes": ["food waste", "picky eating", "meal subscription", "budget"],
  "freeze-little-spoon-plates": ["freezing", "freezer storage", "reheating", "meal subscription"],
  "baby-toddler-meal-subscriptions-hub": ["meal subscription", "baby food", "two under two", "close-age siblings", "budget"],
  "baby-food-digestive-comfort": ["meal subscription", "baby food", "digestion", "fiber", "wellbeing"],
  "feeding-twins-subscription": ["twins", "meal subscription", "multiples", "budget"],
  "allergy-mismatched-siblings": ["allergy", "meal subscription", "baby food", "wellbeing"],
  "daycare-coordination": ["daycare", "meal subscription", "lunches", "wellbeing"],
  "cerebelly-vs-little-spoon": ["cerebelly", "meal subscription", "baby food", "budget"],
  "delivery-zone-comparison": ["shipping", "meal subscription", "budget"],
  "switching-subscriptions-playbook": ["switching", "cancel", "meal subscription", "budget"],
  "adult-meal-kit-combination": ["meal subscription", "adult meal kit", "budget"],
  "ultra-processed-food-debate": ["meal subscription", "baby food", "processing", "wellbeing"],
  "packaging-bpa-phthalates-microplastics": ["meal subscription", "baby food", "packaging", "wellbeing"],
  "baby-led-weaning-starter-guide": ["meal subscription", "baby-led weaning", "feeding", "wellbeing"],
  "cheapest-subscriptions-ranked": ["meal subscription", "baby food", "cost", "budget"],
  "label-certification-glossary": ["meal subscription", "certifications", "labels", "wellbeing"],
  "review-sentiment-aggregation": ["meal subscription", "reviews", "sentiment", "budget"],
  "diaper-delivery-subscriptions-hub": ["diaper subscription", "two under two", "close-age siblings", "budget"],
  "diaper-bundle-portal-mixing-sizes-blueprint": ["diaper subscription", "hello bello", "honest company", "portal", "mixing sizes", "budget"],
  "hello-bello-vs-dyper-showdown": ["diaper subscription", "hello bello", "dyper", "budget"],
  "kudos-cotton-premium-economics": ["diaper subscription", "kudos", "premium", "budget"],
  "diaper-to-pull-up-transition-subscription": ["diaper subscription", "potty training", "pull-ups", "transition", "budget"],
  "heavy-wetter-overnight-sibling-protocol": ["diaper subscription", "hello bello", "dyper", "overnight", "heavy wetter"],
  "hello-bello-cancellation-exit-strategy": ["diaper subscription", "hello bello", "cancel", "exit strategy"],
  "kudos-2026-manufacturing-investigation": ["diaper subscription", "kudos", "manufacturing", "quality"],
  "eco-subscription-vs-bulk-buying-cost-reality": ["diaper subscription", "bulk buying", "costco", "kirkland", "budget"],
  "diaper-subscriptions-twins-multiples": ["diaper subscription", "twins", "multiples", "abby & finn", "budget"],
  "preemie-nicu-diaper-sizing-gap": ["diaper subscription", "preemie", "nicu", "sizing"],
  "honest-vs-kudos-comparison": ["diaper subscription", "honest company", "kudos", "budget"],
  "coterie-vs-kudos-comparison": ["diaper subscription", "coterie", "kudos", "premium", "budget"],
  "diaper-pfas-lab-testing-review": ["diaper subscription", "pfas", "kudos", "lab testing", "safety"],
  "baby-wipes-pfas-testing-review": ["diaper subscription", "pfas", "wipes", "consumer reports", "safety"],
  "dyper-vs-kudos-comparison": ["diaper subscription", "dyper", "kudos", "budget"],
  "babyproofing-toddler-toys-choking-hazard-baby": ["babyproofing", "home safety", "toddler toys", "choking", "newborn"],
  "involve-toddler-newborn-care-without-resentment": ["newborn", "toddler", "jealousy", "bonding", "attention"],
  "total-household-cost-hub": ["app subscriptions", "budget", "monthly cost", "digital tools", "two under two"],
  "huckleberry-multi-child-sleep-tracker-review": ["huckleberry", "sleep tracking", "app", "schedule", "budget"],
  "yoto-vs-tonies-screen-free-audio-comparison": ["yoto", "tonies", "screen-free audio", "budget", "independent play"],
  "blueberry-pediatrics-cost-review": ["blueberry pediatrics", "telehealth", "budget", "urgent care"],
  "shared-audio-library-infant-toddler": ["screen-free audio", "yoto", "tonies", "development", "audio library"],
  "yoto-two-bedroom-bluetooth-range-test": ["yoto", "hardware", "range", "gear", "two rooms"],
  "blueberry-hsa-fsa-eligibility": ["hsa", "fsa", "tax", "telehealth", "budget"],
  "hatch-vs-yoto-tonies-infant-room": ["sound machine", "yoto", "tonies", "infant room", "safety"],
  "baby-monitors-two-rooms": ["baby monitor", "video monitor", "privacy", "two rooms", "gear"],
  "blueberry-vs-summer-health": ["blueberry pediatrics", "telehealth", "pay-per-visit", "budget"],
  "caregiver-access-permission-models": ["caregiver access", "nanny", "permissions", "apps", "sharing"],
  "postpartum-mental-health-telehealth": ["postpartum", "mental health", "telehealth", "helplines"],
  "taking-cara-babies-vs-huckleberry": ["taking cara babies", "huckleberry", "sleep training", "course", "budget", "schedule"],
  "daycare-apps-two-platforms": ["daycare apps", "brightwheel", "communication", "two programs", "daycare"],
  "virtual-lactation-consultants": ["lactation", "ibclc", "telehealth", "aca", "tandem feeding"],
  "toddler-bed-transition-timing-new-baby-needs-crib": ["sleep", "bed transition", "crib", "toddler", "newborn", "available sleep space"],
  "discipline-consistency-two-kids-different-stages": ["discipline", "behavior", "toddler aggression", "sibling safety", "co-parenting", "age gap"],
  "grocery-shopping-alone-toddler-infant": ["grocery shopping", "errands", "solo parenting", "shopping cart safety", "toddler behavior"],
  "free-nara-baby-alternative": ["nara baby", "free alternative", "baby tracker", "offline", "app", "sharing", "budget"],
  "how-to-tell-toddler-new-baby-is-coming": ["toddler", "new baby", "pregnancy announcement", "siblings", "bonding", "big brother", "big sister", "milestones"],
  "diaper-bag-setup-two-kids-in-diapers": ["diaper bag", "gear", "organization", "two kids", "toddler", "newborn", "packing", "errands"],
  "toy-rotation-storage-toddler-baby-playroom": ["toy rotation", "storage", "playroom", "toddler", "baby", "organization", "safety"],
  "toddler-fever-newborn-still-nursing-what-to-do-first": ["fever", "toddler", "newborn", "nursing", "breastfeeding", "illness", "safety", "hydration"],
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

export const PLAY_CLUSTER_SLUGS: string[] = [
  "lovevery-hub-complete-guide",
  "lovevery-vs-amazon-diy-montessori-12-month-experiment",
  "lovevery-two-under-two-box-by-box-audit",
  "lovevery-portal-skip-pause-calibration-blueprint",
  "beyond-lovevery-monti-kids-hoppi-box-kiwico-panda-crates",
  "clean-sanitize-used-lovevery-toys-sibling-hygiene-guide",
  "lovevery-babbler-slide-seek-ball-run-vs-amazon",
  "lovevery-for-twins-two-full-subscriptions-or-one-kit",
  "lovevery-play-gym-two-under-two-one-gym-two-babies",
  "lovevery-negative-reviews-two-under-two-household",
  "lovevery-vs-kiwico-switch-at-two-younger-sibling",
  "lovevery-preschool-lineup-past-age-two-second-kid",
  "lovevery-premature-babies-nicu-twins-adjusted-age",
  "lovevery-storage-rotation-room-by-room-guide",
  "lovevery-items-worth-buying-individually",
  "lovevery-grandparents-gift-guide-two-grandkids",
  "lovevery-full-time-daycare-worth-it",
  "lovevery-two-households-coparenting-logistics",
  "lovevery-baby-registry-two-kids-close-in-age",
  "lovevery-pre-loved-resale-listing-guide",
  "lovevery-blended-families-merging-collections",
  "lovevery-end-of-journey-collection-exit-guide",
  "lovevery-international-buyers-guide",
  "lovevery-adoptive-foster-families-guide",
];

export const MEAL_CLUSTER_SLUGS: string[] = [
  "baby-toddler-meal-subscriptions-hub",
  "little-spoon-two-under-two-master-review",
  "once-upon-a-farm-sibling-milestones",
  "tiny-organics-vs-nurture-life",
  "true-cost-of-toddler-food-strikes",
  "freeze-little-spoon-plates",
  "baby-food-digestive-comfort",
  "feeding-twins-subscription",
  "allergy-mismatched-siblings",
  "daycare-coordination",
  "cerebelly-vs-little-spoon",
  "delivery-zone-comparison",
  "switching-subscriptions-playbook",
  "adult-meal-kit-combination",
  "ultra-processed-food-debate",
  "packaging-bpa-phthalates-microplastics",
  "baby-led-weaning-starter-guide",
  "cheapest-subscriptions-ranked",
  "label-certification-glossary",
  "review-sentiment-aggregation",
];

export const DIAPER_CLUSTER_SLUGS: string[] = [
  "diaper-delivery-subscriptions-hub",
  "diaper-bundle-portal-mixing-sizes-blueprint",
  "hello-bello-vs-dyper-showdown",
  "kudos-cotton-premium-economics",
  "diaper-to-pull-up-transition-subscription",
  "heavy-wetter-overnight-sibling-protocol",
  "hello-bello-cancellation-exit-strategy",
  "kudos-2026-manufacturing-investigation",
  "eco-subscription-vs-bulk-buying-cost-reality",
  "diaper-subscriptions-twins-multiples",
  "preemie-nicu-diaper-sizing-gap",
  "honest-vs-kudos-comparison",
  "coterie-vs-kudos-comparison",
  "diaper-pfas-lab-testing-review",
  "baby-wipes-pfas-testing-review",
  "dyper-vs-kudos-comparison",
];

export function getClusterRelated(
  slug: string,
  count = 2,
  exclude: string[] = [],
  clusterSlugs: string[] = PLAY_CLUSTER_SLUGS
): PostMeta[] {
  const current = getPost(slug);
  if (!current) return [];
  const currentTopics = POST_TOPICS[current.slug] ?? [];
  const excluded = new Set([slug, ...exclude]);
  return clusterSlugs.filter((s) => !excluded.has(s))
    .map((s) => getPost(s))
    .filter((p): p is PostMeta => Boolean(p))
    .map((p) => {
      const sharedTopics = (POST_TOPICS[p.slug] ?? []).filter((t) =>
        currentTopics.includes(t)
      ).length;
      return { post: p, sharedTopics };
    })
    .filter((s) => s.sharedTopics >= 1)
    .sort((a, b) =>
      b.sharedTopics - a.sharedTopics ||
      b.post.publishedAt.localeCompare(a.post.publishedAt)
    )
    .slice(0, count)
    .map((s) => s.post);
}

// ---------------------------------------------------------------------------
// Reviews restructure
// ---------------------------------------------------------------------------

export type ReviewCluster =
  | "lovevery"
  | "baby-food"
  | "diapers"
  | "gear"
  | "digital-services";

export interface ReviewClusterCta {
  eyebrow: string;
  heading: string;
  body: string;
  href: string;
  ctaLabel: string;
}

export interface ReviewClusterDef {
  slug: ReviewCluster;
  label: string;
  short: string;
  blurb: string;
  emoji: string;
  cta: ReviewClusterCta;
}

const CLUSTER_CTA: Record<ReviewCluster, ReviewClusterCta> = {
  lovevery: {
    eyebrow: "Free to use",
    heading: "Not sure when a Lovevery box fits into your day?",
    body: "Sibling Stack puts both kids' sleep and feed windows on one timeline, so you can see when a toy-box session actually fits — before the meltdown starts.",
    href: "/tools/wake-window-calculator",
    ctaLabel: "Try the wake window calculator",
  },
  "baby-food": {
    eyebrow: "Free to use",
    heading: "Feeding two kids at two different offsets?",
    body: "The feeding schedule calculator lines up a newborn's feeds with a toddler's mealtimes and flags the conflicts before they happen — no subscription required.",
    href: "/tools/feeding-offset-calculator",
    ctaLabel: "Plan your feeding schedule",
  },
  diapers: {
    eyebrow: "Free to use",
    heading: "Sync naps to get a diaper-change window you can use",
    body: "Two kids in diapers means the overlap window is everything. Sibling Stack maps both kids' naps on one timeline so you know exactly when you'll get a free stretch.",
    href: "/tools/nap-sync-calculator",
    ctaLabel: "Sync their naps",
  },
  gear: {
    eyebrow: "Free to use",
    heading: "The real test of gear is your actual day",
    body: "Build both kids' sleep and feed windows on one timeline, then see which gear decisions actually matter — and at what hour they get tested.",
    href: "/schedules",
    ctaLabel: "Open the schedule app",
  },
  "digital-services": {
    eyebrow: "Free to use",
    heading: "Which digital tools actually earn their keep?",
    body: "The real question is what all these subscriptions cost together — and where they quietly overlap. Map both kids' sleep and feed windows on one timeline to see where a paid app does real work.",
    href: "/schedules",
    ctaLabel: "Open the schedule app",
  },
};

export const REVIEW_CLUSTERS: ReviewClusterDef[] = [
  {
    slug: "lovevery",
    label: "Lovevery",
    short: "Lovevery & play kits",
    blurb:
      "Whether a Lovevery subscription makes sense for two kids close in age — the financial math, pass-down value, storage, gifting, and the family situations that don't fit the standard two-under-two mold.",
    emoji: "🧩",
    cta: CLUSTER_CTA.lovevery,
  },
  {
    slug: "baby-food",
    label: "Baby & Toddler Food",
    short: "Meal subscription kits",
    blurb:
      "Baby and toddler meal subscription kits for close-age-sibling households — combined budgets, freezer math, allergy logistics, delivery zones, and the science behind the labels, across five brands.",
    emoji: "🍽️",
    cta: CLUSTER_CTA["baby-food"],
  },
  {
    slug: "diapers",
    label: "Diapers",
    short: "Diaper delivery subscriptions",
    blurb:
      "Diaper delivery subscriptions for two kids sharing one changing table — mixing sizes in a single bundle, the real volume math, brand showdowns, potty-training transitions, and independent PFAS lab results.",
    emoji: "🧷",
    cta: CLUSTER_CTA.diapers,
  },
  {
    slug: "gear",
    label: "Gear",
    short: "Gear roundups",
    blurb:
      "Stroller, car seat, feeding, and nursery gear for two kids at different stages — organized by decision, not by checklist, with honest guidance on what to buy twice and what to skip.",
    emoji: "🚼",
    cta: CLUSTER_CTA.gear,
  },
  {
    slug: "digital-services",
    label: "Apps & Services",
    short: "Baby apps & subscriptions",
    blurb:
      "The digital toolkit for a close-age-sibling household — sleep-tracking apps, screen-free audio, telehealth memberships, baby monitors, and daycare apps — with the real subscription math and the tax treatment that actually applies.",
    emoji: "📱",
    cta: CLUSTER_CTA["digital-services"],
  },
];

export const DEFERRED_GEAR_SLUGS: string[] = [
  "double-stroller-close-in-age",
  "double-stroller-roundup",
  "tandem-vs-side-by-side-stroller-2-under-2",
];

const GEAR_REVIEW_SLUGS: string[] = [
  "high-chair-roundup",
  "car-seat-two-different-sizes",
  "convertible-car-seats-2026",
  "baby-carriers-2026",
  "baby-gear-dont-buy-twice",
  "hand-me-down-sizing-cheat-sheet",
  "crib-and-bassinet-setup-two-babies-one-room",
  "hand-me-down-clothes-timeline-close-in-age",
];

export const DIGITAL_SERVICES_CLUSTER_SLUGS: string[] = [
  "total-household-cost-hub",
  "huckleberry-multi-child-sleep-tracker-review",
  "yoto-vs-tonies-screen-free-audio-comparison",
  "blueberry-pediatrics-cost-review",
  "shared-audio-library-infant-toddler",
  "yoto-two-bedroom-bluetooth-range-test",
  "blueberry-hsa-fsa-eligibility",
  "hatch-vs-yoto-tonies-infant-room",
  "baby-monitors-two-rooms",
  "blueberry-vs-summer-health",
  "caregiver-access-permission-models",
  "postpartum-mental-health-telehealth",
  "taking-cara-babies-vs-huckleberry",
  "daycare-apps-two-platforms",
  "virtual-lactation-consultants",
];

export const HUB_SLUG: Record<
  "lovevery" | "baby-food" | "diapers" | "digital-services",
  string
> = {
  lovevery: "lovevery-hub-complete-guide",
  "baby-food": "baby-toddler-meal-subscriptions-hub",
  diapers: "diaper-delivery-subscriptions-hub",
  "digital-services": "total-household-cost-hub",
};

/** Every slug whose canonical home is /reviews (migrated MDX), by cluster. */
export const REVIEW_SLUGS_BY_CLUSTER: Record<ReviewCluster, string[]> = {
  lovevery: PLAY_CLUSTER_SLUGS,
  "baby-food": MEAL_CLUSTER_SLUGS,
  diapers: DIAPER_CLUSTER_SLUGS,
  gear: GEAR_REVIEW_SLUGS,
  "digital-services": DIGITAL_SERVICES_CLUSTER_SLUGS,
};

const MIGRATED_SLUGS = new Set(
  (["lovevery", "baby-food", "diapers", "gear", "digital-services"] as ReviewCluster[]).flatMap(
    (c) => REVIEW_SLUGS_BY_CLUSTER[c]
  )
);

export function isMigratedReview(slug: string): boolean {
  return MIGRATED_SLUGS.has(slug);
}

export function reviewClusterOf(slug: string): ReviewCluster | undefined {
  for (const c of ["lovevery", "baby-food", "diapers", "gear", "digital-services"] as ReviewCluster[]) {
    if (REVIEW_SLUGS_BY_CLUSTER[c].includes(slug)) return c;
  }
  return undefined;
}

/** Canonical public path for a post slug, after the reviews restructure. */
export function canonicalRouteOf(slug: string): string {
  const cluster = reviewClusterOf(slug);
  if (cluster) {
    if (cluster === "gear") return `/reviews/gear/${slug}`;
    return HUB_SLUG[cluster] === slug
      ? `/reviews/${cluster}`
      : `/reviews/${cluster}/${slug}`;
  }
  if (DEFERRED_GEAR_SLUGS.includes(slug)) return `/gear/${slug}`;
  return `/blog/${slug}`;
}

export function clusterDefOf(slug: string): ReviewClusterDef | undefined {
  const cluster = reviewClusterOf(slug);
  return cluster ? REVIEW_CLUSTERS.find((c) => c.slug === cluster) : undefined;
}

// ---------------------------------------------------------------------------
// Reviewer credentials (E-E-A-T)
//
// Health-adjacent (YMYL) posts are flagged with a named reviewer and their
// verified credential context. Keep these genuinely descriptive — name, role,
// and the exact scope of what they reviewed.
// ---------------------------------------------------------------------------

export interface ReviewerInfo {
  name: string;
  role: string;
  scope: string;
}

export const POST_REVIEWERS: Record<string, ReviewerInfo> = {
  "diaper-pfas-lab-testing-review": {
    name: "Dr. Meredith Alvarez, PhD",
    role: "Analytical toxicologist",
    scope:
      "reviewed the lab-testing methodology, PFAS detection thresholds, and the interpretation of OEKO-TEX certification vs. independent results.",
  },
  "baby-wipes-pfas-testing-review": {
    name: "Dr. Meredith Alvarez, PhD",
    role: "Analytical toxicologist",
    scope:
      "reviewed the Consumer Reports testing protocol, the VOC findings, and the distinction between certified and independently verified results.",
  },
  "packaging-bpa-phthalates-microplastics": {
    name: "Dr. Meredith Alvarez, PhD",
    role: "Analytical toxicologist",
    scope:
      "reviewed the phthalate and microplastics testing data, what BPA-free does and doesn't convey, and the exposure-reduction advice.",
  },
  "allergy-mismatched-siblings": {
    name: "Dr. Samuel Okafor, MD",
    role: "Pediatric allergist-immunologist",
    scope:
      "reviewed the cross-contact risk analysis, facility-level allergen disclosures, and the kitchen-hygiene recommendations.",
  },
  "baby-food-digestive-comfort": {
    name: "Rebecca Lindqvist, RD",
    role: "Registered pediatric dietitian",
    scope:
      "reviewed the fiber, sorbitol, and constipidating-food guidance as it applies to infants and toddlers at each solid-food stage.",
  },
  "ultra-processed-food-debate": {
    name: "Dr. Priya Natarajan, PhD",
    role: "Food science researcher",
    scope:
      "reviewed the NOVA framework application, the February 2026 study methodology, and the label-reading checks.",
  },
  "baby-led-weaning-starter-guide": {
    name: "Carla Jiménez, OTR/L",
    role: "Pediatric occupational therapist",
    scope:
      "reviewed the gagging-vs-choking distinction, hazard-food shapes and sizes, and the oral-motor readiness guidance.",
  },
};

export const CATEGORY_LABEL: Record<PostMeta["category"], string> = {
  gear: "Gear",
  schedule: "Schedule",
  wellbeing: "Wellbeing",
  budget: "Budget",
  safety: "Safety",
  bonding: "Sibling Bonding & Family",
  sleep: "Sleep & Transitions",
  discipline: "Discipline & Behavior",
  errands: "Errands & Outings",
  health: "Health & Illness",
};

export const CATEGORY_COLOR: Record<PostMeta["category"], string> = {
  gear: "#D98C5F",
  schedule: "#5FA39A",
  wellbeing: "#9A7EC8",
  budget: "#7EC89A",
  safety: "#E2574B",
  bonding: "#D17FA3",
  sleep: "#7B93C9",
  discipline: "#C79A3F",
  errands: "#6FA8D5",
  health: "#F28A2E",
};
