import ImageSlot from "@/components/media/ImageSlot";
import Parallax from "@/components/motion/Parallax";
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
  held = false,
  lead,
}: {
  frame: Frame;
  align?: "left" | "right" | "full";
  ratio?: Ratio;
  ratioSm?: Ratio;
  priority?: boolean;
  onDark?: boolean;
  /**
   * This frame is the sequence's held shot: its PICTURE carries the scene's
   * over-scale and answers to the `shot` layer.
   *
   * A boolean rather than a class and a layer name plumbed in from the caller,
   * because which box in here is the picture is this component's business. The
   * caller only knows that one frame in the sequence is the one being held.
   */
  held?: boolean;
  /**
   * A block that opens the caption column — in practice a section's own
   * heading, set beside the picture rather than above it.
   *
   * It exists because of the arithmetic of a side-aligned frame. A standing
   * figure cannot run the full measure on a desktop without being cropped to a
   * horizontal slice of itself, so it takes a column and something has to sit
   * in the one beside it. A caption and two links is ~110px of content against
   * a ~700px picture, and no alignment rescues that: hung at the foot it leaves
   * the hole at the top, hung at the head it leaves it at the bottom, spread it
   * leaves it in the middle. Given the heading, the column is a column.
   *
   * Only the side alignments take it. A full-bleed frame's caption is already a
   * row under the picture and has no column to fill.
   */
  lead?: React.ReactNode;
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
        {/* A full frame is bounded by the viewport, not by its own aspect.
            It used to be forced to a wide ratio here, because a 2:3 picture run
            edge to edge on a desktop is one and a half screens tall and the
            reader loses it scrolling. Forcing the ratio solved the height by
            throwing away the photograph: a standing figure in a 16:9 box is a
            horizontal slice of their chest.

            A height band keeps both — the picture stays the shape it was shot
            at and the screen decides how much of it you see at once. `svh` so a
            phone measures the viewport it actually has rather than the tallest
            one it could have. */}
        <div
          className="relative h-[86svh] w-full overflow-hidden"
        >
          {/* THE OVER-SCALE BELONGS TO THE PICTURE, NOT TO THE FIGURE.
              It used to sit on a wrapper around the whole of this component,
              which meant the scene was scaling the caption, the numeral and the
              worn list along with the photograph — type enlarged by a transform
              rather than set at a size, so it rendered soft and off its own
              ladder, and the caption's page-frame gutter was pushed past the
              edge of the screen (9px at 1440, 26px at 390) and clipped.
              The comment in CampaignSequence already said the camera moves
              inside the shot rather than outside it. This is where that is
              actually true: the scaled box is inside the `overflow-hidden`
              above it, so the picture zooms within its frame and nothing else
              in the composition moves at all. */}
          <div
            data-layer={held ? "shot" : undefined}
            className={`absolute inset-0 ${held ? "scene-oversize" : ""}`}
          >
            <ImageSlot image={frame.image} fill sizes="100vw" priority={priority} />
          </div>
          {markers}
        </div>
        <figcaption className="page-frame mt-6">
          <div className="max-w-3xl">{meta}</div>
        </figcaption>
      </figure>
    );
  }

  const imageFirst = align === "left";

  // A `lead` puts a section heading in the side column, so the column has to be
  // a column rather than a margin note: five tracks against the picture's
  // seven. Without one it stays the narrow record it has always been.
  const pictureSpan = lead
    ? imageFirst
      ? "md:col-span-7 md:col-start-1"
      : "md:col-span-7 md:col-start-6"
    : imageFirst
      ? "md:col-span-8 md:col-start-1"
      : "md:col-span-8 md:col-start-5";
  const sideSpan = lead
    ? imageFirst
      ? "md:col-span-5 md:col-start-8"
      : "md:col-span-5 md:col-start-1"
    : imageFirst
      ? "md:col-span-4 md:col-start-9"
      : "md:col-span-4 md:col-start-1";

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
    //
    // TWO ROWS FROM `md`, AND THAT IS WHAT LETS `lead` EXIST. The lead, the
    // picture and the record are three siblings in source order, so a phone
    // reads heading, picture, caption — the order the section is written in.
    // From `md` the lead takes the first row of the side column, the picture
    // spans both rows, and the record sits at the foot of the second: the
    // heading's baseline starts level with the top of the frame and the worn
    // list's rule lands on its lower edge, with the air collecting between two
    // blocks that are each attached to an edge. Hung at one end instead, the
    // column left 500px of empty page at 1440x900 — at the foot if it was
    // top-aligned, at the head if it was bottom-aligned.
    <figure
      className={`grid grid-cols-1 items-start gap-y-8 md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-8 ${mobileInset}`}
    >
      {lead ? (
        <div className={`min-w-0 ${sideSpan} md:row-start-1`}>{lead}</div>
      ) : null}

      <div
        className={`min-w-0 ${pictureSpan} md:row-start-1 ${lead ? "md:row-span-2" : ""}`}
      >
        {/* Capped for the same reason the full frame is. At 66% of a 1440px
            frame a native 2:3 picture is ~1200px tall, so the record beside it
            lands a screen and a half below its own heading. The cap crops from
            a shape the photograph already has rather than imposing a different
            one.

            The picture drifts against the type set beside it. `subject` rather
            than a deeper rung: this frame shares a row with words, and a
            picture that travels further than they do stops reading as the same
            object. */}
        <Parallax
          depth="subject"
          className="relative max-h-[78svh] overflow-hidden"
        >
          <ImageSlot
            image={frame.image}
            ratio={ratio}
            ratioSm={ratioSm}
            sizes="(min-width: 768px) min(66vw, 920px), 100vw"
            priority={priority}
          />
          {markers}
        </Parallax>
      </div>

      <figcaption
        className={`min-w-0 ${sideSpan} md:self-end ${lead ? "md:row-start-2" : "md:row-start-1 md:row-span-2"}`}
      >
        {meta}
      </figcaption>
    </figure>
  );
}
