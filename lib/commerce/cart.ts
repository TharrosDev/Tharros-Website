import { getProductById, variantFor } from "@/lib/catalog/queries";
import type { Product, Size, Variant } from "@/lib/catalog/types";

/**
 * A stored line holds only identity and quantity. Name, price, colourway and
 * imagery are re-read from the catalog at render time, so a price or a rename
 * can never go stale inside somebody's saved bag.
 */
export type CartLine = {
  productId: string;
  size: Size;
  quantity: number;
};

export type ResolvedLine = CartLine & {
  key: string;
  product: Product;
  variant: Variant;
  /** Units actually purchasable — the quantity stepper clamps to this. */
  maxQuantity: number;
  lineTotal: number;
};

export const MAX_LINE_QUANTITY = 10;

function lineKey(productId: string, size: Size): string {
  return `${productId}::${size}`;
}

/**
 * Units of a size that may actually be written into a bag: what is on the
 * shelf, capped by the per-line limit. 0 when the piece or the size is gone.
 *
 * Every write to the stored bag goes through this. `add` clamped and
 * `setQuantity` did not, which left the quantity stepper's `max` as the only
 * thing holding a line down — and that is display state, recomputed from a
 * render. A `setQuantity` carrying a larger number (a second tab stepping the
 * same line, a replayed handler) wrote it straight to storage, where
 * `resolveLines` would hide it on the way back out and stock replenishment
 * would hand it back.
 */
export function purchasableCeiling(productId: string, size: Size): number {
  const product = getProductById(productId);
  if (!product) return 0;
  return Math.min(variantFor(product, size)?.inventory ?? 0, MAX_LINE_QUANTITY);
}

/**
 * Drops lines whose product or size no longer exists, or is out of stock, and
 * clamps quantities to what is on hand. Runs on every read, so a bag restored
 * from localStorage months later can never check out something unsellable.
 */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const resolved: ResolvedLine[] = [];

  for (const line of lines) {
    const product = getProductById(line.productId);
    if (!product) continue;

    const variant = variantFor(product, line.size);
    if (!variant || variant.inventory <= 0) continue;

    const maxQuantity = Math.min(variant.inventory, MAX_LINE_QUANTITY);
    const quantity = Math.max(1, Math.min(line.quantity, maxQuantity));

    resolved.push({
      ...line,
      quantity,
      key: lineKey(line.productId, line.size),
      product,
      variant,
      maxQuantity,
      lineTotal: product.price * quantity,
    });
  }

  return resolved;
}

export function subtotalOf(lines: ResolvedLine[]): number {
  return lines.reduce((total, line) => total + line.lineTotal, 0);
}

export function countOf(lines: ResolvedLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}
