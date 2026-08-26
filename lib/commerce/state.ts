/**
 * THE STOREFRONT IS OPEN.
 *
 * The catalogue, the inventory, the bag and the checkout are the working
 * storefront: pieces are browsed, sized, added and taken through to the order
 * boundary. The one thing that is not local is the provider that takes money,
 * and that lives behind a single seam — `createCheckout()` in
 * `lib/commerce/checkout.ts`. Nothing else on the site knows a provider exists.
 *
 * The flag stays because the storefront needs a way to be closed between drops
 * without deleting the purchase path. Set it to `false` and every add-to-bag
 * control, the drawer, the header bag and `/checkout` stand down at once —
 * `isPurchasable()` is the only place that reads it.
 */
export const STORE_OPEN = true;
