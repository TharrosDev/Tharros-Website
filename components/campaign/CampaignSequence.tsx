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

      <div className="mt-14 flex flex-col gap-20 md:gap-28">
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
