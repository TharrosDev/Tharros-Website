import { AVAILABILITY_LABEL, resolveAvailability } from "@/lib/catalog/queries";
import type { Product } from "@/lib/catalog/types";

/**
 * State is derived from inventory, never authored — so a badge can only appear
 * when the numbers support it.
 */
export default function ProductBadge({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const availability = resolveAvailability(product);

  if (availability === "available") {
    return product.isNew ? (
      <span className={`badge badge-solid ${className}`}>New</span>
    ) : null;
  }

  const tone = availability === "sold-out" ? "badge-quiet" : "badge-solid";

  return (
    <span className={`badge ${tone} ${className}`}>
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}
