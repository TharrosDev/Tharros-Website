"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/** Locks background scrolling while an overlay owns the screen. */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

/**
 * Traps Tab inside an overlay, moves focus in on open, and restores it to
 * whatever opened the overlay on close.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  /** Where focus should land on open. Defaults to the first focusable child. */
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const opener = document.activeElement as HTMLElement | null;

    const selector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const focusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
        (element) =>
          element.offsetParent !== null || element === document.activeElement,
      );

    (initialFocusRef?.current ?? focusable()[0])?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [active, containerRef, initialFocusRef]);
}

/** ESC to dismiss, bound at the document so it works before focus lands. */
export function useEscape(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape);

  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active]);
}

const noopSubscribe = () => () => {};

/** True only after hydration — guards anything read from browser storage. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Scroll position as an external store, so no state is set inside an effect. */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    (listener) => {
      window.addEventListener("scroll", listener, { passive: true });
      return () => window.removeEventListener("scroll", listener);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

export function useDebounced<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
