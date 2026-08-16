import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import WornList from "@/components/campaign/WornList";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts } from "@/lib/catalog/queries";

/**
 * The shop's one editorial moment, above the grid.
 *
 * It is shown on the unfiltered view only. Someone who has picked a category,
 * typed a search or sorted by price has already decided what they are looking
 * for, and a campaign frame in front of their results is an obstacle — the
 * grid should be the first thing they see. Someone arriving at "everything"
 * has not decided anything yet, and a picture is a better opening than a wall
 * of cards.
 *
 * Returns null without campaign data.
 */
export default function ShopFeature() {
  const campaign = campaignFor(CURRENT_DROP.id);
  if (!campaign) return null;

  const frame = campaign.hero;
  const count = listProducts({ drop: CURRENT_DROP.id }).length;

  return (
    // A split rather than a full-bleed band. Edge to edge at a campaign ratio
    // this is 800px of picture before the first product, which is a lot to ask
    // of someone who came here to look at clothes. Beside its own text it is
    // less than half that, and it still opens the page with a person.
    <section className="page-frame rhythm-tight">
      <div className="grid gap-x-8 gap-y-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <ImageSlot
            image={frame.image}
            ratio="campaign"
            ratioSm="editorial"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </div>

        <div className="flex flex-col md:col-span-4 md:col-start-9">
          <div className="eyebrow border-t border-ink pt-4">
            <span className="num">{CURRENT_DROP.index}</span>
            <span>{CURRENT_DROP.name}</span>
          </div>
          <h2 className="type-display-4 mt-6 text-balance">
            {CURRENT_DROP.statement}
          </h2>
          <p className="type-meta mt-5 text-ink-faint">
            <span className="num">{count}</span> pieces in the run
          </p>
          <Link href="/drop" className="link-rule link-rule-reveal mt-5 self-start">
            About this drop
          </Link>

          <div className="mt-8">
            <WornList
              slugs={frame.wearing}
              frameId={`shop-${frame.id}`}
              variant="stack"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
