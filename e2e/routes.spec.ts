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

/**
 * Every scroll entrance actually fires.
 *
 * THIS EXISTS BECAUSE THE SUITE ONCE PASSED OVER A SITE WITH BLANK SCREENS.
 * `.reveal-frame` clipped the very element `Reveal` asks an
 * IntersectionObserver about, so the observer reported no intersection, the
 * uncovering class was never added, and every product card stayed invisible —
 * while the console stayed clean, nothing 404'd, and every other assertion
 * here passed.
 *
 * So this asserts the mechanism rather than any one symptom: after walking the
 * page, no `.reveal` may still be waiting. Checking `reveal-in` rather than
 * opacity is the whole point — the clipping modes deliberately hold opacity at
 * 1, which is exactly how the original bug hid from an opacity check.
 */
test.describe("scroll entrances", () => {
  // Chromium and the phone viewport only. The defect this guards is a CSS and
  // IntersectionObserver interaction with no engine-specific part — reverting
  // the fix fails all eighteen routes here, which is all the coverage it needs.
  // On WebKit the *walker* is the unreliable part: scrolling a long page in
  // steps and waiting for lazy images to settle leaves a trailing entrance
  // genuinely below the fold often enough to flake, and a regression test that
  // cries wolf is one people start ignoring.
  test.skip(({ browserName }) => browserName === "webkit", "walker flakes on WebKit");

  for (const route of ROUTES) {
    test(`${route} reveals everything it hides`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // The height is re-read every step, not measured once: images load as
      // the page is walked and the document grows underneath the loop, so a
      // height taken up front stops short of the real bottom and leaves the
      // last entrances legitimately un-fired.
      for (let y = 0; ; y += 600) {
        await page.evaluate((to) => window.scrollTo(0, to), y);
        await page.waitForTimeout(200);
        const height = await page.evaluate(() => document.body.scrollHeight);
        if (y >= height) break;
      }

      // Polled rather than slept on. A fixed wait long enough for WebKit under
      // load is dead time on every other run, and one short enough to be
      // tolerable there fails when several browsers are competing for the CPU
      // — which is flake, and flake in a regression test is worse than no test.
      await expect
        .poll(
          async () =>
            page.evaluate(() =>
              [...document.querySelectorAll<HTMLElement>(".reveal")]
                // The bag drawer is mounted on every route and parked
                // off-canvas, so its empty state never legitimately comes
                // into view.
                .filter((el) => !el.closest(".overlay-root"))
                .filter((el) => !el.classList.contains("reveal-in"))
                .map((el) => el.className.replace(/\s+/g, " ").slice(0, 60)),
            ),
          { message: `${route} left entrances un-fired`, timeout: 15_000 },
        )
        .toEqual([]);
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

/**
 * The two ways a scene that moves DOM breaks the page, both of which shipped.
 *
 * Neither was visible to any assertion the suite already had: the routes spec
 * loads each page directly and watches its console, and both of these need a
 * CLIENT navigation away from — or a scroll through — a route whose scenes have
 * already rewritten the DOM. `/` is that route.
 *
 * `.split-line` is the signal that GSAP has arrived and re-parented something:
 * `SplitText` writes it at every width, where a pin exists only from `lg` up.
 */
test.describe("scenes that move the DOM", () => {
  /**
   * A pin has to reserve the distance it holds for.
   *
   * ScrollTrigger reserves it as `padding-bottom` on the spacer it wraps the
   * pinned element in — and it silently declines to do that when the parent is
   * a flex container, because it cannot pad a flex item into reserving space.
   * The campaign's held frame sat in `flex flex-col gap-28` and reserved zero
   * against `end="+=90%"`, so it was fixed for 900px the document never
   * accounted for, and every frame after it scrolled up over the top of it —
   * caption over caption, two "In this frame" lists in the same place.
   *
   * Asserted as "no spacer reserves nothing" rather than against a number: how
   * far a scene holds is its own business, that it reserves anything at all is
   * the invariant.
   */
  test("every pin reserves the scroll it holds", async ({ page }, testInfo) => {
    // Pins are `lg` and up by design — below that a scene keeps its
    // choreography and loses the hold, so there is no spacer to check.
    // See QUERY.wide in lib/motion/media.ts.
    const width = testInfo.project.use.viewport?.width ?? 0;
    test.skip(width < 1024, "scenes do not pin below lg");

    await page.goto("/");
    await page.waitForSelector(".pin-spacer", { timeout: 15_000 });

    const reserved = await page.$$eval(".pin-spacer", (spacers) =>
      spacers.map((spacer) => ({
        parent: getComputedStyle(spacer.parentElement!).display,
        padding: parseFloat(getComputedStyle(spacer).paddingBottom),
      })),
    );

    expect(reserved.length).toBeGreaterThan(0);
    for (const spacer of reserved) {
      expect(spacer.padding, `pin in a ${spacer.parent} parent`).toBeGreaterThan(0);
    }
  });

  /**
   * Leaving such a route must not throw.
   *
   * GSAP moves nodes React owns — `pin` wraps the element in a spacer,
   * `SplitText` replaces a heading's children with per-line spans. React
   * deletes host nodes in the mutation phase and runs `useEffect` cleanups
   * after it, so reverting there happened once the removal had already thrown
   * `NotFoundError: Failed to execute 'removeChild'`, and the route error
   * boundary took the page. It reproduced on every navigation off `/`.
   *
   * Runs at every width: `SplitText` re-parents on a phone too, so the hazard
   * is not the pin's alone.
   */
  test("leaving a scene does not throw", async ({ page, console: watched }) => {
    await page.goto("/");
    await page.waitForSelector(".split-line", { timeout: 15_000 });

    // The footer's link, not the header's: the header states its destinations
    // inline only from `md` up, so on a phone there is no "Shop" to click and
    // the mobile project — the one width where `SplitText` is the whole hazard,
    // because nothing pins there — would never run this.
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Archive", exact: true })
      .click();
    await expect(page).toHaveURL(/\/archive$/);
    await expect(page.locator("main h1").first()).toBeVisible();

    // The boundary renders this. The console assertion below would also catch
    // the throw, but naming it makes a failure legible.
    await expect(page.getByText("That didn't work.")).toHaveCount(0);
    expect(watched.errors, "navigating away from a scene").toEqual([]);
  });
});
