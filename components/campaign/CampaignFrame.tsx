import ImageSlot from "@/components/media/ImageSlot";
import ParallaxNumeral from "@/components/motion/ParallaxNumeral";
import FrameHotspots from "./FrameHotspots";
import ModelCredit from "./ModelCredit";
import WornList from "./WornList";
import type { CampaignFrame as Frame, Ratio } from "@/lib/catalog/types";

/**
 * One frame of the campaign, with everything it is allowed to say about itself:
 * its index, its line, who is in it, and what they are wearing.
 *
 * `align` decides whether the picture takes the page or shares it. A sequence
 * that alternates left, right and full is what stops a run of frames reading as
 * a gallery — the brief asks for controlled asymmetry, and this is where it
 * lives.
 *
 * Type is set *beside* the image, never over the garment. The only place type
 * sits on top of a picture is the page opener, which handles its own scrim.
 */
export default function CampaignFrame({
  frame,
  align = "left",
  ratio,
  ratioSm,
  priority = false,
  onDark = false,
}: {
  frame: Frame;
  align?: "left" | "right" | "full";
  ratio?: Ratio;
  ratioSm?: Ratio;
  priority?: boolean;
  onDark?: boolean;
}) {
  const muted = onDark ? "text-ink-on-dark-faint" : "text-ink-faint";
  const rule = onDark ? "border-rule-on-dark" : "border-rule";

  const meta = (
    <div className="flex flex-col gap-6">
      <div className={`flex items-baseline gap-4 border-t ${rule} pt-3`}>
        <ParallaxNumeral className={`type-mono-3 ${muted}`}>
          {frame.index}
        </ParallaxNumeral>
        {frame.caption ? (
          <p
            className={`type-body-sm ${onDark ? "text-ink-on-dark" : "text-ink"}`}
          >
            {frame.caption}
          </p>
        ) : null}
      </div>
      <ModelCredit modelIds={frame.models} onDark={onDark} />
      <WornList
        slugs={frame.wearing}
        frameId={frame.id}
        variant={align === "full" ? "rail" : "stack"}
        onDark={onDark}
      />
    </div>
  );

  // Markers are gated on a real photograph existing. A coordinate pointing at a
  // garment in a drawing that has no garment at that coordinate is a fabricated
  // interaction, so today this is always false and the rail is the whole story.
  const markers =
    frame.hotspots && frame.image.src ? (
      <FrameHotspots hotspots={frame.hotspots} frameId={frame.id} />
    ) : null;

  if (align === "full") {
    return (
      <figure>
        {/* A full-width frame takes a wide ratio whatever the slot declares: a
            portrait run edge to edge on a desktop is nearly two screens tall,
            and the reader loses the picture scrolling through it. On a phone it
            goes back to a tall frame, where full width is only 390px. */}
        <div className="relative">
          <ImageSlot
            image={frame.image}
            ratio={ratio ?? "campaign"}
            ratioSm={ratioSm ?? "editorial"}
            sizes="100vw"
            priority={priority}
          />
          {markers}
        </div>
        <figcaption className="page-frame mt-6">
          <div className="max-w-3xl">{meta}</div>
        </figcaption>
      </figure>
    );
  }

  const imageFirst = align === "left";

  // The alternation has to exist on a phone too. Left, full and right lived
  // entirely in `md:col-start-*` / `md:order-*`, so below `md` all three frames
  // rendered identically — image, then caption — and the sequence became the
  // gallery it says it is not. A right-aligned frame is inset from the leading
  // edge on small screens; a left-aligned one runs the full measure. Same idea,
  // expressed in the one axis a narrow screen still has.
  const mobileInset = imageFirst ? "" : "ms-8 sm:ms-14 md:ms-0";

  return (
    // One column on a phone, twelve from `md`. A 12-column track with a 2rem
    // column gap needs 11 × 32px = 352px for the gaps alone, which is more than
    // the 280px a 320px screen has inside the page frame — so the grid pushed
    // the whole document wider than the viewport before a single child was
    // measured. The children stack anyway at this width; the columns were only
    // ever for the desktop composition.
    <figure
      className={`grid grid-cols-1 items-start gap-y-8 md:grid-cols-12 md:gap-x-8 ${mobileInset}`}
    >
      <div
        className={
          imageFirst
            ? "min-w-0 md:col-span-8"
            : "min-w-0 md:col-span-8 md:col-start-5 md:order-2"
        }
      >
        <div className="relative">
          <ImageSlot
            image={frame.image}
            ratio={ratio}
            ratioSm={ratioSm}
            sizes="(min-width: 768px) 66vw, 100vw"
            priority={priority}
          />
          {markers}
        </div>
      </div>

      <figcaption
        className={
          imageFirst
            ? "min-w-0 md:col-span-3 md:col-start-10 md:pt-10"
            : "min-w-0 md:col-span-3 md:col-start-1 md:row-start-1 md:pt-10"
        }
      >
        {meta}
      </figcaption>
    </figure>
  );
}
