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
import { BagIcon, HeartIcon, SearchIcon } from "@/components/ui/icons";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { NAV_PRIMARY } from "@/lib/site";

/** Routes that open on a full-bleed image the header floats over. */
const TRANSPARENT_ROUTES = new Set(["/"]);

export default function Header() {
  const pathname = usePathname();
  const { count, openBag, ready, isOpen: bagOpen } = useCart();
  const { ids, ready: wishlistReady } = useWishlist();

  const [indexOpen, setIndexOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Latched the first time search is opened, so its body is kept out of the
  // HTML of every route until someone actually wants it. Set here rather than
  // inside the overlay because it belongs in an event handler, not an effect.
  const [searchUsed, setSearchUsed] = useState(false);

  const openSearch = () => {
    setSearchUsed(true);
    setIndexOpen(false);
    setSearchOpen(true);
  };

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
      openSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bagOpen]);

  return (
    <>
      <a href="#main" className="type-meta skip-link">
        Skip to content
      </a>

      {/* The floating → solid change is a cross-fade between two grounds that
          are both always present, rather than a swap of the whole class string.
          Before this the scrim was a `before:` gradient that only existed while
          floating, so it vanished the instant the page passed 24px — the colour
          transitioned and the picture behind the header did not.

          THE CHROME IS LIGHT ON EVERY ROUTE. It used to invert over the hero:
          `on-dark`, paper ink, and a black gradient down from the top edge to
          hold it off the photograph. That was necessary while the hero was a
          full-bleed picture with type laid over it. The hero keeps its picture
          to one side now, so the header sits on the page rather than on the
          image, and a black band across the top of a light site was the one
          piece of chrome still arguing with the ground.

          What floats is the ground, not the ink: a paper wash with no rule,
          fading up into a solid plate with one once the page has moved. */}
      <header
        className="fixed inset-x-0 top-0 z-[var(--z-header)] text-ink [transition:color_var(--dur-base)_var(--ease-out-quart)]"
      >
        <span
          aria-hidden="true"
          /* Solid paper for the header's own height, then a fade. The ink is
             dark now, and on the home page the hero photograph runs to the top
             edge — on a phone it is directly behind the wordmark. A gentle
             wash that was already half transparent at 36px left dark type on a
             picture, which is the same legibility failure the old dark scrim
             existed to prevent, just inverted. The fade starts below the
             controls and ends before the picture is dimmed. */
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-[var(--paper)] from-45% via-[var(--paper)]/75 to-transparent [transition:opacity_var(--dur-base)_var(--ease-out-quart)] ${
            floating ? "opacity-100" : "opacity-0"
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 border-b border-rule bg-surface/95 backdrop-blur-sm [transition:opacity_var(--dur-base)_var(--ease-out-quart)] ${
            floating ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className="page-frame flex items-center justify-between gap-4"
          style={{ height: "var(--header-h)" }}
        >
          <div className="flex items-center gap-5">
            <Link href="/" className="inline-flex h-11 shrink-0 items-center" aria-label="THARROS — home">
              <Wordmark className="type-wordmark" label={false} />
            </Link>

            {/* The drop stamp. The one persistent mark of what the label is
                currently releasing, and the only accent in the chrome — so
                hiding it below `sm` left the site with no accent at all on the
                device most people meet it on. It is three characters. */}
            <Link
              href="/drop"
              className="type-meta -my-2 inline-block py-2 text-signal transition-opacity hover:opacity-60"
            >
              <span className="num">{CURRENT_DROP.index}</span>
              <span className="visually-hidden"> — {CURRENT_DROP.name}</span>
            </Link>

            {/* Real links, so they survive scripting being unavailable and the
                site is never left with the footer as its only navigation. The
                overlay keeps everything else. */}
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {NAV_PRIMARY.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`type-meta inline-flex h-11 items-center px-3 transition-opacity hover:opacity-60 ${
                          active ? "opacity-100" : "opacity-70"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            {/* Search had no visible affordance at all — it was reachable from
                inside the index overlay, or from a `/` shortcut documented
                nowhere. That is a shortcut standing in for a control. */}
            <button
              type="button"
              onClick={openSearch}
              aria-expanded={searchOpen}
              className="inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
            >
              <SearchIcon />
              <span className="visually-hidden">Search</span>
            </button>

            {/* Saved is per-visitor state, so it belongs beside the bag rather
                than counted on the navigation button — a number on "Menu" is a
                number about something the menu is not. It appears only once
                something is in it: a permanent zero is chrome displaying a
                nothing, the same reason the bag count is absent at zero. */}
            {savedCount > 0 ? (
              <Link
                href="/wishlist"
                className="inline-flex h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60"
              >
                <HeartIcon />
                <span className="num type-mono-3" aria-hidden="true">
                  {savedCount}
                </span>
                <span className="visually-hidden">
                  Saved — {savedCount} piece{savedCount === 1 ? "" : "s"}
                </span>
              </Link>
            ) : null}

            {/* "Index" is a designer's word for a list of pages. Every customer
                who has ever looked for navigation was looking for a menu. */}
            <button
              type="button"
              onClick={() => setIndexOpen(true)}
              aria-expanded={indexOpen}
              className="type-meta -my-2 inline-flex h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60"
            >
              Menu
              <span className="visually-hidden">— open site navigation</span>
            </button>

            <button
              type="button"
              onClick={openBag}
              className="-mr-2 inline-flex h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60"
            >
              <BagIcon />
              {/* Keyed on the count so the nudge animation restarts on every
                  add — no timer, no state. Absent rather than zero: a badge
                  reading "0" is chrome permanently displaying a nothing, and
                  the icon already says what it is. */}
              {ready && count > 0 ? (
                <span
                  key={count}
                  className="num type-mono-3 bag-count"
                  aria-hidden="true"
                >
                  {count}
                </span>
              ) : null}
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
        onSearch={openSearch}
        savedCount={savedCount}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        hasOpened={searchUsed}
      />
    </>
  );
}
