import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/catalog/queries";
import { archiveEntries } from "@/lib/catalog/archive";
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
    { path: "/drop", priority: 0.9, changeFrequency: "weekly" },
    { path: "/archive", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/size-guide", priority: 0.5, changeFrequency: "yearly" },
    { path: "/shipping", priority: 0.4, changeFrequency: "yearly" },
    { path: "/returns", priority: 0.4, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
    // The three legal routes are not here. They are admitted working drafts and
    // now carry `robots: { index: false }`, so listing them was the sitemap
    // asking for exactly what the pages ask not to happen. They go back in with
    // the reviewed wording.
  ];

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    // Through `queries.ts` like everything else that reads the catalog. This
    // was the one place importing `products.ts` directly, so a CMS swapped in
    // behind the seam would have left the sitemap reading the old array.
    ...listProducts().map((product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: new Date(product.releasedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Archive records are permanent by definition — a run does not reopen —
    // so they change less often than the product page for the same garment.
    ...archiveEntries().map((entry) => ({
      url: `${SITE_URL}/archive/${entry.ref}`,
      lastModified: new Date(entry.product.releasedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
