"use client";

import { useEffect, useRef, useState } from "react";
import { observeOnce } from "@/lib/reveal-observer";

/**
 * How an element arrives. One entrance repeated down a page is the tell of
 * generated animation — everything fades up, so nothing is emphasised. The
 * mode is chosen for the content, not assigned at random:
 *
 *   fade   a block of type
 *   frame  a photograph, uncovered bottom-edge-down
 *   wipe   a horizontal uncover — rails, ledgers, rows
 *   mask   a soft sweep, for a picture that should emerge without an edge
 *   rise   the fade at scene scale, for a whole composition
 *   scale  a frame settling from slightly over-size
 *   still  opted out, but keeping its slot in a stagger
 *
 * Every mode is defined in `globals.css` and cancels the base fade rather than
 * stacking with it. See the block headed THE REVEAL MODES.
 */
export type RevealMode =
  | "fade"
  | "frame"
  | "wipe"
  | "mask"
  | "rise"
  | "scale"
  | "still";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms, for siblings revealed together. */
  delay?: number;
  mode?: RevealMode;
  as?: "div" | "section" | "article" | "li" | "figure";
};

/**
 * Scroll-triggered entrance. The hidden state lives behind [data-js] (set by
 * the head script in the root layout), so the entrance is purely additive:
 * with scripting unavailable the section is simply never hidden in the first
 * place. `reveal-in` is added, never removed, for the same reason.
 *
 * This is deliberately NOT a GSAP component. A fade on intersection does not
 * need a timeline library, and routing it through one would cost the
 * [data-js] guarantee above — the SSR HTML would carry a hidden state that
 * only a successful bundle could undo. GSAP drives the scrubbed and pinned
 * work in `components/motion/Scene.tsx`; this drives the other 19 call sites.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  mode = "fade",
  as = "div",
}: Props) {
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Every entrance on the page shares one observer rather than constructing
    // its own — six or seven of them were doing identical work.
    const stop = observeOnce(node, () => setShown(true));

    // No observer available: show it immediately, via the DOM rather than
    // state, so nothing is ever left hidden behind a missing API.
    if (!stop) {
      node.classList.add("reveal-in");
      return;
    }

    return stop;
  }, []);

  // `fade` is the base class on its own — it has no modifier, so it does not
  // need to cancel anything.
  const modeClass = mode === "fade" ? "" : `reveal-${mode}`;

  return (
    <Tag
      ref={ref}
      className={`reveal ${modeClass} ${shown ? "reveal-in" : ""} ${className}`}
      style={
        delay
          ? ({
              transitionDelay: `${delay}ms`,
              // Also published as a property so `.rule-draw`'s pseudo-element
              // can share the stagger; an inline transition-delay never
              // reaches ::before.
              "--reveal-delay": `${delay}ms`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
