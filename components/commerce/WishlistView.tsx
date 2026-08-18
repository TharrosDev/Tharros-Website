"use client";

import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useWishlist } from "./WishlistProvider";

export default function WishlistView() {
  const { products, ready } = useWishlist();

  if (!ready) {
    // Nothing renders until storage is read — a flash of "empty" would read as
    // data loss to someone with saved pieces.
    return <div className="min-h-[40vh]" aria-hidden="true" />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        className="min-h-[40vh]"
        title="Nothing saved."
        body="Tap the heart on any piece to keep it here. Saved pieces stay on this device — there is no account to sync them to yet."
        action={{ href: "/shop", label: "Shop the drop" }}
        secondary={{ href: "/archive", label: "Open the archive" }}
      />
    );
  }

  return (
    <>
      <p className="type-meta mb-10 text-ink-faint">
        <span className="num">{products.length}</span>
        <span className="ml-2">saved</span>
      </p>
      <ProductGrid products={products} heading="Saved pieces" columns={3} />
    </>
  );
}
