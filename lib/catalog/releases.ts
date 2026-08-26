/**
 * THE RELEASE RECORD — every garment THARROS has put out, with its number, the
 * drop it came from and what is left of it.
 *
 * NOTHING HERE IS AUTHORED. Garment numbers come from release order, state
 * from `resolveAvailability()`, dates from the drop. There is no second source
 * of truth to drift out of step with a product page, and no field anyone can
 * type a wrong number into.
 *
 * THE RECORD HOLDS RELEASED WORK ONLY. An unreleased piece has a number
 * reserved for it — `garmentId()` covers the whole catalogue — but no entry,
 * because it has not been released. Until a drop is out its pieces live on
 * `/drop` and `/shop`.
 */
import { PRODUCTS } from "./products";
import { getDrop, releasedDrops } from "./drops";
import { releaseDate, resolveAvailability, totalInventory } from "./queries";
import type { Availability, Drop, Product } from "./types";

/**
 * What a record entry is, as distinct from what a product is.
 *
 * `closed` is the same stock condition as `sold-out`, named from the release's
 * side: that run finished at the number it finished at. It stays a separate
 * word only inside this module — every customer-facing label comes from
 * `AVAILABILITY_LABEL`, which says "Sold out" and says it everywhere.
 *
 * `unreleased` never appears on a `ReleaseEntry`; entries are filtered before
 * they are built. It stays in the union because it is still the right answer
 * for a *product*.
 */
export type ReleaseEntryState = "available" | "closed" | "unreleased";

export type ReleaseEntry = {
  /** `TH-001`. Sequential across the whole catalogue, derived, permanent. */
  garmentId: string;
  /** Lowercased for the URL: `th-001`. */
  ref: string;
  product: Product;
  drop: Drop | undefined;
  /** ISO date of the release this piece came out in. */
  releasedAt: string;
  state: ReleaseEntryState;
  availability: Availability;
  /** How many were made. */
  made: number;
  remaining: number;
};

/**
 * Release order, and it has to be stable forever: a garment number that
 * renumbers itself when the catalogue grows is not an identity, and every
 * `/releases` URL would rot the next time a piece shipped.
 *
 * Date alone is not a stable key — a drop releases every one of its pieces on
 * the same day — so declaration order in `products.ts` is the tiebreak and the
 * numbering is reproducible on every machine. Unreleased pieces sort last but
 * still take a number: something being sampled is already a garment.
 */
const ORDERED: Product[] = PRODUCTS.map((product, position) => ({ product, position }))
  .sort((a, b) => {
    const byDate = (releaseDate(a.product) ?? "9999-12-31").localeCompare(
      releaseDate(b.product) ?? "9999-12-31",
    );
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

/** Read off the same availability every other surface reads. */
export function releaseEntryState(product: Product): ReleaseEntryState {
  const availability = resolveAvailability(product);
  if (availability === "sold-out") return "closed";
  if (availability === "coming-soon") return "unreleased";
  return "available";
}

export const RELEASE_STATE_LABEL: Record<ReleaseEntryState, string> = {
  available: "Available",
  closed: "Sold out",
  unreleased: "Coming soon",
};

/** Has this piece been released? The record's one entry condition. */
export function isReleased(product: Product): boolean {
  return releaseEntryState(product) !== "unreleased";
}

const RELEASED: Product[] = ORDERED.filter(isReleased);

function toEntry(product: Product): ReleaseEntry {
  const id = garmentId(product);
  return {
    garmentId: id,
    ref: id.toLowerCase(),
    product,
    drop: getDrop(product.drop),
    releasedAt: releaseDate(product) ?? "",
    state: releaseEntryState(product),
    availability: resolveAvailability(product),
    made: product.runSize,
    remaining: totalInventory(product),
  };
}

/** Every released garment, newest first. */
export function releaseEntries(): ReleaseEntry[] {
  return [...RELEASED].reverse().map(toEntry);
}

export function getReleaseEntry(ref: string): ReleaseEntry | undefined {
  const wanted = ref.toLowerCase();
  const product = RELEASED.find((p) => garmentId(p).toLowerCase() === wanted);
  return product ? toEntry(product) : undefined;
}

export function allReleaseRefs(): string[] {
  return RELEASED.map((p) => garmentId(p).toLowerCase());
}

/**
 * The releases, newest first, each with the pieces it put out.
 *
 * This is the shape `/releases` renders: the drop is the unit, not the year.
 * A page organised by year said nothing about a release that a release could
 * not say better, and it turned a history of collections into a ledger with a
 * date column. Drop 003 needs a record in `drops.ts` and nothing else.
 */
export function releaseHistory(): { drop: Drop; entries: ReleaseEntry[] }[] {
  return releasedDrops()
    .map((drop) => ({
      drop,
      entries: releaseEntries().filter((entry) => entry.drop?.id === drop.id),
    }))
    .filter((band) => band.entries.length > 0);
}
