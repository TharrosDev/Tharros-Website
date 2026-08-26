import CampaignFrame from "./CampaignFrame";
import Reveal from "@/components/ui/Reveal";
import Scene from "@/components/motion/Scene";
import { campaignFor } from "@/lib/catalog/campaign";

/**
 * THE PEOPLE — the campaign as a spread. Two frames to a row at their own
 * shapes, each with its record on one line underneath, and a trailing odd frame
 * running full width.
 *
 * The pair keeps each picture's own ratio rather than forcing a common one:
 * forcing a shared shape crops a photograph to level a row. The row is levelled
 * at the foot instead — see the comment on the row itself.
 *
 * `/drop` ONLY. The home page shows one frame and links here
 * (`components/home/HomeCampaign.tsx`) — a trailer is one shot, not a shorter
 * film. Returns null when the drop has no campaign.
 */
export default function CampaignSequence({
  dropId,
  index,
  label = "The people",
}: {
  dropId: string;
  index: string;
  label?: string;
}) {
  const campaign = campaignFor(dropId);
  if (!campaign || campaign.sequence.length === 0) return null;

  const frames = campaign.sequence;

  // Two to a row, and whatever is left over at the end takes the page.
  const rows: (typeof frames)[] = [];
  for (let i = 0; i < frames.length; i += 2) rows.push(frames.slice(i, i + 2));

  return (
    // `rhythm-tight`: this sits between a grid of the same pieces and a band
    // about the next drop, neither of which needs a held breath to be told
    // apart from a photograph.
    <section className="rhythm-tight">
      {/* ONE MONO LINE, NO DISPLAY HEADING. The rule and the index place the
          section in the sequence, which is all an opener owes a set of
          pictures — a display heading announces them from further away than
          they are tall. */}
      <div className="page-frame">
        <Reveal className="rule-draw pt-4">
          <p className="eyebrow">
            <span className="num">{index}</span>
            <span>{label}</span>
          </p>
        </Reveal>
      </div>

      <div className="section-lead space-y-16 md:space-y-24">
        {rows.map((row, rowIndex) => {
          // The last row, when it holds one frame, is the held shot: the
          // picture comes out of an over-scale as it crosses the viewport, a
          // camera coming to rest rather than a zoom. It used to be pinned; the
          // pin is gone at the owner's direction and the move is unchanged.
          const alone = row.length === 1;
          const first = row[0];
          if (!first) return null;

          if (alone) {
            return (
              <Scene
                key={first.id}
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
                {/* No SceneLayer. `held` puts `data-layer="shot"` and
                    `scene-oversize` on the PICTURE inside CampaignFrame, which
                    is the only part of the frame the camera is supposed to
                    move. `Scene` finds the layer by its attribute wherever it
                    lives, and the pre-state is CSS behind [data-js] rather than
                    a step's `from`: GSAP arrives a frame or two after paint, so
                    a `from` would show the picture at rest and then jump it. */}
                <CampaignFrame frame={first} align="full" held />
              </Scene>
            );
          }

          return (
            // `items-end`, not `items-start` or `stretch`.
            //
            // The pair keeps each picture's own shape, so at equal width a 2:3
            // frame is 102px taller than a 3:4 one and something has to be
            // ragged. Aligned at the top it is the captions, which puts two
            // identical blocks of type on two different lines a hundred pixels
            // apart and reads as a mistake. Stretched to a common height it is
            // a hole under the shorter picture, which is the fault this whole
            // section was rebuilt to remove.
            //
            // Aligned at the foot it is the tops that are ragged, and that is
            // the one of the three that is not a defect: both photographs are
            // figures on a floor, so a shared bottom edge stands them on the
            // same ground line and lands their captions on one baseline. The
            // ragged edge ends up at the top, where there is nothing to line up
            // against anyway.
            <div
              key={`row-${rowIndex}`}
              className="page-frame grid grid-cols-1 items-end gap-x-6 gap-y-14 md:grid-cols-2 md:gap-x-10"
            >
              {row.map((frame) => (
                <Reveal key={frame.id} mode="frame">
                  {/* A PHONE RATIO FOR EVERY PAIRED FRAME. A frame declaring
                      `campaign` (16:9) rendered 16:9 at every width — 295 x
                      166px at 390 — which is the band `ratioSm` exists to
                      prevent. 4:5 below `md` gives a figure room to be a
                      figure; from `md` the frame is whatever shape the data
                      says it was shot at. */}
                  <CampaignFrame frame={frame} align="stacked" ratioSm="editorial" />
                </Reveal>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
