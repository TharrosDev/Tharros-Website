"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/catalog/categories";
import { SORT_OPTIONS } from "@/lib/catalog/queries";
import type { CategoryId } from "@/lib/catalog/types";
import { CloseIcon } from "@/components/ui/icons";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import type { SortKey } from "@/lib/catalog/types";

type Props = {
  category: string;
  sort: SortKey;
  drop?: string;
  newOnly?: boolean;
  count: number;
  /** Only categories that currently hold a piece are offered. */
  available: CategoryId[];
};

/**
 * Filters are links, not state. The URL is the source of truth, so a filtered
 * view is shareable, back-navigable and server-rendered — and the bar keeps
 * working if JS never loads.
 */
function buildHref(params: {
  category?: string;
  sort?: string;
  drop?: string;
  newOnly?: boolean;
}): string {
  const search = new URLSearchParams();
  if (params.category && params.category !== "all") search.set("category", params.category);
  if (params.sort && params.sort !== "featured") search.set("sort", params.sort);
  if (params.drop) search.set("drop", params.drop);
  if (params.newOnly) search.set("new", "1");
  const query = search.toString();
  return query ? `/shop?${query}` : "/shop";
}

export default function FilterBar({ category, sort, drop, newOnly, count, available }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(sheetOpen);
  useEscape(sheetOpen, () => setSheetOpen(false));
  useFocusTrap(sheetOpen, sheetRef);

  const filters = [
    { id: "all", name: "All", href: buildHref({ sort, drop }) },
    ...CATEGORIES.filter((entry) => available.includes(entry.id)).map((entry) => ({
      id: entry.id,
      name: entry.name,
      href: buildHref({ category: entry.id, sort, drop }),
    })),
  ];

  const activeId = newOnly ? "new" : category;

  return (
    <>
      <div className="sticky top-[var(--header-h)] z-40 border-y border-rule bg-surface/95 backdrop-blur-sm">
        <div className="page-frame flex items-center justify-between gap-6 py-3">
          {/* Desktop: everything visible. */}
          <nav aria-label="Filter products" className="hidden lg:block">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {filters.map((filter) => (
                <li key={filter.id}>
                  <Link
                    href={filter.href}
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
            className="type-meta -my-2 py-4 lg:hidden"
            aria-expanded={sheetOpen}
          >
            Filter &amp; sort
          </button>

          <div className="flex items-center gap-6">
            <p className="type-meta hidden text-ink-faint md:block">
              <span className="num">{count}</span>
              <span className="ml-2">{count === 1 ? "piece" : "pieces"}</span>
            </p>

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
                      })}
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
      </div>

      {/* Mobile: a bottom sheet, not a cramped dropdown. */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-70 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/40"
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-surface"
          >
            <div className="flex items-center justify-between border-b border-rule px-6 py-5">
              <p className="type-meta">Filter &amp; sort</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="-mr-1 p-1 transition-opacity hover:opacity-60"
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
                      href={buildHref({ category, sort: option.key, drop, newOnly })}
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
