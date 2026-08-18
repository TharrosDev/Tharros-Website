import Image from "next/image";
import type { ImageSlotData, Ratio } from "@/lib/catalog/types";

/**
 * TEMPORARY VISUALISATION AID — delete once real photography lands.
 *
 * Photography does not exist yet, so every image slot on the site renders as an
 * empty frame. That is honest but it makes whole pages hard to read: rhythm,
 * contrast and crop all disappear. This puts a stand-in photograph in the slot
 * instead — picked from `public/filler` by the slot's own `kind` and `crop`, and
 * held steady by the slot's `code` so a piece keeps the same frames across
 * renders — so the layout can be judged before the shoot.
 *
 * The stand-ins are free-licence stock (Openverse, CC0 and public domain),
 * fetched by `scripts/fetch-filler.mjs` and credited in
 * `scripts/filler-credits.json`. They are in colour and ungraded: an earlier
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

type Scene =
  | "flat"
  | "worn"
  | "scene"
  | "street"
  | "campaign"
  | "portrait"
  | "detail";

/**
 * Kind first, then crop, then ratio.
 *
 * Kind says what the slot is for; crop says how it is framed, and a crop can
 * override the default composition for its kind — a `model` slot cropped close
 * is a portrait, not a fitting. Ratio is the last resort: a wide frame with no
 * other signal is a campaign frame, because nothing else is shot that shape.
 */
function sceneFor(image: ImageSlotData): Scene {
  if (image.kind === "detail") return "detail";
  if (image.crop === "close") return "portrait";
  if (image.crop === "walking") return "street";
  if (image.kind === "campaign") return "campaign";
  if (image.kind === "lifestyle") return "scene";
  if (image.kind === "model") return "worn";
  if (image.ratio === "campaign" || image.ratio === "wide") return "campaign";
  return "flat";
}

function hash(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0;
  return h;
}

/** `ratio` is the slot's, kept for call-site parity — the frame is cropped by CSS. */
type Props = { image: ImageSlotData; ratio?: Ratio; sizes?: string; className?: string };

export default function FillerImage({ image, sizes = "100vw", className = "" }: Props) {
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
      alt={`${image.alt} — stand-in photograph, THARROS photography pending`}
      fill
      sizes={sizes}
      className={`zoom-target object-cover ${className}`}
    />
  );
}
