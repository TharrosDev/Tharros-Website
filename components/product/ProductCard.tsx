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
};

export default function ProductCard({
  product,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: Props) {
  const { add, openBag, lines } = useCart();
  // Quick-add confirms in place and offers the drawer rather than throwing a
  // browsing visitor out of the grid they are reading.
  const [added, setAdded] = useState<string | null>(null);
  // The confirmation is a claim about the bag, so the bag is what decides it:
  // this only records the last size added here, and removing that line in the
  // drawer must not leave the card still asserting "Size M in bag".
  const inBag =
    added &&
    lines.some((line) => line.productId === product.id && line.size === added)
      ? added
      : null;

  // Which frames these are is the catalogue's decision — lib/catalog/images.ts.
  const { primary, secondary } = cardImages(product);
  const buyable = isPurchasable(product);
  const soldOut = resolveAvailability(product) === "sold-out";
  const sellable = product.variants.filter((variant) =>
    isSizeAvailable(product, variant.size),
  );

  return (
    // Hover is CSS, not React state: a useState pair re-rendered every card in
    // the grid on each pointer entry, for something the browser does on its own.
    // `flex h-full flex-col` levels the row — the frames already lined up, the
    // records under them did not once a name wrapped to two lines.
    <article className="group flex h-full flex-col">
      {/* `overflow-hidden` belongs to the frame, not to the card: on the card it
          clipped the focus ring of the heart and every quick-add button. */}
      <div className="relative">
        {/* THE PICTURE IS THE SECOND WAY IN, NOT A SECOND LINK. A link wrapping
            only images takes its accessible name from their `alt`, so every
            card announced its destination twice — once as the piece, once as a
            description of a photograph. This one leaves the accessibility tree
            and the tab order and the name under it is the single named link.
            It stays a real anchor, so click, middle-click and copy-address all
            still work.

            `aria-hidden` AND `tabIndex={-1}`: hiding a focusable element is
            what makes `aria-hidden` invalid, and either alone leaves the
            duplicate in the links list. It holds no focusable descendants — the
            heart and the quick-add strip are siblings, outside this frame. */}
        <Link
          href={`/shop/${product.slug}`}
          aria-hidden="true"
          tabIndex={-1}
          className="block overflow-hidden"
        >
          <div className="hover-zoom">
            <ImageSlot image={primary} sizes={sizes} priority={priority} />
          </div>
          {/* The second shot fades in on top — the standard fashion swap. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <ImageSlot image={secondary} sizes={sizes} />
          </div>
          {/* A sold-out frame is marked, not merely washed out: the wash alone
              read as a rendering artefact beside the solid badge. */}
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

        {/* Quick add. Desktop only: on touch the product page does this job
            properly and a permanent size row would clutter the grid.

            `group-focus-within` matters as much as `group-hover` — the strip
            stays in the tab order, so without it a keyboard user walked through
            two dozen invisible size buttons. */}
        {buyable ? (
          <div
            /* Hidden by opacity, not by a full translate: the frame does not
               clip (so focus rings survive), which means a strip translated
               100% down sat on top of the name and price instead of leaving. */
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-1 bg-surface/95 px-3 py-3 opacity-0 transition duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:block"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="type-meta mr-1 text-ink-faint">
                {inBag ? "Added" : "Add"}
              </span>
              {/* Only what can actually be bought — a size someone cannot pick
                  is not a shortcut, it is a decision they have to discard. The
                  full size run is on the product page. */}
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

            {/* A polite live region rather than a toast, and the bag is offered
                rather than opened over the grid being read. */}
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
          {/* `-my-1 py-1`: the name is the card's keyboard target and a
              `type-body` line is a 19px box, under the 24px minimum. The
              negative margin gives the padding back to the layout. */}
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
        {/* On the mono ladder: the price is a figure the card is partly about. */}
        <p className="num type-mono-3 shrink-0 text-ink-muted">
          {formatPrice(product.price)}
        </p>
      </div>

    </article>
  );
}
