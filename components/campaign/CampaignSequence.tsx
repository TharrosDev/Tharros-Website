import CampaignFrame from "./CampaignFrame";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Scene, { SceneLayer } from "@/components/motion/Scene";
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
          to stop at, and at gap-20 the sequence scrolled as a strip. */}
      <div className="section-lead flex flex-col gap-28 md:gap-40">
        {campaign.sequence.map((frame, i) => {
          const align = ALIGNMENTS[i % ALIGNMENTS.length];

          if (i === pinnedIndex) {
            return (
              // THE HELD SHOT. The frame is pinned for its own height while
              // the picture settles out of an over-scale — a camera coming to
              // rest rather than a zoom.
              <Scene
                key={frame.id}
                pin
                end="+=90%"
                steps={[
                  { at: 0, span: 0.7, layer: "shot", to: { scale: 1, ease: "none" } },
                ]}
              >
                <SceneLayer
                  name="shot"
                  // `scene-oversize` is the resting state the scrub settles
                  // out of, and it lives in CSS behind [data-js] rather than
                  // in a step's `from`: GSAP arrives a frame or two after
                  // paint, so a `from` would show the picture at rest and then
                  // jump it — and with scripting off nothing would ever bring
                  // an inline over-scale back down.
                  className="scene-oversize"
                >
                  <CampaignFrame frame={frame} align={align} />
                </SceneLayer>
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
