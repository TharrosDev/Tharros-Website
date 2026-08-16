import ProductCard from "./ProductCard";
import type { Product } from "@/lib/catalog/types";

type Props = {
  products: Product[];
  /**
   * Names the grid in the page outline. Rendered visually hidden — without it,
   * product titles become h3s with no h2 above them.
   */
  heading?: string;
  /** Columns at the large breakpoint. Two reads more editorial, four reads catalog. */
  columns?: 2 | 3 | 4;
  priorityCount?: number;
  /** Print each piece's code and run figures under the frame. */
  specimen?: boolean;
};

/* One column on the narrowest phones so a single piece reads at full width,
   then a middle step at md — the grid used to jump straight from two to four
   at lg, which made the change abrupt and left cards tiny on small tablets. */
const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const SIZES: Record<2 | 3 | 4, string> = {
  2: "(min-width: 640px) 50vw, 100vw",
  3: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
};

export default function ProductGrid({
  products,
  heading,
  columns = 3,
  priorityCount = 0,
  specimen = false,
}: Props) {
  return (
    <>
      {heading ? <h2 className="visually-hidden">{heading}</h2> : null}
      <ul
        className={`grid gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 ${COLUMN_CLASS[columns]}`}
      >
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              sizes={SIZES[columns]}
              priority={index < priorityCount}
              specimen={specimen}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
