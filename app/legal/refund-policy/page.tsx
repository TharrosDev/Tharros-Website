import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import PendingNotice from "@/components/ui/PendingNotice";
import { informationIndex } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/site";
import { RETURN_WINDOW } from "@/lib/commerce/returns";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "THARROS refund terms, timelines and exceptions.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageIntro
        index={informationIndex("/legal/refund-policy")}
        label="Legal"
        title="Refund policy"
      >
        <div className="mt-10">
          <PendingNotice
            label="Working draft"
            title="This has not been through legal review yet."
          >
            <p className="type-body max-w-prose text-ink-muted">
              It states what THARROS actually intends to do, and it is here so
              nothing about the store is hidden. It is not the final wording, it
              is deliberately left out of search results, and it will be replaced
              before the store opens.
            </p>
          </PendingNotice>
        </div>
      </PageIntro>
      <InfoSections
        sections={[
          {
            index: "01",
            title: "Eligibility",
            body: [
              `Pieces returned unworn, unwashed and with tags attached within ${RETURN_WINDOW} of delivery are eligible for a refund.`,
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

      <InfoFooter current="/legal/refund-policy" />
    </>
  );
}
