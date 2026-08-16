"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Wordmark from "@/components/ui/Wordmark";
import { CloseIcon } from "@/components/ui/icons";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { NAV_MOBILE, SOCIAL } from "@/lib/site";

type Props = {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
};

export default function MobileNav({ open, onClose, onSearch }: Props) {
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
      aria-label="Menu"
      className="overlay-root on-dark fixed inset-0 z-80 flex flex-col"
    >
      <div
        className="page-frame flex shrink-0 items-center justify-between"
        style={{ height: "var(--header-h)" }}
      >
        <Wordmark className="text-lg" label={false} />
        <button type="button" onClick={onClose} className="-mr-1 p-1 transition-opacity hover:opacity-60">
          <CloseIcon />
          <span className="visually-hidden">Close menu</span>
        </button>
      </div>

      <nav aria-label="Mobile" className="page-frame flex flex-1 flex-col justify-center">
        <ul className="space-y-1">
          {NAV_MOBILE.map((item, index) => (
            <li key={item.href} className="border-b border-rule-on-dark">
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-baseline gap-5 py-4"
              >
                <span className="num text-[0.6875rem] text-ink-on-dark-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="type-display-3 uppercase">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSearch();
            }}
            className="link-rule link-rule-reveal"
          >
            Search
          </button>
          <Link href="/account" onClick={onClose} className="link-rule link-rule-reveal">
            Account
          </Link>
          <Link href="/wishlist" onClick={onClose} className="link-rule link-rule-reveal">
            Saved
          </Link>
        </div>
      </nav>

      <div className="page-frame flex flex-wrap gap-x-6 gap-y-2 border-t border-rule-on-dark py-6">
        {SOCIAL.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            className="type-meta text-ink-on-dark-muted transition-opacity hover:opacity-60"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
}
