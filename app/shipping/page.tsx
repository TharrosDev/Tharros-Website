import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import { informationIndex } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_OPTIONS,
  SHIPPING_RATES_CONFIRMED,
} from "@/lib/commerce/shipping";

export const metadata: Metadata = {
  title: "Shipping",
  description: "THARROS shipping options, delivery times and costs.",
  alternates: { canonical: "/shipping" },
};

/**
 * RATES THAT ARE NOT CONFIRMED ARE NOT PRICES.
 *
 * This page printed two carrier rates and a free-shipping threshold as
 * settled figures, and then, four lines below them, said they were
 * placeholders pending final carrier contracts. Anything a customer reads as a
 * price has to be one; a footnote does not undo a number. The rates are
 * declared in one place — `lib/commerce/shipping.ts`, which is also what the
 * bag and the checkout quote from — so `SHIPPING_RATES_CONFIRMED` is the one
 * flag that decides whether they are shown as figures or as the delivery
 * options they describe. Confirm the contracts, fill in the real numbers, flip
 * the flag, and every surface follows.
 */
export default function ShippingPage() {
  const rates = SHIPPING_OPTIONS.map((option) =>
    SHIPPING_RATES_CONFIRMED
      ? `${option.name} — ${option.detail}. ${formatPrice(option.price)}.`
      : `${option.name} — ${option.detail}.`,
  );

  return (
    <>
      <PageIntro
        index={informationIndex("/shipping")}
        label="Information"
        title="Shipping"
        lead="Where it goes, what it costs, and how long it takes."
        crumbs={[{ name: "Home", href: "/" }]}
      />
      <InfoSections
        sections={[
          {
            index: "01",
            title: "Rates",
            body: SHIPPING_RATES_CONFIRMED
              ? [
                  ...rates,
                  `Standard shipping is free on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`,
                ]
              : [...rates, "Costs are published with the first release."],
          },
          {
            index: "02",
            title: "Processing",
            body: [
              "Orders are packed within two business days. A drop release can take longer — if a piece is going to be delayed, you are emailed rather than left waiting.",
            ],
          },
          {
            index: "03",
            title: "Tracking",
            body: [
              "A tracking number is emailed as soon as the parcel is scanned by the carrier.",
            ],
          },
          {
            index: "04",
            title: "Duties and taxes",
            body: [
              "Tax is calculated at payment based on the delivery address. International orders may attract duties on arrival, which are the responsibility of the recipient.",
            ],
          },
        ]}
      />

      <InfoFooter current="/shipping" />
    </>
  );
}
