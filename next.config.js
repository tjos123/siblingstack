const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const GEAR_REDIRECTS = [
  {
    source: "/blog/double-stroller-close-in-age",
    destination: "/gear/double-stroller-close-in-age",
    statusCode: 301,
  },
  {
    source: "/blog/double-stroller-roundup",
    destination: "/gear/double-stroller-roundup",
    statusCode: 301,
  },
  {
    source: "/blog/tandem-vs-side-by-side-stroller-2-under-2",
    destination: "/gear/tandem-vs-side-by-side-stroller-2-under-2",
    statusCode: 301,
  },
  {
    source: "/blog/high-chair-roundup",
    destination: "/gear/high-chair-roundup",
    statusCode: 301,
  },
  {
    source: "/blog/car-seat-two-different-sizes",
    destination: "/gear/car-seat-two-different-sizes",
    statusCode: 301,
  },
  {
    source: "/blog/convertible-car-seats-2026",
    destination: "/gear/convertible-car-seats-2026",
    statusCode: 301,
  },
  {
    source: "/blog/baby-carriers-2026",
    destination: "/gear/baby-carriers-2026",
    statusCode: 301,
  },
  {
    source: "/blog/baby-gear-dont-buy-twice",
    destination: "/gear/baby-gear-dont-buy-twice",
    statusCode: 301,
  },
  {
    source: "/blog/hand-me-down-sizing-cheat-sheet",
    destination: "/gear/hand-me-down-sizing-cheat-sheet",
    statusCode: 301,
  },
  {
    source: "/blog/hand-me-down-clothes-timeline-close-in-age",
    destination: "/gear/hand-me-down-clothes-timeline-close-in-age",
    statusCode: 301,
  },
  {
    source: "/blog/crib-and-bassinet-setup-two-babies-one-room",
    destination: "/gear/crib-and-bassinet-setup-two-babies-one-room",
    statusCode: 301,
  },
];

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