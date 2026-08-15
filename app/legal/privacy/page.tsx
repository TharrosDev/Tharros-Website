import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How THARROS collects, uses and stores customer information.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Legal"
        title="Privacy policy"
        lead="Working draft — pending legal review before the store opens."
      />
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
    </>
  );
}
