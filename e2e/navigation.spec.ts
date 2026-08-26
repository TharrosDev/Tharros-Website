import { expect, test } from "./fixtures";

/**
 * The overlays, and the two things they are always getting wrong: a scroll lock
 * that outlives the surface that took it, and focus that ends up on `<body>`.
 */
test.describe("the index overlay", () => {
  test("opens, navigates, and closes itself on arrival", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /^Menu/ }).click();
    const index = page.getByRole("dialog", { name: "Site navigation" });
    await expect(index).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    // The row is numbered, so the accessible name is "03 Releases".
    await index.getByRole("link", { name: /Releases$/ }).click();

    await expect(page).toHaveURL(/\/releases$/);
    // A menu still open over the page it just navigated to is the commonest
    // overlay bug there is.
    await expect(index).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("Escape closes it and does not strand focus inside it", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /^Menu/ });
    await trigger.click();
    const index = page.getByRole("dialog", { name: "Site navigation" });
    await expect(index).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(index).toBeHidden();

    // The assertion that holds everywhere: focus must not be left on a control
    // inside a dialog that is now `visibility: hidden`. That is the failure
    // that actually traps someone — the keyboard goes dead.
    expect(
      await page.evaluate(
        () => !!document.activeElement?.closest('[aria-label="Site navigation"]'),
      ),
      "focus left inside the closed overlay",
    ).toBe(false);

    // Safari does not focus a button when it is clicked, so the trap has no
    // opener to restore to and returns focus to the body. That is WebKit's
    // behaviour rather than the site's, and a keyboard user on Safari (who
    // reached the button by tabbing) gets the restore. Asserted where the
    // platform allows it to be asserted.
    if (browserName !== "webkit") await expect(trigger).toBeFocused();
  });
});

test.describe("search", () => {
  test("submitting takes the term to the shop", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Search", exact: true }).first().click();
    const search = page.getByRole("dialog", { name: "Search" });
    await expect(search).toBeVisible();

    await search.getByRole("searchbox").fill("hoodie");
    await search.getByRole("searchbox").press("Enter");

    await expect(page).toHaveURL(/\/shop\?q=hoodie$/);
    await expect(search).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("two overlays are never live at once", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /^Menu/ }).click();
    await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();

    // Index → search is the one deliberate hand-off. The index has to go.
    await page
      .getByRole("dialog", { name: "Site navigation" })
      .getByRole("button", { name: "Search" })
      .click();

    await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeHidden();
    // Two nested locks, released in the wrong order, leave the page stuck.
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  });
});

test.describe("moving through the site", () => {
  test("shop to a piece and back leaves the page usable", async ({
    page,
    console: watched,
  }) => {
    await page.goto("/shop");
    await page.getByRole("link", { name: /arc hoodie/i }).first().click();

    await expect(page).toHaveURL(/\/shop\/arc-hoodie$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/shop$/);
    // The route curtain is `pointer-events-none`, so a link under it must
    // still take a click straight after a navigation.
    await expect(page.getByRole("link", { name: /arc hoodie/i }).first()).toBeVisible();

    expect(watched.errors).toEqual([]);
  });

  test("the skip link moves focus, not just the scroll position", async ({
    page,
    browserName,
  }) => {
    await page.goto("/about");

    const skip = page.getByRole("link", { name: "Skip to content" });

    // Safari only tabs to links when Full Keyboard Access is switched on, so
    // Tab-reachability is asserted where the platform tabs to links at all.
    // What the link *does* is asserted everywhere: `#main` carries
    // `tabIndex={-1}` precisely so activating it moves focus rather than only
    // the scroll position, and that is the part this site owns.
    if (browserName === "webkit") {
      await skip.focus();
    } else {
      await page.keyboard.press("Tab");
      await expect(skip).toBeFocused();
    }

    await skip.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });
});

/**
 * Reduced motion is a branch, not a speed — so the thing to assert is that the
 * branch still renders a whole page rather than that it renders it faster.
 */
test.describe("reduced motion", () => {
  test("every entrance is at rest and nothing is left hidden", async ({ page }) => {
    // Emulated on the page rather than declared as a fixture option: the option
    // form silently did not reach the page here, and a reduced-motion test that
    // is not actually in reduced motion passes for the wrong reason. This
    // asserts the emulation took before it asserts anything about the site.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
      "reduced-motion emulation did not apply",
    ).toBe(true);
    await page.waitForLoadState("networkidle");

    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".reveal")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.99,
      ).length,
    );
    expect(hidden, "sections still faded out under reduced motion").toBe(0);

    // The opening plane refuses to arm under reduced motion, in the head
    // script and again in CSS.
    await expect(page.locator(".entry")).toBeHidden();
  });
});
