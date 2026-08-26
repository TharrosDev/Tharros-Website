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
import { STORE_OPEN } from "@/lib/commerce/state";

/** Routes that open on a full-bleed image the header floats over. */
const TRANSPARENT_ROUTES = new Set(["/"]);

/**
 * The navigation trigger, declared once and mounted twice — left below `md`,
 * right from `md` up. Those are two different grid cells, and reordering one
 * element with CSS would put the tab order out of step with the visual order at
 * one breakpoint or the other. `display: none` removes the inactive instance
 * from the accessibility tree, so exactly one is ever exposed.
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
  // Latched the first time the menu is opened, so its four destination frames
  // stay out of every route's HTML until someone actually wants them. Set in
  // the handler rather than in an effect, because that is where it belongs.
  const [indexUsed, setIndexUsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // Latched the first time search is opened, so its body is kept out of the
  // HTML of every route until someone actually wants it. Set here rather than
  // inside the overlay because it belongs in an event handler, not an effect.
  const [searchUsed, setSearchUsed] = useState(false);

  const openIndex = () => {
    setIndexUsed(true);
    setIndexOpen(true);
  };

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

      {/* THE CHROME INVERTS OVER THE HERO: paper ink on a gradient there, dark
          ink on a plate everywhere else.

          Both grounds are always present and cross-fade. Swapping the class
          string outright makes the gradient cease to exist at the threshold
          rather than leave, so the colour transitions and the picture behind
          the header does not. */}
      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-header)] [transition:color_var(--dur-base)_var(--ease-out-quart)] ${
          floating ? "on-dark" : "text-ink"
        }`}
      >
        <span
          aria-hidden="true"
          /* The scrim that holds paper ink off the photograph. Strongest for
             the header's own height, then a fade that ends well before the
             subject of the picture — the hero's own top band carries on from
             here, and between them nothing dims the middle of the frame. */
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/75 via-black/40 to-transparent [transition:opacity_var(--dur-base)_var(--ease-out-quart)] ${
            floating ? "opacity-100" : "opacity-0"
          }`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 border-b border-rule bg-surface/95 backdrop-blur-sm [transition:opacity_var(--dur-base)_var(--ease-out-quart)] ${
            floating ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* THREE CELLS, NOT A FLEX SPLIT. The sides change width at runtime —
            the bag count appears and grows, the saved count appears — and
            `justify-between` would centre the middle group in whatever space
            they left over, so the wordmark would drift on every add to bag. An
            `auto` column between two `1fr` columns is centred regardless. */}
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
                        /* Active carries a rule as well as full opacity: on
                           11px type a 30% opacity step is the faintest signal
                           in the system, spent on the one control that says
                           where you are. */
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
              onOpen={openIndex}
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
              /* A 24px box. The mark is as tall as its glyphs — 18px on a
                 phone — and the stamp sits flush under it, so without the box
                 the home link and `/drop` are two abutting targets 21px between
                 centres. */
              className="inline-flex h-6 shrink-0 items-center"
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
            {/* A real control, not just the `/` shortcut below: a shortcut
                documented nowhere is not an affordance. */}
            <button
              type="button"
              onClick={openSearch}
              aria-expanded={searchOpen}
              className="inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
            >
              <SearchIcon />
              <span className="visually-hidden">Search</span>
            </button>

            {/* Saved sits beside the bag and appears only once something is in
                it — a permanent zero is chrome displaying a nothing, which is
                also why the bag count is absent at zero.

                Not below `sm`: at 320px the frame is 272px and the bar
                overflows. `IndexOverlay` carries Saved with the same count, one
                tap away behind Menu. */}
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

            {/* "Menu", not "Index": one is a customer's word, one is a
                designer's. */}
            <MenuButton
              open={indexOpen}
              onOpen={openIndex}
              className="hidden md:inline-flex"
            />

            {/* Absent, not disabled, while the shop is closed: a bag icon is a
                promise that there is somewhere to put something. */}
            {STORE_OPEN ? (
            <button
              type="button"
              onClick={openBag}
              className="-mr-2 inline-flex h-11 items-center gap-2 px-2 transition-opacity hover:opacity-60"
            >
              <BagIcon />
              {/* Keyed on the count so the nudge restarts on every add — no
                  timer, no state. Absent rather than zero. */}
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
            ) : null}
          </div>
        </div>
      </header>

      <IndexOverlay
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        onSearch={openSearch}
        savedCount={savedCount}
        hasOpened={indexUsed}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        hasOpened={searchUsed}
      />
    </>
  );
}
