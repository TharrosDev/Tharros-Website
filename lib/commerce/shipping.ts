/**
 * PLACEHOLDER RATES. These are structural stand-ins so the bag and checkout can
 * show a real subtotal → shipping → total breakdown. Replace with the carrier
 * rates THARROS actually contracts before launch.
 */
export type ShippingOption = {
  id: string;
  name: string;
  detail: string;
  /** Minor units. */
  price: number;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard",
    detail: "5–8 business days",
    price: 1200,
  },
  {
    id: "express",
    name: "Express",
    detail: "2–3 business days",
    price: 2500,
  },
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
