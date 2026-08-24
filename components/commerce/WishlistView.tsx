"use client";

import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useWishlist } from "./WishlistProvider";

export default function WishlistView() {
  const { products, ready } = useWishlist();

  if (!ready) {
    // Nothing renders until storage is read — a flash of "empty" would read as
    // data loss to someone with saved pieces.
    //
    // But that blank is what the SERVER sends, so with scripting unavailable it
    // is the whole page: `main` held seven characters, the word in the heading.
    // The saved list genuinely cannot work without storage, and saying so is
    // the honest version of a page that otherwise just looks broken. `noscript`
    // rather than a rendered fallback, because a reader who has JavaScript is
    // about to get the real answer a frame later and must not see this.
    return (
      <div className="min-h-[40svh]">
        <noscript>
          <p className="type-body text-ink-muted">
            Saved pieces are kept in this browser rather than in an account, so
            this list needs JavaScript to read them back.
          </p>
        </noscript>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        className="min-h-[40svh]"
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
