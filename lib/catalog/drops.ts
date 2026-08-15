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
      "Nothing here was made in a quantity that needed a warehouse. When a size is gone, it is gone, and what comes next is built on what this run taught.",
    ],
    releasedAt: "2026-05-02",
    status: "released",
    cover: {
      code: "DROP-001-COVER",
      alt: "Drop 001 campaign image",
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
      alt: "Drop 002 development image",
      kind: "detail",
      ratio: "campaign",
    },
  },
];

/** The most recent released drop — what the storefront leads with. */
export const CURRENT_DROP = DROPS[0];

/** The drop being worked on, if there is one. */
export const NEXT_DROP = DROPS.find((drop) => drop.status === "in-development");

export function getDrop(slug: string): Drop | undefined {
  return DROPS.find((drop) => drop.slug === slug || drop.id === slug);
}
