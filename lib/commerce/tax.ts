/**
 * Tax is destination-dependent and no tax engine is connected, so the site
 * never invents a number. Totals show tax as pending until a provider
 * calculates it, which is also the honest thing to show a customer.
 */
export const TAX_IS_CALCULATED = false;

export const TAX_PENDING_LABEL = "Calculated at payment";
