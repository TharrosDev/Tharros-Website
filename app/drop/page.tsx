import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import CampaignSequence from "@/components/campaign/CampaignSequence";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CURRENT_DROP, NEXT_DROP } from "@/lib/catalog/drops";
import ImageSlot from "@/components/media/ImageSlot";
import { listProducts } from "@/lib/catalog/queries";
import { formatDate } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

/* Counted, never typed. A "seven pieces" line against a drop of nine is how
   the description and the page it describes stop agreeing. */
const PIECE_COUNT = listProducts({ drop: CURRENT_DROP.id }).length;
const DROP_SUMMARY = `${CURRENT_DROP.name} from THARROS — ${PIECE_COUNT} pieces in heavyweight jersey, fleece and canvas, released in a limited run.`;

export const metadata: Metadata = {
  title: "Current Drop",
  description: DROP_SUMMARY,
  alternates: { canonical: "/drop" },
  openGraph: {
    type: "website",
    title: `${CURRENT_DROP.name} — ${CURRENT_DROP.statement}`,
    description: DROP_SUMMARY,
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
 * THE RELEASE. THE COLLECTION, THE PIECES, THE PEOPLE IN THEM, WHAT IS NEXT.
 *
 * It opens editorially and not administratively: the drop's name, its date,
 * one statement, and the cover frame at the scale it was shot for. The output
 * statistics that used to lead — pieces, units made, still available, set at
 * display scale — are gone. A shopper needs to know what is in a release and
 * whether it is still going; per-piece run figures say that on the product
 * page, where the decision is.
 *
 * The pieces come before the campaign. Measured at 1440x900 this page once
 * gave its photography more room than its garments, so someone who came to see
 * what is in Drop 001 met four screens before the first product.
 */
export default function DropPage() {
  const pieces = listProducts({ drop: CURRENT_DROP.id });
  const upcoming = NEXT_DROP ? listProducts({ drop: NEXT_DROP.id }) : [];

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
        <div className="mt-10 max-w-[var(--measure-body)] space-y-5">
          {CURRENT_DROP.body.map((paragraph) => (
            <p key={paragraph} className="type-body text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </PageIntro>

      {/* The collection, at the scale it was shot for, before the grid. A drop
          with no cover opens on its type alone rather than on a reserved
          hole. */}
      {CURRENT_DROP.cover ? (
        <Reveal mode="frame">
          <ImageSlot
            image={CURRENT_DROP.cover}
            ratio="campaign"
            ratioSm="editorial"
            priority
            sizes="100vw"
          />
        </Reveal>
      ) : null}

      <div className="page-frame rhythm-tight">
        <SectionHeading
          index="02"
          label="The pieces"
          title={`${pieces.length} pieces.`}
          titleClass="type-display-3"
          className="mb-12"
        />
        {/* Four up, so seven pieces read 4 + 3. At three the last row was one
            card beside two columns of empty page, which reads as the grid
            having run out. No `priorityCount`: the cover frame above is the
            largest paint here and already carries `priority`. */}
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

            {/* A preview: the statement, what is in it, the date, and the
                pieces themselves as the picture. */}
            <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="type-display-3 max-w-[14ch]">{NEXT_DROP.statement}</h2>

                {NEXT_DROP.body.map((paragraph) => (
                  <p key={paragraph} className="type-body mt-6 text-ink-muted">
                    {paragraph}
                  </p>
                ))}

                {NEXT_DROP.releasedAt ? (
                  <p className="type-meta mt-6 text-ink-faint">
                    <time dateTime={NEXT_DROP.releasedAt}>
                      {formatDate(NEXT_DROP.releasedAt)}
                    </time>
                  </p>
                ) : null}
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

      {/* The way on from a release is the rest of the releases. */}
      <section className="page-frame rhythm-tight border-t border-rule">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="type-display-3 uppercase">Every drop so far.</p>
          <Link href="/releases" className="btn btn-solid">
            See the releases
          </Link>
        </div>
      </section>

    </>
  );
}
