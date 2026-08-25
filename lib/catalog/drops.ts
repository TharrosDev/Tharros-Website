/**
 * PLACEHOLDER CONTENT — drop copy pending final direction.
 *
 * A drop is the unit THARROS releases in. Numbered, dated, small, and closed
 * once it sells through. Replaces the open-ended "collection" idea: this label
 * does not run a permanent catalogue.
 */
import type { Drop } from "./types";

export const DROPS: Drop[] = [
  {
    id: "drop-001",
    index: "001",
    name: "Drop 001",
    slug: "drop-001",
    statement: "Where it starts.",
    body: [
      "Seven pieces. Small runs of each, made to see what holds up — the cut, the weight, the way a graphic sits once it is on a body rather than a screen.",
      "Nothing here was made in a quantity that needed a warehouse.",
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
    statement: "In development.",
    body: [
      "Being patterned and sampled now. Two pieces are far enough along to show; the rest are still being cut and re-cut.",
      "No date yet. It goes out when the fit is right.",
    ],
    releasedAt: null,
    status: "in-development",
    cover: {
      code: "DROP-002-COVER",
      src: "/photography/drop-002-cover.jpg",
      alt: "Black canvas part cut on a work table, a chalk line and pins across it",
      kind: "detail",
      ratio: "campaign",
    },
  },
];

/** The most recent released drop — what the storefront leads with. */
export const CURRENT_DROP = DROPS[0];

/** The drop being worked on, if there is one. */
export const NEXT_DROP = DROPS.find((drop) => drop.status === "in-development");

/**
 * One string, because it was two.
 *
 * The home page's next-drop section and `/drop`'s own fourth band both stated
 * this inline, in the same words, and a sentence written twice is a sentence
 * that gets edited once. It lives here because it is a fact about the drop
 * rather than about either page.
 */
export const NO_DATE_NOTE = "No release date is published until there is one.";

export function getDrop(slug: string): Drop | undefined {
  return DROPS.find((drop) => drop.slug === slug || drop.id === slug);
}
