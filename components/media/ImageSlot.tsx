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
  /** Fill the parent instead of holding its own aspect ratio. */
  fill?: boolean;
};

/**
 * Every image on the site goes through here.
 *
 * Photography does not exist yet, so a slot without `src` renders as a
 * ratio-correct frame carrying its asset code and an accessible label. Adding
 * the photograph is a one-line data change and moves no layout.
 */
export default function ImageSlot({
  image,
  ratio,
  ratioSm,
  sizes = "100vw",
  priority = false,
  className = "",
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
        <FillerImage image={image} ratio={ratio} sizes={sizes} />
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
        className="object-cover"
      />
    </div>
  );
}
