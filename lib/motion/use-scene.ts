"use client";

import { useEffect, type RefObject } from "react";
import { loadMotion, type MotionApi } from "./registry";

/**
 * Runs a piece of choreography inside a `gsap.context()` scoped to `ref`, and
 * reverts every tween, ScrollTrigger and inline style it created when the
 * component unmounts or the dependencies change.
 *
 * This is the twenty lines of `@gsap/react`'s `useGSAP` that this site needs,
 * written out so GSAP can stay a dynamic import — see `registry.ts`.
 *
 * Two details that are easy to get wrong and expensive to debug:
 *
 * - **The cleanup can run before the setup finishes.** GSAP arrives on a
 *   promise, so a component that mounts and unmounts quickly — a route change
 *   mid-load — would otherwise build its scene into a detached tree and leave
 *   the ScrollTriggers alive. The `cancelled` flag covers the window before
 *   the context exists; reverting the context covers everything after.
 * - **`gsap.context(fn, scope)` is what makes cleanup total.** Selector
 *   strings inside `fn` are scoped to the element, and every animation created
 *   during `fn` is recorded, so `revert()` restores the DOM to exactly the
 *   state the server rendered. Without it a ScrollTrigger outlives its
 *   element and throws on the next refresh.
 */
export function useScene(
  ref: RefObject<HTMLElement | null>,
  setup: (api: MotionApi, el: HTMLElement) => void,
  dependencies: unknown[] = [],
) {
  useEffect(() => {
    let context: ReturnType<MotionApi["gsap"]["context"]> | null = null;
    let cancelled = false;

    loadMotion().then((api) => {
      const el = ref.current;
      if (cancelled || !el) return;
      context = api.gsap.context(() => setup(api, el), el);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
    // `setup` is intentionally not a dependency: it is a fresh closure every
    // render, and depending on it would tear the scene down and rebuild it on
    // every parent render. Callers pass what actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
