"use client";

import Link, { useLinkStatus } from "next/link";
import { useRef, useState } from "react";
import { CATEGORIES, categoryName } from "@/lib/catalog/categories";
import { SORT_OPTIONS } from "@/lib/catalog/queries";
import type { Availability, CategoryId } from "@/lib/catalog/types";
import { CloseIcon } from "@/components/ui/icons";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import type { SortKey } from "@/lib/catalog/types";

/** A release the shop can be narrowed to, with how many pieces it holds. */
export type DropOption = {
  slug: string;
  name: string;
  count: number;
};

/** A stock cut the bar can offer, with the count it will actually return. */
export type AvailabilityOption = {
  id: Availability;
  name: string;
  count: number;
};

type Props = {
  category: string;
  sort: SortKey;
  drop?: string;
  dropName?: string;
  /** The active stock cut, if one is on. */
  availability?: Availability;
  /** The active `?q=`, carried through every link the bar builds. */
  query?: string;
  count: number;
  /** Only categories that currently hold a piece are offered. */
  available: CategoryId[];
  /** Only drops that currently hold a piece, newest first. */
  drops: DropOption[];
  /** Only stock states that currently hold a piece, with their counts. */
  availabilities: AvailabilityOption[];
};

/**
 * The orders worth offering a run of this size.
 *
 * Four sort keys stay valid in the URL — a bookmarked `?sort=price-desc` still
 * resolves — but a seven-piece drop offered four orders, two of which are the
 * same list reversed and one of which ("Newest") cannot vary inside a single
 * release. The rest of the bar tells you what the list is; the sort should not
 * be the largest decision on the page.
 */
const OFFERED_SORTS: SortKey[] = ["featured", "price-asc"];

const SORT_LABELS: Partial<Record<SortKey, string>> = {
  featured: "Run order",
  "price-asc": "Price",
};

/**
 * Categories are a secondary axis and they have to earn the row.
 *
 * Six category rails over seven pieces is a directory of one-item shelves. The
 * guard is derived, so the row appears on its own the day the catalogue is
 * genuinely worth filtering rather than on the day someone remembers to switch
 * it on.
 */
const CATEGORY_ROW_MIN_CATEGORIES = 4;
const CATEGORY_ROW_MIN_PIECES = 9;

/**
 * Filters are links, not state. The URL is the source of truth, so a filtered
 * view is shareable, back-navigable and server-rendered — and the bar keeps
 * working if JS never loads.
 *
 * Every link carries `q`. It used to drop it, so following any filter from a
 * search result silently threw the search away.
 */
function buildHref(params: {
  category?: string;
  sort?: string;
  drop?: string;
  availability?: string;
  query?: string;
}): string {
  const search = new URLSearchParams();
  if (params.query) search.set("q", params.query);
  if (params.category && params.category !== "all") search.set("category", params.category);
  if (params.sort && params.sort !== "featured") search.set("sort", params.sort);
  if (params.drop) search.set("drop", params.drop);
  if (params.availability) search.set("availability", params.availability);
  const q = search.toString();
  return q ? `/shop?${q}` : "/shop";
}

/**
 * The mark that says a filter was pressed and the server is answering.
 *
 * Every link in this bar is a real server navigation, and the bar had no
 * pending state at all: you pressed a category and the page sat there. The
 * feedback used to come from `app/shop/loading.tsx`, a full skeleton for the
 * whole `/shop` segment — which also put every product page behind a Suspense
 * boundary that only ever resolves with JavaScript, so a visitor without it
 * got a permanent skeleton instead of the shop. The route-level loading state
 * is gone; the feedback lives here, on the control that was pressed.
 *
 * The slot is always in the layout and only its opacity changes, so a pending
 * filter cannot shift the row it sits in.
 */
function LinkPending() {
  const { pending } = useLinkStatus();

  return (
    <>
      <span
        aria-hidden="true"
        className={`inline-block h-1 w-1 shrink-0 bg-current [transition:opacity_var(--dur-fast)_var(--ease-out-quart)] ${
          pending ? "opacity-100" : "opacity-0"
        }`}
      />
      {pending ? <span className="visually-hidden">Loading</span> : null}
    </>
  );
}

export default function FilterBar({
  category,
  sort,
  drop,
  dropName,
  availability,
  query,
  count,
  available,
  drops,
  availabilities,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDetailsElement>(null);
  const stockRef = useRef<HTMLDetailsElement>(null);

  const sorts = OFFERED_SORTS.map((key) => ({
    key,
    label:
      SORT_LABELS[key] ??
      SORT_OPTIONS.find((option) => option.key === key)?.label ??
      key,
  }));

  // An order reached by URL that the bar no longer offers still has to name
  // itself, or the chip row reports a filter with no label.
  const sortLabel =
    SORT_LABELS[sort] ??
    SORT_OPTIONS.find((option) => option.key === sort)?.label ??
    sort;

  useLockBodyScroll(sheetOpen);
  useEscape(sheetOpen, () => setSheetOpen(false));
  useFocusTrap(sheetOpen, sheetRef);

  /**
   * The releases, which are what this shop is actually browsed by. The rail
   * only exists once there is more than one: a single-drop label offering a
   * choice of one release is furniture describing itself.
   */
  const releases =
    drops.length > 1
      ? [
          ...drops.map((entry) => ({
            id: entry.slug,
            name: entry.name,
            count: entry.count,
            href: buildHref({ category, sort, drop: entry.slug, availability, query }),
          })),
          {
            id: "all",
            name: "Everything",
            count,
            href: buildHref({ category, sort, availability, query }),
          },
        ]
      : [];

  /* THE STOCK CUT — the axis a shopper actually browses on: what can I get,
     what is coming, what did I miss. It was the one axis the bar did not
     offer. What stood in for it was `?new=1`, rendered under the label "In
     development" — a word about the label's schedule rather than about whether
     a piece is there. Only states that hold at least one piece are offered,
     and the counts are passed in from the same filter the grid runs, so a cut
     can never turn out to be empty. Clicking the active one clears it. */
  const stock = availabilities.map((entry) => ({
    ...entry,
    href: buildHref({
      category,
      sort,
      drop,
      availability: availability === entry.id ? undefined : entry.id,
      query,
    }),
  }));

  const showCategories =
    available.length >= CATEGORY_ROW_MIN_CATEGORIES &&
    (count >= CATEGORY_ROW_MIN_PIECES || category !== "all");

  const filters = [
    { id: "all", name: "All", href: buildHref({ sort, drop, availability, query }) },
    ...CATEGORIES.filter((entry) => available.includes(entry.id)).map((entry) => ({
      id: entry.id,
      name: entry.name,
      href: buildHref({ category: entry.id, sort, drop, availability, query }),
    })),
  ];

  const activeId = category;

  /**
   * WHAT THE BAR LEADS WITH, AND WHY IT IS NOT ALWAYS THE SAME THING.
   *
   * Three axes exist and only one can hold the leading rail. The order of
   * preference is the order a shopper narrows in: which release, then what is
   * in stock, then what kind of garment. A single-release label offering a
   * choice of one release is furniture describing itself, so the releases only
   * take the rail once there are two of them — and until then the stock cut
   * takes it, which is the question someone browsing one drop is actually
   * asking.
   *
   * Whichever axis is not leading and still has something to say goes on the
   * secondary row underneath, so no axis is ever offered twice.
   */
  const axis: "release" | "category" | "none" =
    releases.length > 0 ? "release" : showCategories ? "category" : "none";

  const primary: { id: string; name: string; href: string; count?: number }[] =
    axis === "release" ? releases : axis === "category" ? filters : [];

  const currentId = axis === "release" ? (drop ?? "all") : activeId;

  /** The categories, on the row below, whenever they are not already the rail. */
  const secondary = showCategories && axis === "release" ? filters : [];

  /* Stock does not compete for a rail. Three axes and two rows meant one of
     them was always the one a desktop did not get — and the stock cut is the
     axis a shopper uses most, so it takes a control of its own beside Sort
     rather than a place in a queue. Same `<details>` disclosure: real keyboard
     behaviour, an accessible name, an open state the browser owns, and it
     works with no JavaScript. */
  const stockLabel =
    stock.find((entry) => entry.id === availability)?.name ?? "All";

  const chips = [
    query
      ? {
          key: "q",
          label: `“${query}”`,
          href: buildHref({ category, sort, drop, availability }),
        }
      : null,
    category !== "all"
      ? {
          key: "category",
          label: categoryName(category as CategoryId),
          href: buildHref({ sort, drop, availability, query }),
        }
      : null,
    drop
      ? {
          key: "drop",
          label: dropName ?? drop,
          href: buildHref({ category, sort, availability, query }),
        }
      : null,
    availability
      ? {
          key: "availability",
          label:
            availabilities.find((entry) => entry.id === availability)?.name ??
            availability,
          href: buildHref({ category, sort, drop, query }),
        }
      : null,
    sort !== "featured"
      ? {
          key: "sort",
          label: SORT_OPTIONS.find((option) => option.key === sort)?.label ?? sort,
          href: buildHref({ category, drop, availability, query }),
        }
      : null,
  ].filter((chip): chip is { key: string; label: string; href: string } => chip !== null);

  const pieces = (
    <p className="type-meta text-ink-faint">
      <span className="num">{count}</span>
      <span className="ml-2">{count === 1 ? "piece" : "pieces"}</span>
    </p>
  );

  return (
    <>
      <div className="sticky top-[var(--header-h)] z-[var(--z-sticky)] border-y border-rule bg-surface/95 backdrop-blur-sm">
        <div className="page-frame flex items-center justify-between gap-6 py-3">
          {/* The release is the axis this shop is browsed on, so it takes the
              leading position and the categories — when they are offered at
              all — sit under it as the secondary cut. */}
          <nav
            aria-label={
              axis === "release" ? "Filter by release" : "Filter by category"
            }
            className={primary.length === 0 ? "hidden" : "hidden min-w-0 lg:block"}
          >
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {primary.map((entry) => {
                const current = currentId === entry.id;
                return (
                  <li key={entry.id}>
                    <Link
                      href={entry.href}
                      scroll={false}
                      aria-current={current ? "page" : undefined}
                      className={`type-meta inline-flex items-baseline gap-2 transition-opacity hover:opacity-60 ${
                        current ? "text-ink" : "text-ink-faint"
                      }`}
                    >
                      {entry.name}
                      {entry.count !== undefined ? (
                        <span className="num opacity-60">{entry.count}</span>
                      ) : null}
                      <LinkPending />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="type-meta -my-2 flex items-center gap-2 py-4 lg:hidden"
            aria-expanded={sheetOpen}
          >
            {axis === "none" && stock.length < 2 ? "Sort" : "Filter & sort"}
            {chips.length > 0 ? (
              <span className="num badge badge-solid h-5">{chips.length}</span>
            ) : null}
          </button>

          <div className="flex items-center gap-6">
            {/* The count was hidden below md, so the one number that says
                whether a filter did anything was invisible on a phone. */}
            {pieces}

            {/* One control that names the current order, rather than four
                persistent links. The bar could put seventeen simultaneous
                controls around a nine-piece run, and three of them were the
                sort orders nobody had chosen — the chip row already reports
                which one is on.

                `<details>` rather than state: it is a real disclosure with
                keyboard behaviour, an accessible name and an open/closed state
                the browser owns, and like every other control in this bar it
                still works with no JavaScript. */}
            {stock.length > 1 ? (
              <details ref={stockRef} className="relative hidden lg:block">
                <summary className="type-meta -my-2 flex cursor-pointer list-none items-center gap-2 py-2 transition-opacity hover:opacity-60 [&::-webkit-details-marker]:hidden">
                  <span className="text-ink-faint">Availability</span>
                  <span className="text-ink">{stockLabel}</span>
                </summary>
                <nav
                  aria-label="Filter by availability"
                  className="absolute top-full right-0 z-10 mt-3 min-w-56 border border-ink bg-surface p-2"
                >
                  <ul>
                    <li>
                      <Link
                        href={buildHref({ category, sort, drop, query })}
                        scroll={false}
                        onClick={() => {
                          if (stockRef.current) stockRef.current.open = false;
                        }}
                        aria-current={availability ? undefined : "true"}
                        className={`type-meta block px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper ${
                          availability ? "text-ink-faint" : "text-ink"
                        }`}
                      >
                        All
                      </Link>
                    </li>
                    {stock.map((entry) => (
                      <li key={entry.id}>
                        <Link
                          href={entry.href}
                          scroll={false}
                          onClick={() => {
                            if (stockRef.current) stockRef.current.open = false;
                          }}
                          aria-current={availability === entry.id ? "true" : undefined}
                          className={`type-meta flex items-baseline justify-between gap-4 px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper ${
                            availability === entry.id ? "text-ink" : "text-ink-faint"
                          }`}
                        >
                          {entry.name}
                          <span className="num opacity-60">{entry.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            ) : null}

            <details ref={sortRef} className="relative hidden lg:block">
              <summary className="type-meta -my-2 flex cursor-pointer list-none items-center gap-2 py-2 transition-opacity hover:opacity-60 [&::-webkit-details-marker]:hidden">
                <span className="text-ink-faint">Sort</span>
                <span className="text-ink">{sortLabel}</span>
              </summary>
              <nav
                aria-label="Sort products"
                className="absolute top-full right-0 mt-3 min-w-56 border border-ink bg-surface p-2"
              >
                <ul>
                  {sorts.map((option) => (
                    <li key={option.key}>
                      <Link
                        href={buildHref({
                          category,
                          sort: option.key,
                          drop,
                          availability,
                          query,
                        })}
                        scroll={false}
                        onClick={() => {
                          if (sortRef.current) sortRef.current.open = false;
                        }}
                        aria-current={sort === option.key ? "true" : undefined}
                        className={`type-meta block px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper ${
                          sort === option.key ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {option.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </div>
        </div>

        {/* The secondary cut, and only once there is enough catalogue for it to
            cut anything — and only when the leading rail is already spoken for
            by the releases, so the categories never render twice. */}
        {secondary.length > 0 ? (
          <div className="page-frame hidden border-t border-rule py-2.5 lg:block">
            <nav aria-label="Filter by category">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {secondary.map((filter) => (
                  <li key={filter.id}>
                    <Link
                      href={filter.href}
                      scroll={false}
                      aria-current={activeId === filter.id ? "page" : undefined}
                      className={`type-meta inline-flex items-center gap-2 transition-opacity hover:opacity-60 ${
                        activeId === filter.id ? "text-ink" : "text-ink-faint"
                      }`}
                    >
                      {filter.name}
                      <LinkPending />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ) : null}

        {/* What is on, and how to take it off. Without this the only way to
            read the state of the list was to compare the grid to memory. */}
        {chips.length > 0 ? (
          <div className="page-frame border-t border-rule py-2.5">
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <li className="type-meta text-ink-faint">Filtered</li>
              {chips.map((chip) => (
                <li key={chip.key}>
                  {/* The label is bounded because one of these chips can hold
                      a search term, and a search term is as long as someone
                      typed. A 400-character query pushed the document to
                      3386px wide — the chip is `inline-flex`, so an unbroken
                      token could not wrap and took the whole page sideways
                      with it, on a phone as well as a desktop. */}
                  <Link
                    href={chip.href}
                    scroll={false}
                    title={chip.label}
                    className="type-meta inline-flex max-w-[14rem] items-center gap-2 border border-rule-strong px-2 py-1 transition-colors hover:border-ink"
                  >
                    <span className="min-w-0 truncate">{chip.label}</span>
                    <span aria-hidden="true">×</span>
                    <span className="visually-hidden">— remove this filter</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  scroll={false}
                  className="type-meta text-ink-faint transition-opacity hover:opacity-60"
                >
                  Clear all
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {/* Mobile: a bottom sheet on the documented overlay pattern. It used to be
          conditionally rendered, which is exactly what stops an overlay being
          able to animate out — the same mistake the drawer was built to avoid. */}
      <div
        data-open={sheetOpen}
        className="overlay-root fixed inset-0 z-[var(--z-overlay)] lg:hidden"
      >
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setSheetOpen(false)}
          tabIndex={sheetOpen ? undefined : -1}
          className="absolute inset-0 h-full w-full cursor-default bg-black/40"
        />
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-sheet-title"
          className="overlay-panel overlay-from-below pb-safe absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto bg-surface"
        >
          <div className="flex items-center justify-between border-b border-rule px-6 py-4">
            <h2 id="filter-sheet-title" className="type-meta">
              Filter &amp; sort
            </h2>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="-mr-3 flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
            >
              <CloseIcon />
              <span className="visually-hidden">Close</span>
            </button>
          </div>

          <div className="px-6 py-8">
            {/* The sheet mirrors the bar rather than holding a second, fuller
                set of controls: a phone offered the axes a desktop was judged
                not to need. */}
            {releases.length > 0 ? (
              <>
                <p className="type-meta text-ink-faint">Release</p>
                <ul className="mt-4 space-y-1">
                  {releases.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={entry.href}
                        scroll={false}
                        onClick={() => setSheetOpen(false)}
                        aria-current={
                          (drop ?? "all") === entry.id ? "page" : undefined
                        }
                        className={`type-display-4 flex items-baseline justify-between gap-4 py-2 ${
                          (drop ?? "all") === entry.id
                            ? "text-ink"
                            : "text-ink-faint"
                        }`}
                      >
                        {entry.name}
                        <span className="num type-meta">{entry.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {stock.length > 1 ? (
              <>
                <p
                  className={`type-meta text-ink-faint ${releases.length > 0 ? "mt-10" : ""}`}
                >
                  Availability
                </p>
                <ul className="mt-4 space-y-1">
                  {stock.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={entry.href}
                        scroll={false}
                        onClick={() => setSheetOpen(false)}
                        aria-current={availability === entry.id ? "page" : undefined}
                        className={`type-display-4 flex items-baseline justify-between gap-4 py-2 ${
                          availability === entry.id ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {entry.name}
                        <span className="num type-meta">{entry.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {showCategories ? (
              <>
                <p
                  className={`type-meta text-ink-faint ${
                    releases.length > 0 || stock.length > 1 ? "mt-10" : ""
                  }`}
                >
                  Category
                </p>
                <ul className="mt-4 space-y-1">
                  {filters.map((filter) => (
                    <li key={filter.id}>
                      <Link
                        href={filter.href}
                        scroll={false}
                        onClick={() => setSheetOpen(false)}
                        aria-current={activeId === filter.id ? "page" : undefined}
                        className={`type-display-4 block py-2 ${
                          activeId === filter.id ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {filter.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <p
              className={`type-meta text-ink-faint ${axis === "none" ? "" : "mt-10"}`}
            >
              Sort
            </p>
            <ul className="mt-4 space-y-1">
              {sorts.map((option) => (
                <li key={option.key}>
                  <Link
                    href={buildHref({ category, sort: option.key, drop, availability, query })}
                    scroll={false}
                    onClick={() => setSheetOpen(false)}
                    aria-current={sort === option.key ? "true" : undefined}
                    className={`type-body block py-2 ${
                      sort === option.key ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-5">
              {pieces}
              {chips.length > 0 ? (
                <Link
                  href="/shop"
                  scroll={false}
                  onClick={() => setSheetOpen(false)}
                  className="link-rule link-rule-reveal"
                >
                  Clear all
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
