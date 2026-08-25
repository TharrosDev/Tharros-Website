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
  dropsInUse,
  filterProducts,
  isSortKey,
  listProducts,
  searchProducts,
  sortProducts,
} from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";
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

  // A search is still a view of the shop, so the same filters apply to it. It
  // previously ignored all of them: the bar rendered above a search showed a
  // category and a sort that changed nothing, and every one of its links threw
  // the search away. Relevance stays the default order — an explicit sort is the
  // only thing allowed to override what the search decided was most relevant.
  const products = query
    ? (() => {
        const matches = filterProducts(searchProducts(query, 100), {
          category,
          drop: drop?.id,
          isNew: newOnly || undefined,
        });
        return sort === "featured" ? matches : sortProducts(matches, sort);
      })()
    : listProducts({ category, sort, drop: drop?.id, isNew: newOnly || undefined });

  // What the shop is browsed by is the release, so the unfiltered view names
  // the release it is actually showing. While one drop is the whole catalogue,
  // "Every piece" and "Drop 001" are the same list under two names — and the
  // less specific one was the one on the page.
  const releases = dropsInUse();
  const soleDrop = releases.length === 1 ? releases[0]?.drop : undefined;

  const heading = query
    ? `“${query}”`
    : newOnly
      ? "In development"
      : drop
        ? drop.name
        : category !== "all"
          ? categoryName(category)
          : (soleDrop?.name ?? "Everything made so far");

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
        label={
          query
            ? "Search"
            : newOnly
              ? "Next drop"
              : (drop ?? soleDrop)
                ? "The run"
                : // Not "Everything made so far": that is the title, and an
                  // eyebrow repeating its own heading is a label describing
                  // nothing.
                  "The catalogue"
        }
        title={heading}
        titleClass="type-display-2"
        crumbs={[{ name: "Home", href: "/" }]}
      >
        {/* The release line: what this view is, dated, from the drop record.
            Only where a single release is being shown — across drops there is
            no one date to state. */}
        {!query && (drop ?? soleDrop) ? (
          <p className="type-meta mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-ink-faint">
            <span>
              <span className="num">{(drop ?? soleDrop)!.index}</span>
              <span className="ml-3">{(drop ?? soleDrop)!.name}</span>
            </span>
            {(drop ?? soleDrop)!.releasedAt ? (
              <span>
                Released{" "}
                <time dateTime={(drop ?? soleDrop)!.releasedAt!}>
                  {formatDate((drop ?? soleDrop)!.releasedAt!)}
                </time>
              </span>
            ) : null}
          </p>
        ) : null}
      </PageIntro>

      {/* Only on the unfiltered view — see ShopFeature. Someone who has already
          narrowed the list wants the list. */}
      {unfiltered ? <ShopFeature /> : null}

      <FilterBar
        category={category}
        sort={sort}
        drop={dropSlug}
        dropName={drop?.name}
        newOnly={newOnly}
        query={query}
        count={products.length}
        available={categoriesInUse()}
        drops={releases.map((entry) => ({
          slug: entry.drop.slug,
          name: entry.drop.name,
          count: entry.count,
        }))}
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
            heading={`${heading} — ${products.length} ${
              products.length === 1 ? "piece" : "pieces"
            }`}
            columns={5}
            priorityCount={5}
            specimen
          />
        )}
      </div>
    </>
  );
}
