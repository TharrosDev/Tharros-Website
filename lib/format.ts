export const CURRENCY = "CAD";

// Always two decimals, then the whole-dollar case is stripped below. With
// `minimumFractionDigits: 0` a price of 12050 formatted as "$120.5" — one
// digit of cents, which reads as a typo on a price tag. Every catalog price is
// whole dollars today, so the defect only surfaces once a piece is priced at
// x.50, or once tax or a discount lands on a total.
const formatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Prices are stored in minor units (cents) so totals never touch floats. */
export function formatPrice(cents: number): string {
  const value = cents / 100;
  return formatter.format(value).replace(/\.00$/, "");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
