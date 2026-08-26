import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import { informationIndex } from "@/lib/site";
import { freeShippingLine, shippingLines } from "@/lib/commerce/shipping";

export const metadata: Metadata = {
  title: "Shipping",
  description: "THARROS shipping options, delivery times and costs.",
  alternates: { canonical: "/shipping" },
};

/**
 * Every figure on this page is composed by `lib/commerce/shipping.ts`, which is
 * also what the product page, the bag and the checkout quote from. The page
 * formats nothing itself — a rate written out here is a rate that can disagree
 * with the one the customer is charged.
 */
export default function ShippingPage() {
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
            body: [...shippingLines(), freeShippingLine()],
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
              "Tax is calculated at payment based on the delivery address. Orders crossing a border may attract duties on arrival, which are the responsibility of the recipient.",
            ],
          },
        ]}
      />

      <InfoFooter current="/shipping" />
    </>
  );
}
