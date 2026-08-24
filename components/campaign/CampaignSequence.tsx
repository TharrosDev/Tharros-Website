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
 * to be a photograph rather than a composition — so it is also the one that
 * gets held.
 *
 * ONE PIN, ON THE FULL FRAME ONLY. A pinned frame is a scroll the visitor has
 * to spend before the page moves again; three of them in a row is a corridor
 * with no way out, and this sequence can be any length the campaign data says.
 * So the pin is spent on the first full-bleed frame and every other frame
 * scrolls past normally, with its picture and its caption drifting against
 * each other. That contrast is the point: the held frame reads as held because
 * the ones either side of it do not stop.
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

  // The first full-bleed frame, and only that one, is the held shot.
  const pinnedIndex = campaign.sequence.findIndex(
    (_, i) => ALIGNMENTS[i % ALIGNMENTS.length] === "full",
  );

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading index={index} label={label} title={title} action={action} />
      </div>

      {/* Frames are separated by more than sections are: each one is a picture
          to stop at, and at gap-20 the sequence scrolled as a strip.

          A BLOCK COLUMN WITH MARGINS, NOT A FLEX ONE WITH A GAP. This held
          `flex flex-col gap-28`, and ScrollTrigger silently drops `pinSpacing`
          when the element it pins sits in a flex parent — it cannot reserve the
          held distance by padding a flex item. The spacer for the held shot
          therefore measured `padding-bottom: 0` against `end="+=90%"`, so the
          frame was fixed for 900px of scrolling that the document never
          reserved and every frame after it rode up over the top of it, caption
          and all. The statement's pin, whose parent is `<main>`, reserved its
          800px correctly the whole time — which is what made this look like a
          campaign bug rather than a layout one.

          Nothing else here wanted flex: no ordering, no alignment, one axis.
          `space-y` spaces the pin-spacer exactly as it spaced the frame. */}
      <div className="section-lead space-y-28 md:space-y-40">
        {campaign.sequence.map((frame, i) => {
          const align = ALIGNMENTS[i % ALIGNMENTS.length];

          if (i === pinnedIndex) {
            return (
              // THE SHOT THAT SETTLES. The picture comes out of an over-scale
              // as the frame crosses the viewport — a camera coming to rest
              // rather than a zoom.
              //
              // It used to be pinned, holding the page for 90% of its own
              // height while the scale played out. The pin is gone at the
              // owner's direction: nothing on this site stops or slows the
              // scroll. The move itself is unchanged, and it is the same
              // unpinned branch `Scene` already built for narrow screens.
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
                   not contain it.
                   Clipping here crops the frame to its own bounds, which is
                   what an over-scaled photograph in a frame is supposed to do
                   anyway — the camera moves inside the shot, not outside it. */
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

                    `scene-oversize` is still the resting state the scrub
                    settles out of, and still lives in CSS behind [data-js]
                    rather than in a step's `from`: GSAP arrives a frame or two
                    after paint, so a `from` would show the picture at rest and
                    then jump it — and with scripting off nothing would ever
                    bring an inline over-scale back down. */}
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
              <CampaignFrame frame={frame} align={align} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
