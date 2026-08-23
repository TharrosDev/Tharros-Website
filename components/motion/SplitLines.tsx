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
        SplitText.create(target, {
          type: "lines",
          // Each line gets a wrapper with overflow hidden, so a line rises out
          // of a mask rather than sliding in over whatever is above it.
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self: { lines: Element[] }) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: DUR.frame,
              ease: EASE.expo,
              stagger: STAGGER.base,
              delay: delay / 1000,
              scrollTrigger: { trigger: node, start: "top 85%", once: true },
            });
          },
        });
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
