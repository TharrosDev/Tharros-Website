/**
 * One IntersectionObserver for every scroll entrance on the page.
 *
 * Each `Reveal` used to construct its own, so a page carried six or seven
 * observers doing identical work against identical options. They share this
 * one instead, created lazily on first use and never torn down — the page it
 * belongs to outlives it either way.
 *
 * Elements unregister themselves the moment they have been seen, so the
 * observed set shrinks to nothing as the visitor scrolls.
 */

type Seen = () => void;

const callbacks = new WeakMap<Element, Seen>();
let observer: IntersectionObserver | null = null;

/** Matches the previous per-instance options exactly. */
const OPTIONS: IntersectionObserverInit = {
  rootMargin: "0px 0px -12% 0px",
  threshold: 0.05,
};

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (observer) return observer;

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const seen = callbacks.get(entry.target);
      if (seen) {
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        seen();
      }
    }
  }, OPTIONS);

  return observer;
}

/**
 * Calls `seen` once, the first time `node` comes into view. Returns a cleanup
 * that stops watching. When the API is unavailable the caller is told so, and
 * is expected to reveal its content immediately rather than wait.
 */
export function observeOnce(node: Element, seen: Seen): (() => void) | null {
  const active = getObserver();
  if (!active) return null;

  callbacks.set(node, seen);
  active.observe(node);

  return () => {
    callbacks.delete(node);
    active.unobserve(node);
  };
}
