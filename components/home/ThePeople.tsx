import CampaignSequence from "@/components/campaign/CampaignSequence";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The home page's editorial middle: the drop on people, before the page goes
 * back to talking about how it was made.
 *
 * It sits after the statement rather than before it, so the run of surfaces
 * stays alternated — black record, paper grid, black statement, paper
 * editorial, paper process. Two image-led sections either side of the statement
 * would have put the page's two heaviest blocks in the same breath.
 */
export default function ThePeople() {
  return (
    <CampaignSequence
      dropId={CURRENT_DROP.id}
      index="03"
      label="The people"
      title="Worn in, not styled."
    />
  );
}
