import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import PendingNotice from "@/components/ui/PendingNotice";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Account",
  description: "Your THARROS account — saved pieces, and what arrives with sign-in.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

/**
 * What works without an account, and where it lives. Both of these are real
 * today, which is the whole reason this page is not just a notice.
 */
const WORKING = [
  {
    index: "01",
    name: "Saved pieces",
    description:
      "Kept on this device, so they survive a closed tab but not a different browser.",
    href: "/wishlist",
    action: "Open saved",
  },
  {
    index: "02",
    name: "Ordering",
    description:
      "The bag, the address and the totals are real; the order itself is placed by email until a payment provider is connected.",
    href: "/checkout",
    action: "Go to checkout",
  },
];

/** What sign-in would add. Named plainly, once, in the order it would arrive. */
const PENDING = ["Order history and tracking", "Saved addresses", "Email preferences"];

export default function AccountPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Your things"
        title="Account"
        lead="Sign-in is not connected yet. What you can do without one is below, and it is not a placeholder."
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <div className="page-frame rhythm-tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The page led with a disabled Sign in button over a list of three
              "Pending" rows — four dead controls and one live link, arranged so
              the dead ones came first. It states its position once, in the
              language the rest of the site states a pending thing in, and then
              spends the page on what works. */}
          <div className="lg:col-span-5">
            <PendingNotice
              label="Sign-in"
              title="Accounts are not live yet."
            >
              <p className="type-body text-ink-muted">
                Nothing here needs one. Saved pieces and the bag are held on this
                device, and an order is placed by writing to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-rule">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              <p className="type-body text-ink-muted">
                When authentication is connected, this page signs you in and the
                list opposite fills in from the account.
              </p>
            </PendingNotice>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-rule border-y border-rule">
              {WORKING.map((section) => (
                <li key={section.index} className="py-6">
                  <div className="flex items-baseline justify-between gap-6">
                    <div className="min-w-0">
                      <p className="type-meta text-ink-faint">
                        <span className="num">{section.index}</span>
                        <span className="ml-3">{section.name}</span>
                      </p>
                      <p className="type-body mt-2 text-ink-muted">
                        {section.description}
                      </p>
                    </div>
                    <Link
                      href={section.href}
                      className="link-rule link-rule-reveal shrink-0"
                    >
                      {section.action}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>

            <p className="type-meta mt-8 text-ink-faint">With sign-in</p>
            <ul className="type-body mt-3 space-y-1.5 text-ink-muted">
              {PENDING.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
