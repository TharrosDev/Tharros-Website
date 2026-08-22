import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import CampaignSequence from "@/components/campaign/CampaignSequence";
import ProductGrid from "@/components/product/ProductGrid";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CURRENT_DROP, NEXT_DROP } from "@/lib/catalog/drops";
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
        lead={CURRENT_DROP.statement}
      >
        {/* Real numbers, straight from the catalogue. Nothing here is a
            marketing figure. */}
        <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-ink pt-6">
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
      </PageIntro>

      <div className="page-frame">
        <div className="max-w-2xl space-y-5">
          {CURRENT_DROP.body.map((paragraph) => (
            <p key={paragraph} className="type-body text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* The drop as a story: the statement and its figures, the writing, then
          the people, then the pieces. Someone meets the run on a body before
          they meet it as a grid. Renders nothing without campaign data, in
          which case this page is what it was before. */}
      <CampaignSequence
        dropId={CURRENT_DROP.id}
        index="02"
        label="The people"
        title="The drop, worn."
      />

      <div className="page-frame rhythm-tight">
        <SectionHeading
          index="03"
          label="The pieces"
          title="Everything in the run."
          titleClass="type-display-3"
          className="mb-12"
        />
        <ProductGrid
          products={pieces}
          columns={3}
          priorityCount={3}
          specimen
        />
      </div>

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

            <h2 className="type-display-2 mt-10 max-w-[16ch]">{NEXT_DROP.statement}</h2>

            <div className="mt-8 grid gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-5">
                {NEXT_DROP.body.map((paragraph) => (
                  <p key={paragraph} className="type-body text-ink-muted">
                    {paragraph}
                  </p>
                ))}
                <p className="type-meta text-ink-faint">
                  No release date is published until there is one.
                </p>
              </div>

              <Reveal className="lg:col-span-6 lg:col-start-7">
                <ImageSlot
                  image={NEXT_DROP.cover}
                  ratio="tall"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </Reveal>
            </div>

            {upcoming.length > 0 ? (
              <div className="section-lead">
                <Reveal className="rule-draw pt-4">
                  <p className="eyebrow">Far enough along to show</p>
                </Reveal>
                <div className="mt-10">
                  <ProductGrid
                    products={upcoming}
                    heading={`${NEXT_DROP.name} pieces in development`}
                    columns={4}
                  />
                </div>
              </div>
            ) : null}
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
