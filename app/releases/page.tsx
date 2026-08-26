import type { Metadata } from "next";
import ReleaseLedger from "@/components/releases/ReleaseLedger";
import PageIntro from "@/components/layout/PageIntro";
import Reveal from "@/components/ui/Reveal";
import { archiveByYear, archiveTotals } from "@/lib/catalog/archive";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Every piece THARROS has released, by year — its number, the drop it came from, and what is left of the run.",
  alternates: { canonical: "/releases" },
  openGraph: {
    type: "website",
    title: "THARROS releases",
    description: "Every piece released so far, by year.",
    url: `${SITE_URL}/releases`,
  },
};

export default function ReleasesPage() {
  const bands = archiveByYear();
  const totals = archiveTotals();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList(SITE_URL, [
        { name: "Home", path: "/" },
        { name: "Releases", path: "/releases" },
      ]),
    ],
  };

  // The index runs as one series across the year bands rather than restarting
  // per year: the reveal stagger is a property of reading down the page, not
  // of the band a row happens to fall in.
  //
  // Precomputed rather than accumulated in the JSX. A `let` incremented inside
  // `.map()` is a variable reassigned after render completes, which the React
  // Compiler lint rules reject outright — and rightly, since the render would
  // read a different value on a re-run.
  const offsets = bands.reduce<number[]>(
    (acc, band, i) => [...acc, (acc[i] ?? 0) + band.entries.length],
    [0],
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro
        index="01"
        label="The index"
        title="Releases"
        split
        lead="Every piece THARROS has put out, newest first. A piece stays here after its run is gone."
        crumbs={[{ name: "Home", href: "/" }]}
      >
        {/* The two figures the page is about, stated once at the top so the
            ledger below does not have to be added up by eye. Both derived. */}
        <dl className="mt-12 flex flex-wrap gap-x-14 gap-y-6">
          <div>
            <dt className="type-meta text-ink-faint">Garments</dt>
            <dd className="num type-mono-2 mt-2">{totals.garments}</dd>
          </div>
          <div>
            <dt className="type-meta text-ink-faint">Units released</dt>
            <dd className="num type-mono-2 mt-2">{totals.made}</dd>
          </div>
          <div>
            <dt className="type-meta text-ink-faint">Sold out</dt>
            <dd className="num type-mono-2 mt-2">{totals.closed}</dd>
          </div>
        </dl>
      </PageIntro>

      <div className="page-frame pb-[var(--rhythm-default)]">
        {bands.map((band, i) => {
          return (
            <section key={band.year} className="mt-[var(--rhythm-tight)] first:mt-0">
              {/* The band header is the year at mono display scale — the
                  archive's largest figure, because the year is the axis the
                  record is organised on. */}
              <Reveal className="rule-draw flex items-baseline justify-between gap-6 pt-4">
                <h2 className="num type-mono-2">{band.year}</h2>
                <p className="type-meta text-ink-faint">
                  <span className="num">{band.entries.length}</span>{" "}
                  {band.entries.length === 1 ? "garment" : "garments"}
                </p>
              </Reveal>

              <ReleaseLedger entries={band.entries} delayFrom={offsets[i]} />
            </section>
          );
        })}
      </div>
    </>
  );
}
