/**
 * THE RETURN POLICY, STATED ONCE.
 *
 * The window was written out as "30 days" in five separate places — the
 * product page, the bag, the FAQ, the returns page and the refund policy —
 * which is five chances for a policy change to leave one of them lying.
 * Everything that states the window reads it from here, including the prose
 * forms: `/returns` opened on a hand-typed "Thirty days" that no longer had
 * anything to do with the number below it.
 */
export const RETURN_WINDOW_DAYS = 30;

/** Reads inside a sentence: "returned within 30 days of delivery". */
export const RETURN_WINDOW = `${RETURN_WINDOW_DAYS} days`;

const WORDS: Record<number, string> = {
  7: "Seven",
  14: "Fourteen",
  21: "Twenty-one",
  30: "Thirty",
  60: "Sixty",
  90: "Ninety",
};

/** Opens a sentence: "Thirty days, unworn, tags on." */
export const RETURN_WINDOW_WORDS = `${WORDS[RETURN_WINDOW_DAYS] ?? RETURN_WINDOW_DAYS} days`;
