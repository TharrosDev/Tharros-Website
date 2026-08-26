import Link from "next/link";
import {
  formatMeasurement,
  MEASUREMENT_UNIT,
  pieceTable,
} from "@/lib/catalog/sizing";
import type { Product } from "@/lib/catalog/types";

/**
 * THIS PIECE'S OWN MEASUREMENTS.
 *
 * Nobody can touch the clothes, so the numbers are the fitting room. They were
 * only ever published one place — `/size-guide`, per category — which answers
 * "how big is a THARROS medium" rather than "how big is this hoodie", and two
 * hoodies cut differently share a category and share nothing else.
 *
 * Sizes come from `pieceTable()`, which lists only the sizes the piece is made
 * in and pads a half-measured row with the same em dash the category table
 * uses. Until a piece is measured this states that plainly rather than
 * rendering a grid of dashes and calling it a specification — an empty table
 * reads as a broken table, not as pending work.
 */
export default function Measurements({ product }: { product: Product }) {
  const table = pieceTable(product);

  if (!table) {
    return (
      /* Two sentences where there were five, and neither of them explains
         the label's sampling schedule to somebody trying to pick a size. What
         a shopper can act on is the fit notes, which are on this page and are
         real, and the how-to-measure guide, which does not depend on the
         numbers arriving. */
      <>
        <p className="type-body text-ink-muted">
          Measurements coming soon. The fit notes above describe how this piece
          is cut.
        </p>
        <p className="type-body mt-4 text-ink-muted">
          <Link href="/size-guide" className="link-rule">
            How to measure
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="type-meta text-ink-faint">
        Garment measurements, {MEASUREMENT_UNIT}. Measured flat.
      </p>

      {/* The table scrolls inside itself: four columns of figures plus a size
          column does not fit a 390px record column, and the page must not
          scroll sideways to hold it. */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="type-meta py-3 pr-4">
                Size
              </th>
              {table.columns.map((column) => (
                <th key={column} scope="col" className="type-meta py-3 pr-4">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.size} className="border-b border-rule">
                <th scope="row" className="num type-meta py-3 pr-4 text-ink">
                  {row.size}
                </th>
                {row.values.map((value, column) => (
                  <td
                    key={table.columns[column]}
                    className="num type-body-sm py-3 pr-4 text-ink-muted"
                  >
                    {formatMeasurement(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="type-body-sm mt-5 text-ink-muted">
        Measure a piece you already own flat and compare — it is the closest
        thing to trying this one on.{" "}
        <Link href="/size-guide" className="link-rule">
          How to measure
        </Link>
        .
      </p>
    </>
  );
}
