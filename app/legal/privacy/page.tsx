import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import PendingNotice from "@/components/ui/PendingNotice";
import { informationIndex } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How THARROS collects, uses and stores customer information.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        index={informationIndex("/legal/privacy")}
        label="Legal"
        title="Privacy policy"
      >
        <div className="mt-10">
          <PendingNotice
            label="Working draft"
            title="This has not been through legal review yet."
          >
            <p className="type-body text-ink-muted">
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
            title: "What is collected",
            body: [
              "When you place an order, THARROS collects the details needed to fulfil it: name, email, shipping address and order contents.",
              "Your bag and saved pieces are stored in your browser on your own device, not on a THARROS server.",
            ],
          },
          {
            index: "02",
            title: "How it is used",
            body: [
              "Order information is used to process, ship and support your order. Email addresses given to the mailing list are used to announce drops and campaigns, and can be unsubscribed at any time.",
            ],
          },
          {
            index: "03",
            title: "Analytics",
            body: [
              "The site records anonymous, aggregated page-view analytics. No advertising trackers or third-party profiling scripts are loaded.",
            ],
          },
          {
            index: "04",
            title: "Your rights",
            body: [
              `To request a copy of your data or have it deleted, email ${CONTACT_EMAIL}.`,
            ],
          },
        ]}
      />

      <InfoFooter current="/legal/privacy" />
    </>
  );
}
