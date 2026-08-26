import { expect, test } from "./fixtures";
import { STORE_OPEN } from "../lib/commerce/state";

const PIECE = "/shop/arc-hoodie";

/**
 * THE PURCHASE PATH, WHICH IS THE ONLY FLOW ON THIS SITE WHOSE FAILURE COSTS
 * ANYBODY ANYTHING.
 *
 * Gated on `STORE_OPEN` so the suite follows the storefront when it is closed
 * between drops rather than failing against a shop that is deliberately shut.
 * The complementary assertions — what is and is not offered — live in
 * `routes.spec.ts` and run either way.
 */
test.skip(!STORE_OPEN, "the storefront is closed");

/**
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
    // The transaction is one call to `createCheckout()`. The button is the
    // whole payment boundary as far as this suite is concerned; what it
    // resolves to is the provider's business, and no order is placed here.
    await expect(
      page.getByRole("button", { name: /Continue to payment/ }),
    ).toBeVisible();
  });

  test("the order cannot be placed once the contact address has been blanked", async ({
    page,
  }) => {
    await page.goto(PIECE);
    await page.locator("fieldset label").filter({ hasText: /^M$/ }).click();
    await page.getByRole("button", { name: "Add to bag" }).first().click();

    await page.goto("/checkout");
    await page.getByLabel("First name", { exact: true }).fill("Test");
    await page.getByLabel("Last name", { exact: true }).fill("Person");
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page.getByRole("button", { name: /Continue to delivery/ }).click();

    await page.getByLabel("Address", { exact: true }).fill("1 Test Street");
    await page.getByLabel("City", { exact: true }).fill("Ottawa");
    await page.getByLabel("Province", { exact: true }).selectOption("ON");
    await page.getByLabel("Postal code", { exact: true }).fill("K1A 0B1");

    // The step rail walks backwards without validating, which is the whole
    // point of it. Blanking the email here and stepping forward again lands on
    // a step whose own checks all pass — and the order would leave with nobody
    // to send a confirmation to.
    await page.getByRole("button", { name: /01 Your details/ }).click();
    // Wait for the step rather than for the field. `goTo` scrolls and then
    // moves focus a frame later, so filling the moment the click returns races
    // that — which is what made this flake on WebKit under a loaded run.
    await expect(page.getByRole("heading", { name: "Your details" })).toBeVisible();
    await page.getByLabel("Email", { exact: true }).fill("");
    await page.getByRole("button", { name: /02 Delivery/ }).click();
    await expect(page.getByRole("heading", { name: "Where it goes" })).toBeVisible();

    await page.getByRole("button", { name: /Continue to payment/ }).click();

    // Sent back to the field that is missing, not handed to a provider with
    // nobody to reply to. The address above is valid, so only the blanked email
    // can do this.
    await expect(page.getByRole("heading", { name: "Your details" })).toBeVisible();
    await expect(
      page.getByRole("alert").filter({ hasText: "Enter your email address." }),
    ).toBeVisible();
  });
});

test("an empty bag says so at checkout instead of showing a form", async ({ page }) => {
  await page.goto("/checkout");
  // Scoped to `main`: the bag drawer is mounted on every route and carries the
  // same sentence, hidden.
  await expect(page.locator("main").getByText(/Your bag is empty/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your details" })).toBeHidden();
});
