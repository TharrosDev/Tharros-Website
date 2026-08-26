import { formatPrice } from "@/lib/format";

/**
 * THE ONLY PLACE A DELIVERY RATE IS WRITTEN DOWN.
 *
 * The product page, the bag, the checkout and `/shipping` all read from here,
 * and none of them formats a rate of its own — `shippingLines()` and
 * `freeShippingLine()` are the sentences, so four surfaces cannot disagree
 * about what standard delivery costs. Replacing these with contracted carrier
 * rates is a change to this file and nothing else.
 */
export type ShippingOption = {
  id: string;
  name: string;
  detail: string;
  /** Minor units. */
  price: number;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", name: "Standard", detail: "5–8 business days", price: 1200 },
  { id: "express", name: "Express", detail: "2–3 business days", price: 2500 },
];

export const FREE_SHIPPING_THRESHOLD = 20000;

export const DEFAULT_SHIPPING_OPTION = SHIPPING_OPTIONS[0];

export function shippingCost(subtotal: number, optionId: string): number {
  const option =
    SHIPPING_OPTIONS.find((entry) => entry.id === optionId) ?? DEFAULT_SHIPPING_OPTION;
  if (option.id === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return option.price;
}

export function amountToFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

/** "Standard — 5–8 business days. $12.00." One per option, in order. */
export function shippingLines(): string[] {
  return SHIPPING_OPTIONS.map(
    (option) => `${option.name} — ${option.detail}. ${formatPrice(option.price)}.`,
  );
}

/** The threshold, stated once. */
export function freeShippingLine(): string {
  return `Standard shipping is free on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`;
}
