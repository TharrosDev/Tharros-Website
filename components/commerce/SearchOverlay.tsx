"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import ImageSlot from "@/components/media/ImageSlot";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import EmptyState from "@/components/ui/EmptyState";
import { createPersistentStore } from "@/lib/persistent-store";
import {
  useDebounced,
  useEscape,
  useFocusTrap,
  useLockBodyScroll,
} from "@/lib/hooks";
import {
  categoriesInUse,
  getFeatured,
  searchProducts,
  thumbnailImage,
} from "@/lib/catalog/queries";
import { CATEGORIES } from "@/lib/catalog/categories";
import { formatPrice } from "@/lib/format";

const RECENT_KEY = "tharros:recent-searches:v1";
const MAX_RECENT = 5;
/** Matches `searchProducts`' own default, so the overlay knows when it is capped. */
const RESULT_LIMIT = 8;

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
  const router = useRouter();
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
    () => (debounced.trim().length >= 2 ? searchProducts(debounced, RESULT_LIMIT) : []),
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
      aria-labelledby="search-title"
      className="overlay-root fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-surface"
    >
      <div className="page-frame">
        <div
          className="flex items-center justify-between"
          style={{ height: "var(--header-h)" }}
        >
          <h2 id="search-title" className="type-meta text-ink-faint">
            Search
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-3 flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
          >
            <CloseIcon />
            <span className="visually-hidden">Close search</span>
          </button>
        </div>

        <form
          role="search"
          // Enter used to record the term and stop. The shop has taken `?q=`
          // the whole time — it is what backs the WebSite SearchAction in the
          // JSON-LD graph — so submitting the search form did nothing while a
          // search engine's deep link worked.
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = term.trim();
            if (trimmed.length < 2) return;
            remember(trimmed);
            onClose();
            router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
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
                {/* Only categories that hold a piece. The overlay offered all
                    of them, linking into rails the shop deliberately hides. */}
                <ul className="space-y-2">
                  {CATEGORIES.filter((category) =>
                    categoriesInUse().includes(category.id),
                  ).map((category) => (
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
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <p className="type-meta text-ink-faint" aria-live="polite">
                  {searching
                    ? `${results.length} result${results.length === 1 ? "" : "s"}`
                    : "Suggested"}
                </p>
                {/* `searchProducts` caps at eight by default, and the overlay
                    gave no way past that cap. */}
                {searching && results.length >= RESULT_LIMIT ? (
                  <Link
                    href={`/shop?q=${encodeURIComponent(debounced.trim())}`}
                    onClick={onClose}
                    className="link-rule link-rule-reveal"
                  >
                    See all results
                  </Link>
                ) : null}
              </div>

              {searching && results.length === 0 ? (
                <EmptyState
                  title="Nothing found."
                  body="Nothing in the run matches that."
                  secondary={{
                    href: "/shop",
                    label: "Browse everything",
                    onClick: onClose,
                  }}
                />
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
                            image={thumbnailImage(product)}
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
