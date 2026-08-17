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

  // Every unavailable state is solid. Sold out used to be the quietest badge in
  // the system while "New" was the loudest, which inverted the two states'
  // actual weight: one is a nice-to-know, the other is the whole answer to
  // "can I buy this".
  return (
    <span className={`badge badge-solid ${className}`}>
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}
