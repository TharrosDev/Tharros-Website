"use client";

import { useRef } from "react";
import { useScene } from "@/lib/motion/use-scene";
import { DEPTH, EASE, type Depth } from "@/lib/motion/config";
import { QUERY } from "@/lib/motion/media";

/**
 * Depth without a whole scene.
 *
 * Most parallax on the site is one element drifting against the one behind it,
 * which does not need a timeline or a pin. This is that case: a single
 * scrubbed tween from `+travel` to `-travel`, where travel comes from the
 * depth ladder rather than from a number somebody picked.
 *
 * The travel is a fraction of the element's OWN height (`yPercent`), not a
 * pixel figure, so the same `depth` reads the same on a 300px thumbnail and a
 * full-bleed frame. A fixed 40px drift is a large move on the first and
 * invisible on the second.
 *
 * There is no flash when GSAP arrives late. A scrubbed `fromTo` renders at the
 * progress the current scroll position implies, not at its `from` state, so
 * the element lands where it belongs on the frame it is created.
 *
 * On a coarse pointer the travel is halved rather than removed. Switching
 * parallax off on touch leaves the site with no depth at all on the device
 * most people meet it on, which is the wrong trade — the reason to reduce it
 * there is that a thumb scrolls faster than a wheel, not that motion is
 * unwelcome.
 */
export default function Parallax({
  children,
  depth = "subject",
  className = "",
  cursorMode,
  as = "div",
}: {
  children: React.ReactNode;
  depth?: Depth;
  className?: string;
  /**
   * Declared explicitly rather than spread from `...rest`. A hyphenated JSX
   * attribute passes TypeScript on ANY component whether or not the component
   * forwards it, so `data-cursor-mode` written at a call site would have been
   * silently dropped here with no error anywhere.
   */
  cursorMode?: string;
  as?: "div" | "figure" | "span" | "p";
}) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement>(null);

  useScene(
    ref,
    ({ gsap }, node) => {
      const media = gsap.matchMedia();
      const travel = DEPTH[depth] * 100;

      const attach = (scale: number) => () => {
        gsap.fromTo(
          node,
          { yPercent: travel * scale },
          {
            yPercent: -travel * scale,
            ease: EASE.scrub,
            scrollTrigger: {
              trigger: node,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      };

      media.add(QUERY.motion + " and " + QUERY.fine, attach(1));
      media.add(QUERY.motion + " and " + QUERY.coarse, attach(0.5));

      // Reduced motion: nothing is attached and nothing is written, so the
      // element sits exactly where the document put it.
    },
    [depth],
  );

  return (
    <Tag ref={ref} className={className} data-cursor-mode={cursorMode}>
      {children}
    </Tag>
  );
}
