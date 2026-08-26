import type { ResolvedLine } from "./cart";
import { CONTACT_EMAIL } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { regionName } from "./regions";

/**
 * THE PAYMENT BOUNDARY. There is exactly one, and this is it.
 *
 * Everything upstream — the bag, the address form, the delivery choice, the
 * totals — is the finished storefront and knows nothing about who takes the
 * money. Connecting a provider means replacing the body of `createCheckout`
 * with a call that opens a hosted session and returns its URL. No component,
 * no page and no test above this file changes.
 *
 * Until that call exists nothing here fabricates an order: no order id, no
 * charge, no confirmation. The draft is handed to the label directly instead.
 */
export type OrderDraft = {
  lines: ResolvedLine[];
  contact: { email: string; firstName: string; lastName: string };
  address: {
    address1: string;
    address2: string;
    city: string;
    region: string;
    postal: string;
    country: string;
    countryName: string;
  };
  delivery: { id: string; name: string; cost: number };
  subtotal: number;
  total: number;
};

/** Where the customer goes next. A provider returns its own hosted URL here. */
export type Checkout = { url: string };

export async function createCheckout(draft: OrderDraft): Promise<Checkout> {
  return { url: orderMailto(draft) };
}

/**
 * The draft, written out for a human to read. It is what the label receives
 * while no provider is connected, and it is composed from the same values the
 * summary shows — nothing is retyped and nothing is invented.
 */
function orderMailto(draft: OrderDraft): string {
  const { contact, address, delivery } = draft;
  const body = [
    "I would like to order the following:",
    "",
    ...draft.lines.map(
      (line) =>
        `- ${line.product.name} / size ${line.size} x${line.quantity} — ${formatPrice(line.lineTotal)}`,
    ),
    "",
    `Delivery: ${delivery.name}`,
    `Total: ${formatPrice(draft.total)}`,
    "",
    "Ship to:",
    ...[
      `${contact.firstName} ${contact.lastName}`.trim(),
      address.address1,
      address.address2,
      [address.city, regionName(address.country, address.region), address.postal]
        .filter(Boolean)
        .join(", "),
      address.countryName,
      contact.email,
    ].filter(Boolean),
  ].join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Order")}&body=${encodeURIComponent(body)}`;
}
