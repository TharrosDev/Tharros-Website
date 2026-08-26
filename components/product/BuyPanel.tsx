"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import { useOutOfView } from "@/lib/hooks";
import { formatDate, formatPrice } from "@/lib/format";
import SaveButton from "./SaveButton";
import SizeGuideModal from "./SizeGuideModal";
import QuantityStepper from "@/components/commerce/QuantityStepper";
import {
  fitNote,
  isPurchasable,
  isSizeAvailable,
  resolveAvailability,
  releaseDate,
  runStatus,
  variantFor,
} from "@/lib/catalog/queries";
import { getDrop, NEXT_DROP } from "@/lib/catalog/drops";
import { pieceTable } from "@/lib/catalog/sizing";
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
  const sizesRef = useRef<HTMLFieldSetElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  // The sticky bar is present exactly while the real Add button is not, and
  // lives here because it is the same purchase — same size, same quantity,
  // same add. A second copy of that state is a second thing to keep in sync.
  const addOffScreen = useOutOfView(addRef);

  const availability = resolveAvailability(product);
  const buyable = isPurchasable(product);
  const sizingKey = getCategory(product.category)?.sizingKey ?? null;

  const maxQuantity = size
    ? Math.min(variantFor(product, size)?.inventory ?? 1, MAX_LINE_QUANTITY)
    : MAX_LINE_QUANTITY;

  const onAdd = () => {
    if (!size) {
      setError("Select a size.");
      // From the sticky bar the size selector is usually off screen, so saying
      // "select a size" without taking them to the sizes is a dead end.
      sizesRef.current?.scrollIntoView({ block: "center" });
      return;
    }
    setError(null);
    add(product.id, size, quantity);
  };

  const run = runStatus(product);
  const drop = getDrop(product.drop);

  if (!buyable) {
    const soldOut = availability === "sold-out";
    const releasesOn = releaseDate(product);

    // Two reasons a piece cannot be bought, and both belong to the garment:
    // the run is gone, or the release has not happened. Each is the answer to
    // the question the visitor arrived with, so each gets display scale.
    const headline = soldOut ? "Sold out" : "Coming soon";

    const body = soldOut
      ? run.neverRestocked
        ? "That run is finished and this piece will not be remade."
        : "That run is finished. If it returns it will be in a later drop, and it may not be identical."
      : releasesOn
        ? `Out with ${drop?.name ?? "the next drop"} on ${formatDate(releasesOn)}.`
        : `Announced for ${drop?.name ?? NEXT_DROP?.name ?? "the next drop"}.`;

    return (
      <div className="border-t border-ink pt-6">
        <p className="type-display-3 uppercase">{headline}</p>
        {soldOut && run.made > 0 ? (
          <p className="type-meta mt-3 text-ink-faint">
            <span className="num">{run.made}</span> made
          </p>
        ) : null}
        <p className="type-body mt-5 text-ink-muted">{body}</p>

        {/* Sizes are still worth showing on a piece nobody can buy — they are
            what it was cut in. As plain text rather than radios: a control that
            cannot be acted on is chrome. Struck through where the size is gone,
            which is a fact about the run. */}
        {product.variants.length > 1 ? (
          <div className="mt-8 border-t border-rule pt-5">
            <p className="type-meta text-ink-faint">Cut in</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {product.variants.map((variant) => (
                <li
                  key={variant.sku}
                  className={`type-meta ${
                    variant.inventory > 0 ? "text-ink" : "text-ink-faint line-through"
                  }`}
                >
                  {variant.size}
                  {variant.inventory > 0 ? null : (
                    <span className="visually-hidden"> — sold out</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-8 flex items-center gap-3">
          <SaveButton
            productId={product.id}
            productName={product.name}
            className="border border-rule-strong"
          />
          <span className="type-meta text-ink-faint">
            {soldOut ? "Save it" : "Save it for the release"}
          </span>
        </div>

        {/* The way on is the rest of the release it came from, and the next one
            when the data names one. Neither promises this piece back. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-5">
          <Link
            href={`/shop?drop=${drop?.slug ?? ""}`}
            className="link-rule link-rule-reveal"
          >
            The rest of {drop?.name ?? "the drop"}
          </Link>
          {NEXT_DROP && drop?.id !== NEXT_DROP.id ? (
            <Link href="/drop" className="link-rule link-rule-reveal">
              {NEXT_DROP.name}, coming next
            </Link>
          ) : null}
        </div>

        {sizingKey ? (
          <>
            <p className="type-meta mt-6">
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="link-rule link-rule-reveal -my-2 py-2"
              >
                Size guide
              </button>
            </p>
            <SizeGuideModal
              open={guideOpen}
              onClose={() => setGuideOpen(false)}
              tableKey={sizingKey}
              fitNote={fitNote(product)}
              piece={pieceTable(product)}
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {product.variants.length > 1 ? (
        <fieldset ref={sizesRef} className="border-t border-ink pt-6">
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

          {/* Native radios, not `aria-pressed` toggles: a radio group already
              has arrow-key navigation, roving focus and the right
              announcement. A disabled size is struck through as well as faint
              — the one state the spec says must not be merely a colour. */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const available = isSizeAvailable(product, variant.size);
              const selected = size === variant.size;
              return (
                <label
                  key={variant.sku}
                  className={`type-meta relative inline-flex h-12 min-w-14 items-center justify-center border px-3 transition-colors ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-rule-strong"
                  } ${
                    available
                      ? "cursor-pointer hover:border-ink"
                      : "cursor-not-allowed border-rule text-ink-faint line-through"
                  }`}
                >
                  <input
                    type="radio"
                    name={`size-${product.id}`}
                    value={variant.size}
                    disabled={!available}
                    checked={selected}
                    onChange={() => {
                      setSize(variant.size);
                      setQuantity(1);
                      setError(null);
                    }}
                    className="visually-hidden peer"
                  />
                  <span className="pointer-events-none absolute inset-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink" />
                  {variant.size}
                  {!available ? (
                    <span className="visually-hidden"> — unavailable</span>
                  ) : null}
                </label>
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
          min={1}
          onChange={setQuantity}
        />
        <SaveButton
          productId={product.id}
          productName={product.name}
          className="border border-rule-strong"
        />
      </div>

      <button
        ref={addRef}
        type="button"
        onClick={onAdd}
        className="btn btn-solid btn-full mt-6"
      >
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
          fitNote={fitNote(product)}
          piece={pieceTable(product)}
        />
      ) : null}

      {/* The phone's buy control, once the real one has scrolled away. `inert`
          rather than a conditional render, so the bar can travel and still stay
          out of the tab order until it has arrived. */}
      <div
        inert={!addOffScreen}
        className={`pb-safe fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-rule bg-surface/95 backdrop-blur-sm [transition:transform_var(--dur-base)_var(--ease-out-expo)] lg:hidden ${
          addOffScreen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="page-frame flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="num type-mono-3">{formatPrice(product.price)}</p>
            <p className="type-meta mt-0.5 text-ink-faint">
              {size ? `Size ${size}` : "Select a size"}
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="btn btn-solid shrink-0"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
