"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms, for siblings revealed together. */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

/**
 * Scroll-triggered entrance. Transform + opacity only, and the class is added
 * rather than removed — server-rendered content is styled visible if this
 * never runs.
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

    // No observer available: show it immediately, via the DOM rather than
    // state, so nothing is ever left hidden behind a missing API.
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("reveal-in");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
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
