import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import PendingNotice from "@/components/ui/PendingNotice";
import CheckoutFlow from "@/components/commerce/CheckoutFlow";
import { CONTACT_EMAIL } from "@/lib/site";

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
        {/* Stated before the form rather than after it. `/account` already
            announces its own limitation in the lead, and this page said nothing
            until step four — the same honesty, eight fields too late.

            HANDED TO THE FLOW RATHER THAN RENDERED ABOVE IT, because whether it
            belongs on screen depends on the bag and the bag is client state.
            Rendered here unconditionally it explained the payment situation to
            people whose bag is empty: four lines about a checkout they cannot
            start, sitting above the line that tells them why. */}
        <CheckoutFlow
          notice={
            <div className="mb-12">
              <PendingNotice
                label="Before you start"
                title="No card can be taken yet."
              >
                <p className="type-body text-ink-muted">
                  Everything on this page is real — your bag, your address, the
                  delivery options and the totals. What is missing is the
                  payment provider, so the last step hands you a pre-filled
                  email to{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="link-rule">
                    {CONTACT_EMAIL}
                  </a>{" "}
                  instead of a card form.
                </p>
                <p className="type-body text-ink-muted">
                  Nothing you enter leaves this browser.
                </p>
                {/* Its own line. Run on after the sentence it followed, a mono
                    uppercase link reads as the end of that sentence rather than
                    as a control. */}
                <Link
                  href="/shop"
                  className="link-rule link-rule-reveal mt-2 inline-block"
                >
                  Back to the shop
                </Link>
              </PendingNotice>
            </div>
          }
        />
      </div>
    </>
  );
}
