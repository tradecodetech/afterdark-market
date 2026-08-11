import type { NextConfig } from "next";

// Product images are local SVG placeholders under /public/placeholders by
// default (see scripts/gen-placeholders.mjs) so the app has no dependency
// on an external image host. To use a real image CDN/bucket, add its
// hostname to images.remotePatterns here.
const nextConfig: NextConfig = {};

export default nextConfig;
