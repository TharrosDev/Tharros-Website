import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "THARROS refund terms, timelines and exceptions.",
  alternates: { canonical: "/legal/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Legal"
        title="Refund policy"
        lead="Working draft — pending legal review before the store opens."
      />
      <InfoSections
        sections={[
          {
            index: "01",
            title: "Eligibility",
            body: [
              "Pieces returned unworn, unwashed and with tags attached within 30 days of delivery are eligible for a refund.",
              "Final-sale pieces, where marked as such at the time of purchase, are not eligible.",
            ],
          },
          {
            index: "02",
            title: "Timeline",
            body: [
              "Refunds are issued to the original payment method within 10 business days of the return being received and inspected. How quickly it appears depends on your bank.",
            ],
          },
          {
            index: "03",
            title: "Faulty pieces",
            body: [
              `If a piece arrives faulty or incorrect, email ${CONTACT_EMAIL} within 14 days of delivery. Return shipping is covered and the piece is refunded or replaced.`,
            ],
          },
        ]}
      />
    </>
  );
}
