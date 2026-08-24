"use client";

import { useRef } from "react";
import { useScene } from "@/lib/motion/use-scene";
import { DUR, EASE, STAGGER } from "@/lib/motion/config";
import { QUERY } from "@/lib/motion/media";

/**
 * Display type arriving a line at a time, each line rising out of its own
 * mask.
 *
 * This is the site's loudest typographic gesture, so it is reserved for
 * display-scale statements — a drop line, a section title, the one sentence a
 * page is about. Applied to body copy it turns reading into waiting.
 *
 * NO HIDDEN PRE-STATE. The heading is server-rendered as ordinary text and is
 * readable from first paint; the split and the rise happen after GSAP arrives.
 * That is deliberate — a `[data-js]`-gated hidden heading would be invisible
 * for the frames before the library loads, on the element most likely to be
 * the largest paint on its page. The gesture enhances type that already reads.
 *
 * ACCESSIBILITY. `SplitText` rewrites the children into per-line spans, which
 * would otherwise shred the text for a screen reader. `aria-label` restates
 * the whole string on the wrapper and the generated spans sit inside an
 * `aria-hidden` element, so the accessible name is the sentence either way.
 * `autoSplit` re-splits on a font load or a resize, which stops lines being
 * measured against a fallback face and then reflowing mid-animation.
 *
 * REDUCED MOTION never splits and never hides — the heading renders as the
 * plain heading it already is.
 */
export default function SplitLines({
  children,
  text,
  delay = 0,
  className = "",
  id,
  as = "h2",
}: {
  children?: React.ReactNode;
  /** The full string, for the accessible name. */
  text: string;
  delay?: number;
  className?: string;
  /** So a labelled section can point `aria-labelledby` at this heading. */
  id?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement>(null);

  useScene(
    ref,
    ({ gsap, SplitText }, node) => {
      const target = node.querySelector<HTMLElement>("[data-split]");
      if (!target) return;

      const media = gsap.matchMedia();

      media.add(QUERY.motion, () => {
        // Whether the entrance has already run for this element. A re-split is
        // a re-MEASURE, not a replay — see onSplit.
        let arrived = false;
        let entrance: { kill: () => void; scrollTrigger?: { kill: () => void } } | null =
          null;

        SplitText.create(target, {
          type: "lines",
          // Each line gets a wrapper with overflow hidden, so a line rises out
          // of a mask rather than sliding in over whatever is above it.
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self: { lines: Element[] }) {
            // A HEADING THAT IS ALREADY ON SCREEN DOES NOT WAIT FOR A SCROLL.
            //
            // This used to hand every entrance a ScrollTrigger at `top 85%`,
            // including the ones sitting at the top of the page where that
            // point is already behind the viewport before the trigger exists.
            // `autoSplit` re-splits when the webfont lands, and the runtime
            // calls `ScrollTrigger.refresh()` on `document.fonts.ready` — so
            // the replacement trigger was being created during a refresh it
            // was not part of, against a start it had already passed, on a page
            // nobody had scrolled. It never evaluated, and the lines it owned
            // stayed at `yPercent: 110` for good.
            //
            // The failure is not subtle and it is not rare: the `h1` on
            // `/about`, `/archive` and `/drop` and the line on the 404 render
            // as a sliced fragment of their own letterforms — `line-height` is
            // below 1 on the display ladder, so what shows is the part of the
            // glyph that overhangs its own mask. It reproduces in Chrome and
            // not in headless, which is why it survived: the fonts are already
            // warm in a fresh headless context and the re-split never happens.
            //
            // So the trigger is only attached when the heading is actually
            // below the fold. In view, it just plays.
            const inView =
              node.getBoundingClientRect().top < window.innerHeight * 0.85;

            // A re-split replaces the line elements, so the tween that owned
            // the old ones — and any trigger still holding a reference to them
            // — is finished with. Left alive they accumulate one per font load
            // and per resize.
            entrance?.scrollTrigger?.kill();
            entrance?.kill();

            if (arrived) {
              // Already seen. Re-measured lines belong at rest, not at the top
              // of a second performance.
              gsap.set(self.lines, { yPercent: 0 });
              entrance = null;
              return;
            }

            entrance = gsap.from(self.lines, {
              yPercent: 110,
              duration: DUR.frame,
              ease: EASE.expo,
              stagger: STAGGER.base,
              delay: delay / 1000,
              ...(inView
                ? {}
                : {
                    scrollTrigger: {
                      trigger: node,
                      start: "top 85%",
                      once: true,
                      onEnter: () => {
                        arrived = true;
                      },
                    },
                  }),
            });
            if (inView) arrived = true;
            return entrance;
          },
        });

        return () => {
          entrance?.scrollTrigger?.kill();
          entrance?.kill();
        };
      });
    },
    [text, delay],
  );

  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      <span data-split aria-hidden="true">
        {children ?? text}
      </span>
    </Tag>
  );
}
