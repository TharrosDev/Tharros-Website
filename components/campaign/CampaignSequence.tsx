import CampaignFrame from "./CampaignFrame";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Scene from "@/components/motion/Scene";
import { campaignFor } from "@/lib/catalog/campaign";

/**
 * THE PEOPLE — the campaign read as a sequence rather than a gallery.
 *
 * Alignment alternates left, full, right so no two neighbouring frames are
 * built the same way, which is the same rule the home page's surface
 * alternation follows. The full-width frame in the middle is the one that gets
 * to be a photograph rather than a composition.
 *
 * THIS RUNS ON `/drop` ONLY. The home page used to mount it too and ran the
 * whole sequence: 2934px at 1440x900, three and a quarter viewports of the same
 * picture-plus-caption-plus-worn-list furniture, ending in a grid of the pieces
 * `01 The run` had already shown with their prices one screen above. `/` shows
 * one frame and links here — see `components/home/ThePeople.tsx`. A trailer is
 * not a shorter film, it is one shot.
 *
 * Returns null when the drop has no campaign, which keeps every page that
 * mounts it byte-identical to before until the data exists.
 */
const ALIGNMENTS = ["left", "full", "right"] as const;

export default function CampaignSequence({
  dropId,
  index,
  label = "The people",
  title,
  action,
}: {
  dropId: string;
  index: string;
  label?: string;
  title?: string;
  /** Passed straight to the opener's right-hand slot — the way out of the sequence. */
  action?: { href: string; label: string };
}) {
  const campaign = campaignFor(dropId);
  if (!campaign || campaign.sequence.length === 0) return null;

  const frames = campaign.sequence;

  // The first full-bleed frame, and only that one, carries the settling shot.
  const heldIndex = frames.findIndex(
    (_, i) => ALIGNMENTS[i % ALIGNMENTS.length] === "full",
  );

  return (
    // `rhythm-tight`, not `rhythm-default`. The interval either side was 214px
    // of the 2689 this section ran, and it sits between a grid of the same
    // pieces above and a band about the next drop below — neither of which the
    // photographs need a held breath to be told apart from.
    <section className="rhythm-tight">
      <div className="page-frame">
        {/* The step matches `02 The pieces` above it. At `display-2` the opener
            was a 168px block alone on a near-empty screen, announcing the
            photographs from further away than they are tall. */}
        <SectionHeading
          index={index}
          label={label}
          title={title}
          titleClass="type-display-3"
          action={action}
        />
      </div>

      {/* Frames are separated by more than sections are: each one is a picture
          to stop at, and at gap-20 the sequence scrolled as a strip.

          A BLOCK COLUMN WITH MARGINS, NOT A FLEX ONE WITH A GAP. This held
          `flex flex-col gap-28` while the full frame was pinned, and
          ScrollTrigger silently drops `pinSpacing` when the element it pins
          sits in a flex parent — it cannot reserve the held distance by padding
          a flex item. Nothing pins now, but nothing here wants flex either: no
          ordering, no alignment, one axis. */}
      {/* 160px between frames was set when each one was a picture with a hole
          beside it, so the sequence needed the interval to read as separate
          stops. With the columns closed up the frames are their own stops and
          96px is enough of a beat. */}
      <div className="section-lead space-y-16 md:space-y-24">
        {frames.map((frame, i) => {
          const align = ALIGNMENTS[i % ALIGNMENTS.length];

          if (i === heldIndex) {
            return (
              // THE SHOT THAT SETTLES. The picture comes out of an over-scale
              // as the frame crosses the viewport — a camera coming to rest
              // rather than a zoom. It used to be pinned; the pin is gone at
              // the owner's direction and the move is unchanged.
              <Scene
                key={frame.id}
                /* THE OVER-SCALE HAS TO BE CROPPED BY SOMETHING.
                   `scene-oversize` is `scale(1.14)`, and a scaled box expands
                   the scrollable area of the document unless an ancestor clips
                   it — the `overflow-hidden` inside `CampaignFrame` sits on a
                   descendant of the scaled node, so it never applied. The page
                   really did scroll sideways: 89px at 1280 and 26px on a phone,
                   on `/` and on `/drop`, for as long as the scrub had not yet
                   settled the layer back to 1. `body { overflow-x: clip }` did
                   not contain it. */
                className="overflow-clip"
                steps={[
                  { at: 0, span: 0.7, layer: "shot", to: { scale: 1, ease: "none" } },
                ]}
              >
                {/* No SceneLayer here. `held` puts `data-layer="shot"` and
                    `scene-oversize` on the PICTURE inside CampaignFrame, which
                    is the only part of the frame the camera is supposed to
                    move — wrapping the whole component scaled the caption and
                    the worn list with it. `Scene` finds the layer by its
                    attribute wherever it lives, so nothing else changes.

                    `scene-oversize` is the resting state the scrub settles out
                    of, and lives in CSS behind [data-js] rather than in a
                    step's `from`: GSAP arrives a frame or two after paint, so a
                    `from` would show the picture at rest and then jump it — and
                    with scripting off nothing would ever bring an inline
                    over-scale back down. */}
                <CampaignFrame frame={frame} align={align} held />
              </Scene>
            );
          }

          // Full-width frames break the page frame; the others sit inside it.
          return (
            <Reveal
              key={frame.id}
              mode="frame"
              className={align === "full" ? "" : "page-frame"}
            >
              {/* A PHONE RATIO FOR EVERY FRAME THAT SHARES THE PAGE FRAME.
                  `ratioSm` was never passed, so a frame declaring `campaign`
                  (16:9) rendered 16:9 at every width — 295 x 166px at 390 and
                  435 x 245 at 768, which is the band `ratioSm` was added to
                  prevent. 4:5 below `md` gives a figure room to be a figure;
                  from `md` the frame is whatever shape the data says it was
                  shot at. */}
              <CampaignFrame frame={frame} align={align} ratioSm="editorial" />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
