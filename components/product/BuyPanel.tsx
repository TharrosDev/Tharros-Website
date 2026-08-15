"use client";

import { useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import SaveButton from "./SaveButton";
import SizeGuideModal from "./SizeGuideModal";
import QuantityStepper from "@/components/commerce/QuantityStepper";
import {
  AVAILABILITY_LABEL,
  isPurchasable,
  isSizeAvailable,
  resolveAvailability,
  variantFor,
} from "@/lib/catalog/queries";
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

  if (!buyable) {
    return (
      <div className="border-t border-ink pt-6">
        <p className="type-meta">{AVAILABILITY_LABEL[availability]}</p>
        <p className="type-body mt-3 text-ink-muted">
          {availability === "sold-out"
            ? "This piece has sold out. Restocks are announced to the mailing list first."
            : "Not released yet. Release dates go out to the mailing list first."}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <SaveButton
            productId={product.id}
            productName={product.name}
            className="border border-rule-strong"
          />
          <span className="type-meta text-ink-faint">Save for later</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {product.variants.length > 1 ? (
        <fieldset className="border-t border-ink pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <legend className="type-meta float-left">Size</legend>
            {sizingKey ? (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="type-meta text-ink-faint transition-opacity hover:opacity-60"
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

      {availability === "low-stock" ? (
        <p className="type-meta mt-2 text-ink-muted">Low stock</p>
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
