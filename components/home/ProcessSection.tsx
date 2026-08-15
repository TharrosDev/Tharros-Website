import Reveal from "@/components/ui/Reveal";
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
 * in the About page. Type-led on purpose — this is a statement, not a tutorial.
 */
export default function ProcessSection() {
  return (
    <section className="rhythm-default">
      <div className="page-frame">
        <div className="flex items-baseline justify-between gap-6 border-t border-ink pt-4">
          <p className="eyebrow">
            <span className="num">03</span>
            <span>The Process</span>
          </p>
          <p className="type-meta hidden text-ink-faint md:block">
            Designed, tested, refined
          </p>
        </div>

        <h2 className="type-display-3 mt-8 max-w-[24ch]">
          Every piece gets made twice before it gets made properly.
        </h2>

        <div className="mt-16 grid gap-x-6 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <ImageSlot
              image={{
                code: "PRC-01",
                alt: "A pattern piece and a part-sewn sample on a work table",
                kind: "detail",
                ratio: "editorial",
              }}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </Reveal>

          <ol className="lg:col-span-6 lg:col-start-7 lg:self-center">
            {STEPS.map((step) => (
              <li
                key={step.index}
                className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-rule py-5 last:border-b-0"
              >
                <span className="num type-meta pt-1 text-ink-faint">{step.index}</span>
                <div>
                  <h3 className="type-display-4">{step.name}</h3>
                  <p className="type-body-sm mt-2 text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
