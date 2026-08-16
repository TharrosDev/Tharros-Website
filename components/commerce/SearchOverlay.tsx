"use client";

import Link from "next/link";
import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import ImageSlot from "@/components/media/ImageSlot";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { createPersistentStore } from "@/lib/persistent-store";
import {
  useDebounced,
  useEscape,
  useFocusTrap,
  useLockBodyScroll,
} from "@/lib/hooks";
import { getFeatured, searchProducts } from "@/lib/catalog/queries";
import { CATEGORIES } from "@/lib/catalog/categories";
import { formatPrice } from "@/lib/format";

const RECENT_KEY = "tharros:recent-searches:v1";
const MAX_RECENT = 5;

type Props = {
  open: boolean;
  onClose: () => void;
  /**
   * True once the overlay has been opened at least once. The overlay stays
   * mounted so it can animate out, but its body should not ship in the HTML of
   * every route before anyone asks for it — that put a four-tile suggestion
   * grid on pages like /faq. Owned by the header so it is latched in an event
   * handler rather than an effect.
   */
  hasOpened: boolean;
};

const recentStore = createPersistentStore<string[]>(RECENT_KEY, [], (raw) =>
  Array.isArray(raw)
    ? raw.filter((entry): entry is string => typeof entry === "string")
    : null,
);

export default function SearchOverlay({ open, onClose, hasOpened }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const showContents = open || hasOpened;

  const recent = useSyncExternalStore(
    recentStore.subscribe,
    recentStore.get,
    recentStore.getServer,
  );

  const debounced = useDebounced(term, 160);
  // This overlay is mounted on every page, so both of these ran on every
  // render of every route — the search scan on each keystroke of the
  // undebounced value, and the suggestions constantly for no reason.
  const results = useMemo(
    () => (debounced.trim().length >= 2 ? searchProducts(debounced) : []),
    [debounced],
  );
  const suggestions = useMemo(() => getFeatured(4), []);

  useLockBodyScroll(open);
  useEscape(open, onClose);
  // Focus lands in the field, not on the close button.
  useFocusTrap(open, panelRef, inputRef);

  const remember = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    recentStore.set((current) =>
      [trimmed, ...current.filter((entry) => entry !== trimmed)].slice(
        0,
        MAX_RECENT,
      ),
    );
  };

  const searching = debounced.trim().length >= 2;

  return (
    <div
      ref={panelRef}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="overlay-root fixed inset-0 z-80 overflow-y-auto bg-surface"
    >
      <div className="page-frame">
        <div
          className="flex items-center justify-between"
          style={{ height: "var(--header-h)" }}
        >
          <p className="type-meta text-ink-faint">Search</p>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 p-1 transition-opacity hover:opacity-60"
          >
            <CloseIcon />
            <span className="visually-hidden">Close search</span>
          </button>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            remember(term);
          }}
          className="flex items-center gap-4 border-b border-ink pb-4"
        >
          <SearchIcon className="shrink-0 text-ink-faint" />
          <label htmlFor="site-search" className="visually-hidden">
            Search products
          </label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="What are you looking for?"
            autoComplete="off"
            className="type-display-3 w-full bg-transparent outline-none placeholder:text-ash"
          />
        </form>

        {showContents ? (
          <div className="grid gap-12 py-12 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div className="space-y-10">
              {recent.length > 0 ? (
                <div>
                  <p className="type-meta mb-4 text-ink-faint">Recent</p>
                  <ul className="space-y-2">
                    {recent.map((entry) => (
                      <li key={entry}>
                        <button
                          type="button"
                          onClick={() => setTerm(entry)}
                          className="type-body-sm transition-opacity hover:opacity-60"
                        >
                          {entry}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <p className="type-meta mb-4 text-ink-faint">Categories</p>
                <ul className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/shop?category=${category.id}`}
                        onClick={onClose}
                        className="type-body-sm transition-opacity hover:opacity-60"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="type-meta mb-6 text-ink-faint" aria-live="polite">
                {searching
                  ? `${results.length} result${results.length === 1 ? "" : "s"}`
                  : "Suggested"}
              </p>

              {searching && results.length === 0 ? (
                <div className="border-t border-rule pt-10">
                  <p className="type-display-3 uppercase">Nothing found.</p>
                  <p className="type-body mt-4 text-ink-muted">
                    Try another search, or{" "}
                    <Link href="/shop" onClick={onClose} className="link-rule">
                      browse everything
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                  {(searching ? results : suggestions).map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={() => {
                          remember(term);
                          onClose();
                        }}
                        className="group block"
                      >
                        <div className="hover-zoom overflow-hidden">
                          <ImageSlot
                            image={product.images[0]}
                            sizes="(min-width: 1024px) 20vw, 45vw"
                          />
                        </div>
                        <p className="type-body-sm mt-3 font-medium">
                          {product.name}
                        </p>
                        <p className="num type-body-sm text-ink-muted">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
