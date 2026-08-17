import ImageSlot from "@/components/media/ImageSlot";
import type { ImageSlotData } from "@/lib/catalog/types";

/**
 * THE SPECIMEN CROP — one of the site's signatures.
 *
 * Two frames of one thing: the whole silhouette, and a hard crop of the cloth,
 * side by side on a shared baseline rule with the asset code set in the gutter
 * between them.
 *
 * It is the idea the drop record already runs on — state a thing, then state
 * its figures — applied to imagery instead of numbers. Two views indexed
 * together read as evidence about a garment; the same two frames stacked in a
 * gallery read as a slideshow. The offset is what makes it a composition
 * rather than a pair, so the crop hangs below the full frame's baseline and the
 * rule runs under both.
 */
export default function EditorialPair({
  wide,
  crop,
  caption,
  priority = false,
  onDark = false,
}: {
  /** The full frame — the silhouette. */
  wide: ImageSlotData;
  /** The close frame — the cloth. */
  crop: ImageSlotData;
  caption?: string;
  priority?: boolean;
  onDark?: boolean;
}) {
  const rule = onDark ? "border-rule-on-dark" : "border-rule";
  const muted = onDark ? "text-ink-on-dark-faint" : "text-ink-faint";

  return (
    // Same reasoning as CampaignFrame: twelve columns and their gaps do not fit
    // a phone, and the two frames stack there regardless.
    <figure className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
      <div className="min-w-0 md:col-span-7">
        <ImageSlot
          image={wide}
          sizes="(min-width: 768px) 58vw, 100vw"
          priority={priority}
        />
      </div>

      {/* The crop drops below the full frame's baseline — the offset is the
          composition. On a phone the two simply stack, because a 40%-width
          crop beside a 58%-width frame is two thumbnails. */}
      <div className="min-w-0 md:col-span-4 md:col-start-9 md:pt-20">
        <ImageSlot
          image={crop}
          ratio="square"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>

      <figcaption
        className={`flex flex-wrap md:col-span-12 items-baseline justify-between gap-x-8 gap-y-2 border-t ${rule} pt-3`}
      >
        {caption ? (
          <span
            className={`type-body-sm ${onDark ? "text-ink-on-dark" : "text-ink"}`}
          >
            {caption}
          </span>
        ) : (
          <span />
        )}
        <span className={`type-meta ${muted}`}>
          <span className="num">{wide.code}</span>
          <span aria-hidden="true"> / </span>
          <span className="num">{crop.code}</span>
        </span>
      </figcaption>
    </figure>
  );
}
