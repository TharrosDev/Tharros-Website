import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "Account",
  description: "Saved pieces.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

/**
 * UNLINKED, NOINDEXED, AND DELIBERATELY ALMOST EMPTY.
 *
 * Authentication is not connected. The page used to say so at length: a lead
 * announcing that sign-in was not live, a framed notice explaining that saved
 * pieces and the bag were held on this device and an order was placed by
 * email, a second paragraph describing what would happen once authentication
 * arrived, and a list headed "With sign-in" naming order history, saved
 * addresses and email preferences. That is a roadmap, published to customers,
 * on a route that does nothing.
 *
 * Nothing links here now — the entry is gone from the header, the index
 * overlay and the footer, and the route carries `noindex`. It survives so the
 * work has somewhere to land, and it says the one true thing plus the one
 * place that actually works.
 */
export default function AccountPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Account"
        title="Account"
        lead="Accounts are not open yet."
        crumbs={[{ name: "Home", href: "/" }]}
      />
      <div className="page-frame rhythm-tight">
        <Link href="/wishlist" className="btn btn-solid">
          Saved pieces
        </Link>
      </div>
    </>
  );
}
