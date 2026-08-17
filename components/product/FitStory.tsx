import ModelCredit from "./ModelCredit";
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
export default function FitStory({ product }: { product: Product }) {
  if (product.fit.length === 0) return null;

  return (
    <section aria-labelledby="fit-story">
      <div className="eyebrow border-t border-ink pt-4">
        <span className="num">03</span>
        <span>How it fits</span>
      </div>

      <h2 id="fit-story" className="type-display-4 mt-6 max-w-[16ch] text-balance">
        Cut to sit like this.
      </h2>

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
