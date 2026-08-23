"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { loadMotion, type MotionApi } from "./registry";

/**
 * A LAYOUT EFFECT, AND THAT IS THE WHOLE POINT.
 *
 * GSAP moves DOM nodes that React believes it owns. `ScrollTrigger`'s `pin`
 * wraps the pinned element in a `pin-spacer` div; `SplitText` replaces a
 * heading's children with per-line spans. React recorded the original parent,
 * so once either has run, the node it means to remove is no longer where it
 * left it.
 *
 * React deletes a subtree's host nodes during the MUTATION phase and runs
 * passive (`useEffect`) cleanups afterwards. Reverting there is too late: the
 * removal has already thrown. Layout-effect cleanups run inside the deletion
 * walk, before the node comes out — which is the only window where unwrapping
 * the spacer still helps.
 *
 * With `useEffect` this threw `NotFoundError: Failed to execute 'removeChild'
 * on 'Node'` on every navigation away from `/`, and the route error boundary
 * took the page. Reproduced 4/4; the home page holds two pins and twelve split
 * lines.
 *
 * Guarded for the server, where `useLayoutEffect` warns and no DOM exists to
 * mutate. The setup inside is behind a dynamic import either way, so this
 * blocks paint no more than the passive version did.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  useIsomorphicLayoutEffect(() => {
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
    //
    // There was an `eslint-disable` for `react-hooks/exhaustive-deps` here and
    // it is now dead: the rule matches effects by name, so aliasing the hook
    // puts this call outside its view entirely. Nothing is lost that the
    // directive was not already suppressing, but the deps array above is on
    // trust now rather than checked.
  }, dependencies);
}
