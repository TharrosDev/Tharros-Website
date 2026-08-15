export const CURRENCY = "CAD";

const formatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
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
