/**
 * PLACEHOLDER CONTENT — drop copy pending final direction.
 *
 * A drop is the unit THARROS releases in. Numbered, dated, small, and closed
 * once it sells through. Replaces the open-ended "collection" idea: this label
 * does not run a permanent catalogue.
 *
 * WHAT A DROP RECORD SAYS AND WHAT IT DOES NOT. It names the release, states
 * what the clothes are, and stops. It used to read as a production log — what
 * was being patterned, what was on its second sample, how much could be sewn,
 * why a run was the size it was. None of that is what someone comes to a
 * clothing label for, and a release that explains its own manufacturing is
 * asking to be judged on the manufacturing. The garments carry the drop.
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
    statement: "Coming next.",
    body: [
      "A technical outer layer cut to go over the heaviest thing in Drop 001, and a fine-gauge rib knitted long enough to wear either way.",
    ],
    releasedAt: null,
    status: "upcoming",
    // NO COVER. The only frame that existed for Drop 002 was a work table with
    // a chalk line and pins across it — a picture of the drop being made
    // rather than of the drop. A preview reads better with no photograph than
    // with a photograph of something else.
  },
];

/** The most recent released drop — what the storefront leads with. */
export const CURRENT_DROP = DROPS[0];

/** The next release, if one is announced. */
export const NEXT_DROP = DROPS.find((drop) => drop.status === "upcoming");

/**
 * One string, because it was two.
 *
 * The home page's next-drop section and `/drop`'s own preview band both stated
 * this inline, in the same words, and a sentence written twice is a sentence
 * that gets edited once. It lives here because it is a fact about the drop
 * rather than about either page.
 */
export const NO_DATE_NOTE = "Dated when the release is set.";

export function getDrop(slug: string): Drop | undefined {
  return DROPS.find((drop) => drop.slug === slug || drop.id === slug);
}
