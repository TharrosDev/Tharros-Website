import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import CheckoutFlow from "@/components/commerce/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your THARROS order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageIntro index="01" label="Checkout" title="Checkout" compact />
      <div className="page-frame">
        <CheckoutFlow />
      </div>
    </>
  );
}
