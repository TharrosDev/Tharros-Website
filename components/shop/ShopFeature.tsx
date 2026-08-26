import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import WornList from "@/components/campaign/WornList";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/motion/Parallax";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";

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

  return (
    // A split rather than a full-bleed band. Edge to edge at a campaign ratio
    // this is 800px of picture before the first product, which is a lot to ask
    // of someone who came here to look at clothes. Beside its own text it is
    // less than half that, and it still opens the page with a person.
    <section className="page-frame rhythm-tight">
      <div className="grid gap-x-8 gap-y-8 md:grid-cols-12">
        {/* `min-w-0` on both columns: a grid child's automatic minimum size is
            its content, so the horizontally scrolling rail below sized the track
            to its own max-content and pushed the page 6px wider than the phone.
            The rail is meant to scroll, not to set the layout. */}
        {/* The feature frame drifts against the record beside it. It is the
            one picture on the shop that is a photograph rather than a product,
            so it is the one that gets to move — the grid below stays square,
            because there the job is scanning. */}
        <Parallax depth="environment" className="min-w-0 md:col-span-7">
          {/* `priority`, because on the unfiltered view this frame IS the
              largest contentful paint — it sits above the grid and fills most
              of the first screen. Without it Next lazy-loads the one image the
              route is measured on, so the LCP waits for the loader to notice
              it. It is not inside a `Reveal`, so nothing is hiding it either;
              the `Parallax` around it only writes a transform. */}
          <ImageSlot
            image={frame.image}
            ratio="campaign"
            ratioSm="editorial"
            priority
            sizes="(min-width: 768px) min(58vw, 800px), 100vw"
          />
        </Parallax>

        <div className="flex min-w-0 flex-col md:col-span-4 md:col-start-9">
          <Reveal className="rule-draw pt-4">
            <p className="eyebrow">
              <span className="num">{CURRENT_DROP.index}</span>
              <span>{CURRENT_DROP.name}</span>
            </p>
          </Reveal>
          <h2 className="type-display-4 mt-6 text-balance">
            {CURRENT_DROP.statement}
          </h2>
          {/* NO COUNT HERE. This block sat directly above a grid headed
              "Everything — 9 pieces" and said "7 pieces in the run", because
              one counts the drop and the other counts the catalogue. Both were
              derived and both were right, which is exactly why they could not
              share a screen. The bar below states the counts, per release, and
              this states which release the picture is. */}
          <p className="type-meta mt-5 text-ink-faint">
            The current release
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
