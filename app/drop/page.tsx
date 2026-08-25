import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import CampaignSequence from "@/components/campaign/CampaignSequence";
import ProductGrid from "@/components/product/ProductGrid";
import ImageSlot from "@/components/media/ImageSlot";
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
    "Drop 001 — a small run of original pieces from THARROS. Made in limited numbers, not restocked on a schedule.",
  alternates: { canonical: "/drop" },
  openGraph: {
    type: "website",
    title: `${CURRENT_DROP.name} — ${CURRENT_DROP.statement}`,
    description:
      "A small run of original pieces. Made in limited numbers, not restocked on a schedule.",
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
 * THE PIECES COME BEFORE THE CAMPAIGN, AND THAT IS THE WHOLE REORGANISATION.
 *
 * Measured at 1440x900 the page ran 9148px — twelve and a half viewports — and
 * spent them like this: the campaign 29%, the run 29%, the drop that has not
 * been made 22%. A release page that gives its photography more room than its
 * garments and gives next season nearly as much as this one has its priorities
 * inverted, and someone who came to see what is in Drop 001 met four screens
 * before the first product.
 *
 * So the order is the run, then the campaign, then what is being sampled. The
 * campaign is not diminished by moving — it is the closing movement now rather
 * than the toll on the way in, and it still runs whole, which is the reason it
 * lives here rather than on the home page.
 *
 * The opening was three stacked blocks in the left half of the frame: the
 * title, then the figures, then the writing, each starting where the last
 * stopped. They are one row now — what the drop is on the left, what it is
 * about on the right — because the figures and the paragraphs are the same
 * thought and neither needs a screen of its own.
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
            : "In development"
        }
        title={CURRENT_DROP.name}
        split
        lead={CURRENT_DROP.statement}
      >
        {/* ONE ROW, NOT TWO BLOCKS. The figures and the writing were stacked,
            each capped at `max-w-2xl` in the leading half of a 1425px frame, so
            the opening ran a full viewport with the trailing half empty for all
            of it. Read across instead of down they fill the measure between
            them: real numbers straight from the catalogue on the left, what the
            run was for on the right. Nothing here is a marketing figure. */}
        <div className="mt-12 grid gap-x-6 gap-y-10 border-t border-ink pt-6 lg:grid-cols-12">
          <dl className="grid grid-cols-3 gap-6 lg:col-span-6">
            <div>
              <dt className="type-meta text-ink-faint">Pieces</dt>
              <dd className="num type-display-4 mt-2">{pieces.length}</dd>
            </div>
            <div>
              <dt className="type-meta text-ink-faint">Units made</dt>
              <dd className="num type-display-4 mt-2">{totalMade}</dd>
            </div>
            <div>
              <dt className="type-meta text-ink-faint">Still available</dt>
              <dd className="num type-display-4 mt-2">{remaining}</dd>
            </div>
          </dl>

          <div className="space-y-5 lg:col-span-5 lg:col-start-8">
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
        <ProductGrid products={pieces} columns={4} specimen />
      </div>

      {/* The run on a body, after the run as a grid. Renders nothing without
          campaign data, in which case this page is what it was before. */}
      <CampaignSequence
        dropId={CURRENT_DROP.id}
        index="03"
        label="The people"
        title="The drop, worn."
      />

      {NEXT_DROP ? (
        <section className="on-pale rhythm-default">
          <div className="page-frame">
            <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
              <p className="eyebrow">
                <span className="num">04</span>
                <span>{NEXT_DROP.name}</span>
              </p>
              {/* Oxide marks the state, not the numeral. */}
              <p className="type-meta text-signal">In development</p>
            </Reveal>

            {/* A BAND, NOT A MOVEMENT. This was 1984px — a fifth of the page —
                for work that cannot be bought: a display-2 statement, both body
                paragraphs, a half-width picture forced to `tall`, and then a
                second block below with its own rule and heading to hold two
                products. It is one row now. What is in development should be
                worth knowing about without competing with what is for sale.

                The picture keeps its photograph and loses the `ratio="tall"`
                override, so it renders at the `campaign` shape its own data
                declares. The second paragraph goes: it said the drop has no
                date and goes out when the fit is right, which is what
                `NO_DATE_NOTE` says on the line under it. */}
            <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h2 className="type-display-3 max-w-[16ch]">{NEXT_DROP.statement}</h2>

                {NEXT_DROP.body.slice(0, 1).map((paragraph) => (
                  <p key={paragraph} className="type-body mt-6 text-ink-muted">
                    {paragraph}
                  </p>
                ))}

                <p className="type-meta mt-4 text-ink-faint">{NO_DATE_NOTE}</p>

                {upcoming.length > 0 ? (
                  <div className="mt-10">
                    <p className="eyebrow border-t border-rule pt-4">
                      Far enough along to show
                    </p>
                    <div className="mt-8">
                      <ProductGrid
                        products={upcoming}
                        heading={`${NEXT_DROP.name} pieces in development`}
                        columns={2}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <Reveal className="lg:col-span-6 lg:col-start-7">
                <ImageSlot
                  image={NEXT_DROP.cover}
                  sizes="(min-width: 1024px) min(50vw, 700px), 100vw"
                />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-frame rhythm-tight border-t border-rule">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="type-display-3 uppercase">Everything made so far.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/archive" className="btn btn-solid">
              Open the archive
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
