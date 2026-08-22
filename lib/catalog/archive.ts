/**
 * THE ARCHIVE — every garment THARROS has made, as a record rather than as
 * stock.
 *
 * A shop answers "what can I buy". An archive answers "what has been made",
 * and the second question is the one a small label is actually interesting
 * for. So a piece never leaves this file: when its run is finished it stops
 * being for sale and starts being history, which is a promotion, not a
 * deletion.
 *
 * NOTHING HERE IS AUTHORED. Every figure is derived from the catalogue —
 * garment numbers from release order, state from `resolveAvailability()`,
 * years from `releasedAt`. There is no second source of truth to drift out of
 * step with the product pages, and there is no field anyone can hand-type a
 * wrong number into.
 */
import { PRODUCTS } from "./products";
import { getDrop } from "./drops";
import { resolveAvailability, totalInventory } from "./queries";
import type { Availability, Drop, Product } from "./types";

/**
 * What an archive record is, as distinct from what a product is.
 *
 * `archived` is not `sold-out` wearing a nicer word. Sold out is a shopping
 * fact — you came too late. Archived is a production fact — that run is
 * closed and the number it closed at is now part of the record. Same data,
 * and deliberately a different frame: the site is trying to make a finished
 * run read as something that happened rather than as something you missed.
 */
export type ArchiveState = "available" | "archived" | "in-development";

export type ArchiveEntry = {
  /** `TH-001`. Sequential across the whole catalogue, derived, permanent. */
  garmentId: string;
  /** Lowercased for the URL: `th-001`. */
  ref: string;
  product: Product;
  drop: Drop | undefined;
  /** Four-digit year from `releasedAt`, or null while a piece is unreleased. */
  year: string | null;
  state: ArchiveState;
  availability: Availability;
  /** How many were made. Zero while a piece is still being developed. */
  made: number;
  remaining: number;
};

/**
 * Release order, and it has to be stable forever: a garment number that
 * renumbers itself when the catalogue grows is not an identity, it is an
 * index, and every archive URL would rot the next time a piece shipped.
 *
 * Sorting by `releasedAt` alone is not stable — Drop 001 released seven
 * pieces on one date and `Array.prototype.sort` gives no guarantee across
 * equal keys beyond insertion order. Declaration order in `products.ts` is
 * the tiebreak, so the numbering is reproducible on every machine.
 *
 * Unreleased pieces sort last by date but still take a number: something in
 * development is already a garment, it just is not a finished one yet.
 */
const ORDERED: Product[] = PRODUCTS.map((product, position) => ({ product, position }))
  .sort((a, b) => {
    const byDate = a.product.releasedAt.localeCompare(b.product.releasedAt);
    return byDate !== 0 ? byDate : a.position - b.position;
  })
  .map(({ product }) => product);

const NUMBERS = new Map<string, string>(
  ORDERED.map((product, i) => [product.id, `TH-${String(i + 1).padStart(3, "0")}`]),
);

/** `TH-003`. The piece's permanent number in the record. */
export function garmentId(product: Product): string {
  return NUMBERS.get(product.id) ?? "TH-000";
}

/**
 * State is read off the same availability the rest of the site reads, so a
 * piece cannot be archived here and on sale two routes away.
 */
export function archiveState(product: Product): ArchiveState {
  const availability = resolveAvailability(product);
  if (availability === "sold-out") return "archived";
  if (availability === "coming-soon" || availability === "preorder") return "in-development";
  return "available";
}

export const ARCHIVE_STATE_LABEL: Record<ArchiveState, string> = {
  available: "Available",
  archived: "Archived",
  "in-development": "In development",
};

function toEntry(product: Product): ArchiveEntry {
  const id = garmentId(product);
  return {
    garmentId: id,
    ref: id.toLowerCase(),
    product,
    drop: getDrop(product.drop),
    year: product.releasedAt ? product.releasedAt.slice(0, 4) : null,
    state: archiveState(product),
    availability: resolveAvailability(product),
    made: product.runSize,
    remaining: totalInventory(product),
  };
}

/** Every garment, newest first — the order the archive is read in. */
export function archiveEntries(): ArchiveEntry[] {
  return [...ORDERED].reverse().map(toEntry);
}

export function getArchiveEntry(ref: string): ArchiveEntry | undefined {
  const wanted = ref.toLowerCase();
  const product = ORDERED.find((p) => garmentId(p).toLowerCase() === wanted);
  return product ? toEntry(product) : undefined;
}


export function allArchiveRefs(): string[] {
  return ORDERED.map((p) => garmentId(p).toLowerCase());
}

/**
 * Grouped into `ARCHIVE / 2026` bands, newest year first. A piece with no
 * release date has not entered a year yet and collects under its own band,
 * which is named at the call site rather than here — this file does not do
 * copy.
 */
export function archiveByYear(): { year: string | null; entries: ArchiveEntry[] }[] {
  const bands = new Map<string, ArchiveEntry[]>();
  for (const entry of archiveEntries()) {
    const key = entry.year ?? "";
    const band = bands.get(key);
    if (band) band.push(entry);
    else bands.set(key, [entry]);
  }
  return [...bands.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, entries]) => ({ year: year === "" ? null : year, entries }));
}

/**
 * The two figures the archive is actually about. Derived on every read so
 * they cannot disagree with a product page, and returned as numbers rather
 * than as a formatted string because the pages set them in different type.
 */
export function archiveTotals(): { garments: number; made: number; archived: number } {
  const entries = archiveEntries();
  return {
    garments: entries.length,
    made: entries.reduce((sum, e) => sum + e.made, 0),
    archived: entries.filter((e) => e.state === "archived").length,
  };
}
