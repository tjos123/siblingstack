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
        has: [{ type: "host", value: "www.siblingstack.com" }],
        destination: "https://siblingstack.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withMDX(nextConfig);