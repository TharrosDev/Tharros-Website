import ModelCredit from "./ModelCredit";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/catalog/types";

/**
 * How it fits.
 *
 * Unlike the model credit this ships populated, because it is built from
 * `product.fit` — real authored data about the pattern, already shown on the
 * page as a comma-joined line in the specimen list. Given its own block it
 * answers the question a size chart cannot: not what the garment measures, but
 * how it is meant to sit.
 *
 * The model credit rides underneath because it is the same question answered by
 * a person rather than by copy, and it disappears cleanly when there is no
 * fitting.
 */
export default function FitStory({
  product,
  index = "03",
}: {
  product: Product;
  /** The page owns the numbering — three sections here are conditional. */
  index?: string;
}) {
  if (product.fit.length === 0) return null;

  return (
    <section aria-labelledby="fit-story">
      <SectionHeading
        index={index}
        label="How it fits"
        title="Cut to sit like this."
        titleClass="type-display-3"
        titleId="fit-story"
      />

      <ul className="mt-8 grid gap-px border-t border-rule sm:grid-cols-3">
        {product.fit.map((line) => (
          <li key={line} className="border-b border-rule py-5">
            <p className="type-body-sm text-ink">{line}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <ModelCredit product={product} />
      </div>
    </section>
  );
}
