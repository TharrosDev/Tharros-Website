"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import ImageSlot from "@/components/media/ImageSlot";
import QuantityStepper from "./QuantityStepper";
import { useCart } from "./CartProvider";
import { CloseIcon } from "@/components/ui/icons";
import EmptyState from "@/components/ui/EmptyState";
import { useEscape, useFocusTrap, useLockBodyScroll } from "@/lib/hooks";
import { getRelated, getFeatured, thumbnailImage } from "@/lib/catalog/queries";
import { formatPrice } from "@/lib/format";
import {
  amountToFreeShipping,
  DEFAULT_SHIPPING_OPTION,
  shippingCost,
} from "@/lib/commerce/shipping";
import { RETURN_WINDOW } from "@/lib/commerce/returns";
import { TAX_PENDING_LABEL } from "@/lib/commerce/tax";

export default function CartDrawer() {
  const {
    isOpen,
    closeBag,
    lines,
    subtotal,
    count,
    setQuantity,
    remove,
    add,
    adjusted,
  } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Removing a line was instant and irreversible, in a panel that updates live,
   * with no confirmation and nothing to press afterwards. Undo is cheaper than a
   * confirmation dialog and costs the customer nothing when they meant it.
   *
   * Cleared by closing rather than by a timer: a countdown that expires while
   * someone is reading is a worse promise than one that waits.
   */
  const [undo, setUndo] = useState<{
    productId: string;
    size: (typeof lines)[number]["size"];
    quantity: number;
    name: string;
  } | null>(null);

  /**
   * The bag-was-adjusted notice, once the customer has actually seen the bag.
   *
   * `adjusted` compares stored lines against resolved ones, and nothing ever
   * writes the resolution back — so a piece that sold out while it sat in
   * somebody's bag made this banner true permanently. It reads as news, it
   * carries `role="status"`, and it re-announced the same stale line on every
   * open for the life of the bag. Told once, on the screen that shows what
   * changed, and then done with.
   */
  const [noticeSeen, setNoticeSeen] = useState(false);

  const close = () => {
    setUndo(null);
    setNoticeSeen(true);
    closeBag();
  };

  useLockBodyScroll(isOpen);
  useEscape(isOpen, close);
  useFocusTrap(isOpen, panelRef);

  const shipping = shippingCost(subtotal, DEFAULT_SHIPPING_OPTION.id);
  const remaining = amountToFreeShipping(subtotal);
  // The drawer is mounted on every page now, so this ran on every render of
  // every route. It only depends on the first line.
  const firstLine = lines[0]?.product;
  const recommendations = useMemo(
    () => (firstLine ? getRelated(firstLine, 3) : getFeatured(3)),
    [firstLine],
  );

  return (
    <div data-open={isOpen} className="overlay-root fixed inset-0 z-[var(--z-overlay)]">
      <button
        type="button"
        aria-label="Close bag"
        onClick={close}
        tabIndex={isOpen ? undefined : -1}
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        className="overlay-panel overlay-from-right pb-safe absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col bg-surface"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-rule px-6 py-4">
          <h2 id="bag-title" className="type-meta">
            Bag <span className="num ml-2">{count}</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="-mr-3 flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
          >
            <CloseIcon />
            <span className="visually-hidden">Close bag</span>
          </button>
        </div>

        {/* The bag re-reads stock on every render, so a piece that sold out
            since it was added is dropped and an over-large quantity is clamped.
            Both used to happen in silence. */}
        {adjusted && !noticeSeen ? (
          <p
            role="status"
            className="type-meta shrink-0 border-b border-rule bg-surface-frame px-6 py-3 text-ink"
          >
            Your bag was updated — something in it is no longer available.
          </p>
        ) : null}

        {undo ? (
          <div
            role="status"
            className="flex shrink-0 items-center justify-between gap-4 border-b border-rule px-6 py-3"
          >
            <p className="type-meta min-w-0 truncate text-ink-muted">
              Removed {undo.name}
            </p>
            <button
              type="button"
              onClick={() => {
                add(undo.productId, undo.size, undo.quantity, { open: false });
                setUndo(null);
              }}
              className="link-rule link-rule-reveal shrink-0"
            >
              Undo
            </button>
          </div>
        ) : null}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center px-6 py-16">
            <EmptyState
              title="Your bag is empty."
              body="The whole catalogue is in the shop."
              action={{ href: "/shop", label: "Shop the drop", onClick: close }}
              secondary={{ href: "/drop", label: "What is coming", onClick: close }}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-rule">
                {lines.map((line) => (
                  <li key={line.key} className="flex gap-4 py-6">
                    <Link
                      href={`/shop/${line.product.slug}`}
                      onClick={close}
                      className="w-24 shrink-0"
                    >
                      <ImageSlot image={thumbnailImage(line.product)} sizes="96px" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="type-body-sm font-medium">
                            <Link href={`/shop/${line.product.slug}`} onClick={close}>
                              {line.product.name}
                            </Link>
                          </p>
                          <p className="type-meta mt-1.5 text-ink-faint">
                            {line.product.colorway} / {line.size}
                          </p>
                        </div>
                        <p className="num type-mono-3 shrink-0">
                          {formatPrice(line.lineTotal)}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <QuantityStepper
                          value={line.quantity}
                          max={line.maxQuantity}
                          label={`${line.product.name}, size ${line.size}`}
                          onChange={(next) =>
                            setQuantity(line.productId, line.size, next)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUndo({
                              productId: line.productId,
                              size: line.size,
                              quantity: line.quantity,
                              name: line.product.name,
                            });
                            remove(line.productId, line.size);
                          }}
                          className="type-meta text-ink-faint transition-opacity hover:opacity-60"
                        >
                          Remove
                          <span className="visually-hidden">
                            {" "}
                            {line.product.name}, size {line.size}
                          </span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {recommendations.length > 0 ? (
                <div className="border-t border-rule py-8">
                  <h3 className="type-meta mb-5 text-ink-faint">You may also like</h3>
                  <ul className="grid grid-cols-3 gap-3">
                    {recommendations.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={close}
                          className="block"
                        >
                          <ImageSlot image={thumbnailImage(product)} sizes="120px" />
                          <p className="type-body-sm mt-2 leading-tight">{product.name}</p>
                          <p className="num type-body-sm text-ink-muted">
                            {formatPrice(product.price)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="shrink-0 border-t border-rule px-6 py-6">
              {/* A hairline is the one mark this site has for progress, and
                  this is the one place in the bag with progress to show. */}
              {remaining > 0 ? (
                <div className="mb-5">
                  <p className="type-meta text-ink-faint">
                    {formatPrice(remaining)} from free standard shipping
                  </p>
                  <div className="mt-2 h-px w-full bg-rule">
                    <div
                      className="h-px bg-ink [transition:width_var(--dur-base)_var(--ease-out-quart)]"
                      style={{
                        width: `${Math.min(100, Math.round((subtotal / (subtotal + remaining)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="type-body-sm text-ink-muted">Subtotal</dt>
                  <dd className="num type-mono-3">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="type-body-sm text-ink-muted">Shipping estimate</dt>
                  <dd className="num type-mono-3">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="type-body-sm text-ink-muted">Tax</dt>
                  <dd className="type-body-sm text-ink-faint">{TAX_PENDING_LABEL}</dd>
                </div>
                <div className="flex justify-between border-t border-rule pt-3">
                  <dt className="type-meta">Total</dt>
                  <dd className="num font-medium">{formatPrice(subtotal + shipping)}</dd>
                </div>
              </dl>

              {/* The two questions asked at this exact moment, answered here
                  rather than in the footer's information directory: how long it
                  takes and what happens if it does not fit. Both come from the
                  data the checkout quotes from, so neither can drift. */}
              <p className="type-meta mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink-faint">
                <span>
                  {DEFAULT_SHIPPING_OPTION.name}, {DEFAULT_SHIPPING_OPTION.detail}
                </span>
                <Link
                  href="/returns"
                  onClick={close}
                  className="link-rule link-rule-reveal"
                >
                  {RETURN_WINDOW} to return
                </Link>
              </p>

              <Link href="/checkout" onClick={close} className="btn btn-solid btn-full mt-5">
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
