import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { ARCHIVE_STATE_LABEL, type ArchiveEntry } from "@/lib/catalog/archive";
import { categoryName } from "@/lib/catalog/categories";
import { thumbnailImage } from "@/lib/catalog/queries";

/**
 * THE LEDGER — the archive's one repeated object.
 *
 * A row, not a card. Cards are how a shop shows stock: equal-sized, image
 * first, priced, built to be compared and chosen between. A record is read
 * down a column, and what makes it read as a record is that the figures line
 * up — which is what the mono layer's tabular figures were already for.
 *
 * The frame is always visible rather than revealed on hover. A hover-only
 * preview is a desktop flourish that gives a phone nothing, and it would have
 * needed client state to drive a shared preview column. A 56px frame per row
 * costs one small image, works on every input, and `thumbnailImage()` already
 * exists for exactly this size — it inverts the usual ladder because at 56px a
 * full-body shot is a smudge.
 *
 * TWO LAYOUTS, ONE MARKUP. Below `lg` the cells group into three legible
 * lines; from `lg` the groups take `display: contents` and dissolve, so their
 * children become direct children of the row grid and the columns line up
 * across every record. The alternative was rendering the row twice and hiding
 * one, which doubles the images and lies to a screen reader.
 *
 * The columned layout starts at `lg`, not `md`. Its fixed tracks come to
 * 28rem and its five gaps to 8.75rem; at 768px the frame is 42.7rem wide, so
 * the one flexible track — the garment name — was left about 35px. `minmax(0,
 * 1fr)` meant that degraded to a truncated name rather than to an overflow,
 * which is the failure mode you do not notice in a screenshot.
 */
export default function ArchiveLedger({
  entries,
  delayFrom = 0,
}: {
  entries: ArchiveEntry[];
  delayFrom?: number;
}) {
  return (
    <ol className="mt-8">
      {entries.map((entry, i) => {
        const archived = entry.state === "archived";
        return (
          <Reveal
            as="li"
            key={entry.garmentId}
            delay={Math.min(delayFrom + i, 5) * 60}
            className="border-b border-rule"
          >
            <Link
              href={`/archive/${entry.ref}`}
              className="hover-zoom grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-5 gap-y-2 py-5 lg:grid-cols-[3.5rem_6rem_minmax(0,1fr)_minmax(0,7rem)_5rem_6.5rem] lg:items-center lg:gap-x-7 lg:gap-y-0"
            >
              <span className="row-span-3 overflow-hidden bg-surface-frame lg:row-span-1">
                <ImageSlot image={thumbnailImage(entry.product)} ratio="square" sizes="56px" />
              </span>

              {/* Line one on a phone: the identity and the verdict, the two
                  things a record is looked up for. */}
              <span className="flex items-baseline justify-between gap-4 lg:contents">
                <span className="num type-meta-lg text-ink-faint">{entry.garmentId}</span>
                <span
                  className={`type-meta lg:order-last lg:text-end ${archived ? "text-ink" : "text-ink-faint"}`}
                >
                  {entry.state === "available" ? (
                    <>
                      <span className="num">{entry.remaining}</span> available
                    </>
                  ) : (
                    ARCHIVE_STATE_LABEL[entry.state]
                  )}
                </span>
              </span>

              <span className="type-body-sm uppercase">
                {entry.product.name}
                <span className="type-meta ms-3 normal-case text-ink-faint">
                  {entry.product.colorway}
                </span>
              </span>

              <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1 lg:contents">
                <span className="type-meta min-w-0 truncate text-ink-muted">
                  {entry.drop?.name ?? categoryName(entry.product.category)}
                </span>
                {/* A piece still being sampled has no run size yet, and
                    `runSize: 0` is the absence of a decision rather than a
                    decision to make none. Printing "0 made" states a fact that
                    is true and means the opposite of what it reads as. */}
                <span className="type-meta whitespace-nowrap text-ink-faint lg:text-end">
                  {entry.state === "in-development" ? (
                    <span aria-label="Run size not set">&mdash;</span>
                  ) : (
                    <>
                      <span className="num">{entry.made}</span> made
                    </>
                  )}
                </span>
              </span>
            </Link>
          </Reveal>
        );
      })}
    </ol>
  );
}
