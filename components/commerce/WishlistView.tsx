"use client";

import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
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
      <div className="min-h-[40vh] border-t border-rule pt-16">
        <p className="type-display-3 uppercase">Nothing saved.</p>
        <p className="type-body mt-4 text-ink-muted">
          Tap the heart on any piece to keep it here.
        </p>
        <Link href="/shop" className="btn btn-solid mt-10">
          Shop the collection
        </Link>
      </div>
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
