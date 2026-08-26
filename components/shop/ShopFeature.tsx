import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import WornList from "@/components/campaign/WornList";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/motion/Parallax";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";

/**
 * The shop's one editorial moment, above the grid — and it is kept short,
 * because the shop is the transactional page.
 *
 * Unfiltered view only: someone who has picked a category, typed a search or
 * sorted by price has decided what they want, and a campaign frame in front of
 * their results is an obstacle. Someone arriving at "everything" has decided
 * nothing, and a picture opens better than a wall of cards.
 *
 * FIVE COLUMNS OF PICTURE, NOT SEVEN. At seven the band ran 523px and pushed
 * the first product row to 1041 — a screen and a half of scroll on a 1440x900
 * laptop before the first garment. Five is 401 and the picture is still the
 * first thing on the page. Measure this again before growing it back.
 *
 * Returns null without campaign data.
 */
export default function ShopFeature() {
  const campaign = campaignFor(CURRENT_DROP.id);
  if (!campaign) return null;

  const frame = campaign.hero;

  return (
    // A split, not a full-bleed band: edge to edge at a campaign ratio this is
    // 800px of picture in front of someone who came to look at clothes.
    <section className="page-frame rhythm-tight">
      <div className="grid gap-x-8 gap-y-8 md:grid-cols-12">
        {/* `min-w-0` on both columns: a grid child's automatic minimum size is
            its content, so the scrolling rail below sized its track to
            max-content and pushed the page wider than the phone.

            The frame drifts against the record beside it — it is the one
            picture on the shop that is a photograph rather than a product, so
            it is the one that gets to move. The grid below stays square,
            because there the job is scanning. */}
        <Parallax depth="environment" className="min-w-0 md:col-span-5">
          {/* `priority`, because on the unfiltered view this frame IS the
              largest contentful paint. Without it Next lazy-loads the one image
              the route is measured on. Not inside a `Reveal`, so nothing hides
              it; the `Parallax` only writes a transform. */}
          <ImageSlot
            image={frame.image}
            ratio="campaign"
            ratioSm="editorial"
            priority
            sizes="(min-width: 768px) min(42vw, 580px), 100vw"
          />
        </Parallax>

        <div className="flex min-w-0 flex-col md:col-span-6 md:col-start-7">
          <Reveal className="rule-draw pt-4">
            <p className="eyebrow">
              <span className="num">{CURRENT_DROP.index}</span>
              <span>{CURRENT_DROP.name}</span>
            </p>
          </Reveal>
          <h2 className="type-display-4 mt-6 text-balance">
            {CURRENT_DROP.statement}
          </h2>
          {/* NO COUNT HERE. The filter bar below states the counts, per
              release; the eyebrow above states which release this is. Two
              derived counts on one screen — one of the drop, one of the
              catalogue — were both right and read as a contradiction. */}
          <Link href="/drop" className="link-rule link-rule-reveal mt-6 self-start">
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
