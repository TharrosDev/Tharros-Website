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
 * Like the catalogue, none of these frames carry `src` yet. Captions and lines
 * below are placeholder copy for layout and must be replaced before launch.
 *
 * `hotspots` is deliberately absent on every frame. A coordinate pointing at a
 * garment in a drawing that has no garment at that coordinate is a fabricated
 * interaction, so the markers only render once a frame has a real photograph
 * behind them — see components/campaign/FrameHotspots.tsx.
 */
import type { CampaignFrame, Campaign } from "./types";

export const CAMPAIGNS: Campaign[] = [
  {
    drop: "drop-001",
    hero: {
      id: "cmp-001-hero",
      index: "001",
      line: "Nine pieces, made small.",
      wearing: ["arc-hoodie", "utility-cargo-pant"],
      image: {
        code: "CMP-001-HERO",
        alt: "Two figures in Drop 001 on a concrete stair, late afternoon",
        kind: "campaign",
        ratio: "campaign",
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
          alt: "Figure walking, the Arc Hoodie moving with the stride",
          kind: "lifestyle",
          ratio: "editorial",
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
          alt: "Figure standing against a brutalist wall in the Core Tee",
          kind: "model",
          ratio: "portrait",
          crop: "full",
        },
      },
      {
        id: "cmp-001-c",
        index: "03",
        caption: "Drop 001, at the end of the street it was made on.",
        wearing: ["work-jacket", "utility-cargo-pant"],
        image: {
          code: "CMP-001-C",
          alt: "Figure at distance under an underpass in the Work Jacket",
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

/** Every frame of a campaign, hero first — for pages that want the whole set. */
export function campaignFrames(dropId: string): CampaignFrame[] {
  const campaign = campaignFor(dropId);
  return campaign ? [campaign.hero, ...campaign.sequence] : [];
}
