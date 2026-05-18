import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      // Legacy onboarding URL — the wizard now lives at /brief. Declared here
      // (instead of as a page-level permanentRedirect) so it emits a real HTTP
      // 308 at the edge rather than a meta-refresh in a prerendered page.
      { source: "/intake", destination: "/brief", permanent: true },
      // Forgive a common typo: singular /admin/brief → plural /admin/briefs.
      { source: "/admin/brief", destination: "/admin/briefs", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
