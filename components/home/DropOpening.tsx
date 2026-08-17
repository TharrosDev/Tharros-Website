import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import WornList from "@/components/campaign/WornList";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

/**
 * The opening screen: a person in the clothes, and the record of the release.
 *
 * The composition is led by the sentence rather than by the category. It used
 * to set the word "Drop" at display-1 with the numeral beside it, which made
 * the largest type on the landing page a noun that belongs to every label that
 * releases this way, and left `statement` — the one line that belongs to this
 * one — at display-4 in a paragraph above it. Reading order made it worse: the
 * heaviest type was the last thing on the screen. The statement is the h1 now
 * and the drop's name is a mono caption, which is the ordering the rest of the
 * site already uses when a page has both a title and a record.
 *
 * THE RUN LEDGER is what replaced the figures. Pieces / Made / Remaining were
 * set as a three-cell table with hairline tops — structurally the same object
 * as a SaaS statistics row, wearing the most distinctive content on the page.
 * The same two numbers are now stated as the proportion they describe: a rule
 * whose oxide segment is the part of the run that is gone, annotated in mono at
 * either end. Both figures stay derived (`runSize`, `runStatus().remaining`),
 * so this cannot drift from the product pages and cannot manufacture urgency —
 * it can only draw what the inventory already says. It survives the photography
 * being absent, which the picture-led version of this screen does not.
 *
 * What the picture no longer does is carry a flat wash. `bg-black/45` sat over
 * the whole frame *in addition* to the two anchored bands, so the only part of
 * the image ever seen undimmed was the middle third, which is the part with
 * nothing in it. The bands remain — they are anchored to the block they protect
 * rather than to a fraction of the viewport, because viewport-fraction bands
 * drift as the screen height changes and leave type on bare picture. The
 * metadata over them stays `--ink-on-dark-muted`: the faint tone only just
 * clears AA on pure black, so it has no headroom left over a photograph.
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
    <section className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <ImageSlot image={frame} fill priority sizes="100vw" />
      </div>

      {/* Each block carries its own scrim, anchored to the block rather than to
          a fraction of the viewport. Viewport-fraction bands drift: the same
          gradient that covered the figures at one screen height left them on
          bare picture at another, and the readback caught it. */}
      <div className="relative w-full pt-28 md:pt-32">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -bottom-24 bg-gradient-to-b from-black/85 via-black/65 to-transparent"
        />
        {/* The record of the release, stated once. This row used to run
            "Released 2 May 2026" against "Out now" at the same size in the same
            tone — two ways of saying a date has passed, in the two most
            valuable slots on the screen. The piece count is derived and takes
            the slot the second one was wasting. */}
        <div className="page-frame relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule-on-dark pt-4">
          <p className="type-meta text-ink-on-dark-muted">
            {CURRENT_DROP.name}
            <span aria-hidden="true"> · </span>
            <span className="num">{pieces.length}</span>{" "}
            {pieces.length === 1 ? "piece" : "pieces"}
          </p>
          <p className="type-meta text-ink-on-dark-muted">{released}</p>
        </div>
      </div>

      <div className="relative w-full pb-14 md:pb-20">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 bottom-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent"
        />
        <div className="page-frame relative">
          {/* Not wrapped in Reveal. This is the LCP element on the site's most
              visited route, and an entrance that starts at opacity 0 is an
              entrance that delays it — the ledger below carries the gesture
              instead, where nothing is waiting on it. */}
          <h1 className="type-display-1 max-w-[13ch] text-balance">
            {CURRENT_DROP.statement}
          </h1>

          <Reveal className="mt-10 max-w-xl md:mt-12">
            <div className="flex items-baseline justify-between gap-6">
              <p className="type-meta text-ink-on-dark">
                <span className="num">{made}</span> made
              </p>
              <p className="type-meta text-ink-on-dark">
                <span className="num">{remaining}</span> left
              </p>
            </div>
            <div
              aria-hidden="true"
              className="run-ledger mt-3"
              style={{ "--run-taken": taken } as React.CSSProperties}
            />
          </Reveal>

          {/* Reversed below `lg` so the rail is never the last element on the
              screen. A horizontal snap surface sitting on the bottom margin is
              where a thumb lands first, and it fought the page's own vertical
              scroll every time. The action goes there instead, which is what
              the thumb zone is for. */}
          <div className="mt-12 flex flex-col-reverse gap-10 lg:mt-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href={`/shop?drop=${CURRENT_DROP.slug}`}
                className="btn btn-inverse"
              >
                Shop the drop
              </Link>
              <Link href="/drop" className="link-rule link-rule-reveal">
                About this drop
              </Link>
            </div>

            {/* The way into the shop from the picture rather than from the
                buttons: what is actually being worn in the frame above. */}
            {hero ? (
              <div className="max-w-md lg:max-w-sm">
                <WornList
                  slugs={hero.wearing}
                  frameId={hero.id}
                  variant="rail"
                  onDark
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
