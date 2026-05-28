"use client";

import { useSyncExternalStore } from "react";

/**
 * Detect mobile viewports via matchMedia, subscribed through
 * useSyncExternalStore so there's no setState-in-effect cascade and the
 * server snapshot is always desktop (false) to keep hydration stable.
 */
export function useIsMobile(breakpoint: number = 768) {
  const query = `(max-width: ${breakpoint}px)`;

  const subscribe = (onChange: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  };

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
