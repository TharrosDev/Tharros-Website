/**
 * THE RELEASE INDEX — every garment THARROS has put out, with its number, its
 * drop and what is left of it.
 *
 * The module keeps its filename; the surface it feeds is `/releases`. It used
 * to be called the archive on both sides, and that word was doing two jobs at
 * once: the page claimed to hold "everything made so far" while six of its
 * rows were pieces you could buy that afternoon, and the same word was the
 * stock label for a run that had closed. A shopper cannot hold both meanings,
 * so the destination is the index of releases and the closed-run label is
 * `Sold out`, which is what everything else on the site already called it.
 *
 * THE INDEX HOLDS RELEASED WORK ONLY. An unreleased piece has a number
 * reserved for it — `garmentId()` covers the whole catalogue — but no row,
 * because it has not been released. Two unreleased garments in an index of
 * releases is the one claim this file exists to make impossible, and it was
 * inflating the count while filing them under the year band of a drop with no
 * date. Until a piece ships it lives on `/drop` and `/shop`.
 *
 * NOTHING HERE IS AUTHORED. Every figure is derived from the catalogue —
 * garment numbers from release order, state from `resolveAvailability()`,
 * years from `releasedAt`. There is no second source of truth to drift out of
 * step with the product pages, and no field anyone can hand-type a wrong
 * number into.
 */
import { PRODUCTS } from "./products";
import { getDrop } from "./drops";
import { resolveAvailability, totalInventory } from "./queries";
import type { Availability, Drop, Product } from "./types";

/**
 * What an index row is, as distinct from what a product is.
 *
 * `closed` is the same stock condition as `sold-out`, named from the release's
 * side rather than the shopper's: that run finished at the number it finished
 * at. It stays a separate word only inside this module, because the index is
 * organised by release rather than by what is buyable; every customer-facing
 * label for the state comes from `AVAILABILITY_LABEL`, which says "Sold out"
 * and says it everywhere.
 *
 * `unreleased` never appears on an `ArchiveEntry` — the entries are filtered
 * before they are built. It stays in the union because it is still the right
 * answer for a *product*, and `ProductCard` reads it to print an em dash where
 * a run size would go.
 */
export type ArchiveState = "available" | "closed" | "unreleased";

export type ArchiveEntry = {
  /** `TH-001`. Sequential across the whole catalogue, derived, permanent. */
  garmentId: string;
  /** Lowercased for the URL: `th-001`. */
  ref: string;
  product: Product;
  drop: Drop | undefined;
  /** Four-digit year from `releasedAt`. Every entry has one — see the filter. */
  year: string;
  state: ArchiveState;
  availability: Availability;
  /** How many were made. */
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
 * development is already a garment, it just is not a finished one yet. The
 * number is why the ordering spans the whole catalogue while the record below
 * does not.
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
  if (availability === "sold-out") return "closed";
  if (availability === "coming-soon") return "unreleased";
  return "available";
}

export const ARCHIVE_STATE_LABEL: Record<ArchiveState, string> = {
  available: "Available",
  closed: "Sold out",
  unreleased: "Coming soon",
};

/** Has this piece been released? The index's one entry condition. */
export function isRecorded(product: Product): boolean {
  return archiveState(product) !== "unreleased";
}

const RECORDED: Product[] = ORDERED.filter(isRecorded);

function toEntry(product: Product): ArchiveEntry {
  const id = garmentId(product);
  return {
    garmentId: id,
    ref: id.toLowerCase(),
    product,
    drop: getDrop(product.drop),
    year: product.releasedAt.slice(0, 4),
    state: archiveState(product),
    availability: resolveAvailability(product),
    made: product.runSize,
    remaining: totalInventory(product),
  };
}

/** Every released garment, newest first — the order the index is read in. */
export function archiveEntries(): ArchiveEntry[] {
  return [...RECORDED].reverse().map(toEntry);
}

export function getArchiveEntry(ref: string): ArchiveEntry | undefined {
  const wanted = ref.toLowerCase();
  const product = RECORDED.find((p) => garmentId(p).toLowerCase() === wanted);
  return product ? toEntry(product) : undefined;
}


export function allArchiveRefs(): string[] {
  return RECORDED.map((p) => garmentId(p).toLowerCase());
}

/** Grouped into year bands, newest first. */
export function archiveByYear(): { year: string; entries: ArchiveEntry[] }[] {
  const bands = new Map<string, ArchiveEntry[]>();
  for (const entry of archiveEntries()) {
    const band = bands.get(entry.year);
    if (band) band.push(entry);
    else bands.set(entry.year, [entry]);
  }
  return [...bands.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, entries]) => ({ year, entries }));
}

/**
 * The three figures the index is actually about. Derived on every read so
 * they cannot disagree with a product page, and returned as numbers rather
 * than as a formatted string because the pages set them in different type.
 */
export function archiveTotals(): { garments: number; made: number; closed: number } {
  const entries = archiveEntries();
  return {
    garments: entries.length,
    made: entries.reduce((sum, e) => sum + e.made, 0),
    closed: entries.filter((e) => e.state === "closed").length,
  };
}
