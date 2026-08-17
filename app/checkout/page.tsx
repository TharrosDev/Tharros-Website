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
            until step four — the same honesty, eight fields too late. */}
        <div className="mb-12">
          <PendingNotice
            label="Before you start"
            title="No card can be taken yet."
          >
            <p className="type-body text-ink-muted">
              Everything on this page is real — your bag, your address, the
              delivery options and the totals. What is missing is the payment
              provider, so the last step hands you a pre-filled email to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-rule">
                {CONTACT_EMAIL}
              </a>{" "}
              instead of a card form.
            </p>
            <p className="type-body text-ink-muted">
              Nothing you enter leaves this browser.{" "}
              <Link href="/shop" className="link-rule link-rule-reveal">
                Back to the shop
              </Link>
            </p>
          </PendingNotice>
        </div>
        <CheckoutFlow />
      </div>
    </>
  );
}
