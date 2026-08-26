import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import PieceRail from "@/components/releases/PieceRail";
import PageIntro from "@/components/layout/PageIntro";
import Reveal from "@/components/ui/Reveal";
import { releaseHistory } from "@/lib/catalog/releases";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Every drop THARROS has released — the collection, the date, and the pieces that came out in it.",
  alternates: { canonical: "/releases" },
  openGraph: {
    type: "website",
    title: "THARROS releases",
    description: "Every drop released so far, newest first.",
    url: `${SITE_URL}/releases`,
  },
};

/**
 * COLLECTION HISTORY, NOT A LEDGER.
 *
 * The page was organised into year bands over a table of rows, opening on
 * three display-scale totals — garments, units released, sold out. That is the
 * label's output as a balance sheet, on a page somebody opens to look at
 * clothes. A release is the unit now: its campaign frame, its date, its
 * statement, its pieces. It gets more valuable as the label puts more out,
 * which a totals row never does.
 *
 * Every band is rendered from `releaseHistory()`, so Drop 003 is a record in
 * `drops.ts` and nothing else.
 */
export default function ReleasesPage() {
  const history = releaseHistory();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(SITE_URL, [
        { name: "Home", path: "/" },
        { name: "Releases", path: "/releases" },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro
        index="01"
        label="Releases"
        title="Releases"
        lead="Every drop so far — the clothes that came out in each one, and what is still available. A piece stays here after its run is gone."
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <div className="page-frame pb-[var(--rhythm-default)]">
        {history.map(({ drop, entries }) => (
          <section
            key={drop.id}
            className="mt-[var(--rhythm-default)] first:mt-0"
            aria-labelledby={`${drop.id}-heading`}
          >
            <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-4">
              <p className="eyebrow">
                <span className="num">{drop.index}</span>
                <span>
                  <span className="num">{entries.length}</span>{" "}
                  {entries.length === 1 ? "piece" : "pieces"}
                </span>
              </p>
              {drop.releasedAt ? (
                <p className="type-meta text-ink-faint">
                  <time dateTime={drop.releasedAt}>{formatDate(drop.releasedAt)}</time>
                </p>
              ) : null}
            </Reveal>

            {/* The frame leads the band. A drop without one opens on its own
                name instead — no placeholder, no reserved hole. */}
            {drop.cover ? (
              <Reveal mode="frame" className="mt-10">
                <ImageSlot
                  image={drop.cover}
                  ratio="campaign"
                  ratioSm="editorial"
                  sizes="(min-width: 1024px) min(88vw, 1376px), 100vw"
                />
              </Reveal>
            ) : null}

            <div className="mt-10 grid gap-x-12 gap-y-6 lg:grid-cols-12">
              <h2 id={`${drop.id}-heading`} className="type-display-2 lg:col-span-5">
                {drop.name}
              </h2>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="type-lead">{drop.statement}</p>
                {drop.body[0] ? (
                  <p className="type-body mt-5 text-ink-muted">{drop.body[0]}</p>
                ) : null}
                <Link
                  href={`/shop?drop=${drop.slug}`}
                  className="link-rule link-rule-reveal mt-6 inline-block"
                >
                  Shop {drop.name}
                </Link>
              </div>
            </div>

            <div className="mt-14">
              <PieceRail entries={entries} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
