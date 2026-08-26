import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageIntro from "@/components/layout/PageIntro";
import CheckoutFlow from "@/components/commerce/CheckoutFlow";
import { STORE_OPEN } from "@/lib/commerce/state";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your THARROS order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

/**
 * Two steps — details, then delivery — and the transaction itself is handed to
 * `createCheckout()` in `lib/commerce/checkout.ts`. Nothing on this page knows
 * who takes the money.
 *
 * Redirects while the storefront is closed between drops: a checkout with
 * nothing purchasable behind it is a wrong turn, not a page.
 */
export default function CheckoutPage() {
  if (!STORE_OPEN) redirect("/shop");

  return (
    <>
      <PageIntro index="01" label="Checkout" title="Checkout" compact />
      <div className="page-frame">
        <CheckoutFlow />
      </div>
    </>
  );
}
