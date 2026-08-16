"use client";

import { useEffect, useRef, useState } from "react";
import { observeOnce } from "@/lib/reveal-observer";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms, for siblings revealed together. */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

/**
 * Scroll-triggered entrance. The hidden state lives behind [data-js] (set by
 * the head script in the root layout), so the entrance is purely additive:
 * with scripting unavailable the section is simply never hidden in the first
 * place. `reveal-in` is added, never removed, for the same reason.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
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

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
