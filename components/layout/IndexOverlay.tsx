"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Wordmark from "@/components/ui/Wordmark";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { NAV_INDEX, SOCIAL } from "@/lib/site";
import { CURRENT_DROP, NEXT_DROP } from "@/lib/catalog/drops";

type Props = {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  savedCount: number;
};

/**
 * The site index. One navigation surface at every breakpoint rather than a
 * desktop bar and a separate mobile drawer — the label has five destinations,
 * and a numbered index states that plainly instead of dressing it as a store
 * menu.
 *
 * Search leads deliberately: taking it out of the header costs discovery, so
 * it is the first thing here and also answers the "/" shortcut.
 */
export default function IndexOverlay({ open, onClose, onSearch, savedCount }: Props) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useEscape(open, onClose);
  useFocusTrap(open, panelRef);

  useEffect(() => {
    if (open) onClose();
    // Closing on navigation only — the pathname is the signal, not `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={panelRef}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      className="overlay-root on-dark fixed inset-0 z-80 flex flex-col overflow-y-auto"
    >
      <div
        className="page-frame flex shrink-0 items-center justify-between"
        style={{ height: "var(--header-h)" }}
      >
        <Wordmark className="text-lg" label={false} />
        <button
          type="button"
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          className="-mr-3 inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
        >
          <CloseIcon />
          <span className="visually-hidden">Close index</span>
        </button>
      </div>

      <div className="page-frame flex flex-1 flex-col justify-center py-10">
        {/* The drop leads the index: it is what the label is currently doing. */}
        <div className="rule-draw flex flex-wrap items-baseline gap-x-5 gap-y-1 pt-4">
          <span className="type-mono-2 text-signal-on-dark">{CURRENT_DROP.index}</span>
          <span className="type-meta text-ink-on-dark">{CURRENT_DROP.name}</span>
          <span className="type-meta text-ink-on-dark-faint">
            {CURRENT_DROP.status === "released" ? "Out now" : "In development"}
          </span>
        </div>

        <nav aria-label="Index" className="mt-10">
          <ul>
            {NAV_INDEX.map((item, index) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="border-b border-rule-on-dark">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    tabIndex={open ? undefined : -1}
                    aria-current={active ? "page" : undefined}
                    // Centred, not baseline-aligned: an 11px index sitting on
                    // the baseline of display type reads as belonging to the
                    // rule below it rather than to its own row.
                    className="group flex items-center gap-6 py-4 md:py-5"
                  >
                    <span className="num text-[0.6875rem] text-ink-on-dark-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="type-display-3 uppercase transition-opacity group-hover:opacity-60 md:type-display-2">
                      {item.name}
                    </span>
                    {active ? (
                      <span className="type-meta ml-auto text-ink-on-dark-faint">
                        Here
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSearch();
            }}
            tabIndex={open ? undefined : -1}
            className="link-rule link-rule-reveal inline-flex items-center gap-3"
          >
            <SearchIcon />
            Search
          </button>
          <Link
            href="/account"
            onClick={onClose}
            tabIndex={open ? undefined : -1}
            className="link-rule link-rule-reveal"
          >
            Account
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            tabIndex={open ? undefined : -1}
            className="link-rule link-rule-reveal"
          >
            Saved
            {savedCount > 0 ? <span className="num ml-2">{savedCount}</span> : null}
          </Link>
        </div>

        {NEXT_DROP ? (
          <p className="type-meta mt-12 text-ink-on-dark-faint">
            <span className="num text-signal-on-dark">{NEXT_DROP.index}</span>
            <span className="ml-4">In development</span>
          </p>
        ) : null}
      </div>

      <div className="page-frame flex shrink-0 flex-wrap gap-x-6 gap-y-2 border-t border-rule-on-dark py-6">
        {SOCIAL.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            tabIndex={open ? undefined : -1}
            className="type-meta text-ink-on-dark-muted transition-opacity hover:opacity-60"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
}
