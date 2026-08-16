import Link from "next/link";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

/**
 * The opening screen. Not a photograph — a record.
 *
 * The previous hero was a full-bleed image behind a scrim with the wordmark
 * and a button set into the bottom corner: the composition every fashion site
 * opens with, and one that says nothing until photography exists. This states
 * what the label is actually releasing and how much of it is left, in figures
 * that come from the catalogue rather than from marketing.
 *
 * Every number here is derived. `runSize` is how many were made and
 * `runStatus().remaining` is real variant inventory, so this cannot drift from
 * what the product pages say, and it cannot be used to manufacture urgency.
 */
export default function DropRecord() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });
  const made = pieces.reduce((sum, product) => sum + product.runSize, 0);
  const remaining = pieces.reduce(
    (sum, product) => sum + runStatus(product).remaining,
    0,
  );

  const figures = [
    { label: "Pieces", value: pieces.length },
    { label: "Made", value: made },
    { label: "Remaining", value: remaining },
  ];

  return (
    // Split top to bottom rather than stacked at the foot of the screen: with
    // no photograph behind it, a single bottom-aligned block leaves the upper
    // half of the first screen as dead black.
    <section className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
      <div className="page-frame w-full pt-28 md:pt-32">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule-on-dark pt-4">
          <p className="type-meta text-ink-on-dark-faint">
            {CURRENT_DROP.releasedAt
              ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
              : "In development"}
          </p>
          <p className="type-meta text-ink-on-dark-faint">
            {CURRENT_DROP.status === "released" ? "Out now" : "In development"}
          </p>
        </div>

        {/* The statement anchors the upper half. Left at the foot of the screen
            with everything else, the first view was a rule at the top and a
            block at the bottom with a third of the screen empty between them —
            which reads as unfinished rather than as restraint. */}
        <p className="type-display-4 mt-10 max-w-[20ch] text-balance md:mt-14">
          {CURRENT_DROP.statement}
        </p>
      </div>

      <div className="page-frame w-full pb-14 md:pb-20">
        {/* Display face and mono face in one lockup — the contrast the type
            system is built on. The numeral is the drop's identity, so it is
            set once here rather than repeated as a separate figure and again
            in the name. */}
        <h1 className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="type-display-2">Drop</span>
          <span className="type-mono-1 text-signal-on-dark">{CURRENT_DROP.index}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <dl className="grid max-w-lg grid-cols-3 gap-6">
            {figures.map((figure) => (
              <div key={figure.label} className="border-t border-rule-on-dark-strong pt-4">
                <dt className="type-meta text-ink-on-dark-faint">{figure.label}</dt>
                <dd className="type-mono-2 mt-3">{figure.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-4">
            <Link href={`/shop?drop=${CURRENT_DROP.slug}`} className="btn btn-inverse">
              Shop the drop
            </Link>
            <Link href="/drop" className="btn btn-outline-on-dark">
              About this drop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
