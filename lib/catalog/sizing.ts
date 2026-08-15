/**
 * Size guide.
 *
 * Measurements are deliberately `null` until real garment measurements are
 * taken — the table renders an em dash rather than a number nobody has checked.
 * Fill these in from the spec sheet before launch; the UI needs no changes.
 */
import { APPAREL_SIZES, type Size } from "./types";

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
 * Fit note shown beneath the table, e.g. "Model is 6'0 and wears a size M."
 * Left null until a real fitting is photographed — see docs/CONTENT_GUIDE.md.
 */
export const MODEL_FIT_NOTE: string | null = null;

export const MEASUREMENT_UNIT = "in";

export function formatMeasurement(value: Measurement): string {
  return value === null ? "—" : `${value}`;
}
