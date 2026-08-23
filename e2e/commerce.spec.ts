import { expect, test } from "./fixtures";

const PIECE = "/shop/arc-hoodie";

/**
 * The purchase path, which is the only flow on this site whose failure costs
 * anybody anything.
 *
 * The size input is `visually-hidden` and the visible control is the `<label>`
 * wrapping it, so these click the label — which is what a person does. Driving
 * the input directly would need `force`, and forcing past actionability is how
 * a test keeps passing after an overlay starts swallowing the click.
 */
test.describe("bag", () => {
  test("a piece can be chosen, added, and is in the bag afterwards", async ({
    page,
    console: watched,
  }) => {
    await page.goto(PIECE);

    await page.locator("fieldset label").filter({ hasText: /^M$/ }).click();
    await expect(page.getByRole("radio", { name: "M", exact: true })).toBeChecked();

    // The sticky mobile bar carries a second Add button, so the in-flow one is
    // taken by document order rather than by a viewport-specific selector.
    await page.getByRole("button", { name: "Add to bag" }).first().click();

    const bag = page.getByRole("dialog", { name: "Bag" });
    await expect(bag).toBeVisible();
    await expect(bag.getByRole("link", { name: /arc hoodie/i }).first()).toBeVisible();
    await expect(bag.getByText("/ M")).toBeVisible();

    expect(watched.errors).toEqual([]);
  });

  test("the bag survives a reload", async ({ page }) => {
    await page.goto(PIECE);
    await page.locator("fieldset label").filter({ hasText: /^M$/ }).click();
    await page.getByRole("button", { name: "Add to bag" }).first().click();
    await expect(page.getByRole("dialog", { name: "Bag" })).toBeVisible();

    await page.reload();

    // The count is re-derived from storage through the catalog on every render,
    // so this also proves the stored line still resolves to something sellable.
    await expect(page.getByRole("button", { name: /Open bag — 1 item$/ })).toBeVisible();
  });

  test("a removed line can be undone, and the card stops claiming it", async ({
    page,
  }) => {
    await page.goto(PIECE);
    await page.locator("fieldset label").filter({ hasText: /^M$/ }).click();
    await page.getByRole("button", { name: "Add to bag" }).first().click();

    const bag = page.getByRole("dialog", { name: "Bag" });
    await bag.getByRole("button", { name: /^Remove/ }).click();

    await expect(bag.getByText(/Your bag is empty/)).toBeVisible();
    await expect(bag.getByRole("button", { name: "Undo" })).toBeVisible();

    await bag.getByRole("button", { name: "Undo" }).click();
    await expect(bag.getByText("/ M")).toBeVisible();
  });

  test("closing the bag releases the scroll lock", async ({ page }) => {
    await page.goto(PIECE);
    await page.getByRole("button", { name: /Open bag/ }).click();

    const bag = page.getByRole("dialog", { name: "Bag" });
    await expect(bag).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(bag).toBeHidden();

    // A drawer that closes and leaves the page unscrollable is the classic
    // overlay failure, and it is invisible until someone tries to scroll.
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("checkout refuses an empty address rather than composing a bad order", async ({
    page,
  }) => {
    await page.goto(PIECE);
    await page.locator("fieldset label").filter({ hasText: /^M$/ }).click();
    await page.getByRole("button", { name: "Add to bag" }).first().click();

    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: "Your details" })).toBeVisible();

    await page.getByRole("button", { name: /Continue to delivery/ }).click();

    // Named, announced, and focused — the step must not advance.
    await expect(page.getByRole("alert").filter({ hasText: "Enter your first name." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where it goes" })).toBeHidden();
  });

  test("a filled-in details step advances to delivery", async ({ page }) => {
    await page.goto(PIECE);
    await page.locator("fieldset label").filter({ hasText: /^M$/ }).click();
    await page.getByRole("button", { name: "Add to bag" }).first().click();

    await page.goto("/checkout");
    await page.getByLabel("First name", { exact: true }).fill("Test");
    await page.getByLabel("Last name", { exact: true }).fill("Person");
    // `exact`, or this also matches the footer newsletter's "Your email".
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page.getByRole("button", { name: /Continue to delivery/ }).click();

    await expect(page.getByRole("heading", { name: "Where it goes" })).toBeVisible();
    // The action is a composed mailto, not a payment. If this ever becomes a
    // real submit, this assertion is the thing that should fail first.
    await expect(page.getByRole("link", { name: /Write this order/ })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  });
});

test("an empty bag says so at checkout instead of showing a form", async ({ page }) => {
  await page.goto("/checkout");
  // Scoped to `main`: the bag drawer is mounted on every route and carries the
  // same sentence, hidden.
  await expect(page.locator("main").getByText(/Your bag is empty/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your details" })).toBeHidden();
});
