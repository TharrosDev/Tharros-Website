/**
 * PLACEHOLDER CONTENT.
 *
 * The campaign is the layer above the catalogue: the frames that show what
 * THARROS looks like on people, in a place, rather than what each piece looks
 * like on its own. The homepage opens on one, the drop page runs the sequence,
 * and every frame links the pieces in it — which is how someone gets from a
 * picture they like to a garment they can buy without ever meeting a product
 * card first.
 *
 * All four frames are photographed. The catalogue is not: captions and lines
 * below are still placeholder copy for layout and must be replaced before
 * launch.
 *
 * `hotspots` is deliberately absent on every frame. A coordinate pointing at a
 * garment in a drawing that has no garment at that coordinate is a fabricated
 * interaction, so the markers only render once a frame has a real photograph
 * behind them — see components/campaign/FrameHotspots.tsx.
 */
import type { Campaign } from "./types";

export const CAMPAIGNS: Campaign[] = [
  {
    drop: "drop-001",
    hero: {
      id: "cmp-001-hero",
      index: "001",
      // No `line` here. It read "Nine pieces, made small." against a drop of
      // seven, nothing rendered it, and a hand-typed count is exactly the figure
      // that drifts. Every piece count on the site is derived from the catalogue.
      // EMPTY, AND NOT BY OVERSIGHT. The opening frame is now a real
      // photograph, and it is a head-and-shoulders portrait — there is no
      // garment in it. "In this frame" over a list of two pieces the frame
      // does not show is the site asserting something untrue, which is the one
      // thing the catalogue rules do not bend on. `WornList` renders nothing
      // for an empty list, so the rail is simply absent until a frame exists
      // that actually has clothes in it.
      wearing: [],
      image: {
        code: "CMP-001-HERO",
        src: "/photography/cmp-001-hero.jpg",
        alt: "A woman in wraparound sunglasses against a plain wall, daylight",
        kind: "campaign",
        // The home page renders this one `fill`, so the ratio is not what
        // shapes it — the opening section is. It stays declared because
        // `sceneFor` reads it to pick a stand-in when `src` is switched off,
        // and a tall declaration keeps that stand-in a portrait rather than a
        // letterbox.
        ratio: "tall",
      },
    },
    sequence: [
      {
        id: "cmp-001-a",
        index: "01",
        caption: "The hoodie, walked in rather than posed in.",
        wearing: ["arc-hoodie"],
        image: {
          code: "CMP-001-A",
          src: "/photography/cmp-001-a.jpg",
          alt: "Figure walking away in the Arc Hoodie, seen from behind against a plaster wall",
          kind: "lifestyle",
          ratio: "tall",
          crop: "walking",
        },
      },
      {
        id: "cmp-001-b",
        index: "02",
        caption: "Boxy through the chest. It holds its shape instead of draping.",
        wearing: ["core-tee"],
        image: {
          code: "CMP-001-B",
          src: "/photography/cmp-001-b.jpg",
          alt: "A woman standing square against a concrete wall in the Core Tee, full length",
          kind: "model",
          ratio: "portrait",
          crop: "full",
        },
      },
      {
        id: "cmp-001-c",
        index: "03",
        caption: "Drop 001, at the far end of the street.",
        wearing: ["work-jacket", "utility-cargo-pant"],
        image: {
          code: "CMP-001-C",
          src: "/photography/cmp-001-c.jpg",
          alt: "Figure at distance under a concrete underpass, small against the span",
          kind: "campaign",
          ratio: "campaign",
        },
      },
    ],
  },
];

export function campaignFor(dropId: string): Campaign | undefined {
  return CAMPAIGNS.find((campaign) => campaign.drop === dropId);
}

