import type { Metadata } from "next";
import Link from "next/link";
import FilterBar from "@/components/shop/FilterBar";
import ProductGrid from "@/components/product/ProductGrid";
import { CATEGORIES, categoryName } from "@/lib/catalog/categories";
import { getCollection } from "@/lib/catalog/collections";
import { isSortKey, listProducts, searchProducts } from "@/lib/catalog/queries";
import { SITE_URL } from "@/lib/site";
import type { CategoryId } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop THARROS — heavyweight tees, hoodies, sweatshirts, pants, outerwear and accessories from Collection 01.",
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

  const collectionParam = first(params.collection);
  const collection = collectionParam && getCollection(collectionParam) ? collectionParam : undefined;

  const newOnly = first(params.new) === "1";

  // `?q=` backs the WebSite SearchAction in the JSON-LD graph, so a search
  // engine's deep link lands on real results rather than the whole catalogue.
  const query = first(params.q)?.trim();

  const products = query
    ? searchProducts(query, 100)
    : listProducts({ category, sort, collection, isNew: newOnly || undefined });

  const heading = query
    ? `“${query}”`
    : newOnly
      ? "New Arrivals"
      : category !== "all"
        ? categoryName(category)
        : "Shop Tharros";

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div
        className="page-frame"
        style={{ paddingTop: "calc(var(--header-h) + 3.5rem)", paddingBottom: "2.5rem" }}
      >
        <div className="border-t border-ink pt-4">
          <p className="eyebrow">
            <span className="num">01</span>
            <span>
              {query
                ? "Search"
                : collection
                  ? getCollection(collection)?.name
                  : "Catalogue"}
            </span>
          </p>
        </div>
        <h1 className="type-display-1 mt-8">{heading}</h1>
      </div>

      <FilterBar
        category={category}
        sort={sort}
        collection={collection}
        newOnly={newOnly}
        count={products.length}
      />

      <div className="page-frame rhythm-tight">
        {products.length === 0 ? (
          <div className="py-20">
            <p className="type-display-3 uppercase">Nothing found.</p>
            <p className="type-body mt-4 text-ink-muted">
              {query
                ? "No pieces match that search."
                : "No pieces match that filter yet."}
            </p>
            <Link href="/shop" className="btn btn-solid mt-10">
              View everything
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} columns={3} priorityCount={3} />
        )}
      </div>
    </>
  );
}
