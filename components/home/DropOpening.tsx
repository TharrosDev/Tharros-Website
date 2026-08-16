import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import WornList from "@/components/campaign/WornList";
import { campaignFor } from "@/lib/catalog/campaign";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";

/**
 * The opening screen: a person in the clothes, and the record of the release.
 *
 * This replaces DropRecord, which was type-only on purpose. Its reasoning was
 * that a full-bleed hero "says nothing until photography exists" — and against
 * an empty bone frame that was right. What changed is not the argument but the
 * ground: the stand-in now draws a figure in a place, so the composition has
 * something to be, and the site is being built around the person wearing the
 * clothes rather than around the garment on its own.
 *
 * What has *not* changed is the record. Every figure below is still derived —
 * `runSize` is how many were made and `runStatus().remaining` is real variant
 * inventory — so this cannot drift from the product pages and cannot be used to
 * manufacture urgency. The picture is additive. Take it away and the section is
 * the one that shipped before it, which is the test that it is not load-bearing.
 *
 * Two things the picture forced, both measured by pixel readback rather than
 * assumed. The scrim is banded, because a flat wash dark enough to carry the
 * type turned the whole frame grey. And the metadata over it is
 * `--ink-on-dark-muted`, not `--ink-on-dark-faint`: the faint tone only just
 * clears AA on pure black, so it has no headroom left over a photograph. The
 * hierarchy it used to carry is carried by the mono face and the scale instead.
 */
export default function DropOpening() {
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

  const hero = campaignFor(CURRENT_DROP.id)?.hero;
  const frame = hero?.image ?? CURRENT_DROP.cover;

  return (
    <section className="on-dark relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
      {/* Scrims are banded rather than flat. The text lives at the top and the
          bottom of this screen, so those bands go nearly opaque while the
          middle — where there is nothing to read — keeps the picture. A flat
          wash heavy enough to carry the type made the whole frame grey, which
          is the version of a photographic hero that says nothing. */}
      <div aria-hidden="true" className="absolute inset-0">
        <ImageSlot image={frame} fill priority sizes="100vw" />
        <span className="absolute inset-0 bg-black/45" />
      </div>

      {/* Each block carries its own scrim, anchored to the block rather than to
          a fraction of the viewport. Viewport-fraction bands drift: the same
          gradient that covered the figures at one screen height left them on
          bare picture at another, and the readback caught it. */}
      <div className="relative w-full pt-28 md:pt-32">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -bottom-24 bg-gradient-to-b from-black/85 via-black/70 to-transparent"
        />
        <div className="page-frame relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule-on-dark pt-4">
          <p className="type-meta text-ink-on-dark-muted">
            {CURRENT_DROP.releasedAt
              ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
              : "In development"}
          </p>
          <p className="type-meta text-ink-on-dark-muted">
            {CURRENT_DROP.status === "released" ? "Out now" : "In development"}
          </p>
        </div>

        {/* The frame has to be its own element: `page-frame` centres its box,
            so putting it on the paragraph alongside a max-width centres the
            text in the page instead of setting it in the gutter. */}
        <div className="page-frame relative">
          <p className="type-display-4 mt-10 max-w-[20ch] text-balance md:mt-14">
            {CURRENT_DROP.statement}
          </p>
        </div>
      </div>

      <div className="relative w-full pb-14 md:pb-20">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -top-32 bottom-0 bg-gradient-to-t from-black/90 via-black/85 to-black/70"
        />
        <div className="page-frame relative">
          {/* Display face and mono face in one lockup — the contrast the type
            system is built on. The numeral is the drop's identity, so it is set
            once here rather than repeated as a separate figure and again in the
            name. It stays the section's only accent. */}
          <h1 className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="type-display-2">Drop</span>
            <span className="type-mono-1 text-signal-on-dark">
              {CURRENT_DROP.index}
            </span>
          </h1>

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <dl className="grid max-w-lg grid-cols-3 gap-6">
              {figures.map((figure) => (
                <div
                  key={figure.label}
                  className="border-t border-rule-on-dark-strong pt-4"
                >
                  <dt className="type-meta text-ink-on-dark-muted">
                    {figure.label}
                  </dt>
                  <dd className="type-mono-2 mt-3">{figure.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/shop?drop=${CURRENT_DROP.slug}`}
                className="btn btn-inverse"
              >
                Shop the drop
              </Link>
              <Link href="/drop" className="btn btn-outline-on-dark">
                About this drop
              </Link>
            </div>
          </div>

          {/* The way into the shop from the picture rather than from the buttons:
            what is actually being worn in the frame above. */}
          {hero ? (
            <div className="mt-12 max-w-md lg:max-w-lg">
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
    </section>
  );
}
