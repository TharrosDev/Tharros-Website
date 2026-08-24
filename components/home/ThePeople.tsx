import CampaignFrame from "@/components/campaign/CampaignFrame";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The home page's editorial middle: the drop on one person.
 *
 * ONE FRAME, NOT THE SEQUENCE. `/drop` runs `CampaignSequence` over this same
 * data and that is the right place for it — the campaign is what that page is
 * about. Here it was the third picture section in a row and the longest thing
 * on the page: 2934px at 1440x900, three frames in three different alignments
 * each appearing exactly once, so the alternation the sequence is built on
 * never read as a rhythm. Under each of them sat an "in this frame" rail of
 * thumbnails, names and prices — a second product grid, one screen below
 * `01 The run`, which already shows every piece in the drop with its price.
 *
 * So the home page spends one frame and hands the sequence over. The opener's
 * right-hand slot is the way out.
 *
 * THE HEADING SITS BESIDE THE PICTURE, NOT ABOVE IT, and that is what makes the
 * composition work rather than a preference. A standing figure cannot run the
 * full measure on a desktop without being cropped to a horizontal slice of
 * itself, so it takes seven columns and something has to occupy the five beside
 * it. A caption and two links is ~110px of content against a ~700px picture,
 * and no alignment saves that — hung at the foot the hole is at the top, hung
 * at the head it is at the bottom, spread it is in the middle. With the heading
 * in it the column is full: title at the top, the frame's own line under it,
 * what is in the picture anchored to the foot.
 *
 * The opener therefore carries the rule, the index and the way out, and the
 * `h2` is rendered into the column by `CampaignFrame`'s `lead`. Still one `h2`
 * in the section and still `SectionHeading`'s rule opening it.
 *
 * The worn list stays. It is the model-led route from a picture to a garment
 * and it is two links, not six — the duplication was three of them, not the
 * idea.
 */
export default function ThePeople() {
  const campaign = campaignFor(CURRENT_DROP.id);
  const frame = campaign?.sequence[0];
  if (!frame) return null;

  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="04"
          label="The people"
          action={{ href: "/drop", label: "The whole campaign" }}
        />

        <Reveal mode="frame" className="section-lead">
          <CampaignFrame
            frame={frame}
            align="left"
            /* 4:5 below `md`. Without it a frame declaring `campaign` renders
               16:9 at every width, which on a phone is a 166px band. */
            ratioSm="editorial"
            /* A rung down until `lg`. Between `md` and `lg` the side column is
               five tracks of a 768px frame — about 265px — and `display-2`
               there broke "STYLED." so the full stop fell onto a line of its
               own. */
            lead={
              <h2 className="type-display-3 lg:type-display-2">
                Worn in, not styled.
              </h2>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
