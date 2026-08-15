import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog/products";
import { JOURNAL } from "@/lib/catalog/journal";
import { SITE_URL } from "@/lib/site";

/**
 * Generated from the catalog, so a new product or journal entry appears here
 * without anyone remembering to update a list.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.9, changeFrequency: "weekly" },
    { path: "/new", priority: 0.9, changeFrequency: "weekly" },
    { path: "/lookbook", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/journal", priority: 0.7, changeFrequency: "weekly" },
    { path: "/size-guide", priority: 0.5, changeFrequency: "yearly" },
    { path: "/shipping", priority: 0.4, changeFrequency: "yearly" },
    { path: "/returns", priority: 0.4, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
    { path: "/legal/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/legal/refund-policy", priority: 0.2, changeFrequency: "yearly" },
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: new Date(product.releasedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...JOURNAL.map((entry) => ({
      url: `${SITE_URL}/journal/${entry.slug}`,
      lastModified: new Date(entry.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
