import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ImageSlot from "@/components/media/ImageSlot";

const STEPS = [
  {
    index: "01",
    name: "Design",
    body: "A shape gets drawn, argued with, and drawn again before anything is cut.",
  },
  {
    index: "02",
    name: "Pattern",
    body: "The drawing becomes a pattern. Most of the work — and most of the mistakes — happen here.",
  },
  {
    index: "03",
    name: "Sample",
    body: "One piece is made and worn. Some patterns survive this. Several have not.",
  },
  {
    index: "04",
    name: "Refine",
    body: "Length, shoulder, hem, weight. The changes are small and they take the longest.",
  },
  {
    index: "05",
    name: "Release",
    body: "A short run is made and goes out. What it teaches goes into the next drop.",
  },
];

/**
 * The process is the differentiator, so it gets a section rather than a line
 * in the About page.
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
          index="04"
          label="The process"
          title="Every piece gets made twice before it gets made properly."
          aside="Designed, tested, refined"
        />

        <div className="section-lead grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {/* Bounded, per the sticky rule: on a short screen it scrolls its own
              overflow rather than hiding its own bottom off the viewport. */}
          <Reveal className="order-2 lg:order-1 lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:max-h-[calc(100svh-var(--header-h)-5rem)] lg:self-start lg:overflow-y-auto">
            <ImageSlot
              image={{
                code: "PRC-01",
                alt: "A pattern piece and a part-sewn sample on a work table",
                kind: "detail",
                ratio: "square",
              }}
              ratioSm="editorial"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </Reveal>

          <ol className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            {STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.index}
                delay={i * 70}
                className="grid grid-cols-[3rem_1fr] gap-x-6 border-b border-rule py-8 last:border-b-0"
              >
                <span className="num type-meta pt-1 text-ink-faint">{step.index}</span>
                <div>
                  <h3 className="type-display-4">{step.name}</h3>
                  <p className="type-body-sm mt-2 text-ink-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
