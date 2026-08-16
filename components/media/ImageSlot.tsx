import Image from "next/image";
import type { ImageSlotData, Ratio } from "@/lib/catalog/types";

const RATIO_CLASS: Record<Ratio, string> = {
  portrait: "ratio-portrait",
  editorial: "ratio-editorial",
  campaign: "ratio-campaign",
  wide: "ratio-wide",
  square: "ratio-square",
};

type Props = {
  image: ImageSlotData;
  /** Override the ratio the data declares — e.g. a portrait shot run wide. */
  ratio?: Ratio;
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
  sizes = "100vw",
  priority = false,
  className = "",
  fill = false,
}: Props) {
  // `fill` positions the slot against the nearest positioned ancestor, so it
  // must not also be `relative` — that would collapse it to zero height.
  const shape = fill
    ? "absolute inset-0 h-full w-full"
    : `relative w-full ${RATIO_CLASS[ratio ?? image.ratio]}`;

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
