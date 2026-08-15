/** PLACEHOLDER CONTENT — collection copy pending final direction. */
import type { Collection } from "./types";

export const COLLECTIONS: Collection[] = [
  {
    id: "collection-01",
    name: "Collection 01",
    slug: "collection-01",
    season: "Summer 2026",
    statement: "Built for those who don't blend in.",
    body: [
      "Collection 01 is the first statement THARROS makes out loud. Fifteen pieces, one palette, no decoration that isn't doing work.",
      "The cuts are heavy and square. Graphics are set at scale or left off entirely. Everything is designed to be worn hard and worn together — the shell over the hoodie, the hoodie over the tee, the tee on its own until it fades.",
    ],
    cover: {
      code: "COL-01-COVER",
      alt: "Collection 01 campaign image",
      kind: "lifestyle",
      ratio: "campaign",
    },
  },
  {
    id: "collection-02",
    name: "Collection 02",
    slug: "collection-02",
    season: "Winter 2026",
    statement: "In progress.",
    body: [
      "Collection 02 is not out yet. Pieces appear here as they are released.",
    ],
    cover: {
      code: "COL-02-COVER",
      alt: "Collection 02 campaign image",
      kind: "lifestyle",
      ratio: "campaign",
    },
  },
];

export const CURRENT_COLLECTION = COLLECTIONS[0];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}
