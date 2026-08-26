/**
 * THE RELEASES. A drop is the unit THARROS puts clothes out in: numbered,
 * dated, small, and closed once it sells through.
 *
 * THE DROP OWNS THE RELEASE DATE. Products used to repeat it — every Drop 001
 * piece carried 2026-05-02 and every Drop 002 piece carried a date the drop
 * itself did not have, so the collection and its own garments disagreed about
 * when the release was. `releaseDate()` in `queries.ts` reads it from here, and
 * a product has no date of its own to drift.
 *
 * A drop record names the release, states what the clothes are, and stops.
 */
import type { Drop } from "./types";

export const DROPS: Drop[] = [
  {
    id: "drop-001",
    index: "001",
    name: "Drop 001",
    slug: "drop-001",
    statement: "Wide and heavy.",
    body: [
      "Seven pieces built around weight and volume — heavyweight jersey and fleece cut wide through the shoulder, canvas squared off through the body, a leg wide enough to stack over a boot.",
      "Black, off white, bone and faded black. Graphics set large or not at all.",
    ],
    releasedAt: "2026-05-02",
    status: "released",
    cover: {
      code: "DROP-001-COVER",
      src: "/photography/drop-001-cover.jpg",
      alt: "Two figures apart along a plaster wall, in the Arc Hoodie and the Work Jacket",
      kind: "lifestyle",
      ratio: "campaign",
    },
  },
  {
    id: "drop-002",
    index: "002",
    name: "Drop 002",
    slug: "drop-002",
    statement: "A shell, and a rib knit.",
    body: [
      "A technical outer layer cut to go over the heaviest thing in Drop 001, and a fine-gauge rib knitted long enough to wear either way.",
    ],
    releasedAt: "2026-09-12",
    status: "upcoming",
    // No cover frame yet. A preview reads better with no photograph than with
    // a photograph of something else; every surface treats `cover` as optional.
  },
];

/** The release the storefront leads with: the most recent one that is out. */
export const CURRENT_DROP =
  [...DROPS]
    .filter((drop) => drop.status === "released")
    .sort((a, b) => (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""))[0] ?? DROPS[0];

/** The next release, if one is announced. Earliest first, so Drop 004 being
 *  added does not make it the one previewed ahead of Drop 003. */
export const NEXT_DROP = [...DROPS]
  .filter((drop) => drop.status === "upcoming")
  .sort((a, b) => (a.releasedAt ?? "9999").localeCompare(b.releasedAt ?? "9999"))[0];

/** Released drops, newest first — the order `/releases` reads in. */
export function releasedDrops(): Drop[] {
  return [...DROPS]
    .filter((drop) => drop.status === "released")
    .sort((a, b) => (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""));
}

export function getDrop(slug: string): Drop | undefined {
  return DROPS.find((drop) => drop.slug === slug || drop.id === slug);
}
