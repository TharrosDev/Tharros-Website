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
} from "@/lib/catalog/queries";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Product;
  /** Grid slot width, for correct image sizing. */
  sizes?: string;
  priority?: boolean;
  /** Print the piece's run figures under the frame. */
  specimen?: boolean;
};

export default function ProductCard({
  product,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: Props) {
  const { add, openBag, lines } = useCart();
  // Quick-add used to force the bag drawer open over the grid, which threw the
  // browsing visitor out of the thing they were browsing. The card confirms in
  // place instead and offers the drawer rather than imposing it.
  const [added, setAdded] = useState<string | null>(null);
  // The confirmation is a claim about the bag, so the bag has to be what says
  // it. This state only records which size was last added here; removing that
  // line in the drawer used to leave the card asserting "Size M in bag" for the
  // rest of the visit, on a site whose position is that it tells you the truth
  // about stock.
  const inBag =
    added &&
    lines.some((line) => line.productId === product.id && line.size === added)
      ? added
      : null;

  // The card leads with the piece on a person and swaps to the garment itself.
  // Which frames those are is the catalogue's decision, not the card's — see
  // lib/catalog/images.ts.
  const { primary, secondary } = cardImages(product);
  const buyable = isPurchasable(product);
  const soldOut = resolveAvailability(product) === "sold-out";
  const sellable = product.variants.filter((variant) =>
    isSizeAvailable(product, variant.size),
  );

  return (
    // Hover is expressed in CSS rather than React state. It used to be a
    // useState pair, which re-rendered the whole card — and every card in the
    // grid it belongs to — on each pointer entry and exit, for an effect the
    // browser can do on its own.
    // `flex h-full flex-col` levels the grid. The frame is one ratio for every
    // piece, so the pictures already lined up — what did not was everything
    // under them: a name that wrapped to two lines pushed its specimen row a
    // line lower than the card beside it. The card fills its grid row and the
    // specimen line is pinned to the foot, so a row of records reads as a row.
    <article className="group flex h-full flex-col">
      {/* `overflow-hidden` belongs to the frame, not to the card. On the card it
          also clipped the 3px focus ring of everything positioned inside it —
          the heart and every quick-add size button — so keyboard focus went
          invisible on the one surface with the most focusable controls. */}
      <div className="relative">
        {/* THE PICTURE IS THE SECOND WAY IN, NOT A SECOND LINK.
            The card carries two routes to the same product — this frame and
            the name under it — which is right for a pointer and wrong for
            everything else: a screen reader announced the destination twice
            per card, and this one announced it as its own photograph, because
            a link wrapping only images takes its accessible name from their
            `alt`. On /shop that is nine pieces read out as eighteen links, half
            of them called things like "A figure in Drop 001 against a plain
            wall, daylight".

            So it leaves the accessibility tree and the tab order, and the name
            under it becomes the single named link to the piece. It stays a real
            anchor, so clicking the picture, middle-clicking it and copying its
            address all still work.

            `aria-hidden` with `tabIndex={-1}` rather than either alone: hiding
            a focusable element is what makes `aria-hidden` invalid, and taking
            it out of the tab order without hiding it leaves the duplicate in
            the links list. It holds no focusable descendants — the heart and
            the quick-add strip are siblings below, deliberately outside this
            frame. */}
        <Link
          href={`/shop/${product.slug}`}
          aria-hidden="true"
          tabIndex={-1}
          className="block overflow-hidden"
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
                {inBag ? "Added" : "Add"}
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
              {inBag ? (
                <>
                  <span className="text-ink-faint">
                    Size {inBag} in bag
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

      <div className="flex items-start justify-between gap-4 pt-5 pb-4">
        <div className="min-w-0">
          {/* `-my-1 py-1` for the same reason the footer links carry it: the
              name is the card's keyboard target and a `type-body` line is a
              19px box, under the 24px minimum. The negative margin gives the
              padding back to the layout, so the specimen row below does not
              move. */}
          <h3 className="type-body font-medium">
            <Link
              href={`/shop/${product.slug}`}
              className="link-rule-reveal -my-1 inline-block py-1"
            >
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

      {/* NO SPECIMEN ROW. Every card in every grid used to end on
          `MADE 40 / LEFT 24` — an inventory ledger under a photograph of a
          hoodie, on the home page, the shop, the drop and the related rail.
          Nine of them in one viewport is a page about stock levels, which is
          the personality this site is no longer trying to have. The run is
          still stated, once, on the product page beside the price, where it
          reads as a property of the release rather than as the point of it.

          What a card says about state is the badge on the frame — sold out,
          low stock, coming soon, new — and that is enough to decide whether
          the piece is worth opening. */}
    </article>
  );
}
