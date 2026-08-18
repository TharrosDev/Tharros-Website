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

/**
 * The navigation trigger, declared once and mounted twice.
 *
 * It sits on the left below `md` — where it is the only navigation there is —
 * and on the right from `md` up, beside the other utilities, once the primary
 * links have taken the left cell. Those are two different grid cells, so one
 * element cannot occupy both.
 *
 * The alternative was a single button reordered with CSS, which puts the tab
 * order out of step with the visual order at one breakpoint or the other. Two
 * display-gated instances keep them in step: `display: none` removes the
 * inactive one from the accessibility tree, so exactly one is ever exposed.
 */
function MenuButton({
  open,
  onOpen,
  className = "",
}: {
  open: boolean;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={open}
      className={`type-meta h-11 items-center px-2 transition-opacity hover:opacity-60 ${className}`}
    >
      Menu
      <span className="visually-hidden">— open site navigation</span>
    </button>
  );
}

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
        {/* THREE CELLS, NOT A FLEX SPLIT.
            The mark is centred on the frame, and it has to stay centred while
            the sides change width — which they do at runtime: the bag count
            appears and grows, the saved count appears, the active nav label
            changes length. `justify-between` would centre the middle group in
            whatever space the other two left over, so the wordmark would drift
            every time something was added to the bag. An `auto` column between
            two `1fr` columns is centred on the frame regardless. */}
        <div
          className="page-frame grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4"
          style={{ height: "var(--header-h)" }}
        >
          <div className="flex items-center justify-self-start">
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
                        /* Active carries a rule as well as full opacity. On
                           11px type a 30% opacity step is the faintest signal
                           in the system, spent on the one control that says
                           where you are. The hairline is the same gesture
                           `.link-rule` already uses on text links, so it reads
                           as this site rather than as a tab bar. */
                        className={`type-meta relative inline-flex h-11 items-center px-3 transition-opacity hover:opacity-60 ${
                          active
                            ? "opacity-100 after:absolute after:inset-x-3 after:bottom-2.5 after:h-px after:bg-current"
                            : "opacity-70"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <MenuButton
              open={indexOpen}
              onOpen={() => setIndexOpen(true)}
              className="-ml-2 inline-flex md:hidden"
            />
          </div>

          {/* THE MARK, and under it the one thing the label is currently
              releasing. The stamp was beside the wordmark; stacked beneath it
              it reads as the caption it always was, and the pair centres as a
              single object. */}
          <div className="flex flex-col items-center justify-self-center">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center"
              aria-label="THARROS — home"
            >
              <Wordmark className="type-wordmark" label={false} />
            </Link>

            {/* The only accent in the chrome, so it is never hidden by
                breakpoint. It carries its own 24px box now: stacked under the
                wordmark it can no longer use negative margins to grow its
                target without overlapping the link above it. */}
            <Link
              href="/drop"
              className="type-meta inline-flex h-6 items-center px-1 text-signal transition-opacity hover:opacity-60"
            >
              <span className="num">{CURRENT_DROP.index}</span>
              <span className="visually-hidden"> — {CURRENT_DROP.name}</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 justify-self-end md:gap-3">
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
                nothing, the same reason the bag count is absent at zero.

                Not below `sm`. At 320px the frame is 272px — `--gutter` floors
                at 1.5rem — and the bar already overflowed there once anything
                was saved, before this layout. `IndexOverlay` lists Saved with
                the same count, one tap away behind the Menu button. */}
            {savedCount > 0 ? (
              <Link
                href="/wishlist"
                className="hidden h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60 sm:inline-flex"
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
            <MenuButton
              open={indexOpen}
              onOpen={() => setIndexOpen(true)}
              className="hidden md:inline-flex"
            />

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
