import type { Metadata } from "next";
import FilterBar from "@/components/shop/FilterBar";
import ShopFeature from "@/components/shop/ShopFeature";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import PageIntro from "@/components/layout/PageIntro";
import { CATEGORIES, categoryName } from "@/lib/catalog/categories";
import { getDrop } from "@/lib/catalog/drops";
import {
  categoriesInUse,
  isSortKey,
  listProducts,
  searchProducts,
} from "@/lib/catalog/queries";
import { SITE_URL } from "@/lib/site";
import type { CategoryId } from "@/lib/catalog/types";
import { jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop THARROS — heavyweight tees, hoodies, sweatshirts, pants, outerwear and accessories from Drop 001.",
  alternates: { canonical: "/shop" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const categoryParam = first(params.category);
  const category = CATEGORIES.some((entry) => entry.id === categoryParam)
    ? (categoryParam as CategoryId)
    : "all";

  const sortParam = first(params.sort);
  const sort = isSortKey(sortParam) ? sortParam : "featured";

  const dropParam = first(params.drop);
  const dropSlug = dropParam && getDrop(dropParam) ? dropParam : undefined;
  const drop = dropSlug ? getDrop(dropSlug) : undefined;

  const newOnly = first(params.new) === "1";

  // `?q=` backs the WebSite SearchAction in the JSON-LD graph, so a search
  // engine's deep link lands on real results rather than the whole catalogue.
  const query = first(params.q)?.trim();

  const products = query
    ? searchProducts(query, 100)
    : listProducts({ category, sort, drop: drop?.id, isNew: newOnly || undefined });

  const heading = query
    ? `“${query}”`
    : newOnly
      ? "In development"
      : drop
        ? drop.name
        : category !== "all"
          ? categoryName(category)
          : "Every piece";

  // "Everything, as it comes" — no search, no category, no drop, no new filter,
  // and the default sort. Anything else is a narrowed view.
  const unfiltered =
    !query && category === "all" && !drop && !newOnly && sort === "featured";

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />

      <PageIntro
        index="01"
        label={query ? "Search" : drop ? "Drop" : "Everything made so far"}
        title={heading}
        titleClass="type-display-2"
        crumbs={[{ name: "Home", href: "/" }]}
      />

      {/* Only on the unfiltered view — see ShopFeature. Someone who has already
          narrowed the list wants the list. */}
      {unfiltered ? <ShopFeature /> : null}

      <FilterBar
        category={category}
        sort={sort}
        drop={dropSlug}
        newOnly={newOnly}
        count={products.length}
        available={categoriesInUse()}
      />

      <div className="page-frame rhythm-tight">
        {products.length === 0 ? (
          <EmptyState
            title="Nothing found."
            body={
              query
                ? "No pieces match that search."
                : "Nothing in that category right now — the line is small on purpose."
            }
            action={{ href: "/shop", label: "View everything" }}
          />
        ) : (
          <ProductGrid
            products={products}
            heading={`${heading} — ${products.length} pieces`}
            columns={3}
            priorityCount={3}
          />
        )}
      </div>
    </>
  );
}
