import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

const pains = [
  {
    num: "01",
    when: "After hours",
    headline: "Missed calls become missed revenue.",
    body: "A lead that calls at 8pm and gets voicemail calls your competitor at 8:01pm.",
  },
  {
    num: "02",
    when: "Every day",
    headline: "The same questions, on repeat.",
    body: "Hours. Service area. Pricing. Your time is worth more than answering those one at a time.",
  },
  {
    num: "03",
    when: "Hours per week",
    headline: "Admin that never ends.",
    body: "Inquiry triage, intake forms, follow-up emails: the paperwork quietly eats your week.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="rhythm-default bg-[color:var(--surface-alt)] border-t border-[color:var(--rule)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 01" label="The problem" className="mb-[1.8rem]" />

        <AnimatedSection className="grid gap-[0.54rem] mb-[2.1rem]">
          <h2 className="type-display-2 max-w-[16ch]">
            Ottawa businesses are bleeding <span className="text-[color:var(--accent)]">time.</span>
          </h2>
          <p className="type-body text-[color:var(--ink-muted)] max-w-[50ch]">
            You don&apos;t need another vendor. You need a modern site, an embedded agent, and a
            number you can call when things change.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <ol className="grid grid-cols-1 md:grid-cols-3 border-t border-[color:var(--rule)]">
            {pains.map((pain, i) => (
              <li
                key={pain.num}
                className={`group py-[1.35rem] px-0 md:px-[1.05rem] border-[color:var(--rule)] ${
                  i > 0 ? "border-t md:border-t-0 md:border-l" : ""
                } ${i === 0 ? "md:pl-0" : ""}`}
              >
                <span className="num block text-[1.35rem] leading-none text-[color:var(--ink)] transition-colors group-hover:text-[color:var(--accent)]">
                  {pain.num}
                </span>
                <span className="type-meta block mt-[0.85rem] text-[color:var(--ink-faint)]">{pain.when}</span>
                <h3 className="type-display-3 mt-[0.9rem]">{pain.headline}</h3>
                <p className="type-body text-[color:var(--ink-muted)] mt-[0.9rem]">{pain.body}</p>
              </li>
            ))}
          </ol>
        </AnimatedSection>
      </div>
    </section>
  );
}
