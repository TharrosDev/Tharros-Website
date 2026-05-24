import { MetadataRoute } from "next";

const SITE_URL = "https://tharros.ca";

// Pin lastModified to deploys, not build-time `new Date()`. Crawlers should not
// see "lastmod changed today" on every build when nothing actually moved.
const LAST_MODIFIED = "2026-05-23";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [
        `${SITE_URL}/opengraph-image/hero`,
        `${SITE_URL}/opengraph-image/packages`,
        `${SITE_URL}/opengraph-image/slogan`,
        `${SITE_URL}/tharros-logo.svg`,
        `${SITE_URL}/icon-512.png`,
      ],
      alternates: {
        languages: {
          "en-CA": SITE_URL,
          "x-default": SITE_URL,
        },
      },
    },
    {
      url: `${SITE_URL}/product`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [`${SITE_URL}/og-image.jpg`],
      alternates: {
        languages: {
          "en-CA": `${SITE_URL}/product`,
          "x-default": `${SITE_URL}/product`,
        },
      },
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [`${SITE_URL}/og-image.jpg`],
      alternates: {
        languages: {
          "en-CA": `${SITE_URL}/pricing`,
          "x-default": `${SITE_URL}/pricing`,
        },
      },
    },
    {
      url: `${SITE_URL}/clients`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.85,
      images: [
        `${SITE_URL}/opengraph-image/hero`,
        `${SITE_URL}/meridian-logo.webp`,
        `${SITE_URL}/echo-five-logo.svg`,
      ],
      alternates: {
        languages: {
          "en-CA": `${SITE_URL}/clients`,
          "x-default": `${SITE_URL}/clients`,
        },
      },
    },
    {
      url: `${SITE_URL}/brief`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${SITE_URL}/opengraph-image/hero`],
      alternates: {
        languages: {
          "en-CA": `${SITE_URL}/brief`,
          "x-default": `${SITE_URL}/brief`,
        },
      },
    },
  ];
}
