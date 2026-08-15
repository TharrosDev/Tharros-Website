import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/media/ImageSlot";
import Reveal from "@/components/ui/Reveal";
import { CURRENT_DROP } from "@/lib/catalog/drops";

export const metadata: Metadata = {
  title: "About",
  description:
    "THARROS is an independent streetwear label built from the ground up — designed, patterned and sampled in-house, released in small runs.",
  alternates: { canonical: "/about" },
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
      <div
        className="page-frame"
        style={{ paddingTop: "calc(var(--header-h) + 3.5rem)" }}
      >
        <div className="border-t border-ink pt-4">
          <p className="eyebrow">
            <span className="num">01</span>
            <span>The label</span>
          </p>
        </div>

        <h1 className="type-display-1 mt-10 max-w-[13ch]">Built from the ground up.</h1>

        <p className="type-lead mt-8 max-w-2xl">
          An independent streetwear label making small runs of original pieces — designed,
          patterned and sampled in-house, then made in numbers small enough to count.
        </p>
      </div>

      <Reveal className="mt-16">
        <ImageSlot
          image={{
            code: "ABT-01",
            alt: "Work table with patterns, a part-sewn sample and fabric",
            kind: "detail",
            ratio: "wide",
          }}
          sizes="100vw"
        />
      </Reveal>

      <div className="page-frame rhythm-default">
        <div className="grid gap-x-12 gap-y-20 lg:grid-cols-12">
          {CHAPTERS.map((chapter) => (
            <Reveal key={chapter.index} className="lg:col-span-8 lg:col-start-4">
              <div className="border-t border-ink pt-4">
                <p className="eyebrow">
                  <span className="num">{chapter.index}</span>
                  <span>{chapter.title}</span>
                </p>
              </div>
              <div className="mt-8 space-y-5">
                {chapter.body.map((paragraph) => (
                  <p key={paragraph} className="type-lead text-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <section className="on-dark rhythm-breath">
        <div className="page-frame">
          <p className="type-display-2 max-w-[18ch]">Designed, tested, refined.</p>
          <p className="type-body mt-8 max-w-lg text-ink-on-dark-muted">
            {CURRENT_DROP.name} is where it starts. Everything it taught is already going
            into the next one.
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
