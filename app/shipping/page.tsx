import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import { informationIndex } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS } from "@/lib/commerce/shipping";

export const metadata: Metadata = {
  title: "Shipping",
  description: "THARROS shipping options, delivery times and costs.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  const rates = SHIPPING_OPTIONS.map(
    (option) => `${option.name} — ${option.detail}. ${formatPrice(option.price)}.`,
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
            body: [
              ...rates,
              `Standard shipping is free on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`,
              "Rates shown are placeholders pending final carrier contracts and will be confirmed before the store opens.",
            ],
          },
          {
            index: "02",
            title: "Processing",
            body: [
              "Orders are packed within two business days. Drop releases can take longer — if a piece is going to be delayed, you will be emailed rather than left waiting.",
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
