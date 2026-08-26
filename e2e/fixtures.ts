import { test as base, expect, type Page } from "@playwright/test";

/**
 * Every route the site serves that a visitor can reach by typing it.
 *
 * The two dynamic segments are represented by one real member each rather than
 * by the whole catalogue: nine product pages built from one template test the
 * template nine times, and the suite is meant to catch breakage rather than to
 * enumerate data.
 */
export const ROUTES = [
  "/",
  "/shop",
  "/shop/arc-hoodie",
  "/drop",
  "/releases",
  "/releases/th-001",
  "/about",
  "/wishlist",
  "/checkout",
  // `/account` is not here. Nothing links to it — authentication is a separate
  // system from shopping and the bag and saved list live on the device — so it
  // is deliberately unreachable rather than broken.
  "/size-guide",
  "/shipping",
  "/returns",
  "/faq",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/refund-policy",
] as const;

/**
 * Console output that is not the site's fault and cannot be fixed from here.
 *
 * Kept deliberately short. A growing allow-list is how a console assertion
 * stops meaning anything — anything added here needs a reason in the comment.
 */
const IGNORED = [
  // Vercel Analytics. The script lives at `/_vercel/insights/script.js`, which
  // the platform serves and `next start` does not — so a local production run
  // 404s it and Chromium then refuses the HTML it got back. Both messages are
  // artefacts of running off-platform, not of this repo. Nothing else is
  // allowed through: a genuine missing asset still fails the run.
  /\[Vercel Web Analytics\]/i,
  /_vercel\/insights/i,
  /Failed to load resource.*404/i,
  // The browser refusing a request the CSP was written to refuse is the CSP
  // working. A real regression shows up as a failed asset, which the network
  // assertion below catches instead.
  /Content Security Policy/i,
];

export type ConsoleWatch = {
  /** Everything the page logged as an error, minus the ignored patterns. */
  errors: string[];
  /** Requests that came back 4xx/5xx. */
  failures: string[];
};

/** Attaches error collection to a page. Call before the first navigation. */
export function watch(page: Page): ConsoleWatch {
  const found: ConsoleWatch = { errors: [], failures: [] };

  const keep = (text: string) => !IGNORED.some((pattern) => pattern.test(text));

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (keep(text)) found.errors.push(text);
  });

  // An uncaught exception never reaches `console`, so it has to be listened
  // for separately — and it is the one this suite most wants to hear about.
  page.on("pageerror", (error) => {
    if (keep(error.message)) found.errors.push(`pageerror: ${error.message}`);
  });

  page.on("response", (response) => {
    if (response.status() < 400) return;
    if (response.url().includes("/_vercel/")) return;
    found.failures.push(`${response.status()} ${response.url()}`);
  });

  return found;
}

/**
 * A page that behaves like a returning visitor's.
 *
 * The opening title is armed by the head script on the first view of a session
 * and holds a full-screen plane over the home page for 1.5s. That is correct
 * for a person and useless for a test: every run against `/` would either wait
 * out the sequence or race it. Marking the session as already entered is what a
 * second page view does anyway.
 *
 * `console` is the watcher, so a spec can assert on what the page logged
 * without wiring listeners itself.
 */
export const test = base.extend<{ console: ConsoleWatch }>({
  console: async ({ page }, use) => {
    const found = watch(page);
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("tharros:entered", "1");
      } catch {
        // Private mode. The sequence then plays, and the specs that care wait.
      }
    });
    await use(found);
  },
});

export { expect };
