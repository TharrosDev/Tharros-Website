import CampaignSequence from "@/components/campaign/CampaignSequence";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The home page's editorial middle: the drop on people.
 *
 * The page used to run this sequence AND a horizontal rail of lookbook
 * spreads four sections later — two movements of people photographed in the
 * same drop, in the same register, which made the second read as more of the
 * first. The rail went, and then the lookbook page did too: the campaign is
 * where the drop is photographed now, and it is enough.
 */
export default function ThePeople() {
  return (
    <CampaignSequence
      dropId={CURRENT_DROP.id}
      index="04"
      label="The people"
      title="Worn in, not styled."
    />
  );
}
