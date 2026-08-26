import { ROUTES, expect, test } from "./fixtures";
import { listProducts, resolveAvailability } from "../lib/catalog/queries";

/**
 * The subject of a state test is found, never named.
 *
 * These used to hard-code `work-jacket` and `shell-jacket-01`. Both left the
 * catalogue and the tests 404ed against a page that was simply gone, which is a
 * failure that says nothing about the behaviour being guarded. The assertion is
 * worth keeping either way, so it looks for a piece in the state it cares about
 * and skips when the catalogue holds none.
 */
function firstInState(state: "sold-out" | "coming-soon") {
  return listProducts().find((product) => resolveAvailability(product) === state);
}

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
   * NOTHING ON THIS SITE HOLDS THE PAGE.
   *
   * The scroll is the visitor's and no scene takes it: there are no pinned
   * ScrollTriggers anywhere, at the owner's direction. This asserts the
   * absence, because the failure it guards is a quiet one — `pin: true` is a
   * one-word change, it looks correct in review, and what it produces is a
   * section that stops the page.
   *
   * The routes checked are the two that used to hold: `/` pinned the statement
   * and the campaign's first full-bleed frame, and `/drop` pinned the same
   * frame through the shared sequence.
   *
   * It waits on `.split-line` first. That class only exists once GSAP has
   * booted and SplitText has run, so it is proof the motion runtime actually
   * arrived — without it the assertion passes on any page where nothing ran.
   */
  test("no scene pins the page", async ({ page }) => {
    for (const route of ["/", "/drop"]) {
      await page.goto(route);
      await page.waitForSelector(".split-line", { timeout: 15_000 });
      // A pin is created on the trigger's first evaluation, so scroll the
      // whole page past every scene before looking for a spacer.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => requestAnimationFrame(r));
        }
      });
      const spacers = await page.locator(".pin-spacer").count();
      expect(spacers, `${route} must not pin`).toBe(0);
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
      .getByRole("link", { name: "Releases", exact: true })
      .click();
    await expect(page).toHaveURL(/\/releases$/);
    await expect(page.locator("main h1").first()).toBeVisible();

    // The boundary renders this. The console assertion below would also catch
    // the throw, but naming it makes a failure legible.
    await expect(page.getByText("That didn't work.")).toHaveCount(0);
    expect(watched.errors, "navigating away from a scene").toEqual([]);
  });
});

/**
 * The archive is a record, and a record cannot contain work that has not been
 * done.
 *
 * Two pieces of Drop 002 are in development. They carry `runSize: 0`, so they
 * never inflated "units made" — but they were counted as garments, filed under
 * the 2026 band beside pieces that shipped in May, and shown as the newest two
 * rows of a home page section titled "Everything made so far." That section is
 * gone and the destination is `/releases` now, but the failure it guards
 * against is the same one: a stated count that disagrees with the rows under
 * it.
 *
 * The assertion is the relationship rather than the numbers: a count that
 * disagrees with the rows under it is the failure, at seven garments or at two
 * hundred.
 */
test.describe("the release history holds what was released", () => {
  test("each release states the number of pieces it actually shows", async ({
    page,
  }) => {
    await page.goto("/releases");

    const bands = page.locator("main section[aria-labelledby]");
    const count = await bands.count();
    expect(count, "released drops on the page").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const band = bands.nth(i);
      const stated = await band.locator(".eyebrow").first().innerText();
      const pieces = await band.locator('a[href^="/releases/th-"]').count();
      expect(
        Number(stated.replace(/[^0-9]/g, "").slice(3)),
        `pieces stated in band ${i}`,
      ).toBe(pieces);
    }
  });

  test("nothing unreleased is in the history", async ({ page }) => {
    await page.goto("/releases");
    // Both spellings: the site used to say "In development" in five places and
    // "Coming soon" in one, for the same state. It says "Coming soon" now, and
    // neither belongs in an index of what has been released.
    await expect(page.getByRole("main").getByText("In development")).toHaveCount(0);
    await expect(page.getByRole("main").getByText("Coming soon")).toHaveCount(0);
  });

  test("an unreleased piece has no record page", async ({ page }) => {
    const response = await page.goto("/releases/th-004");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /return home/i })).toBeVisible();
  });
});

/**
 * A run that has not been decided is not a run that sold out.
 *
 * `runSize: 0` and no stock made the product page print a signal-red `0` above
 * "None left of 0 made", which is the reading every other surface on the site
 * already takes trouble to avoid. The em dash is the site's word for a number
 * nobody has set.
 */
test("an unreleased piece shows no run figures", async ({ page }) => {
  const piece = firstInState("coming-soon");
  test.skip(!piece, "the catalogue holds no unreleased piece");
  await page.goto(`/shop/${piece!.slug}`);
  await expect(page.locator("main")).not.toContainText("None left");
  await expect(page.locator("main")).not.toContainText("0 made");
  await expect(page.getByText("Coming soon").first()).toBeVisible();
});

/**
 * ONE COMMERCE STATE, ASSERTED FROM BOTH ENDS.
 *
 * Everything purchasable derives from `isPurchasable()`, which reads
 * `STORE_OPEN` and then real inventory. The failure this guards against is a
 * surface inventing its own answer — a sold-out piece keeping its add-to-bag,
 * or a released piece losing it.
 */
test.describe("the storefront offers exactly what it can sell", () => {
  test("an in-stock piece can be added", async ({ page }) => {
    await page.goto("/shop/core-tee");
    await expect(
      page.getByRole("button", { name: /add to bag/i }).first(),
    ).toBeVisible();
  });

  test("a sold-out piece offers no purchase", async ({ page }) => {
    const piece = firstInState("sold-out");
    test.skip(!piece, "the catalogue holds no sold-out piece");
    await page.goto(`/shop/${piece!.slug}`);
    await expect(page.getByRole("button", { name: /add to bag/i })).toHaveCount(0);
  });

  test("an unreleased piece offers no purchase", async ({ page }) => {
    const piece = firstInState("coming-soon");
    test.skip(!piece, "the catalogue holds no unreleased piece");
    await page.goto(`/shop/${piece!.slug}`);
    await expect(page.getByRole("button", { name: /add to bag/i })).toHaveCount(0);
    await expect(page.getByText("Coming soon").first()).toBeVisible();
  });

  test("the header carries a bag", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /open bag/i })).toBeVisible();
  });

  test("checkout is reachable", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/checkout$/);
  });
});

/**
 * NO SURFACE INVENTS A SHIPPING RATE.
 *
 * The product page used to format `SHIPPING_OPTIONS` itself while `/shipping`
 * formatted the same array a second way, so the two could quote different
 * numbers for the same carrier. Both compose through `shippingLines()` now,
 * which is what this checks: the sentence is identical on both surfaces.
 */
test("the product page and the shipping page quote the same rates", async ({
  page,
}) => {
  await page.goto("/shipping");
  const stated = (await page.locator("main").innerText())
    .split("\n")
    .map((row) => row.trim());

  const rates = ["Standard", "Express"].map((name) => {
    const line = stated.find((row) => row.startsWith(`${name} —`));
    expect(line, `${name} rate on /shipping`).toBeTruthy();
    return line!;
  });

  await page.goto("/shop/core-tee");
  await page.getByRole("button", { name: /Care & delivery/i }).click();

  // `toContainText` reads `textContent` and retries, so it neither races the
  // accordion's own transition nor depends on the panel being unclipped.
  for (const rate of rates) {
    await expect(page.locator("main")).toContainText(rate);
  }
});
