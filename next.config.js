const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

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
    ];
  },
};

module.exports = withMDX(nextConfig);