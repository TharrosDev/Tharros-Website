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

/* THE FRAME STOPS GROWING AND `vw` DOES NOT.
   `.page-frame` caps at `--frame-max`, so above roughly 1824px the content
   width is fixed at 1376 while every `vw` term keeps climbing with the screen.
   A bare `33vw` therefore claims 845px on a 2560 monitor for a card that is
   measured at 421 — two steps up Next's width ladder, and on a 2x display the
   difference is a 1920px source fetched where an 828 would do.

   `min()` is the whole fix: below the cap the viewport term still wins and
   nothing changes, above it the pixel ceiling takes over. The ceilings are the
   measured box at 2560 rounded up, not guesses. Only the widest branch needs
   one — the narrower breakpoints all sit below the cap, where `vw` is right.

   The full-bleed rails in `OnBody` and `InFrames` deliberately keep bare `vw`:
   they break the frame with `-mx-gutter`, so their items really are a share of
   the viewport. Verified — those two measure exactly what they declare. */
const SIZES: Record<2 | 3 | 4, string> = {
  2: "(min-width: 640px) min(50vw, 680px), 100vw",
  3: "(min-width: 1024px) min(33vw, 440px), (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 1024px) min(25vw, 320px), (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
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
        {/* THE CARDS DO NOT MAKE AN ENTRANCE.
            They arrived as a staggered cascade, each one uncovered as it came
            into view. That is the right gesture for an editorial band and the
            wrong one for a grid somebody is shopping: the merchandise is what
            the visitor came to compare, and an entrance means the thing they
            are looking for is briefly not there — worse when they scroll fast,
            which is exactly how a nine-piece grid gets read. The pieces are
            simply present. The entrances elsewhere on the page are untouched. */}
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
