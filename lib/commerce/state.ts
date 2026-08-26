/**
 * THE STOREFRONT'S ONE COMMERCE FLAG.
 *
 * The site used to hold two positions at once: pieces were "out now", every
 * card had an add-to-bag, the drawer offered a Checkout button — and then a
 * panel at the top of `/checkout` explained that no card could be taken and
 * the order would be composed into an email. A shop that behaves as if it is
 * live until the last screen is not honest about being pre-launch; it is a
 * bait, and the customer only finds out after eight fields.
 *
 * So there is one flag and everything derives from it. While it is `false` the
 * site is a release preview: the clothes, the prices, the run figures and the
 * campaign are all real and all readable, and nothing offers a transaction
 * that cannot complete. The bag, the drawer, the checkout flow, the totals and
 * the address forms are untouched in the repository — they are stood down, not
 * deleted, and flipping this to `true` brings the whole purchase path back.
 *
 * Flip it only when a payment provider is actually connected.
 */
export const STORE_OPEN = false;

/**
 * Whether the newsletter form posts anywhere. It does not — there is no
 * provider and no endpoint — so the signup renders as a real mailto rather
 * than as a form that validates an address and then admits it sent nothing.
 * A control that cannot succeed is worse than no control.
 */
export const NEWSLETTER_CONNECTED = false;
