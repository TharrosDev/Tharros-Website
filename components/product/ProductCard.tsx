"use client";

import Link from "next/link";
import { useState } from "react";
import ImageSlot from "@/components/media/ImageSlot";
import ProductBadge from "./ProductBadge";
import SaveButton from "./SaveButton";
import { useCart } from "@/components/commerce/CartProvider";
import {
  cardImages,
  isPurchasable,
  isSizeAvailable,
  resolveAvailability,
  runStatus,
} from "@/lib/catalog/queries";
import { archiveState, garmentId } from "@/lib/catalog/archive";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Product;
  /** Grid slot width, for correct image sizing. */
  sizes?: string;
  priority?: boolean;
  /** Print the piece's code and run figures under the frame. */
  specimen?: boolean;
};

export default function ProductCard({
  product,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  specimen = false,
}: Props) {
  const { add, openBag } = useCart();
  // Quick-add used to force the bag drawer open over the grid, which threw the
  // browsing visitor out of the thing they were browsing. The card confirms in
  // place instead and offers the drawer rather than imposing it.
  const [added, setAdded] = useState<string | null>(null);

  // The card leads with the piece on a person and swaps to the garment itself.
  // Which frames those are is the catalogue's decision, not the card's — see
  // lib/catalog/images.ts.
  const { primary, secondary } = cardImages(product);
  const buyable = isPurchasable(product);
  const soldOut = resolveAvailability(product) === "sold-out";
  const run = runStatus(product);
  // The garment's number in the record, not its SKU stem. `TH-ARC-HOOD` is a
  // warehouse string that happens to be visible; `TH-003` is the piece's
  // identity, it is the same on the archive ledger and its record page, and it
  // is what someone would actually use to refer to a piece they own.
  const code = garmentId(product);
  const unset = archiveState(product) === "in-development";
  const sellable = product.variants.filter((variant) =>
    isSizeAvailable(product, variant.size),
  );

  return (
    // Hover is expressed in CSS rather than React state. It used to be a
    // useState pair, which re-rendered the whole card — and every card in the
    // grid it belongs to — on each pointer entry and exit, for an effect the
    // browser can do on its own.
    <article className="group">
      {/* `overflow-hidden` belongs to the frame, not to the card. On the card it
          also clipped the 3px focus ring of everything positioned inside it —
          the heart and every quick-add size button — so keyboard focus went
          invisible on the one surface with the most focusable controls. */}
      <div className="relative">
        <Link
          href={`/shop/${product.slug}`}
          className="block overflow-hidden"
          data-cursor-mode="frame"
          data-cursor-label="View"
        >
          <div className="hover-zoom">
            <ImageSlot image={primary} sizes={sizes} priority={priority} />
          </div>
          {/* Second shot sits on top and fades in — the standard fashion swap,
              and here it is the whole editorial-to-commerce move in one gesture:
              the picture you were looking at becomes the thing you can buy. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <ImageSlot image={secondary} sizes={sizes} />
          </div>
          {/* A sold-out frame is marked, not merely washed out. The wash alone
              read as a rendering artefact next to the solid "New" badge — the
              strongest state carrying the weakest mark. */}
          {soldOut ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 border border-ink bg-paper/45"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
          <ProductBadge product={product} />
        </div>

        <div className="absolute top-2 right-2">
          <SaveButton productId={product.id} productName={product.name} />
        </div>

        {/* Quick add. Pointer-and-keyboard, desktop only: on touch the product
            page does this job properly, and a permanent size row would clutter
            the grid.

            `group-focus-within` matters as much as `group-hover`. The strip is
            translated out of sight but still in the tab order, so on /shop a
            keyboard user previously walked through 26 invisible size buttons.
            Revealing it on focus is the fix — the buttons are real
            functionality, so hiding them from the tab order would have been
            the wrong trade. */}
        {buyable ? (
          <div
            /* Hidden by opacity, not by a full translate. The frame does not
               clip — deliberately, so focus rings survive — so a strip
               translated 100% down was not out of sight at all: it sat on top
               of the name and the price on every unhovered card in the grid.
               Fading it in over the foot of the photograph keeps the frame's
               focus rings and gives the row back its own space. */
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-1 bg-surface/95 px-3 py-3 opacity-0 transition duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:block"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="type-meta mr-1 text-ink-faint">
                {added ? "Added" : "Add"}
              </span>
              {/* Only what can actually be bought. The strip used to print every
                  size and disable the gone ones, which put up to eleven targets
                  on one hovered card and nine of those cards in a grid — a
                  size someone cannot pick is not a shortcut, it is a decision
                  they have to make and discard. Which sizes exist and which are
                  finished is stated properly on the product page, in the place
                  that is about this piece. */}
              {sellable.map((variant) => (
                <button
                  key={variant.sku}
                  type="button"
                  onClick={() => {
                    add(product.id, variant.size, 1, { open: false });
                    setAdded(variant.size);
                  }}
                  className="type-meta h-8 min-w-8 border border-rule-strong px-2 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {variant.size}
                  <span className="visually-hidden">
                    {` — add ${product.name} in size ${variant.size} to bag`}
                  </span>
                </button>
              ))}
            </div>

            {/* The confirmation. A polite live region rather than a toast: the
                strip is already where the visitor is looking, and the bag is
                offered rather than opened over the grid they are reading. */}
            <p
              role="status"
              className="type-meta mt-2 flex min-h-6 items-center gap-3"
            >
              {added ? (
                <>
                  <span className="text-ink-faint">
                    Size {added} in bag
                  </span>
                  <button
                    type="button"
                    onClick={openBag}
                    className="link-rule link-rule-reveal"
                  >
                    View bag
                  </button>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <h3 className="type-body font-medium">
            <Link href={`/shop/${product.slug}`} className="link-rule-reveal">
              {product.name}
            </Link>
          </h3>
          <p className="type-meta mt-2 text-ink-faint">{product.colorway}</p>
        </div>
        {/* Promoted onto the mono ladder. The price is a figure the card is
            partly about; it was set smaller than the name it sits beside. */}
        <p className="num type-mono-3 shrink-0 text-ink-muted">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* The specimen line. Real figures only: `made` is how many exist,
          `remaining` is live variant inventory. A closed run is the one thing
          here allowed to carry the accent. */}
      {specimen ? (
        <dl className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-rule pt-3">
          <div className="flex items-baseline gap-2">
            <dt className="visually-hidden">Garment</dt>
            <dd className="type-meta text-ink-faint">{code}</dd>
          </div>
          {/* A piece still being sampled has no run size decided yet, so both
              figures are 0 — which reads as "none were made" rather than as
              "not made yet". Same em dash the archive and the size tables use
              for a number nobody has set. */}
          <div className="flex items-baseline gap-2">
            <dt className="type-meta text-ink-faint">Made</dt>
            <dd className="num type-meta">{unset ? "—" : run.made}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="type-meta text-ink-faint">Left</dt>
            {/* Deliberately not accented. A red zero on one card among nine
                puts a second mark in the same viewport as the drop numeral and
                dilutes it; the sold-out badge on the frame already says this.
                The accent for a closed run belongs on the product page, where
                it is about the piece being looked at. */}
            <dd className="num type-meta">{unset ? "—" : run.remaining}</dd>
          </div>
        </dl>
      ) : null}
    </article>
  );
}
