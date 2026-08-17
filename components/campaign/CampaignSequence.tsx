import CampaignFrame from "./CampaignFrame";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { campaignFor } from "@/lib/catalog/campaign";

/**
 * THE PEOPLE — the campaign read as a sequence rather than a gallery.
 *
 * Alignment alternates left, full, right so no two neighbouring frames are
 * built the same way, which is the same rule the home page's surface
 * alternation follows. The full-width frame in the middle is the one that gets
 * to be a photograph rather than a composition.
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
}: {
  dropId: string;
  index: string;
  label?: string;
  title?: string;
}) {
  const campaign = campaignFor(dropId);
  if (!campaign || campaign.sequence.length === 0) return null;

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading index={index} label={label} title={title} />
      </div>

      {/* Frames are separated by more than sections are: each one is a picture
          to stop at, and at gap-20 the sequence scrolled as a strip. */}
      <div className="section-lead flex flex-col gap-28 md:gap-40">
        {campaign.sequence.map((frame, i) => {
          const align = ALIGNMENTS[i % ALIGNMENTS.length];
          // Full-width frames break the page frame; the others sit inside it.
          return (
            <Reveal key={frame.id} className={align === "full" ? "" : "page-frame"}>
              <CampaignFrame frame={frame} align={align} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
