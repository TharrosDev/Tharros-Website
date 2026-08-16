"use client";

import Link from "next/link";
import { useState } from "react";
import ImageSlot from "@/components/media/ImageSlot";
import ProductBadge from "./ProductBadge";
import SaveButton from "./SaveButton";
import { useCart } from "@/components/commerce/CartProvider";
import {
  isPurchasable,
  isSizeAvailable,
  resolveAvailability,
  runStatus,
} from "@/lib/catalog/queries";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Product;
  /** Grid slot width, for correct image sizing. */
  sizes?: string;
  priority?: boolean;
  /** Larger title, for the editorial slots on the home page. */
  emphasis?: boolean;
  /** Print the piece's code and run figures under the frame. */
  specimen?: boolean;
};

export default function ProductCard({
  product,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  emphasis = false,
  specimen = false,
}: Props) {
  const { add } = useCart();
  const [hovered, setHovered] = useState(false);

  const front = product.images[0];
  const back = product.images[1] ?? front;
  const buyable = isPurchasable(product);
  const soldOut = resolveAvailability(product) === "sold-out";
  const run = runStatus(product);
  // The style code without its size suffix — the same figure the product page
  // prints, so the two cannot disagree.
  const code = product.variants[0]?.sku.replace(/-[^-]+$/, "");

  return (
    <article
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="hover-zoom">
            <ImageSlot image={front} sizes={sizes} priority={priority} />
          </div>
          {/* Second shot sits on top and fades in — the standard fashion swap. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <ImageSlot image={back} sizes={sizes} />
          </div>
          {soldOut ? (
            <span className="absolute inset-0 bg-paper/35" aria-hidden="true" />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
          <ProductBadge product={product} />
        </div>

        <div className="absolute top-2 right-2">
          <SaveButton productId={product.id} productName={product.name} />
        </div>

        {/* Quick add. Hover-only by design: on touch the product page does this
            job properly, and a permanent size row would clutter the grid. */}
        {buyable ? (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-surface/95 px-3 py-3 transition-transform duration-300 md:block ${
              hovered ? "pointer-events-auto translate-y-0" : ""
            }`}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="type-meta mr-1 text-ink-faint">Add</span>
              {product.variants.map((variant) => {
                const available = isSizeAvailable(product, variant.size);
                return (
                  <button
                    key={variant.sku}
                    type="button"
                    disabled={!available}
                    onClick={() => add(product.id, variant.size)}
                    className="type-meta h-8 min-w-8 border border-rule-strong px-2 transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:border-rule disabled:opacity-40 disabled:hover:border-rule disabled:hover:bg-transparent disabled:hover:text-ink"
                  >
                    {variant.size}
                    <span className="visually-hidden">
                      {available
                        ? ` — add ${product.name} in size ${variant.size} to bag`
                        : ` — size ${variant.size} unavailable`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h3 className={emphasis ? "type-display-4" : "type-body font-medium"}>
            <Link href={`/shop/${product.slug}`} className="link-rule-reveal">
              {product.name}
            </Link>
          </h3>
          <p className="type-meta mt-2 text-ink-faint">{product.colorway}</p>
        </div>
        <p className="num shrink-0 text-ink-muted">{formatPrice(product.price)}</p>
      </div>

      {/* The specimen line. Real figures only: `made` is how many exist,
          `remaining` is live variant inventory. A closed run is the one thing
          here allowed to carry the accent. */}
      {specimen ? (
        <dl className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-rule pt-3">
          <div className="flex items-baseline gap-2">
            <dt className="visually-hidden">Code</dt>
            <dd className="type-meta text-ink-faint">{code}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="type-meta text-ink-faint">Made</dt>
            <dd className="num text-[0.6875rem]">{run.made}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="type-meta text-ink-faint">Left</dt>
            {/* Deliberately not accented. A red zero on one card among nine
                puts a second mark in the same viewport as the drop numeral and
                dilutes it; the sold-out badge on the frame already says this.
                The accent for a closed run belongs on the product page, where
                it is about the piece being looked at. */}
            <dd className="num text-[0.6875rem]">{run.remaining}</dd>
          </div>
        </dl>
      ) : null}
    </article>
  );
}
