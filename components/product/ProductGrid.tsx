import ProductCard from "./ProductCard";
import type { Product } from "@/lib/catalog/types";

type Columns = 2 | 3 | 4 | 5;

type Props = {
  products: Product[];
  /**
   * Names the grid in the page outline. Rendered visually hidden — without it,
   * product titles become h3s with no h2 above them.
   */
  heading?: string;
  /** Columns at the large breakpoint. Two reads more editorial, five reads catalog. */
  columns?: Columns;
  priorityCount?: number;
};

/* One column on the narrowest phones so a single piece reads at full width,
   then a middle step at `md` — two straight to four leaves cards tiny on a
   small tablet. */
const COLUMN_CLASS: Record<Columns, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

/* THE FRAME STOPS GROWING AND `vw` DOES NOT. `.page-frame` caps at
   `--frame-max`, so above ~1824px the content width is fixed while every `vw`
   term keeps climbing — a bare `33vw` claims 845px on a 2560 monitor for a card
   measured at 421. `min()` puts a pixel ceiling above the cap and changes
   nothing below it. The ceilings are the measured box at 2560, not guesses.

   `InFrames` keeps bare `vw` on purpose: it breaks the frame with `-mx-gutter`,
   so its items really are a share of the viewport. */
const SIZES: Record<Columns, string> = {
  2: "(min-width: 640px) min(50vw, 680px), 100vw",
  3: "(min-width: 1024px) min(33vw, 440px), (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 1024px) min(25vw, 320px), (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
  5: "(min-width: 1024px) min(20vw, 264px), (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
};

export default function ProductGrid({
  products,
  heading,
  columns = 3,
  priorityCount = 0,
}: Props) {
  /* A five-up row is a narrower card, so it takes a narrower gutter with it.
     The wide interval is measured for a 420px card; spent five times across
     the same frame it takes a third of the row width and leaves the pieces
     too small to read. */
  const gap =
    columns === 5
      ? "gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16"
      : "gap-x-6 gap-y-16 md:gap-x-10 md:gap-y-24 lg:gap-x-14";

  return (
    <>
      {heading ? <h2 className="visually-hidden">{heading}</h2> : null}
      {/* A piece needs more room from the piece beside it than its own record
          needs from its frame, and the vertical gutter is the larger of the two
          so a row reads as a row. `items-stretch` is load-bearing: the card is
          a full-height column, so a row of records sits on one baseline however
          many lines a name takes. */}
      <ul className={`grid ${gap} ${COLUMN_CLASS[columns]}`}>
        {/* THE CARDS DO NOT MAKE AN ENTRANCE. An entrance is right for an
            editorial band and wrong for a grid somebody is shopping: it means
            the thing they are looking for is briefly not there, which is worse
            the faster they scroll. The entrances elsewhere are untouched. */}
        {products.map((product, index) => (
          <li key={product.id} className="h-full">
            <ProductCard
              product={product}
              sizes={SIZES[columns]}
              priority={index < priorityCount}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
