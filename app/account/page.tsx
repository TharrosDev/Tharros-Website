import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "Account",
  description: "Your THARROS account — orders, saved pieces, addresses and settings.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

const SECTIONS = [
  {
    index: "01",
    name: "Orders",
    description: "Order history, tracking and receipts.",
  },
  {
    index: "02",
    name: "Saved",
    description: "Pieces you have saved.",
    href: "/wishlist",
    available: true,
  },
  {
    index: "03",
    name: "Addresses",
    description: "Shipping and billing addresses.",
  },
  {
    index: "04",
    name: "Settings",
    description: "Email, password and communication preferences.",
  },
];

export default function AccountPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Account"
        title="Account"
        lead="Sign-in is not connected yet. Saved pieces work today and are kept on this device."
      />

      <div className="page-frame rhythm-tight">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {/* No auth provider is wired up. The shell is built so connecting
                one is a routing change, not a redesign. */}
            <div className="border border-ink p-8">
              <p className="type-meta">Sign-in not connected</p>
              <p className="type-body mt-4 text-ink-muted">
                THARROS accounts are not live yet. When authentication is connected, this
                is where you will sign in — and orders, addresses and settings below will
                fill in from your account.
              </p>
              <button type="button" disabled aria-disabled="true" className="btn btn-solid btn-full mt-8">
                Sign in
              </button>
              <p className="type-meta mt-3 text-ink-faint">
                Disabled until a provider is connected.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-rule border-y border-rule">
              {SECTIONS.map((section) => (
                <li key={section.index} className="py-6">
                  <div className="flex items-baseline justify-between gap-6">
                    <div>
                      <p className="type-meta text-ink-faint">
                        <span className="num">{section.index}</span>
                        <span className="ml-3">{section.name}</span>
                      </p>
                      <p className="type-body mt-2 text-ink-muted">{section.description}</p>
                    </div>
                    {section.available && section.href ? (
                      <Link href={section.href} className="link-rule link-rule-reveal shrink-0">
                        Open
                      </Link>
                    ) : (
                      <span className="type-meta shrink-0 text-ink-faint">Pending</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
