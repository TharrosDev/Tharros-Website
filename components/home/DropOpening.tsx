import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import WornList from "@/components/campaign/WornList";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

/**
 * The opening screen: the sentence on the left, a person on the right, and no
 * edge between them.
 *
 * It used to be one full-bleed photograph with the type laid over it under two
 * anchored scrims. That works when the picture is dark and the type is white,
 * and it stops working the moment the site's ground is light: dimming a
 * photograph so ink can sit on it is a tax the whole composition pays, and the
 * only part of the picture that survives undimmed is the part with nothing in
 * it.
 *
 * So the two stop competing for the same rectangle. The type sits on the page,
 * at full contrast, needing no scrim at all. The picture keeps its own half and
 * bleeds off the right edge.
 *
 * THERE IS NO SEAM. The picture is not in a column with an edge — it is masked
 * with a gradient, so it dissolves into the paper rather than stopping against
 * it. A hard vertical join between an image and a background is the thing that
 * makes a split hero read as two panels bolted together; a dissolve makes it
 * one surface that happens to have a photograph in part of it. The mask runs
 * right-to-left on desktop and top-to-bottom on a phone, where the picture
 * takes the upper part of the screen and fades down into the opening line.
 *
 * The composition is led by the sentence rather than by the category. It used
 * to set the word "Drop" at display-1 with the numeral beside it, which made
 * the largest type on the landing page a noun that belongs to every label that
 * releases this way, and left `statement` — the one line that belongs to this
 * one — at display-4 above it.
 *
 * THE RUN LEDGER is what replaced the figures. Pieces / Made / Remaining were
 * set as a three-cell table with hairline tops — structurally the same object
 * as a SaaS statistics row, wearing the most distinctive content on the page.
 * The same two numbers are now stated as the proportion they describe: a rule
 * whose oxide segment is the part of the run that is gone, annotated in mono at
 * either end. Both figures stay derived (`runSize`, `runStatus().remaining`),
 * so this cannot drift from the product pages and cannot manufacture urgency —
 * it can only draw what the inventory already says. It survives the photography
 * being absent, which the picture-led version of this screen did not.
 *
 * One primary action. "Shop the drop" and "About this drop" were two buttons of
 * the same height and face, starting with the same two words, giving a
 * low-intent destination equal claim on the buy path.
 */
export default function DropOpening() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });
  const made = pieces.reduce((sum, product) => sum + product.runSize, 0);
  const remaining = pieces.reduce(
    (sum, product) => sum + runStatus(product).remaining,
    0,
  );
  // The share of the run that is gone. Guarded because an empty drop is a real
  // state — the catalogue ships placeholder and a drop with nothing in it would
  // otherwise divide by zero and render NaN into a transform.
  const taken = made > 0 ? (made - remaining) / made : 0;

  const released =
    CURRENT_DROP.status === "released" && CURRENT_DROP.releasedAt
      ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
      : "In development";

  const hero = campaignFor(CURRENT_DROP.id)?.hero;
  const frame = hero?.image ?? CURRENT_DROP.cover;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 md:pb-20">
      {/* The picture. Absolutely placed so it bleeds past `page-frame` to the
          screen edge, and masked so it has no edge of its own on the side that
          meets the type. `pointer-events-none` because it is scenery — every
          way into the shop from this screen is a real link below. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[52svh] [mask-image:linear-gradient(to_bottom,black_45%,transparent)] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[54%] md:[mask-image:linear-gradient(to_right,transparent,black_46%)] lg:w-[50%]"
      >
        <ImageSlot
          image={frame}
          fill
          priority
          sizes="(min-width: 768px) 54vw, 100vw"
        />
      </div>

      {/* The content column. It clears the picture on a phone by starting below
          it, and holds the left half from `md` — never wider than the point
          where the mask begins, so a line of type never lands on the picture. */}
      <div className="page-frame relative pt-[calc(52svh+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
        <div className="md:max-w-[56%] lg:max-w-[52%]">
          {/* The record of the release, stated once. This row used to run
              "Released 2 May 2026" against "Out now" at the same size in the
              same tone — two ways of saying a date has passed, in the two most
              valuable slots on the screen. The piece count is derived and takes
              the slot the second one was wasting. */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule pt-4">
            <p className="type-meta text-ink-muted">
              {CURRENT_DROP.name}
              <span aria-hidden="true"> · </span>
              <span className="num">{pieces.length}</span>{" "}
              {pieces.length === 1 ? "piece" : "pieces"}
            </p>
            <p className="type-meta flex items-center gap-5 text-ink-muted">
              {released}
              {/* The trim mark. One, on the opening screen only — the site's
                  single admission that it is laid out as printed matter rather
                  than as a page. It says nothing, which is why there is exactly
                  one of it: repeated down the site it would stop being a mark
                  and become a motif. */}
              <span className="mark-registration" aria-hidden="true" />
            </p>
          </div>

          {/* Not wrapped in Reveal. This is the LCP text on the site's most
              visited route, and an entrance that starts at opacity 0 is an
              entrance that delays it — the ledger below carries the gesture
              instead, where nothing is waiting on it. */}
          {/* THE RUNG IS CHOSEN FOR THE COLUMN, NOT THE VIEWPORT.
              The ladder's clamps are viewport-relative, which is correct for
              type that spans the frame and wrong for type in a half-width
              column: at 1440 display-1 resolves to ~157px, and "STARTS." needs
              ~660px of it against a 560px column. The ladder sets
              `overflow-wrap: break-word` as a guard against horizontal
              overflow, so instead of spilling, the word split — which is how a
              sizing mistake shows up as a typography bug.

              Full width below `md`, where display-1 fits; a rung down from
              `md`, where the picture takes half the screen. */}
          <h1 className="type-display-1 mt-10 max-w-[13ch] text-balance md:mt-12 md:type-display-2">
            {CURRENT_DROP.statement}
          </h1>

          <Reveal className="mt-10 max-w-xl md:mt-12">
            <div className="flex items-baseline justify-between gap-6">
              <p className="type-meta">
                <span className="num">{made}</span> made
              </p>
              <p className="type-meta">
                <span className="num">{remaining}</span> left
              </p>
            </div>
            <div
              aria-hidden="true"
              className="run-ledger mt-3"
              style={{ "--run-taken": taken } as React.CSSProperties}
            />
          </Reveal>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link href={`/shop?drop=${CURRENT_DROP.slug}`} className="btn btn-solid">
              Shop the drop
            </Link>
            <Link href="/drop" className="link-rule link-rule-reveal">
              About this drop
            </Link>
          </div>

          {/* The way into the shop from the picture rather than from the
              buttons: what is actually being worn in the frame beside it. */}
          {hero ? (
            <div className="mt-12 max-w-md">
              <WornList slugs={hero.wearing} frameId={hero.id} variant="rail" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
