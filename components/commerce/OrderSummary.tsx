"use client";

import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import { useCart } from "./CartProvider";
import { thumbnailImage } from "@/lib/catalog/queries";
import { formatPrice } from "@/lib/format";
import { shippingCost } from "@/lib/commerce/shipping";
import { TAX_PENDING_LABEL } from "@/lib/commerce/tax";

export default function OrderSummary({ shippingOptionId }: { shippingOptionId: string }) {
  const { lines, subtotal } = useCart();
  const shipping = shippingCost(subtotal, shippingOptionId);

  return (
    <div className="border border-rule p-6">
      <h2 className="type-meta">Order summary</h2>

      <ul className="mt-6 space-y-5">
        {lines.map((line) => (
          <li key={line.key} className="flex gap-4">
            <Link href={`/shop/${line.product.slug}`} className="w-16 shrink-0">
              <ImageSlot image={thumbnailImage(line.product)} sizes="64px" />
            </Link>
            <div className="flex min-w-0 flex-1 justify-between gap-3">
              <div className="min-w-0">
                <p className="type-body-sm font-medium">{line.product.name}</p>
                <p className="type-meta mt-1 text-ink-faint">
                  {line.size} — <span className="num">{line.quantity}</span>
                </p>
              </div>
              <p className="num type-mono-3 shrink-0">{formatPrice(line.lineTotal)}</p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-2 border-t border-rule pt-5">
        <div className="flex justify-between">
          <dt className="type-body-sm text-ink-muted">Subtotal</dt>
          <dd className="num type-mono-3">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="type-body-sm text-ink-muted">Shipping</dt>
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

      <p className="type-meta mt-5 text-ink-faint">
        Total excludes tax until a payment provider calculates it.
      </p>
    </div>
  );
}
