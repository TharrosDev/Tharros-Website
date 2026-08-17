"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CATEGORIES, categoryName } from "@/lib/catalog/categories";
import { SORT_OPTIONS } from "@/lib/catalog/queries";
import type { CategoryId } from "@/lib/catalog/types";
import { CloseIcon } from "@/components/ui/icons";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import type { SortKey } from "@/lib/catalog/types";

type Props = {
  category: string;
  sort: SortKey;
  drop?: string;
  dropName?: string;
  newOnly?: boolean;
  /** The active `?q=`, carried through every link the bar builds. */
  query?: string;
  count: number;
  /** Only categories that currently hold a piece are offered. */
  available: CategoryId[];
};

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
  newOnly?: boolean;
  query?: string;
}): string {
  const search = new URLSearchParams();
  if (params.query) search.set("q", params.query);
  if (params.category && params.category !== "all") search.set("category", params.category);
  if (params.sort && params.sort !== "featured") search.set("sort", params.sort);
  if (params.drop) search.set("drop", params.drop);
  if (params.newOnly) search.set("new", "1");
  const q = search.toString();
  return q ? `/shop?${q}` : "/shop";
}

export default function FilterBar({
  category,
  sort,
  drop,
  dropName,
  newOnly,
  query,
  count,
  available,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(sheetOpen);
  useEscape(sheetOpen, () => setSheetOpen(false));
  useFocusTrap(sheetOpen, sheetRef);

  const filters = [
    { id: "all", name: "All", href: buildHref({ sort, drop, query }) },
    ...CATEGORIES.filter((entry) => available.includes(entry.id)).map((entry) => ({
      id: entry.id,
      name: entry.name,
      href: buildHref({ category: entry.id, sort, drop, query }),
    })),
    // `?new=1` used to be an orphan: it filtered the grid, but no entry in this
    // list carried its id, so nothing was ever marked current and the view gave
    // no sign it was filtered at all.
    ...(newOnly
      ? [{ id: "new", name: "In development", href: buildHref({ sort, drop, query, newOnly: true }) }]
      : []),
  ];

  const activeId = newOnly ? "new" : category;

  /** What is actually narrowing the list, each removable on its own. */
  const chips = [
    query
      ? { key: "q", label: `“${query}”`, href: buildHref({ category, sort, drop, newOnly }) }
      : null,
    category !== "all"
      ? {
          key: "category",
          label: categoryName(category as CategoryId),
          href: buildHref({ sort, drop, newOnly, query }),
        }
      : null,
    drop
      ? { key: "drop", label: dropName ?? drop, href: buildHref({ category, sort, newOnly, query }) }
      : null,
    newOnly
      ? { key: "new", label: "In development", href: buildHref({ category, sort, drop, query }) }
      : null,
    sort !== "featured"
      ? {
          key: "sort",
          label: SORT_OPTIONS.find((option) => option.key === sort)?.label ?? sort,
          href: buildHref({ category, drop, newOnly, query }),
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
          {/* Desktop: everything visible. */}
          <nav aria-label="Filter products" className="hidden lg:block">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {filters.map((filter) => (
                <li key={filter.id}>
                  <Link
                    href={filter.href}
                    scroll={false}
                    aria-current={activeId === filter.id ? "page" : undefined}
                    className={`type-meta transition-opacity hover:opacity-60 ${
                      activeId === filter.id ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {filter.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="type-meta -my-2 flex items-center gap-2 py-4 lg:hidden"
            aria-expanded={sheetOpen}
          >
            Filter &amp; sort
            {chips.length > 0 ? (
              <span className="num badge badge-solid h-5">{chips.length}</span>
            ) : null}
          </button>

          <div className="flex items-center gap-6">
            {/* The count was hidden below md, so the one number that says
                whether a filter did anything was invisible on a phone. */}
            {pieces}

            <nav aria-label="Sort products" className="hidden lg:block">
              <ul className="flex items-center gap-5">
                {SORT_OPTIONS.map((option) => (
                  <li key={option.key}>
                    <Link
                      href={buildHref({
                        category,
                        sort: option.key,
                        drop,
                        newOnly,
                        query,
                      })}
                      scroll={false}
                      aria-current={sort === option.key ? "true" : undefined}
                      className={`type-meta transition-opacity hover:opacity-60 ${
                        sort === option.key ? "text-ink" : "text-ink-faint"
                      }`}
                    >
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* What is on, and how to take it off. Without this the only way to
            read the state of the list was to compare the grid to memory. */}
        {chips.length > 0 ? (
          <div className="page-frame border-t border-rule py-2.5">
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <li className="type-meta text-ink-faint">Filtered</li>
              {chips.map((chip) => (
                <li key={chip.key}>
                  <Link
                    href={chip.href}
                    scroll={false}
                    className="type-meta inline-flex items-center gap-2 border border-rule-strong px-2 py-1 transition-colors hover:border-ink"
                  >
                    {chip.label}
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
          className="overlay-panel overlay-from-below absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto bg-surface"
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
            <p className="type-meta text-ink-faint">Category</p>
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

            <p className="type-meta mt-10 text-ink-faint">Sort</p>
            <ul className="mt-4 space-y-1">
              {SORT_OPTIONS.map((option) => (
                <li key={option.key}>
                  <Link
                    href={buildHref({ category, sort: option.key, drop, newOnly, query })}
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
