"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ImageSlot from "@/components/media/ImageSlot";
import Wordmark from "@/components/ui/Wordmark";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { NAV_INDEX, SOCIAL } from "@/lib/site";
import { NAV_FRAMES } from "@/lib/catalog/images";
import { CURRENT_DROP, NEXT_DROP } from "@/lib/catalog/drops";
import { formatDate } from "@/lib/format";
import { loadMotion } from "@/lib/motion/registry";
import { prefersReducedMotion } from "@/lib/motion/media";
import { DUR, EASE, STAGGER } from "@/lib/motion/config";

type Props = {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  savedCount: number;
  /** Latched by the header the first time the menu is opened. */
  hasOpened: boolean;
};

/**
 * The site index, as a scene rather than a list of links.
 *
 * One navigation surface at every breakpoint rather than a desktop bar and a
 * separate mobile drawer — the label has five destinations, and a numbered
 * index states that plainly instead of dressing it as a store menu.
 *
 * WHAT MAKES IT A SCENE. Behind the list sits a stack of frames, one per
 * destination. Pointing at a row brings its frame up and drops the other rows
 * back, so the menu says what each place *is* rather than only naming it —
 * Shop is the drop on a body, Archive is a close study of cloth. It is the one
 * piece of navigation on the site that is also photography.
 *
 * THREE THINGS THAT KEEP IT HONEST:
 *
 * 1. **Keyboard drives it identically.** `focusin` runs the same code as
 *    `pointerover`, so this is not a pointer-only feature and a tabbing
 *    visitor sees the same cinematography.
 * 2. **No React state.** Hover is delegated to two listeners on the list which
 *    write straight to GSAP. A `setState` per hovered row would re-render the
 *    whole overlay on every pointer move across it.
 * 3. **The frames do not load until the menu has been opened once.** This
 *    overlay is mounted on every route; four full-bleed pictures behind it
 *    would be four requests on every page for a surface most visitors never
 *    open. `hasOpened` is latched by the header, the same way `SearchOverlay`
 *    already defers its body.
 *
 * Search leads deliberately: taking it out of the header costs discovery, so
 * it is the first thing here and also answers the "/" shortcut.
 */
export default function IndexOverlay({
  open,
  onClose,
  onSearch,
  savedCount,
  hasOpened,
}: Props) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useEscape(open, onClose);
  useFocusTrap(open, panelRef);

  useEffect(() => {
    if (open) onClose();
    // Closing on navigation only — the pathname is the signal, not `open`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // The choreography: rows stagger in on open, and the frame stack answers
  // whichever row is being pointed at or focused.
  useEffect(() => {
    if (!open || prefersReducedMotion()) return;

    const list = listRef.current;
    const stage = stageRef.current;
    if (!list) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    loadMotion().then(({ gsap }) => {
      if (cancelled || !listRef.current) return;

      const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-nav-row]"));
      const frames = stage
        ? Array.from(stage.querySelectorAll<HTMLElement>("[data-nav-frame]"))
        : [];

      const context = gsap.context(() => {
        gsap.from(rows, {
          yPercent: 60,
          autoAlpha: 0,
          duration: DUR.reveal,
          ease: EASE.expo,
          stagger: STAGGER.base,
        });
      }, list);

      const show = (href: string | null) => {
        for (const frame of frames) {
          const active = frame.dataset.navFrame === href;
          gsap.to(frame, {
            autoAlpha: active ? 1 : 0,
            scale: active ? 1 : 1.06,
            duration: DUR.slow,
            ease: EASE.out,
            overwrite: "auto",
          });
        }
        for (const row of rows) {
          const dim = href !== null && row.dataset.navRow !== href;
          gsap.to(row, {
            opacity: dim ? 0.35 : 1,
            duration: DUR.base,
            ease: EASE.out,
            overwrite: "auto",
          });
        }
      };

      const onEnter = (event: Event) => {
        const target = event.target as Element | null;
        const row = target?.closest?.("[data-nav-row]") as HTMLElement | null;
        if (row) show(row.dataset.navRow ?? null);
      };

      const onLeaveList = () => show(null);

      // Focus leaving the list clears the stage; focus moving between two rows
      // inside it does not.
      const onFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (!next || !list.contains(next)) onLeaveList();
      };

      list.addEventListener("pointerover", onEnter);
      list.addEventListener("focusin", onEnter);
      list.addEventListener("pointerleave", onLeaveList);
      list.addEventListener("focusout", onFocusOut);

      teardown = () => {
        list.removeEventListener("pointerover", onEnter);
        list.removeEventListener("focusin", onEnter);
        list.removeEventListener("pointerleave", onLeaveList);
        list.removeEventListener("focusout", onFocusOut);
        context.revert();
        // The frames keep whatever opacity the last hover left them at, and
        // the overlay stays mounted — so they are reset rather than left
        // holding a picture the next open would fade out of.
        gsap.set(frames, { clearProps: "all" });
        gsap.set(rows, { clearProps: "opacity" });
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [open]);

  return (
    <div
      ref={panelRef}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="overlay-root on-dark pb-safe fixed inset-0 z-[var(--z-overlay)] flex flex-col overflow-y-auto"
    >
      {/* THE PICTURE STAGE. Behind the list, inert, and hidden from assistive
          technology — the rows are the content and they name every
          destination in words. `md` and up only: on a phone the list fills the
          screen and a picture behind it is a picture nobody can see. */}
      {hasOpened ? (
        <div
          ref={stageRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 md:block"
        >
          {NAV_INDEX.map((item) =>
            NAV_FRAMES[item.href] ? (
              <div
                key={item.href}
                data-nav-frame={item.href}
                className="absolute inset-0 opacity-0 [mask-image:linear-gradient(to_right,transparent,black_38%)]"
              >
                <ImageSlot
                  image={NAV_FRAMES[item.href]}
                  fill
                  sizes="(min-width: 768px) 50vw, 1px"
                />
              </div>
            ) : null,
          )}
        </div>
      ) : null}

      <div
        className="page-frame flex shrink-0 items-center justify-between"
        style={{ height: "var(--header-h)" }}
      >
        <Wordmark className="type-wordmark" label={false} />
        <button
          type="button"
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          className="-mr-3 inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
        >
          <CloseIcon />
          <span className="visually-hidden">Close menu</span>
        </button>
      </div>

      {/* THE NAVIGATION HAS TO FIT THE SCREEN IT OPENS ON.
          At `display-2` a destination row is 126px, so four of them plus the
          drop line and the footer wanted 959px — on a 675px laptop viewport
          that put About, Saved and all three social links below the
          fold of a surface that IS the site's navigation, with no scroll cue.
          The rung and the padding step down on a short viewport instead. The
          height query rather than a width one because this is a height
          problem: a 1440x1900 monitor never had it.

          980px, not 820: the full-size list needs 959px, so anything short of
          about a thousand has to use the compact one. The first pass drew the
          line at 820 and left every 900px-tall laptop still cutting the social
          row off the bottom. */}
      <div className="page-frame flex flex-1 flex-col justify-center py-10 [@media(max-height:980px)]:py-5">
        {/* THE RULES STOP BEFORE THE PICTURE.
            The stage is the right half of the screen, so a rule drawn across
            the whole page frame runs through whatever photograph is up — four
            hairlines cutting a standing figure into five pieces. Capping the
            width at just past the stage's leading edge keeps the rules in the
            type's own column, where the picture is still fully transparent
            under the mask. */}
        {/* The drop leads the index: it is what the label is currently doing. */}
        <div className="rule-draw flex flex-wrap items-baseline gap-x-5 gap-y-1 pt-4 md:max-w-[54%]">
          <span className="type-mono-2 text-signal-on-dark">{CURRENT_DROP.index}</span>
          <span className="type-meta text-ink-on-dark">{CURRENT_DROP.name}</span>
          <span className="type-meta text-ink-on-dark-faint">
            {/* "Out now" is a claim about the shop, not about the drop, and
                it was being made on every route while nothing could be bought.
                The release date is the fact. */}
            {CURRENT_DROP.releasedAt
              ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
              : "Coming soon"}
          </span>
        </div>

        <nav aria-label="Site navigation" className="mt-10">
          <ul ref={listRef} className="md:max-w-[54%]">
            {NAV_INDEX.map((item, index) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li
                  key={item.href}
                  data-nav-row={item.href}
                  className="border-b border-rule-on-dark"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    tabIndex={open ? undefined : -1}
                    aria-current={active ? "page" : undefined}
                    // Centred, not baseline-aligned: an 11px index sitting on
                    // the baseline of display type reads as belonging to the
                    // rule below it rather than to its own row.
                    className="group flex items-center gap-6 py-4 md:py-5 [@media(max-height:980px)]:md:py-2.5"
                  >
                    <span className="num type-meta text-ink-on-dark-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="type-display-3 uppercase transition-transform duration-500 ease-out group-hover:translate-x-3 md:type-display-2 [@media(max-height:980px)]:md:type-display-3">
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
            <span className="ml-4">Coming next</span>
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
