import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["motion", "@relevanceai/sdk"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // thum.io powers the live site-preview thumbnails on /clients.
      { protocol: "https", hostname: "image.thum.io" },
    ],
  },
  async redirects() {
    return [
      // Legacy onboarding URL — wizard moved to /brief. Kept as a 308 so
      // external backlinks and indexed search results pointing at /intake
      // forward cleanly and transfer link-equity to the new canonical URL.
      { source: "/intake", destination: "/brief", permanent: true },
      // Forgive a common typo: singular /admin/brief → plural /admin/briefs.
      { source: "/admin/brief", destination: "/admin/briefs", permanent: true },
    ];
  },
  async headers() {
    // Content-Security-Policy. Dangerous directives are locked hard
    // (frame-ancestors/base-uri/form-action/object-src); the resource-loading
    // directives stay permissive enough not to break the integrations this site
    // depends on: the Relevance AI chat (https/wss), Supabase uploads (https),
    // Vercel Analytics (va.vercel-scripts.com), and thum.io thumbnails. Inline
    // scripts/styles are allowed because Next's bootstrap + the JSON-LD blocks
    // are inline; a nonce-based script-src is the recommended follow-up.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https: wss:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
