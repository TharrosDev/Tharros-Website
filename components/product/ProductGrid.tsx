import ProductCard from "./ProductCard";
import Reveal from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/motion/config";
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
  /**
   * Drop the middle column half a step at `lg`, so a three-up grid reads as a
   * hang rather than as rows of a catalogue. For the editorial grids — the home
   * run, the drop — not for `/shop`, where a scannable row is the point.
   */
  hang?: boolean;
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
  hang = false,
}: Props) {
  return (
    <>
      {heading ? <h2 className="visually-hidden">{heading}</h2> : null}
      {/* The gutters are the grid's manners: a piece needs more room from the
          piece beside it than its own record needs from its frame, and at
          gap-x-4 the two were the same distance. Vertical is the larger of the
          two so a row reads as a row. */}
      <ul
        className={`grid gap-x-6 gap-y-16 md:gap-x-10 md:gap-y-24 lg:gap-x-14 ${COLUMN_CLASS[columns]} ${hang ? "grid-hang" : ""}`}
      >
        {/* The grid arrives as a cascade rather than as one slab. The stagger
            is capped at the first row and a bit: past that the delay stops
            reading as sequence and starts reading as lag, and a nine-piece
            grid would have its last card waiting half a second. */}
        {products.map((product, index) => (
          // `frame` rather than the default fade: a card is mostly photograph,
          // and a picture that is uncovered has been developed where a picture
          // that slides up has merely been moved. The priority cards are
          // `still` — an entrance that starts hidden is an entrance that delays
          // the largest paint, and on `/shop` the first row is the LCP.
          <Reveal
            as="li"
            key={product.id}
            mode={index < priorityCount ? "still" : "frame"}
            delay={Math.min(index, STAGGER.cap) * 70}
          >
            <ProductCard
              product={product}
              sizes={SIZES[columns]}
              priority={index < priorityCount}
              specimen={specimen}
            />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
