"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/commerce/CartProvider";
import { useOutOfView } from "@/lib/hooks";
import { formatPrice } from "@/lib/format";
import SaveButton from "./SaveButton";
import SizeGuideModal from "./SizeGuideModal";
import QuantityStepper from "@/components/commerce/QuantityStepper";
import {
  fitNote,
  isPurchasable,
  isSizeAvailable,
  resolveAvailability,
  runStatus,
  variantFor,
} from "@/lib/catalog/queries";
import { getDrop, NEXT_DROP } from "@/lib/catalog/drops";
import { pieceTable } from "@/lib/catalog/sizing";
import { getCategory } from "@/lib/catalog/categories";
import { MAX_LINE_QUANTITY } from "@/lib/commerce/cart";
import type { Product, Size } from "@/lib/catalog/types";
import { STORE_OPEN } from "@/lib/commerce/state";

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
  // The bar is present exactly while the real Add button is not. It lives in
  // this component rather than beside it because it is the same purchase — the
  // same selected size, the same quantity, the same add — and a second copy of
  // that state is a second thing to keep in sync.
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
    const upcoming = availability === "coming-soon";

    // THREE REASONS A PIECE CANNOT BE BOUGHT, AND THEY ARE NOT THE SAME THING.
    // Two belong to the garment — the run is gone, or it has not been released
    // — and one belongs to the storefront: no payment provider is connected,
    // so nothing at all can be bought yet. That last case used to be invisible
    // here and was disclosed for the first time at the top of `/checkout`,
    // after the visitor had chosen a size and filled a bag. It is stated where
    // the purchase would have been made instead.
    // A HEADLINE ONLY WHERE THE GARMENT IS THE REASON.
    // Sold out and coming soon are facts about this piece, and they belong at
    // display scale because they are the answer to the question the visitor
    // came with. The shop being shut is a fact about the storefront, and set
    // in the same type it out-shouted the garment on every product page —
    // "LAUNCHING SOON" twice the size of the name of the thing being looked
    // at. It is stated once, quietly, beside the control it replaces.
    const headline = soldOut ? "Sold out" : upcoming ? "Coming soon" : null;

    const body = soldOut
      ? run.neverRestocked
        ? "That run is finished and this piece will not be remade."
        : "That run is finished. If it returns it will be in a later drop, and it may not be identical."
      : upcoming
        ? `Announced for ${NEXT_DROP?.name ?? "the next drop"}. Dated when the release is set.`
        : null;

    // The panel's own rule belongs to the headline. With no headline the sizes
    // block below supplies the first rule, and keeping both drew two hairlines
    // with an empty band between them.
    return (
      <div className={headline ? "border-t border-ink pt-6" : ""}>
        {headline ? (
          <>
            <p className="type-display-3 uppercase">{headline}</p>
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
          </>
        ) : null}
        {body ? <p className="type-body mt-5 text-ink-muted">{body}</p> : null}

        {/* Sizes are still worth showing on a piece nobody can buy — they are
            what the piece was cut in, and a shopper reads them to know whether
            it comes in theirs. As plain text rather than as radios: a control
            that cannot be acted on is chrome. Struck through where the size is
            gone, which is a fact about the run rather than about the store. */}
        {product.variants.length > 1 ? (
          <div
            className={`border-rule pt-5 ${headline || body ? "mt-8 border-t" : "border-t border-ink"}`}
          >
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
          <span className="type-meta text-ink-faint">Save it</span>
        </div>

        {/* Said once, plainly, where the add-to-bag would be. No provider
            names, no roadmap, no apology. */}
        {!STORE_OPEN && !soldOut && !upcoming ? (
          <p className="type-meta mt-6 text-ink-faint">
            The shop is not open yet.
          </p>
        ) : null}

        {/* The way on is the rest of the release it came from, and the next
            one when the data actually names one. Neither promises this piece
            back. */}
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
          <p className="type-meta mt-6">
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="link-rule link-rule-reveal -my-2 py-2"
            >
              Size guide
            </button>
          </p>
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

          {/* Native radios inside the fieldset, not `aria-pressed` toggle
              buttons. This is a single-select group, and the platform already
              gives a radio group arrow-key navigation, roving focus and the
              right announcement — all of which the button version would have
              had to reimplement, and did not.

              Disabled sizes are struck through and set in the faint tone. They
              used to be struck through *and* faint *and* at 45% opacity, which
              made the one thing the spec says must not be "merely faded" the
              most faded thing on the site. */}
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

      {/* THE STICKY RECORD.
          On a phone the order was gallery, title, price, run, description, a
          five-row specimen table, and only then this panel — so choosing a size
          and adding to the bag sat roughly two screens below the fold, on a
          page whose entire job is that decision. Quick-add is desktop-only and
          explicitly defers to the product page, which meant nothing was doing
          this job anywhere on touch.

          `inert` rather than a conditional render: the bar stays mounted so it
          can travel, and stays out of the tab order until it has arrived. */}
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
