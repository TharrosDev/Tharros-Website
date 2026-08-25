import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SplitLines from "@/components/motion/SplitLines";
import Magnetic from "@/components/motion/Magnetic";
import { NEXT_DROP, NO_DATE_NOTE } from "@/lib/catalog/drops";

/**
 * What is coming, stated without a date — because there isn't one.
 *
 * This closes the page on the drop it opened with, so the whole home page is
 * bracketed by the release cycle rather than by a hero and a social grid. If
 * there is no drop in development the section does not render at all; an empty
 * "coming soon" would be exactly the invented anticipation the content rules
 * forbid.
 */
export default function NextDrop() {
  if (!NEXT_DROP) return null;

  return (
    <section className="on-pale rhythm-breath">
      <div className="page-frame">
        {/* The index in this row is the section's place on the page, not the
            drop's number — printing "002" here put a second numbering series in
            the same column as 01…05 and read as a step backwards. The drop's own
            name carries its number, and the accent moves to the state it marks:
            oxide means in development, which is what this section is. */}
        <Reveal className="rule-draw flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
          <p className="eyebrow">
            <span className="num">06</span>
            <span>{NEXT_DROP.name}</span>
          </p>
          <p className="type-meta text-signal">In development</p>
        </Reveal>

        {/* Same interval as SectionHeading's title, hand-rolled because this
            opener carries a state mark rather than a link.

            Split, because this is the last statement on the page and the one
            the visitor leaves on. The home page spends the gesture twice: on
            what the label is (02) and on what is coming (06). */}
        <SplitLines
          as="h2"
          text={NEXT_DROP.statement}
          className="type-display-2 mt-10 max-w-[16ch] md:mt-12"
        />

        <div className="section-lead grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <Reveal mode="wipe" className="space-y-5 lg:col-span-6">
            {NEXT_DROP.body.map((paragraph) => (
              <p key={paragraph} className="type-body text-ink-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="type-meta text-ink-faint">{NO_DATE_NOTE}</p>
            <Magnetic className="mt-8">
              <Link href="/drop" className="btn btn-outline">
                Follow the build
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
