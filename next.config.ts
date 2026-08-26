import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root. Without it Turbopack walks up looking for a
  // lockfile, finds an unrelated one in the developer's home directory, and
  // treats that as the root — which it warns about on every dev and build run.
  turbopack: { root: import.meta.dirname },
  compiler: {
    // `true` stripped `console.error` too, which took out the only diagnostic
    // the app has: `app/error.tsx` logs the caught error, and in a production
    // build that call was compiled away entirely — so the boundary the visitor
    // sees was the whole of what anybody got. Everything else still goes.
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Product and campaign photography is served from this origin. Add a
    // remotePatterns entry here if assets ever move to a CDN or DAM.
  },
  async redirects() {
    return [
      // The drop page moved from /new when the site shifted to a drop model.
      { source: "/new", destination: "/drop", permanent: true },
      // `/archive` became `/releases`: the page indexes every piece the label
      // has released, including ones still on sale, and calling that an
      // archive contradicted the stock label of the same name.
      { source: "/archive", destination: "/releases", permanent: true },
      { source: "/archive/:ref", destination: "/releases/:ref", permanent: true },
    ];
  },

  async headers() {
    // Nothing on this site loads cross-origin except Vercel Analytics, so the
    // resource directives stay tight. Inline script/style are allowed because
    // Next's bootstrap and the JSON-LD blocks are inline; a nonce-based
    // script-src is the recommended follow-up.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://va.vercel-scripts.com",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      // Meaningless on an http origin, and actively harmful on one: WebKit
      // honours it against `http://localhost` and upgrades every asset request
      // to https, which nothing is listening for — so a local production build
      // serves a page with no CSS and no JavaScript. Chromium exempts loopback
      // and hides the problem. The e2e webServer is the only thing that sets
      // this variable; a deploy never does, so production keeps the directive.
      ...(process.env.CSP_ALLOW_INSECURE === "1"
        ? []
        : ["upgrade-insecure-requests"]),
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
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
