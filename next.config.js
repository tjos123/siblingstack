const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

// Slug -> canonical route after the reviews restructure. Kept in sync with
// canonicalRouteOf() in src/lib/blog.ts. Deferred stroller posts stay at
// /gear, matching the published plan.
const HUB_SLUG = {
  lovevery: "lovevery-hub-complete-guide",
  "baby-food": "baby-toddler-meal-subscriptions-hub",
  diapers: "diaper-delivery-subscriptions-hub",
};

const CLUSTER_SLUGS = {
  lovevery: [
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
  ],
  "baby-food": [
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
  ],
  diapers: [
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
  ],
  gear: [
    "high-chair-roundup",
    "car-seat-two-different-sizes",
    "convertible-car-seats-2026",
    "baby-carriers-2026",
    "baby-gear-dont-buy-twice",
    "hand-me-down-sizing-cheat-sheet",
    "crib-and-bassinet-setup-two-babies-one-room",
    "hand-me-down-clothes-timeline-close-in-age",
  ],
};

const DEFERRED_GEAR_SLUGS = [
  "double-stroller-close-in-age",
  "double-stroller-roundup",
  "tandem-vs-side-by-side-stroller-2-under-2",
];

const GEAR_REDIRECTS = DEFERRED_GEAR_SLUGS.map((slug) => ({
  source: `/blog/${slug}`,
  destination: `/gear/${slug}`,
  statusCode: 301,
})).concat([
  ...Object.entries(CLUSTER_SLUGS).flatMap(([cluster, slugs]) =>
    slugs.map((slug) => ({
      source: `/blog/${slug}`,
      destination:
        HUB_SLUG[cluster] === slug
          ? `/reviews/${cluster}`
          : `/reviews/${cluster}/${slug}`,
      statusCode: 301,
    }))
  ),
  ...CLUSTER_SLUGS.gear.map((slug) => ({
    source: `/gear/${slug}`,
    destination: `/reviews/gear/${slug}`,
    statusCode: 301,
  })),
  {
    source: "/gear",
    destination: "/reviews/gear",
    statusCode: 301,
  },
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  trailingSlash: false,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "siblingstack.com" }],
        destination: "https://www.siblingstack.com/:path*",
        permanent: true,
      },
      {
        source: "/schedules/18-month-and-newborn",
        destination: "/schedules/2-under-2-schedule#toddler-two-naps",
        permanent: true,
      },
      {
        source: "/schedules/newborn-and-2-year-old-routine",
        destination: "/schedules/2-under-2-schedule#toddler-one-nap",
        permanent: true,
      },
      {
        source: "/schedules/newborn-toddler-sync",
        destination: "/schedules/2-under-2-schedule",
        permanent: true,
      },
      {
        source: "/tools/calculator",
        destination: "/tools/wake-window-calculator",
        permanent: true,
      },
      ...GEAR_REDIRECTS,
    ];
  },
};

module.exports = withMDX(nextConfig);