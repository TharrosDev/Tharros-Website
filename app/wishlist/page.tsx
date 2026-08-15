import type { Metadata } from "next";
import PageIntro from "@/components/layout/PageIntro";
import WishlistView from "@/components/commerce/WishlistView";

export const metadata: Metadata = {
  title: "Saved",
  description: "Pieces you have saved from the THARROS collection.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageIntro index="01" label="Saved" title="Saved" />
      <div className="page-frame rhythm-tight">
        <WishlistView />
      </div>
    </>
  );
}
