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

  // Every unavailable state is solid, including `Archived`. Renaming the state
  // reframes what a finished run means; it does not make the badge less
  // load-bearing on a grid, where "can I buy this" is still the question being
  // asked. The archive is where a closed run is read as a record — there the
  // state sits in a ledger row at metadata weight, not on a solid chip.
  // Sold out used to be the quietest badge in the system while "New" was the
  // loudest, which inverted the two states' actual weight.
  return (
    <span className={`badge badge-solid ${className}`}>
      {AVAILABILITY_LABEL[availability]}
    </span>
  );
}
