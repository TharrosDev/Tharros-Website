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
 * THE ROUTE STAYS. THE DEAD END DOES NOT.
 *
 * This page used to open on a panel headed "No card can be taken yet",
 * explaining that the bag, the address and the totals were real but the
 * payment provider was missing, so the last step would hand over a pre-filled
 * email instead of a card form. That panel was honest and it was in the wrong
 * place: by the time anyone read it they had been told a drop was out now,
 * offered an add-to-bag on every card, and walked to a checkout — three
 * promises, then a correction.
 *
 * The correction is now made at the top, once, by not making the promises:
 * nothing is purchasable while `STORE_OPEN` is false, so no bag fills, no
 * drawer opens and this route has nothing to check out. It redirects rather
 * than rendering an apology, because a checkout with an empty bag and no
 * payment is not a page, it is a wrong turn.
 *
 * `CheckoutFlow` is untouched and still holds the working two-step flow —
 * details, address, delivery and live totals. Connecting a provider and
 * flipping the flag restores this page whole.
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
