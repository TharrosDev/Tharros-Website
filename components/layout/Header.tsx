"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScrolledPast } from "@/lib/hooks";
import Wordmark from "@/components/ui/Wordmark";
import IndexOverlay from "./IndexOverlay";
import SearchOverlay from "@/components/commerce/SearchOverlay";
import { useCart } from "@/components/commerce/CartProvider";
import { useWishlist } from "@/components/commerce/WishlistProvider";
import { BagIcon } from "@/components/ui/icons";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/** Routes that open on a full-bleed image the header floats over. */
const TRANSPARENT_ROUTES = new Set(["/", "/lookbook"]);

export default function Header() {
  const pathname = usePathname();
  const { count, openBag, ready, isOpen: bagOpen } = useCart();
  const { ids, ready: wishlistReady } = useWishlist();

  const [indexOpen, setIndexOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const scrolled = useScrolledPast(24);
  const floating = TRANSPARENT_ROUTES.has(pathname) && !scrolled;
  const savedCount = wishlistReady ? ids.length : 0;

  // Search is no longer a permanent icon, so it gets a shortcut. It stands down
  // while the visitor is typing, and while the bag already owns the screen —
  // opening search over an open drawer left two modal dialogs live at once,
  // with competing focus traps and a nested scroll lock. The index is the one
  // surface it may replace, because index → search is a deliberate path.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (bagOpen) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }
      event.preventDefault();
      setIndexOpen(false);
      setSearchOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bagOpen]);

  return (
    <>
      <a href="#main" className="type-meta skip-link">
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-60 transition-colors duration-300 ${
          floating
            ? "on-dark bg-transparent text-paper before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-32 before:bg-gradient-to-b before:from-black/55 before:to-transparent"
            : "border-b border-rule bg-surface/95 text-ink backdrop-blur-sm"
        }`}
      >
        <div
          className="page-frame flex items-center justify-between gap-4"
          style={{ height: "var(--header-h)" }}
        >
          <div className="flex items-center gap-5">
            <Link href="/" className="inline-flex h-11 shrink-0 items-center" aria-label="THARROS — home">
              <Wordmark className="text-lg md:text-xl" label={false} />
            </Link>

            {/* The drop stamp. The one persistent mark of what the label is
                currently releasing, and the only accent in the chrome. */}
            <Link
              href="/drop"
              className="type-meta -my-2 hidden py-2 text-signal transition-opacity hover:opacity-60 sm:inline-block"
            >
              <span className="num">{CURRENT_DROP.index}</span>
              <span className="visually-hidden"> — {CURRENT_DROP.name}</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <button
              type="button"
              onClick={() => setIndexOpen(true)}
              aria-expanded={indexOpen}
              className="type-meta -my-2 inline-flex h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60"
            >
              Index
              {savedCount > 0 ? (
                <span className="num text-[0.6875rem] opacity-60">{savedCount}</span>
              ) : null}
              <span className="visually-hidden">
                — open site index{savedCount > 0 ? `, ${savedCount} saved` : ""}
              </span>
            </button>

            <button
              type="button"
              onClick={openBag}
              className="-mr-2 inline-flex h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60"
            >
              <BagIcon />
              {/* Keyed on the count so the nudge animation restarts on every
                  add — no timer, no state. */}
              <span
                key={count}
                className="num bag-count text-[0.8125rem]"
                aria-hidden="true"
              >
                {ready ? count : 0}
              </span>
              <span className="visually-hidden">
                Open bag — {ready ? count : 0} item{count === 1 ? "" : "s"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <IndexOverlay
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        onSearch={() => setSearchOpen(true)}
        savedCount={savedCount}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
