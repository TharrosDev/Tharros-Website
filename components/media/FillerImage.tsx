import type { ImageSlotData, Ratio } from "@/lib/catalog/types";
import { garmentOf } from "./filler/garments";
import { familyOf, hash, paletteFor } from "./filler/palettes";
import {
  Campaign,
  Detail,
  FlatLay,
  Portrait,
  Scene,
  Street,
  Worn,
  type SceneProps,
} from "./filler/scenes";

/**
 * TEMPORARY VISUALISATION AID — delete once real photography lands.
 *
 * Photography does not exist yet, so every image slot on the site renders as an
 * empty frame. That is honest but it makes whole pages hard to read: rhythm,
 * contrast and crop all disappear. This draws a deterministic monochrome stand-in
 * instead — a flat-lay, a person in the piece, a street, an environment or a
 * fabric study, chosen from the slot's own `kind`, `crop` and `alt` — so the
 * layout can be judged before the shoot.
 *
 * It is deliberately drawn, not photographic, and every frame keeps its asset
 * code and a FILLER mark so nothing here can be mistaken for a real garment
 * photograph. Turning it off is one flag: `FILLER_IMAGES` below — and the site
 * is designed to still read as *pending* with it off, which is the test that a
 * layout is photography-ready rather than filler-dependent.
 *
 * The compositions themselves live in ./filler — this file is the dispatcher.
 */

/** Set to false (or `NEXT_PUBLIC_FILLER_IMAGES=off`) to get the empty frames back. */
export const FILLER_IMAGES = process.env.NEXT_PUBLIC_FILLER_IMAGES !== "off";

const VIEWBOX: Record<Ratio, { w: number; h: number }> = {
  portrait: { w: 300, h: 400 },
  editorial: { w: 320, h: 400 },
  campaign: { w: 640, h: 360 },
  wide: { w: 630, h: 270 },
  square: { w: 400, h: 400 },
};

const SCENES = {
  flat: FlatLay,
  worn: Worn,
  scene: Scene,
  street: Street,
  campaign: Campaign,
  portrait: Portrait,
  detail: Detail,
};

/**
 * Kind first, then crop, then ratio.
 *
 * Kind says what the slot is for; crop says how it is framed, and a crop can
 * override the default composition for its kind — a `model` slot cropped close
 * is a portrait, not a fitting. Ratio is the last resort: a wide frame with no
 * other signal is a campaign frame, because nothing else is drawn that shape.
 */
function sceneFor(image: ImageSlotData): keyof typeof SCENES {
  if (image.kind === "detail") return "detail";
  if (image.crop === "close") return "portrait";
  if (image.crop === "walking") return "street";
  if (image.kind === "campaign") return "campaign";
  if (image.kind === "lifestyle") return "scene";
  if (image.kind === "model") return "worn";
  if (image.ratio === "campaign" || image.ratio === "wide") return "campaign";
  return "flat";
}

type Props = { image: ImageSlotData; ratio?: Ratio; className?: string };

export default function FillerImage({ image, ratio, className = "" }: Props) {
  const { w, h } = VIEWBOX[ratio ?? image.ratio];
  // Tone follows the family so one piece looks shot in one session; the frame's
  // own code varies the composition so sibling shots are not the same picture.
  const seed = hash(image.code);
  const family = familyOf(image.code);
  const palette = paletteFor(image.code);
  const Composition = SCENES[sceneFor(image)];
  const label = Math.max(9, Math.round(Math.min(w, h) * 0.038));

  const props: SceneProps = {
    w,
    h,
    palette,
    garment: garmentOf(image),
    seed,
    kind: image.kind,
    crop: image.crop,
    family,
  };

  // `zoom-target` so a filler frame answers `.hover-zoom` the way a photograph
  // will, and the hover behaviour can be judged now rather than after the shoot.
  return (
    <svg
      role="img"
      aria-label={`${image.alt} — placeholder illustration, photography pending`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={`zoom-target h-full w-full ${className}`}
    >
      <Composition {...props} />
      {/* Kept legible at every size: this is a drawing, not a photograph. */}
      <text
        x={label * 1.4}
        y={h - label * 1.2}
        fill={palette.label}
        fontFamily="ui-monospace, monospace"
        fontSize={label}
        letterSpacing={label * 0.08}
      >
        {image.code}
      </text>
      <text
        x={w - label * 1.4}
        y={h - label * 1.2}
        fill={palette.label}
        fontFamily="ui-monospace, monospace"
        fontSize={label}
        letterSpacing={label * 0.08}
        textAnchor="end"
      >
        FILLER
      </text>
    </svg>
  );
}
