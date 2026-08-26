import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/motion/Parallax";
import PageIntro from "@/components/layout/PageIntro";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { PAGE_FRAMES } from "@/lib/catalog/images";
import { BRAND_LINE, SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

const SUMMARY =
  "THARROS is an independent streetwear label. Heavyweight cloth, wide silhouettes and restrained graphics, released in numbered drops.";

export const metadata: Metadata = {
  title: "About",
  description: SUMMARY,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    title: "About THARROS",
    description: SUMMARY,
    url: `${SITE_URL}/about`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#page`,
      url: `${SITE_URL}/about`,
      name: "About THARROS",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbList(SITE_URL, [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ],
};

/**
 * A LABEL STATEMENT. NOT A FOUNDER'S RETROSPECTIVE.
 *
 * This page was the strongest carrier of the positioning the site has dropped.
 * It ran five chapters — "What this is", "How it is made", "Learning in
 * public", "Why the runs are small", "Where it goes" — under the title "Built
 * from the ground up", and three of the five were about manufacturing: a
 * one-room operation, patterns and samples worn until their faults showed,
 * sewing and grading being learned rather than outsourced, runs kept small
 * because that is how much can currently be made well, and bigger runs promised
 * as the making improved. Its own opening image was pattern paper and a tape
 * measure.
 *
 * Four sections now, and every one of them is about the clothes: what they are,
 * how they are cut, what the name means, and how they come out. Nothing has
 * been invented to replace what was removed — no movement, no mythology, no
 * ethics claim the label has not earned. Where there is nothing to say, the
 * page is shorter instead.
 */
const CHAPTERS = [
  {
    index: "02",
    title: "The clothes",
    body: [
      "Heavyweight jersey, brushed fleece, cotton canvas. Cut wide through the chest and shoulder, shortened through the body, with hems and cuffs ribbed tight enough to keep the volume where it was put. The weight is the point: the cloth stands away from you instead of falling against you, and the silhouette holds its shape through a day of wear.",
      "Graphics are set large or left off. Black, off white, bone, faded black — colour comes from what you put the piece with, not from the piece.",
    ],
  },
  {
    index: "03",
    title: "The name",
    body: [
      "θάρρος. Greek, and it means courage — the ordinary kind, the sort it takes to walk out of the door in something.",
    ],
  },
  {
    index: "04",
    title: "Drops",
    body: [
      "The line is released in numbered drops rather than seasons. A drop is a small, dated set of pieces, made in a short run, and it closes when the run is gone.",
      `${BRAND_LINE} A piece that sells through may return in a later drop, changed, or it may not return at all — every product page says which.`,
    ],
  },
  {
    index: "05",
    title: "What it is for",
    body: [
      "A wardrobe of a few heavy, well-proportioned things that work together and keep working. Not a catalogue. Not a season. A set of clothes that look like they came from the same eye.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro
        index="01"
        label="About"
        /* Not "THARROS". The wordmark sits centred in the header, the
           breadcrumb repeats the page title, and an h1 of the same word put
           the brand name three times in the top 200px of its own page. */
        title="The label"
        split
        lead={SUMMARY}
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <Reveal mode="mask" className="section-lead">
        <ImageSlot
          image={PAGE_FRAMES["ABT-01"]!}
          ratioSm="editorial"
          sizes="100vw"
          priority
        />
      </Reveal>

      <div className="page-frame rhythm-default">
        {/* The label sits in its own column beside the prose, so the mono index
            and the text form a spread rather than a stack — and the first
            chapter runs wider than the rest, giving the sequence a beginning
            instead of four equal steps. */}
        <div className="grid gap-x-12 gap-y-20 lg:grid-cols-12">
          {CHAPTERS.map((chapter, index) => (
              <section
                key={chapter.index}
                className={
                  index === 0
                    ? "lg:col-span-11 lg:col-start-2"
                    : "lg:col-span-9 lg:col-start-4"
                }
              >
                <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
                  {/* The rule is drawn by the element that reveals — on a
                      child it is a correct but static border. */}
                  <Reveal className="rule-draw pt-4 md:col-span-3">
                    <Parallax depth="background">
                      <p className="eyebrow">
                        <span className="num">{chapter.index}</span>
                      </p>
                      <h2 className="type-display-4 mt-4">{chapter.title}</h2>
                    </Parallax>
                  </Reveal>
                  <Reveal className="space-y-5 md:col-span-9" delay={90}>
                    {chapter.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className={
                          index === 0
                            ? "type-lead text-ink"
                            : "type-body text-ink-muted"
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </Reveal>
                </div>
              </section>
          ))}
        </div>
      </div>

      <section className="on-pale rhythm-breath">
        <div className="page-frame">
          <h2 className="type-display-2 max-w-[18ch]">{CURRENT_DROP.name}.</h2>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/drop" className="btn btn-solid">
              See the current drop
            </Link>
            <Link href="/shop" className="btn btn-outline">
              All pieces
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
