/**
 * Size guide.
 *
 * Measurements are deliberately `null` until real garment measurements are
 * taken — the table renders an em dash rather than a number nobody has checked.
 * Fill these in from the spec sheet before launch; the UI needs no changes.
 */
import { APPAREL_SIZES, type Product, type Size } from "./types";

export type Measurement = number | null;

export type SizeRow = {
  size: Size;
  values: Measurement[];
};

export type SizeTable = {
  key: "top" | "bottom";
  title: string;
  /** Column headers after the SIZE column. Measurements are in inches. */
  columns: string[];
  rows: SizeRow[];
};

const emptyRows = (columns: number): SizeRow[] =>
  APPAREL_SIZES.map((size) => ({
    size,
    values: Array.from({ length: columns }, () => null),
  }));

export const SIZE_TABLES: Record<"top" | "bottom", SizeTable> = {
  top: {
    key: "top",
    title: "Tops",
    columns: ["Chest", "Body length", "Sleeve", "Shoulder"],
    rows: emptyRows(4),
  },
  bottom: {
    key: "bottom",
    title: "Bottoms",
    columns: ["Waist", "Inseam", "Leg opening", "Rise"],
    rows: emptyRows(4),
  },
};

/**
 * One piece's own table, built from its measurements against the columns of
 * whichever category table it declares.
 *
 * A piece is measured, not a category: two hoodies cut differently share a
 * column set and share nothing else. This returns null when the piece has no
 * measurements, which is every piece today — the product page says so rather
 * than rendering a grid of dashes and calling it a size guide.
 *
 * Only the sizes the piece actually comes in appear, and in `APPAREL_SIZES`
 * order rather than the order they were typed, so a table cannot disagree with
 * the size row above it.
 */
export function pieceTable(product: Product): SizeTable | null {
  const measured = product.measurements;
  if (!measured) return null;

  const base = SIZE_TABLES[measured.table];
  const stocked = new Set(product.variants.map((variant) => variant.size));

  const rows = APPAREL_SIZES.filter((size) => stocked.has(size))
    .filter((size) => measured.rows[size])
    .map((size) => ({
      size,
      // Short rows pad rather than throw: a piece measured across the chest
      // before anyone reached for the sleeve is normal, and the dash is the
      // same one an unmeasured category column renders.
      values: base.columns.map(
        (_, column) => measured.rows[size]?.[column] ?? null,
      ),
    }));

  if (rows.length === 0) return null;

  return { ...base, title: product.name, rows };
}

/**
 * Fit note shown beneath the table, e.g. "Model is 6'0 and wears a size M."
 * Left null until a real fitting is photographed — see docs/CONTENT_GUIDE.md.
 */
export const MODEL_FIT_NOTE: string | null = null;

export const MEASUREMENT_UNIT = "in";

export function formatMeasurement(value: Measurement): string {
  return value === null ? "—" : `${value}`;
}
