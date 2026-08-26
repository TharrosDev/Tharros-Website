import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import CampaignSequence from "@/components/campaign/CampaignSequence";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CURRENT_DROP, NEXT_DROP, NO_DATE_NOTE } from "@/lib/catalog/drops";
import { listProducts, runStatus } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Current Drop",
  description:
    "Drop 001 from THARROS — seven pieces in heavyweight jersey, fleece and canvas, released in a limited run.",
  alternates: { canonical: "/drop" },
  openGraph: {
    type: "website",
    title: `${CURRENT_DROP.name} — ${CURRENT_DROP.statement}`,
    description:
      "Seven pieces in heavyweight jersey, fleece and canvas. A limited release.",
    url: `${SITE_URL}/drop`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/drop#page`,
      url: `${SITE_URL}/drop`,
      name: CURRENT_DROP.name,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    breadcrumbList(SITE_URL, [
      { name: "Home", path: "/" },
      { name: CURRENT_DROP.name, path: "/drop" },
    ]),
  ],
};

/**
 * A RELEASE PAGE. THE PIECES, THE PEOPLE IN THEM, AND WHAT IS NEXT.
 *
 * The pieces come before the campaign: measured at 1440x900 this page once
 * gave its photography more room than its garments and gave the unreleased
 * drop nearly as much as the released one, so someone who came to see what is
 * in Drop 001 met four screens before the first product.
 *
 * WHAT THIS PAGE STOPPED SAYING. The opening record was three figures —
 * pieces, units made, still available — set at display scale, which made a
 * release page read as a production dashboard; the run is now stated as one
 * line of release information and the third figure moved into it. The preview
 * band below used to name what was being patterned, what was on its second
 * sample and which pieces were "far enough along to show". It is a collection
 * preview: the name, what is in it, and no date, because there is no date.
 */
export default function DropPage() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });
  const upcoming = NEXT_DROP ? listProducts({ drop: NEXT_DROP.id }) : [];

  const totalMade = pieces.reduce((sum, product) => sum + product.runSize, 0);
  const remaining = pieces.reduce((sum, product) => sum + runStatus(product).remaining, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro
        index={CURRENT_DROP.index}
        label={
          CURRENT_DROP.releasedAt
            ? `Released ${formatDate(CURRENT_DROP.releasedAt)}`
            : "Coming soon"
        }
        title={CURRENT_DROP.name}
        split
        lead={CURRENT_DROP.statement}
      >
        {/* THE RELEASE RECORD, NOT A DASHBOARD. Three display-scale figures
            — Pieces / Units made / Still available — put the label's output
            statistics at the top of a page about clothes, at the same size as
            the drop's own name. What a shopper needs from a release is what is
            in it, when it came out, and whether it is still going; that is one
            mono row, and the numbers are still derived from the catalogue so
            nothing here can drift from a product page. */}
        <div className="mt-12 grid gap-x-6 gap-y-10 border-t border-ink pt-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="type-meta flex flex-wrap items-baseline gap-x-6 gap-y-2 text-ink-faint">
              <span>
                <span className="num">{pieces.length}</span>{" "}
                {pieces.length === 1 ? "piece" : "pieces"}
              </span>
              <span>
                <span className="num">{totalMade}</span> made
              </span>
              <span>
                <span className="num">{remaining}</span> still available
              </span>
            </p>
          </div>

          <div className="space-y-5 lg:col-span-6 lg:col-start-7">
            {CURRENT_DROP.body.map((paragraph) => (
              <p key={paragraph} className="type-body text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

      </PageIntro>

      <div className="page-frame rhythm-tight">
        <SectionHeading
          index="02"
          label="The pieces"
          title="Everything in the run."
          titleClass="type-display-3"
          className="mb-12"
        />
        {/* Four up, so seven pieces read 4 + 3. At three the last row was one
            card alone beside two columns of empty page, which reads as the grid
            having run out rather than as the run being seven.

            Still no `priorityCount`, even though the grid has moved up the
            page. The opening is type, so the largest paint here is a heading —
            preloading a row of frames to beat an `h1` spends bandwidth on
            something nothing is waiting for. */}
        <ProductGrid products={pieces} columns={4} />
      </div>

      {/* The run on a body, after the run as a grid. Renders nothing without
          campaign data, in which case this page is what it was before. */}
      <CampaignSequence dropId={CURRENT_DROP.id} index="03" label="The people" />

      {NEXT_DROP ? (
        <section className="on-pale rhythm-default">
          <div className="page-frame">
            <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
              <p className="eyebrow">
                <span className="num">04</span>
                <span>{NEXT_DROP.name}</span>
              </p>
              {/* Oxide marks the state, not the numeral. */}
              <p className="type-meta text-signal">Coming next</p>
            </Reveal>

            {/* A PREVIEW, NOT A STATUS REPORT. This band used to carry the
                drop's development state — what was being cut again, what was
                on which sample, and a heading reading "Far enough along to
                show" over the two pieces — beside a photograph of a part-cut
                panel on a work table. What is confirmed about Drop 002 is its
                name, the two pieces announced for it, and that it has no date.
                That is what is here, and the pieces are the picture. */}
            <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="type-display-3 max-w-[14ch]">{NEXT_DROP.statement}</h2>

                {NEXT_DROP.body.map((paragraph) => (
                  <p key={paragraph} className="type-body mt-6 text-ink-muted">
                    {paragraph}
                  </p>
                ))}

                <p className="type-meta mt-6 text-ink-faint">{NO_DATE_NOTE}</p>
              </div>

              {upcoming.length > 0 ? (
                <div className="lg:col-span-7 lg:col-start-6">
                  <ProductGrid
                    products={upcoming}
                    heading={`${NEXT_DROP.name} pieces`}
                    columns={2}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* The way on from a release is the rest of the releases. It used to be
          "Everything made so far." over a button into the archive — the label's
          output as the closing statement of a page about a collection. */}
      <section className="page-frame rhythm-tight border-t border-rule">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="type-display-3 uppercase">Previous releases.</p>
          <Link href="/releases" className="btn btn-solid">
            Open the index
          </Link>
        </div>
      </section>

    </>
  );
}
