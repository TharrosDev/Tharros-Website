"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, EASE_EXPO } from "@/lib/gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Wrapping element. Keep the real heading inside `children` for semantics. */
  as?: ElementType;
  type?: "lines" | "words";
  stagger?: number;
  duration?: number;
  delay?: number;
  /** ScrollTrigger start. Omit to play on mount. */
  start?: string;
}

/**
 * Masked split reveal. Lines (or words) wipe up from behind an overflow clip.
 * SSR-safe: the text renders normally and stays visible if JS never runs; the
 * split + hide happens inside a layout effect (pre-paint) so there's no flash.
 */
export default function SplitReveal({
  children,
  className = "",
  as: Tag = "div",
  type = "lines",
  stagger = 0.1,
  duration = 0.9,
  delay = 0,
  start,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, { type, mask: type });
        const targets = type === "lines" ? split.lines : split.words;

        gsap.from(targets, {
          yPercent: 115,
          duration,
          ease: EASE_EXPO,
          stagger,
          delay,
          scrollTrigger: start
            ? { trigger: el, start, once: true }
            : undefined,
        });

        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return createElement(Tag, { ref, className }, children);
}
