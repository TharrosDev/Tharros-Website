import CampaignFrame from "@/components/campaign/CampaignFrame";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * THE CLOTHES ON PEOPLE, AT THE SCALE THEY WERE SHOT FOR.
 *
 * The home page used to spend three of its six movements explaining the label
 * — a statement about scale, a band of studio stages, and a ledger of
 * everything ever made — and gave the campaign one frame beside a caption.
 * That is a page about a workshop with some photographs in it. This is the
 * other way round.
 *
 * Two frames, and they are deliberately different objects rather than the same
 * object twice:
 *
 *   a standing figure, held beside a column of type and the pieces she is in
 *   a landscape frame at 86svh with nothing on it but its own caption
 *
 * The second one is the point of the section. Every other picture on this site
 * is captioned, tagged, priced or linked; one of them is allowed to just be a
 * photograph. `CampaignFrame`'s `full` alignment bounds it by the viewport
 * rather than by an aspect ratio, so it is a frame and not a banner.
 *
 * Renders nothing without campaign data, which is what keeps the page whole
 * before a drop has been shot.
 */
export default function HomeCampaign() {
  const campaign = campaignFor(CURRENT_DROP.id);
  if (!campaign) return null;

  const [held, wide] = [campaign.sequence[1], campaign.sequence[2]];
  if (!held) return null;

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="02"
          label={`${CURRENT_DROP.name} campaign`}
          action={{ href: "/drop", label: "The whole campaign" }}
        />
        <Reveal mode="frame" className="section-lead">
          <CampaignFrame
            frame={held}
            align="left"
            /* 4:5 below `md`. A frame declaring `campaign` otherwise renders
               16:9 at every width, which on a phone is a 166px band. */
            ratioSm="editorial"
            /* A rung down until `lg`: between `md` and `lg` the side column is
               five tracks of a 768px frame, and `display-2` broke the line so
               its full stop fell on its own. */
            lead={
              <h2 className="type-display-3 lg:type-display-2">
                Worn in, not styled.
              </h2>
            }
          />
        </Reveal>
      </div>

      {/* Outside the page frame, because this one reaches the edges. The
          interval above it is tight rather than default — the two frames are
          one thought, and a full section break between them would read as two
          campaigns. */}
      {wide ? (
        <Reveal mode="frame" className="mt-[var(--rhythm-tight)]">
          <CampaignFrame frame={wide} align="full" />
        </Reveal>
      ) : null}
    </section>
  );
}
