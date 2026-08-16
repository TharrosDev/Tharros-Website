import { fitNote } from "@/lib/catalog/queries";
import type { Product } from "@/lib/catalog/types";

/**
 * "Jae is 183 cm and wears a size M."
 *
 * Renders nothing at all until a real fitting exists. There is deliberately no
 * pending state here: a size guide can say its measurements are not taken yet,
 * because a garment definitely has measurements. A model credit is different —
 * until someone has actually worn the piece there is no person to be vague
 * about, and a "model details coming soon" line would be inventing the shoot.
 */
export default function ModelCredit({ product }: { product: Product }) {
  const note = fitNote(product);
  if (!note) return null;

  return <p className="type-meta text-ink-faint">{note}</p>;
}
