import { ROUTES, expect, test } from "./fixtures";

/**
 * Every route, loaded directly.
 *
 * DIRECT LOAD IS THE TEST. A page reached by clicking through the site has the
 * router, the providers and the motion runtime already alive; a page typed into
 * the address bar has none of that. Anything that only works after the home
 * page has run is broken for everyone arriving from a search result, and this
 * is the shape of failure that never shows up while developing.
 */
test.describe("routes", () => {
  for (const route of ROUTES) {
    test(`${route} loads, reads and stays quiet`, async ({ page, console: watched }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} status`).toBe(200);

      // Not a blank page. `main` holding a heading is the smallest honest
      // proof that the route rendered rather than merely responded — the
      // `loading.tsx` regression the repo documents served a 200 with forty
      // characters in `main`.
      await expect(page.locator("main h1").first()).toBeVisible();

      expect(watched.errors, `${route} console`).toEqual([]);
      expect(watched.failures, `${route} network`).toEqual([]);
    });
  }
});

/**
 * Nothing scrolls sideways.
 *
 * IT ASKS THE PAGE TO SCROLL RATHER THAN MEASURING IT. `scrollWidth` exceeding
 * `clientWidth` is not the defect — plenty of overflow is legitimately clipped
 * and unreachable. The defect is a page that moves under a thumb, so the test
 * tries to move it and reads where it landed. That distinction is not academic:
 * the pinned campaign scene's `scale(1.14)` really did drag `/` and `/drop`
 * 26px sideways on a phone, and `body { overflow-x: clip }` did not stop it.
 *
 * Run on every project, so the phone viewport is where this earns its keep. The
 * check is made twice — at the top of the page and half way down — because a
 * scroll-driven transform only widens the document while it is part-way
 * through, which is a state no static measurement of the first screen sees.
 */
test.describe("no horizontal overflow", () => {
  for (const route of ROUTES) {
    test(`${route} does not scroll sideways`, async ({ page }) => {
      await page.goto(route);
      // Entrances move things. Let the first paint settle before measuring.
      await page.waitForLoadState("networkidle");

      const result = await page.evaluate(() => {
        const root = document.documentElement;

        const push = (y: number) => {
          window.scrollTo(0, y);
          window.scrollTo(9999, y);
          return window.scrollX;
        };

        const atTop = push(0);
        const atMiddle = push(document.body.scrollHeight * 0.5);
        window.scrollTo(0, 0);

        return {
          atTop,
          atMiddle,
          // Name the widest offender, so a failure says which file to open.
          // Anything inside an overlay is excluded: those are parked off-canvas
          // by design and clipped by `.overlay-root`.
          widest: [...document.querySelectorAll<HTMLElement>("body *")]
            .filter((el) => !el.closest(".overlay-root"))
            .map((el) => ({
              right: Math.round(el.getBoundingClientRect().right),
              tag: `${el.tagName.toLowerCase()}.${el.className?.toString().replace(/\s+/g, " ").slice(0, 60)}`,
            }))
            .filter((entry) => entry.right > root.clientWidth + 1)
            .sort((a, b) => b.right - a.right)
            .slice(0, 3),
        };
      });

      expect(
        Math.max(result.atTop, result.atMiddle),
        `${route} scrolls sideways — ${JSON.stringify(result.widest)}`,
      ).toBe(0);
    });
  }
});

test("an unknown address is a branded 404, not a crash", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
});

test("/new still redirects to the drop", async ({ page }) => {
  await page.goto("/new");
  await expect(page).toHaveURL(/\/drop$/);
});
