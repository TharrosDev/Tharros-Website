import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import InfoSections from "@/components/layout/InfoSections";
import InfoFooter from "@/components/layout/InfoFooter";
import { informationIndex } from "@/lib/site";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns",
  description: "THARROS returns and exchanges policy.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <>
      <PageIntro
        index={informationIndex("/returns")}
        label="Information"
        title="Returns"
        lead="Thirty days, unworn, tags on. The rest is detail."
        crumbs={[{ name: "Home", href: "/" }]}
      />
      <InfoSections
        sections={[
          {
            index: "01",
            title: "Window",
            body: [
              "Unworn, unwashed pieces with tags attached can be returned within 30 days of delivery.",
            ],
          },
          {
            index: "02",
            title: "How to return",
            body: [
              `Email ${CONTACT_EMAIL} with your order number and the pieces you are returning. Return instructions come back by email.`,
              "Return shipping is paid by the customer unless the piece arrived faulty or incorrect.",
            ],
          },
          {
            index: "03",
            title: "Exchanges",
            body: [
              "Sizes can be exchanged where stock allows. Because pieces are made in limited runs, an exchange may not be possible on a sold-out size — in that case the return is refunded.",
            ],
          },
          {
            index: "04",
            title: "Refunds",
            body: [
              "Refunds are issued to the original payment method once the return is received and inspected.",
              "This policy is a working draft pending legal review before launch.",
            ],
          },
        ]}
      />

      <InfoFooter current="/returns" />
    </>
  );
}
