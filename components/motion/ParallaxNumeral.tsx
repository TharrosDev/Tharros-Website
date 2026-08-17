"use client";

import { useEffect, useRef } from "react";

/**
 * THE TRAVELLING NUMERAL — one of the site's signatures.
 *
 * A frame's index drifts about 40px against the picture it labels as the frame
 * crosses the viewport. Typographic and monochrome, set in the mono ladder the
 * design system already owns — slow and flat, per DESIGN.md §6.
 *
 * This was built on `motion`, on the argument that scroll-linked position is the
 * one thing CSS cannot do portably while scroll-timeline has a Safari gap, and
 * that a hand-rolled version means a scroll listener driving `setState` — a
 * render cascade the React Compiler rejects. The first half of that is still
 * true. The second half was not: the transform can be written straight to the
 * node, so React never re-renders and there is no state to cascade.
 *
 * The library measured 38kB gzipped after scoping it to `LazyMotion`, on three
 * routes, for this one gesture. This is the same gesture for nothing.
 *
 * It stays honest about when not to run: no transform is ever written under
 * reduced motion, on a coarse pointer, or before the element has been seen, and
 * the served HTML carries none either way. The observer means the scroll handler
 * only does work while the numeral is actually on screen.
 */
export default function ParallaxNumeral({
  children,
  className = "",
  /** Total travel in pixels across the frame's pass through the viewport. */
  range = 40,
}: {
  children: React.ReactNode;
  className?: string;
  range?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    // Touch has no hover and a much shorter scroll runway, so a drifting numeral
    // there is motion for its own sake.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let frame = 0;
    let onScreen = false;

    const apply = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      // 0 as the element enters at the bottom, 1 as it leaves at the top.
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      node.style.transform = `translateY(${(0.5 - clamped) * range}px)`;
    };

    const schedule = () => {
      if (!onScreen || frame) return;
      frame = requestAnimationFrame(apply);
    };

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? false;
      if (onScreen) apply();
    });

    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      node.style.transform = "";
    };
  }, [range]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
