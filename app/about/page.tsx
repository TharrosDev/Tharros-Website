import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import PageIntro from "@/components/layout/PageIntro";
import { CURRENT_DROP } from "@/lib/catalog/drops";
import { SITE_URL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About",
  description:
    "THARROS is an independent streetwear label built from the ground up — designed, patterned and sampled in-house, released in small runs.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    title: "About THARROS",
    description:
      "An independent streetwear label built from the ground up — designed, patterned and sampled in-house, released in small runs.",
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

const CHAPTERS = [
  {
    index: "02",
    title: "What this is",
    body: [
      "THARROS is an independent clothing label. Not a studio with a factory behind it — a small operation where the designing, patterning and sampling happen in one room, and a run of twenty is a real number rather than a marketing device.",
      "The name is Greek: θάρρος, courage. It is on the label because putting something you made in front of people is the part that takes nerve.",
    ],
  },
  {
    index: "03",
    title: "How it is made",
    body: [
      "Each piece starts as a shape worth arguing about, becomes a pattern, then a sample that gets worn until its faults show. Most of the work is in the second and third attempt: the shoulder that sat wrong, the hem two centimetres too long, the fabric that looked right and moved badly.",
      "What survives that gets made in a short run. What does not gets cut up and used to make the next pattern.",
    ],
  },
  {
    index: "04",
    title: "Learning in public",
    body: [
      "The craft is being built alongside the label. Sewing, construction, grading, fit — these are being learned properly rather than outsourced and forgotten, and each drop is measurably better made than the one before it.",
      "That is not a disclaimer. It is the most interesting thing about a young label: you can watch it get good.",
    ],
  },
  {
    index: "05",
    title: "Why the runs are small",
    body: [
      "Because that is genuinely how much can be made well right now. Not to manufacture urgency, and not to imply exclusivity that has not been earned.",
      "Every product page prints how many were made and how many are left. When a size is gone it is gone, and the site says so plainly instead of dressing it up.",
    ],
  },
  {
    index: "06",
    title: "Where it goes",
    body: [
      "Drops get bigger as the making gets better. More pieces, more ambitious construction, fabric chosen rather than settled for.",
      "The ambition is not small. The current operation is. Both of those things are true at once, and the site is not going to pretend otherwise.",
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
        label="The label"
        title="Built from the ground up."
        lead="An independent streetwear label making small runs of original pieces — designed, patterned and sampled in-house, then made in numbers small enough to count."
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <Reveal className="section-lead">
        <ImageSlot
          image={{
            code: "ABT-01",
            alt: "Work table with patterns, a part-sewn sample and fabric",
            kind: "detail",
            ratio: "wide",
          }}
          ratioSm="editorial"
          sizes="100vw"
        />
      </Reveal>

      <div className="page-frame rhythm-default">
        {/* The chapters used to sit at an identical indent, which turned the
            page into one long ladder of the same shape repeated five times.
            The label sits in its own column beside the prose instead, so the
            mono index and the text form a spread rather than a stack — and the
            first chapter runs wider than the rest, giving the sequence a
            beginning instead of five equal steps. */}
        <div className="grid gap-x-12 gap-y-20 lg:grid-cols-12">
          {CHAPTERS.map((chapter, index) => (
            <Fragment key={chapter.index}>
              {/* One picture partway down, so a page of five prose chapters has
                  somewhere to breathe — and so the label's own page shows the
                  people it keeps talking about. */}
              {index === 3 ? (
                <Reveal className="lg:col-span-10 lg:col-start-2">
                  <ImageSlot
                    image={{
                      code: "ABT-02",
                      alt: "Two figures in Drop 001 on the street the label works from",
                      kind: "campaign",
                      ratio: "campaign",
                    }}
                    ratioSm="editorial"
                    sizes="(min-width: 1024px) 80vw, 100vw"
                  />
                </Reveal>
              ) : null}

              {/* The chapter title is a real h2. Five numbered chapters used to
                  carry their titles inside a mono eyebrow, so the label's own
                  page had one heading in it. And the rule is drawn by the
                  element that reveals — on a child it is static, which is what
                  it was. */}
              <section
                className={
                  index === 0
                    ? "lg:col-span-11 lg:col-start-2"
                    : "lg:col-span-9 lg:col-start-4"
                }
              >
                <div className="grid gap-x-10 gap-y-6 md:grid-cols-12">
                  <Reveal className="rule-draw pt-4 md:col-span-3">
                    <p className="eyebrow">
                      <span className="num">{chapter.index}</span>
                    </p>
                    <h2 className="type-display-4 mt-4">{chapter.title}</h2>
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
            </Fragment>
          ))}
        </div>
      </div>

      <section className="on-dark rhythm-breath">
        <div className="page-frame">
          <h2 className="type-display-2 max-w-[18ch]">
            Designed, tested, refined.
          </h2>
          <p className="type-body mt-8 max-w-lg text-ink-on-dark-muted">
            {CURRENT_DROP.name} is where it starts. Everything it taught is
            already going into the next one.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/drop" className="btn btn-inverse">
              See the current drop
            </Link>
            <Link href="/journal" className="btn btn-outline-on-dark">
              Read the journal
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
