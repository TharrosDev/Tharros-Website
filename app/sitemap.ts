import { MetadataRoute } from "next";

const SITE_URL = "https://tharros.ca";

const LAST_MODIFIED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          "en-CA": SITE_URL,
        },
      },
    },
    {
      url: `${SITE_URL}/intake`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "en-CA": `${SITE_URL}/intake`,
        },
      },
    },
    {
      url: `${SITE_URL}/clients`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          "en-CA": `${SITE_URL}/clients`,
        },
      },
    },
  ];
}
