import Image from "next/image";
import type { ImageSlotData, Ratio } from "@/lib/catalog/types";

/**
 * TEMPORARY VISUALISATION AID — delete once real photography lands.
 *
 * No garment has been photographed, so every product slot on the site renders
 * as an empty frame. That is honest but it makes whole pages hard to read:
 * rhythm, contrast and crop all disappear. This puts a stand-in photograph in
 * the slot instead — picked from `public/filler` by the slot's own `kind` and
 * `crop`, and held steady by the slot's `code` so a piece keeps the same frames
 * across renders — so the layout can be judged before the shoot.
 *
 * It only ever fires for a slot with no `src`. A stand-in is never declared as
 * one: `lib/catalog/photography.test.ts` fails if a `src` points in here.
 *
 * The stand-ins are free-licence stock (Openverse, CC0 and public domain),
 * fetched by `scripts/fetch-filler.mjs` and credited in
 * `scripts/filler-credits.json`.
 *
 * THAT CREDITS FILE IS NOW EMPTY, AND IT IS NOT A CLEAN BILL. It only ever
 * held three entries, all in the `campaign` pool, and that pool has been
 * deleted — so the twenty frames still in `public/filler` have no recorded
 * source. They did not come from a run of the fetch script that wrote credits.
 * Nothing here ships as THARROS work and nothing here should reach production,
 * but if any of it ever needed attributing, the provenance would have to be
 * re-established by refetching rather than looked up. Refetching is one
 * command and it writes the credits as it goes. They are in colour and ungraded: an earlier
 * set was desaturated to a monochrome palette, which read as an art direction
 * the label had chosen rather than as scaffolding, and could not be undone —
 * a greyscale JPEG has no hue left to restore. They are not THARROS product
 * and nothing here should ship.
 *
 * Turning it off is one flag: `FILLER_IMAGES` below — and the site is designed
 * to still read as *pending* with it off, which is the test that a layout is
 * photography-ready rather than filler-dependent.
 */

/** Set to false (or `NEXT_PUBLIC_FILLER_IMAGES=off`) to get the empty frames back. */
export const FILLER_IMAGES = process.env.NEXT_PUBLIC_FILLER_IMAGES !== "off";

/** Four frames per scene, in `public/filler`. */
const POOL_SIZE = 4;

type Scene = "flat" | "worn" | "street" | "portrait" | "detail";

/**
 * Kind first, then crop, then ratio.
 *
 * Kind says what the slot is for; crop says how it is framed, and a crop can
 * override the default composition for its kind — a `model` slot cropped close
 * is a portrait, not a fitting. Ratio is the last resort.
 *
 * THREE POOLS WERE REMOVED, AND THE BRANCHES THAT REACHED THEM WITH THEM.
 * `campaign`, `hero` and `scene` held twelve frames — 760 kB deployed out of
 * `public/` — and by the time the campaign frames, both drop covers and the
 * four navigation frames were photographed, no slot on the site could route to
 * any of them. They were scaffolding for holes that no longer exist.
 *
 * The cases still resolve, because a pool nothing reaches today is not the same
 * as a case that cannot happen tomorrow: a Drop 003 cover declared before its
 * shoot is a `campaign` slot with no `src`. Those now fall to the nearest
 * surviving pool by shape — a tall campaign frame to `portrait`, a wide one to
 * the square `flat` pool, which centre-crops to the middle band. That is a
 * worse-shaped stand-in, not a missing one, and a stand-in is scaffolding. If
 * the wide holes ever come back in number, `scripts/fetch-filler.mjs` refetches
 * a pool in one line.
 */
function sceneFor(image: ImageSlotData): Scene {
  if (image.kind === "detail") return "detail";
  if (image.crop === "close") return "portrait";
  if (image.crop === "walking") return "street";
  if (image.kind === "campaign") {
    return image.ratio === "tall" || image.ratio === "portrait" || image.ratio === "editorial"
      ? "portrait"
      : "flat";
  }
  if (image.kind === "lifestyle") return "worn";
  if (image.kind === "model") return "worn";
  if (image.ratio === "campaign" || image.ratio === "wide") return "flat";
  return "flat";
}

function hash(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  return h;
}

/** `ratio` is the slot's, kept for call-site parity — the frame is cropped by CSS. */
type Props = {
  image: ImageSlotData;
  ratio?: Ratio;
  sizes?: string;
  /**
   * Forwarded from the slot. It was not, and while stand-ins are what the site
   * renders that meant `priority` did nothing anywhere: every LCP image on
   * every route — the home hero, the product gallery, the archive record's
   * lead frame — was declared eager by its call site and served `loading=lazy`.
   * A prop silently dropped one layer down is invisible until you read the HTML.
   */
  priority?: boolean;
  className?: string;
};

export default function FillerImage({ image, sizes = "100vw", priority = false, className = "" }: Props) {
  const scene = sceneFor(image);
  // The code picks the frame, so sibling shots of one piece differ but neither
  // moves between renders.
  const n = (hash(image.code) % POOL_SIZE) + 1;

  // `zoom-target` so a filler frame answers `.hover-zoom` the way a photograph
  // will, and the hover behaviour can be judged now rather than after the shoot.
  //
  // `sizes` comes from the slot rather than being pinned at 100vw here. It was
  // pinned, which meant every stand-in downloaded at full viewport width no
  // matter how small its frame — a 56px archive thumbnail was fetching a
  // 1400px picture, nine times per band. The real-`src` branch of `ImageSlot`
  // always honoured the slot's value; only the stand-in ignored it, so the
  // defect was invisible until a page used small frames.
  return (
    <Image
      src={`/filler/${scene}-${n}.jpg`}
      // THE ALT TEXT DESCRIBES THE PICTURE, AND NOTHING ELSE.
      // It used to append "— stand-in photograph, THARROS photography
      // pending", which put a note about this repository's build state into
      // the accessible name of every frame on the site: read aloud by a screen
      // reader, indexed by a search engine, and quoted in a share card. Which
      // slots are photographed is a fact the repository keeps — in this file,
      // in `docs/PHOTOGRAPHY_PROMPT.md` and in `photography.test.ts`, all of
      // which are read by people working on the site rather than by customers.
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`zoom-target object-cover ${className}`}
    />
  );
}
