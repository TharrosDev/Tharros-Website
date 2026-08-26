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
 * A LABEL STATEMENT, AND IT ANSWERS THREE QUESTIONS.
 *
 * What the clothes are, what the name means, and how they come out. That is
 * the whole page. There is no manifesto section, no founder history, no ethics
 * claim the label has not earned and no philosophy about what the name implies
 * — θάρρος means courage, and the name carries that on its own without a
 * sentence explaining what courage is for. Where there is nothing to say the
 * page is shorter instead.
 */
const CHAPTERS = [
  {
    title: "The clothes",
    body: [
      "Heavyweight jersey, brushed fleece, cotton canvas. Cut wide through the chest and shoulder, shortened through the body, with hems and cuffs ribbed tight enough to keep the volume where it was put. The weight is the point: the cloth stands away from you instead of falling against you, and the silhouette holds its shape through a day of wear.",
      "Graphics are set large or left off. Black, off white, bone, faded black — colour comes from what you put the piece with, not from the piece.",
    ],
  },
  {
    title: "The name",
    body: ["θάρρος. Greek. It means courage."],
  },
  {
    title: "Drops",
    body: [
      "The line is released in numbered drops rather than seasons. A drop is a small, dated set of pieces, made in a short run, and it closes when the run is gone.",
      `${BRAND_LINE} A piece that sells through may return in a later drop, changed, or it may not return at all — every product page says which.`,
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
        {/* The title sits in its own column beside the prose, so the two form
            a spread rather than a stack. The first chapter runs wider than the
            rest, giving the sequence a beginning instead of three equal steps.

            NO MONO NUMERALS HERE. Three sections on one page do not need to be
            counted, and a numeral that adds nothing to orientation is
            decoration. */}
        <div className="grid gap-x-12 gap-y-20 lg:grid-cols-12">
          {CHAPTERS.map((chapter, index) => (
              <section
                key={chapter.title}
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
                      <h2 className="type-display-4">{chapter.title}</h2>
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
          <h2 className="type-display-2 max-w-[18ch]">{CURRENT_DROP.statement}</h2>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/drop" className="btn btn-solid">
              Shop {CURRENT_DROP.name}
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
