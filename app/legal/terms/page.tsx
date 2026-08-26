import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import { informationIndex } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of sale and use for the THARROS store.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro
        index={informationIndex("/legal/terms")}
        label="Legal"
        title="Terms"
      />
      <InfoSections
        sections={[
          {
            index: "01",
            title: "Using this site",
            body: [
              "All content on this site — imagery, copy, graphics and the THARROS wordmark — belongs to THARROS and may not be reproduced commercially without permission.",
            ],
          },
          {
            index: "02",
            title: "Orders",
            body: [
              "An order is an offer to buy. It is accepted when the pieces ship. Because runs are limited, an order may be cancelled and refunded if stock is unavailable.",
              "Prices are listed in Canadian dollars and exclude tax, which is calculated at payment.",
            ],
          },
          {
            index: "03",
            title: "Product accuracy",
            body: [
              "Colours and finishes are reproduced as accurately as screens allow. Garment-washed pieces vary slightly from one to the next by design.",
            ],
          },
          {
            index: "04",
            title: "Liability",
            body: [
              "THARROS is not liable for indirect loss arising from use of this site. Nothing here limits rights you have under applicable consumer law.",
            ],
          },
        ]}
      />

      <InfoFooter current="/legal/terms" />
    </>
  );
}
