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
 * UNLINKED AND NOINDEXED. Accounts are a separate system from shopping and
 * nothing on the storefront depends on one — the bag and the saved list are
 * held on the device. The route survives so authentication has somewhere to
 * land; nothing links to it and it publishes no roadmap.
 */
export default function AccountPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Account"
        title="Account"
        lead="Your saved pieces are held on this device."
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
