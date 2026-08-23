import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageSlot from "@/components/media/ImageSlot";
import { STUDIO_STAGES } from "@/lib/catalog/studio";

/**
 * The studio, in summary — the section that sends you to the page.
 *
 * The six stages live in `lib/catalog/studio.ts` rather than in this file, so
 * the process is data like everything else on the site. There was a `/studio`
 * page that documented them at length; it was cut, and this is now the only
 * place the sequence is stated. Each stage's `short` line is what shows here —
 * `long` is kept in the data for whatever states it next.
 *
 * It is built as a sticky two-column story: the frame holds while the five
 * steps travel past it. That is the difference between this and the campaign
 * section immediately above — before, both were a picture beside a column, two
 * sections running, which is the one thing the rhythm rule asks you not to do.
 *
 * The order flips below `lg`. Stacked, a full-width 4:5 frame ahead of the list
 * spent a whole screen on the illustration before the content it illustrates,
 * so on a phone the steps come first and the frame closes the section.
 */
export default function ProcessSection() {
  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <SectionHeading
          index="03"
          label="The studio"
          aside="Designed, tested, refined"
          title="Every piece gets made twice before it gets made properly."
        />

        <div className="section-lead grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* Bounded, per the sticky rule: on a short screen it scrolls its own
              overflow rather than hiding its own bottom off the viewport. */}
          <Reveal mode="mask" className="order-2 lg:order-1 lg:col-span-6 lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:max-h-[calc(100svh-var(--header-h)-5rem)] lg:self-start lg:overflow-y-auto">
            <ImageSlot
              image={{
                code: "PRC-01",
                alt: "A pattern piece and a part-sewn sample on a work table",
                kind: "detail",
                ratio: "portrait",
              }}
              ratio="portrait"
              ratioSm="tall"
              sizes="(min-width: 1024px) min(48vw, 680px), 100vw"
            />
          </Reveal>

          <ol className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            {STUDIO_STAGES.map((step, i) => (
              <Reveal
                as="li"
                key={step.index}
                delay={i * 70}
                className="grid grid-cols-[3rem_1fr] gap-x-6 border-b border-rule py-8 last:border-b-0"
              >
                <span className="num type-meta pt-1 text-ink-faint">{step.index}</span>
                <div>
                  <h3 className="type-display-4">{step.name}</h3>
                  <p className="type-body-sm mt-2 text-ink-muted">{step.short}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
