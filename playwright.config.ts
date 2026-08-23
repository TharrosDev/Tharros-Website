import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end smoke coverage.
 *
 * WHY IT RUNS AGAINST A PRODUCTION BUILD. Development mode hides the failures
 * that matter here — asset paths, chunk loading, static generation, hydration
 * against prerendered HTML. `webServer` therefore builds and serves rather than
 * running `next dev`, on a port the dev server does not use so the two can be
 * open at once.
 *
 * THREE ENGINES, AND WEBKIT IS THE POINT. This site leans on sticky
 * positioning, clip-path, masks, backdrop-filter and `svh` — the exact set
 * Safari implements differently. Chromium alone would pass while the site was
 * broken for a third of its visitors. The mobile project is Chromium with a
 * phone viewport and a coarse pointer, which is what switches the site onto its
 * touch branches: no custom cursor, no magnetics, halved parallax, no pins.
 *
 * These tests assert behaviour, never appearance. Nothing here should fail
 * because a margin changed — see `e2e/README.md`.
 */
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // A committed `.only` passes locally and silently skips the suite in CI.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],

  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    // Locally, a server already on this port is reused so the suite does not
    // rebuild on every run. CI always builds what it is about to test.
    reuseExistingServer: !process.env.CI,
    // See next.config.ts: without this the CSP upgrades every asset request to
    // https, and WebKit serves the suite an unstyled, unscripted page.
    env: { CSP_ALLOW_INSECURE: "1" },
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
