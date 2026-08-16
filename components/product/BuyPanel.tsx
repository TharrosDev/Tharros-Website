"use client";

import { useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import SaveButton from "./SaveButton";
import SizeGuideModal from "./SizeGuideModal";
import QuantityStepper from "@/components/commerce/QuantityStepper";
import {
  isPurchasable,
  isSizeAvailable,
  resolveAvailability,
  runStatus,
  variantFor,
} from "@/lib/catalog/queries";
import { getDrop } from "@/lib/catalog/drops";
import { getCategory } from "@/lib/catalog/categories";
import { MAX_LINE_QUANTITY } from "@/lib/commerce/cart";
import type { Product, Size } from "@/lib/catalog/types";

export default function BuyPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<Size | null>(
    product.variants.length === 1 ? product.variants[0].size : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const availability = resolveAvailability(product);
  const buyable = isPurchasable(product);
  const sizingKey = getCategory(product.category)?.sizingKey ?? null;

  const maxQuantity = size
    ? Math.min(variantFor(product, size)?.inventory ?? 1, MAX_LINE_QUANTITY)
    : MAX_LINE_QUANTITY;

  const onAdd = () => {
    if (!size) {
      setError("Select a size.");
      return;
    }
    setError(null);
    add(product.id, size, quantity);
  };

  const run = runStatus(product);
  const drop = getDrop(product.drop);

  if (!buyable) {
    const soldOut = availability === "sold-out";
    return (
      <div className="border-t border-ink pt-6">
        <p className="type-display-3 uppercase">
          {soldOut ? "Sold out" : "Not out yet"}
        </p>
        <p className="type-meta mt-3 text-ink-faint">
          {drop?.name}
          {soldOut && run.made > 0 ? (
            <>
              <span className="mx-3" aria-hidden="true">
                /
              </span>
              <span className="num">{run.made}</span> made
            </>
          ) : null}
        </p>

        <p className="type-body mt-5 text-ink-muted">
          {soldOut
            ? run.neverRestocked
              ? "That run is finished and this piece will not be remade. Thank you — it went faster than expected."
              : "That run is finished. If it comes back it will be in a later drop, and it may not be identical."
            : "This piece is still being sampled. It goes on sale when the fit is right, not on a schedule."}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <SaveButton
            productId={product.id}
            productName={product.name}
            className="border border-rule-strong"
          />
          <span className="type-meta text-ink-faint">Save it</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {product.variants.length > 1 ? (
        <fieldset className="border-t border-ink pt-6">
          <legend className="visually-hidden">Select a size</legend>
          <div className="flex items-baseline justify-between gap-4">
            <p className="type-meta" aria-hidden="true">
              Size
            </p>
            {sizingKey ? (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="-my-2 py-2 type-meta text-ink-faint transition-opacity hover:opacity-60"
              >
                Size guide
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const available = isSizeAvailable(product, variant.size);
              const selected = size === variant.size;
              return (
                <button
                  key={variant.sku}
                  type="button"
                  disabled={!available}
                  aria-pressed={selected}
                  onClick={() => {
                    setSize(variant.size);
                    setQuantity(1);
                    setError(null);
                  }}
                  className={`type-meta h-12 min-w-14 border px-3 transition-colors ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-rule-strong hover:border-ink"
                  } ${
                    available
                      ? ""
                      : "cursor-not-allowed border-rule text-ink-faint line-through opacity-45 hover:border-rule"
                  }`}
                >
                  {variant.size}
                  {!available ? (
                    <span className="visually-hidden"> — unavailable</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          max={maxQuantity}
          label={product.name}
          onChange={(next) => setQuantity(Math.max(1, next))}
        />
        <SaveButton
          productId={product.id}
          productName={product.name}
          className="border border-rule-strong"
        />
      </div>

      <button type="button" onClick={onAdd} className="btn btn-solid btn-full mt-6">
        Add to bag
      </button>

      <p role="alert" className="field-error min-h-5">
        {error}
      </p>

      {/* The run figures are stated once, above this panel. Only the restock
          claim lives here, and only when the data actually says so. */}
      {run.neverRestocked ? (
        <p className="type-meta mt-6 border-t border-rule pt-5">Will not be remade</p>
      ) : null}

      {sizingKey ? (
        <SizeGuideModal
          open={guideOpen}
          onClose={() => setGuideOpen(false)}
          tableKey={sizingKey}
        />
      ) : null}
    </div>
  );
}
