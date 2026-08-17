/**
 * PLACEHOLDER POLICY, stated once.
 *
 * The return window was written out as "30 days" in four separate places — the
 * product page, the bag, the FAQ, the returns page and the refund policy — which
 * is five chances for a policy change to leave one of them lying. Everything
 * that states the window reads it from here.
 *
 * The window itself is the owner's to set before launch; this file is where it
 * gets set.
 */
export const RETURN_WINDOW_DAYS = 30;

/** Reads inside a sentence: "returned within 30 days of delivery". */
export const RETURN_WINDOW = `${RETURN_WINDOW_DAYS} days`;
