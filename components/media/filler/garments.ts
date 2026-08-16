import type { ImageSlotData } from "@/lib/catalog/types";

/**
 * The garments, drawn once. Every scene places this same 200 × 240 box, so a
 * piece is recognisably itself whether it is laid flat, worn, or seen from
 * across a street.
 */

export type Garment = "tee" | "hoodie" | "crew" | "pants" | "jacket" | "cap" | "beanie";

/**
 * The slot already says what it holds, in its code and its alt text. Read it
 * rather than adding a filler-only field to the catalog types.
 */
export function garmentOf(image: ImageSlotData): Garment {
  const text = `${image.code} ${image.alt}`.toLowerCase();
  if (/hood/.test(text)) return "hoodie";
  if (/crew|sweatshirt/.test(text)) return "crew";
  if (/cargo|pant|trouser/.test(text)) return "pants";
  if (/jacket|jkt|shell|shl/.test(text)) return "jacket";
  if (/beanie|bean/.test(text)) return "beanie";
  if (/cap\b/.test(text)) return "cap";
  return "tee";
}

export const GARMENT_PATHS: Record<Garment, string[]> = {
  tee: [
    "M80,44 L62,46 L40,54 L26,100 L54,112 L60,90 L60,228 L140,228 L140,90 L146,112 L174,100 L160,54 L138,46 L120,44 C119,62 81,62 80,44 Z",
  ],
  hoodie: [
    "M80,54 L62,56 L36,66 L20,154 L50,166 L58,126 L58,232 L142,232 L142,126 L150,166 L180,154 L164,66 L138,56 L120,54 C119,76 81,76 80,54 Z",
    "M66,56 C72,20 128,20 134,56 C120,74 80,74 66,56 Z",
    "M72,158 L128,158 L132,190 L68,190 Z",
  ],
  crew: [
    "M80,50 L62,52 L36,62 L20,150 L50,162 L58,122 L58,228 L142,228 L142,122 L150,162 L180,150 L164,62 L138,52 L120,50 C119,70 81,70 80,50 Z",
    "M58,212 L142,212 L142,228 L58,228 Z",
  ],
  pants: [
    "M60,40 L140,40 L148,236 L112,236 L100,124 L88,236 L52,236 Z",
    "M60,40 L140,40 L142,60 L58,60 Z",
  ],
  jacket: [
    "M80,48 L62,50 L34,62 L20,152 L50,164 L58,124 L58,230 L142,230 L142,124 L150,164 L180,152 L166,62 L138,50 L120,48 L100,74 Z",
    "M80,48 L100,74 L120,48 L110,42 L100,60 L90,42 Z",
    "M96,74 L104,74 L104,230 L96,230 Z",
  ],
  cap: ["M42,146 C42,88 158,88 158,146 Z", "M40,146 C40,160 120,176 182,158 L180,144 Z"],
  beanie: ["M54,152 C54,82 146,82 146,152 Z", "M50,152 L150,152 L150,188 L50,188 Z"],
};

/**
 * A garment worn on a body is not the same shape as one laid flat: it hangs
 * from the shoulder rather than lying open. `lift` narrows the hem slightly so
 * a worn piece reads as draped rather than pinned to the figure.
 */
export const HEM_LIFT: Record<Garment, number> = {
  tee: 0.98,
  hoodie: 0.99,
  crew: 0.99,
  pants: 1,
  jacket: 0.985,
  cap: 1,
  beanie: 1,
};
