import type { Crop, ImageKind, ImageSlotData, Product } from "./types";

/**
 * Which picture of a piece to show, and in what order.
 *
 * Until now every consumer reached into `product.images` by position — the card
 * took `[0]` and `[1]`, the gallery walked the array in authored order. That
 * worked only because every product happens to carry the same four slots in the
 * same sequence, and it made "lead with the shot of someone wearing it" a
 * change to every component rather than a change to one rule.
 *
 * So the order is decided here, once, from what a slot *is*. A piece with one
 * photograph and a piece with eight both come out right, and no component needs
 * to know how many exist — which is the whole point, because the shoot will not
 * produce the same set for every garment.
 */

/**
 * The discovery ladder. Lower sorts first: a person wearing the piece beats a
 * picture of the piece on its own, every time.
 */
const KIND_RANK: Record<ImageKind, number> = {
  model: 0,
  lifestyle: 1,
  campaign: 2,
  detail: 3,
  back: 4,
  front: 5,
};

/** Within a kind, a frame that shows the whole silhouette wins — that is what a fit shot is for. */
const CROP_BONUS: Record<Crop, number> = {
  full: -0.3,
  "three-quarter": -0.2,
  walking: -0.1,
  close: 0,
};

function score(image: ImageSlotData): number {
  if (image.rank !== undefined) return image.rank;
  return KIND_RANK[image.kind] + (image.crop ? CROP_BONUS[image.crop] : 0);
}

/**
 * A piece with no slots at all should still hold its frame rather than crash a
 * grid. The catalogue never produces this today; it exists so the resolvers can
 * promise a slot instead of an optional one.
 */
function pendingSlot(product: Product): ImageSlotData {
  return {
    code: product.variants[0]?.sku.replace(/-[^-]+$/, "") ?? product.id.toUpperCase(),
    alt: `${product.name} — photography pending`,
    kind: "front",
    ratio: "portrait",
  };
}

/**
 * Every slot, best first. `sort` is stable, so slots of equal rank keep the
 * order they were authored in — which keeps the stand-in artwork deterministic.
 */
export function orderedImages(product: Product): ImageSlotData[] {
  return [...product.images].sort((a, b) => score(a) - score(b));
}

/** The single frame that represents the piece. */
export function heroImage(product: Product): ImageSlotData {
  return orderedImages(product)[0] ?? pendingSlot(product);
}

/**
 * The grid card: the piece on a person, swapping to the garment itself on
 * hover. The second frame is deliberately of a *different* kind — two views of
 * one object is the point, and two near-identical model shots is not a swap.
 */
export function cardImages(product: Product): {
  primary: ImageSlotData;
  secondary: ImageSlotData;
} {
  const ordered = orderedImages(product);
  const primary = ordered[0] ?? pendingSlot(product);
  const secondary = ordered.find((image) => image.kind !== primary.kind) ?? primary;
  return { primary, secondary };
}

/** The product page gallery: worn, then in the world, then detail, then flat. */
export function galleryImages(product: Product): ImageSlotData[] {
  const ordered = orderedImages(product);
  return ordered.length > 0 ? ordered : [pendingSlot(product)];
}

/** Frames of a person wearing it. May be empty — the ON BODY section renders nothing then. */
export function onBodyImages(product: Product): ImageSlotData[] {
  return orderedImages(product).filter(
    (image) => image.kind === "model" || image.kind === "lifestyle",
  );
}

/** Frames of the piece somewhere, rather than on a plain ground. May be empty. */
export function inSituImages(product: Product): ImageSlotData[] {
  return orderedImages(product).filter(
    (image) => image.kind === "lifestyle" || image.kind === "campaign",
  );
}

/** Close studies of cloth and construction. May be empty. */
export function detailImages(product: Product): ImageSlotData[] {
  return orderedImages(product).filter((image) => image.kind === "detail");
}

/**
 * The bag, the search results, the order summary.
 *
 * These deliberately invert the ladder: at 64px a full-body frame is a smudge,
 * and someone checking their bag is identifying an item, not being sold one. A
 * flat shot of the garment is the legible choice, so it wins here and only here.
 */
export function thumbnailImage(product: Product): ImageSlotData {
  const flat = product.images.find((image) => image.kind === "front");
  return flat ?? product.images.find((image) => image.kind === "back") ?? heroImage(product);
}

/**
 * THE NAVIGATION FRAMES — one picture per destination in the index overlay.
 *
 * Hovering a row in the menu brings up the frame that belongs to it, so
 * navigation states what each place actually is rather than only naming it.
 *
 * They are catalog data rather than paths in a component for the same reason
 * every other frame on this site is: the kind and crop declared here are what
 * `FillerImage` reads to pick a stand-in, and they are what a real photograph
 * replaces without touching a line of markup. Each destination declares a
 * different kind, so the four frames come from four different pools and the
 * menu does not show the same picture four times.
 */
export const NAV_FRAMES: Record<string, ImageSlotData> = {
  "/shop": {
    code: "NAV-SHOP",
    src: "/photography/nav-shop.jpg",
    alt: "A woman in the Core Tee and Utility Cargo Pant against a plaster wall",
    kind: "campaign",
    ratio: "tall",
    crop: "three-quarter",
  },
  "/drop": {
    code: "NAV-DROP",
    src: "/photography/nav-drop.jpg",
    alt: "A figure in the Arc Hoodie against a concrete wall, hood down",
    kind: "model",
    ratio: "tall",
    crop: "full",
  },
  "/archive": {
    code: "NAV-ARCHIVE",
    src: "/photography/nav-archive.jpg",
    alt: "The ribbed cuff and sleeve seam of a black fleece, close",
    kind: "detail",
    ratio: "portrait",
  },
  "/about": {
    code: "NAV-ABOUT",
    src: "/photography/nav-about.jpg",
    alt: "A figure walking away down an empty street under an overcast sky",
    kind: "lifestyle",
    ratio: "tall",
  },
};

/**
 * THE PAGE FRAMES — the photography that belongs to a route rather than to a
 * garment, a drop or a campaign.
 *
 * Three slots were declared as object literals inside JSX, which made them the
 * only images on the site the catalog layer could not see: nothing could count
 * them, nothing could tell whether they were photographed or standing in, and
 * a change of crop meant editing a page component. They are declared here for
 * the same reason `NAV_FRAMES` is — the `kind` and `crop` are what picks a
 * stand-in and what a real photograph replaces without touching markup.
 *
 * Keyed by asset code, because that is what the pending frame prints and what
 * the photography brief is written against.
 */
export const PAGE_FRAMES: Record<string, ImageSlotData> = {
  "ABT-01": {
    code: "ABT-01",
    src: "/photography/abt-01.jpg",
    alt: "Pattern paper, cut black cloth and a tape measure on a work table",
    kind: "detail",
    ratio: "wide",
  },
  "ABT-02": {
    code: "ABT-02",
    src: "/photography/abt-02.jpg",
    alt: "Two figures in Drop 001 outside an industrial door on a quiet street",
    kind: "campaign",
    ratio: "campaign",
  },
  "PRC-01": {
    code: "PRC-01",
    src: "/photography/prc-01.jpg",
    alt: "Pattern pieces weighted flat beside a part-sewn sample on a work table",
    kind: "detail",
    ratio: "wide",
  },
};
