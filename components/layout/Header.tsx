"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScrolledPast } from "@/lib/hooks";
import Wordmark from "@/components/ui/Wordmark";
import MobileNav from "./MobileNav";
import SearchOverlay from "@/components/commerce/SearchOverlay";
import { useCart } from "@/components/commerce/CartProvider";
import { useWishlist } from "@/components/commerce/WishlistProvider";
import { AccountIcon, BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { NAV_PRIMARY } from "@/lib/site";

/** Routes that open on a full-bleed image the header floats over. */
const TRANSPARENT_ROUTES = new Set(["/", "/lookbook"]);

export default function Header() {
  const pathname = usePathname();
  const { count, openBag, ready } = useCart();
  const { ids, ready: wishlistReady } = useWishlist();

  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const scrolled = useScrolledPast(24);
  const floating = TRANSPARENT_ROUTES.has(pathname) && !scrolled;
  const savedCount = wishlistReady ? ids.length : 0;

  return (
    <>
      <a
        href="#main"
        className="type-meta skip-link"
      >
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
          <div className="flex flex-1 items-center gap-8">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="-ml-3 inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 lg:hidden"
              aria-expanded={navOpen}
            >
              <MenuIcon />
              <span className="visually-hidden">Open menu</span>
            </button>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {NAV_PRIMARY.map((item) => {
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`link-rule ${active ? "" : "link-rule-reveal"}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <Link href="/" className="inline-flex h-11 shrink-0 items-center" aria-label="THARROS — home">
            <Wordmark className="text-lg md:text-xl" label={false} />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
            >
              <SearchIcon />
              <span className="visually-hidden">Search</span>
            </button>

            <Link href="/account" className="hidden h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 md:inline-flex">
              <AccountIcon />
              <span className="visually-hidden">Account</span>
            </Link>

            <Link href="/wishlist" className="relative hidden h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 md:inline-flex">
              <HeartIcon filled={savedCount > 0} />
              <span className="visually-hidden">
                Saved items{savedCount > 0 ? ` (${savedCount})` : ""}
              </span>
            </Link>

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

      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
