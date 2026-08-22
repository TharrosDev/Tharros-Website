import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import type { ImageSlotData } from "@/lib/catalog/types";

/**
 * THE CINEMATIC FRAME — a picture given a whole screen.
 *
 * The site's other image primitive is `ImageSlot`, which draws an
 * aspect-ratio box: the frame's height follows its width. That is right for a
 * picture sitting in a column, and it breaks the moment a picture goes
 * full-bleed. The photography is 2:3, so a full-width 2:3 frame on a 1600px
 * screen is 2400px tall — one and a half viewports of a single image, which is
 * not cinematic, it is a wall.
 *
 * So this frame is bounded by the viewport instead. It sets its own height in
 * `svh` and lets the image cover it, which is how the shape of a screen rather
 * than the shape of a file decides what you see. A tall photograph in a
 * viewport-height band shows the figure; the same photograph in a 21:9 box
 * shows a horizontal slice of their chest.
 *
 * `svh` rather than `vh`: on a phone `vh` is the tallest the viewport ever gets,
 * so a `100vh` band is partly behind the browser chrome until you scroll.
 *
 * The caption sits under the frame on the page grid, not over the picture.
 * Type over an image needs a scrim, a scrim dims the image, and the whole
 * argument for going full-bleed was to stop dimming the photography.
 */
export default function CinematicFrame({
  image,
  height = "full",
  eyebrow,
  caption,
  aside,
  priority = false,
  className = "",
}: {
  image: ImageSlotData;
  /** `full` is a held beat; `half` is a picture you pass through. */
  height?: "full" | "half";
  eyebrow?: string;
  caption?: string;
  /** The right-hand end of the caption rule — a figure, a count, a date. */
  aside?: React.ReactNode;
  priority?: boolean;
  className?: string;
}) {
  const band = height === "full" ? "h-[86svh]" : "h-[58svh]";

  return (
    <figure className={className}>
      {/* Not wrapped in `Reveal` when it is the priority frame: an entrance
          that starts hidden is an entrance that delays the largest paint. */}
      {priority ? (
        <div className={`relative w-full overflow-hidden ${band}`}>
          <ImageSlot image={image} fill priority sizes="100vw" />
        </div>
      ) : (
        <Reveal className={`reveal-frame relative w-full overflow-hidden ${band}`}>
          <ImageSlot image={image} fill sizes="100vw" />
        </Reveal>
      )}

      {caption || eyebrow || aside ? (
        <figcaption className="page-frame">
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule pt-3">
            <p className="type-meta flex flex-wrap items-baseline gap-x-5 gap-y-1 text-ink-faint">
              {eyebrow ? <span className="num">{eyebrow}</span> : null}
              {caption ? <span>{caption}</span> : null}
            </p>
            {aside ? <div className="type-meta text-ink-faint">{aside}</div> : null}
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}
