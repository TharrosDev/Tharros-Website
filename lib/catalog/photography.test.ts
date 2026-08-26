/**
 * Run with: node lib/catalog/photography.test.ts
 *
 * IMPORTS HERE CARRY `.ts` AND SO MUST EVERY VALUE IMPORT THEY REACH. Node
 * runs this file directly and strips the types itself, which means a bare
 * `from "./products"` two modules down resolves to nothing and `npm test`
 * fails with ERR_MODULE_NOT_FOUND. It works today because `products`,
 * `images`, `campaign` and `drops` import types only, and a type import is
 * erased before resolution ever happens. `archive.ts` and `queries.ts` cannot
 * be imported from here for exactly that reason.
 *
 * THE LINE BETWEEN A PHOTOGRAPH AND A STAND-IN.
 *
 * `public/filler` holds free-licence stock. It exists so a layout can be
 * judged before the shoot, and `FillerImage` labels every one of them in the
 * alt text — but the only structural difference between "this is the garment"
 * and "this is a picture of somebody else's garment" is whether a slot carries
 * a `src`. That is one optional field standing between a development aid and a
 * false claim about a product, and nothing was checking it.
 *
 * Two assertions, and they fail in opposite directions:
 *
 *   1. No declared `src` may point into `public/filler`. Pointing a slot at a
 *      stand-in is how a stock photograph becomes product photography without
 *      anybody deciding to do that.
 *   2. The set of pieces with no photography is stated, not counted. When a
 *      shoot lands, this fails until the list is updated — which is the point:
 *      it makes "which pieces are still unphotographed" a thing the repository
 *      knows rather than a thing somebody remembers.
 */
import assert from "node:assert/strict";
import { PRODUCTS } from "./products.ts";
import { NAV_FRAMES, PAGE_FRAMES } from "./images.ts";
import { CAMPAIGNS } from "./campaign.ts";
import { DROPS } from "./drops.ts";
import type { ImageSlotData } from "./types.ts";

/**
 * Pieces with no photography yet, by slug. Empty this as the shoot delivers.
 * Session 2 of `docs/PHOTOGRAPHY_PROMPT.md` is the queue that empties it.
 */
export const PENDING_PHOTOGRAPHY = [
  "core-tee",
  "arc-hoodie",
  "utility-cargo-pant",
];

const everySlot: ImageSlotData[] = [
  ...PRODUCTS.flatMap((product) => product.images),
  ...Object.values(NAV_FRAMES),
  ...Object.values(PAGE_FRAMES),
  ...DROPS.flatMap((drop) => (drop.cover ? [drop.cover] : [])),
  ...CAMPAIGNS.flatMap((campaign) =>
    [campaign.hero, ...campaign.sequence].map((frame) => frame.image),
  ),
];

for (const slot of everySlot) {
  if (!slot.src) continue;
  assert.ok(
    slot.src.startsWith("/photography/"),
    `${slot.code} points at ${slot.src} — real photography lives in /photography, and a stand-in must never be declared as a src`,
  );
}

const unphotographed = PRODUCTS.filter(
  (product) => !product.images.some((image) => image.src),
).map((product) => product.slug);

assert.deepEqual(
  unphotographed.sort(),
  [...PENDING_PHOTOGRAPHY].sort(),
  "PENDING_PHOTOGRAPHY is out of step with the catalogue — a piece was shot, or a piece lost its photography",
);

console.log(
  `photography: ok — ${everySlot.filter((s) => s.src).length} frames shot, ${unphotographed.length} pieces pending`,
);
