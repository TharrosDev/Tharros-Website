import Image from "next/image";
import FillerImage, { FILLER_IMAGES } from "@/components/media/FillerImage";
import type { ImageSlotData, Ratio } from "@/lib/catalog/types";

const RATIO_CLASS: Record<Ratio, string> = {
  tall: "ratio-tall",
  portrait: "ratio-portrait",
  editorial: "ratio-editorial",
  campaign: "ratio-campaign",
  wide: "ratio-wide",
  square: "ratio-square",
};

/**
 * The same ratios, applied from `md` up. Paired with `ratioSm` this lets one
 * slot be a tall frame on a phone and a wide one on a desktop — a 21:9 campaign
 * frame is 167px tall on a 390px screen, which is a band, not a photograph.
 *
 * Written as a second lookup rather than a template string because Tailwind
 * only sees class names it can find whole in the source.
 */
const RATIO_CLASS_MD: Record<Ratio, string> = {
  tall: "md:ratio-tall",
  portrait: "md:ratio-portrait",
  editorial: "md:ratio-editorial",
  campaign: "md:ratio-campaign",
  wide: "md:ratio-wide",
  square: "md:ratio-square",
};

/**
 * The same shapes as numbers, for a frame that has to be sized by its HEIGHT.
 *
 * A slot is normally sized by its width and takes its height from the ratio,
 * which is right everywhere the picture is one column of a layout. Where the
 * *height* is what is bounded — a campaign frame held to a fraction of the
 * viewport — the arithmetic runs the other way: cap the width at
 * `height x ratio` and the height can never exceed the bound, so nothing has to
 * be clipped off the bottom of a photograph to make it fit.
 */
export const RATIO_VALUE: Record<Ratio, number> = {
  tall: 2 / 3,
  portrait: 3 / 4,
  editorial: 4 / 5,
  campaign: 16 / 9,
  wide: 21 / 9,
  square: 1,
};

type Props = {
  image: ImageSlotData;
  /** Override the ratio the data declares — e.g. a portrait shot run wide. */
  ratio?: Ratio;
  /**
   * Ratio below the `md` breakpoint. The slot still renders one element and
   * downloads one file — unlike a hidden/visible pair of slots, which would
   * fetch both once there is real photography.
   */
  ratioSm?: Ratio;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /**
   * Classes for the PICTURE rather than for the frame around it — in practice
   * `object-position`, which is the one piece of art direction a single file
   * still needs.
   *
   * `object-cover` crops to the centre, and the centre of a 16:9 photograph is
   * nowhere near the centre of the 0.5-aspect box a phone gives it. The home
   * hero's subject sits at 62% across; centred, a phone showed the 28% of the
   * frame either side of the middle and cut her out of her own picture.
   *
   * A class rather than a style prop, because the value is per-breakpoint and
   * an inline style cannot carry a media query. Written literally at the call
   * site so Tailwind can see both halves of `object-[62%_center] lg:object-center`.
   */
  imageClassName?: string;
  /** Fill the parent instead of holding its own aspect ratio. */
  fill?: boolean;
};

/**
 * Every image on the site goes through here.
 *
 * With a `src` it is a `next/image` at the slot's declared ratio. Without one —
 * which is still every product slot on the site — it renders as a ratio-correct
 * frame carrying its asset code and an accessible label, or as a stand-in if
 * filler is on. Adding the photograph is a one-line data change and moves no
 * layout.
 */
export default function ImageSlot({
  image,
  ratio,
  ratioSm,
  sizes = "100vw",
  priority = false,
  className = "",
  imageClassName = "",
  fill = false,
}: Props) {
  const wide = ratio ?? image.ratio;
  // With `ratioSm` the small ratio is the base and the declared one takes over
  // at `md`; without it, one ratio holds at every width.
  const ratioClass = ratioSm
    ? `${RATIO_CLASS[ratioSm]} ${RATIO_CLASS_MD[wide]}`
    : RATIO_CLASS[wide];

  // `fill` positions the slot against the nearest positioned ancestor, so it
  // must not also be `relative` — that would collapse it to zero height.
  const shape = fill
    ? "absolute inset-0 h-full w-full"
    : `relative w-full ${ratioClass}`;

  // Stand-in artwork while photography is pending — see FillerImage.
  if (!image.src && FILLER_IMAGES) {
    return (
      <div className={`${shape} overflow-hidden bg-surface-frame ${className}`}>
        <FillerImage
          image={image}
          ratio={ratio}
          sizes={sizes}
          priority={priority}
          className={imageClassName}
        />
      </div>
    );
  }

  if (!image.src) {
    return (
      <div
        role="img"
        aria-label={`${image.alt} — image pending`}
        // `on-light` because the frame carries its own bone surface: inside a
        // dark section the labels sit on the frame, not on the black, so they
        // must not follow the section's inverted ink.
        className={`on-light @container ${shape} overflow-hidden bg-surface-frame ${className}`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-3 border border-dashed border-ash/80"
        />
        {/* Labels only where they fit — thumbnails would just collide. */}
        <span
          aria-hidden="true"
          className="type-meta absolute bottom-4 left-4 hidden text-ink @[16rem]:block"
        >
          {image.code}
        </span>
        <span
          aria-hidden="true"
          className="type-meta absolute right-4 bottom-4 hidden text-ink @[24rem]:block"
        >
          {image.kind}
        </span>
      </div>
    );
  }

  return (
    <div className={`${shape} overflow-hidden bg-surface-frame ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}
