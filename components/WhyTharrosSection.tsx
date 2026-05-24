import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

const pillars = [
  {
    num: "01",
    label: "Ottawa-local",
    body: "We know Kanata trades companies and Centretown law offices. The site and the agent are tuned to local context, local pricing questions, and the real shape of small business in this city.",
  },
  {
    num: "02",
    label: "One team, end-to-end",
    body: "One team handles your website, your AI agent, and the integrations between them. We work across a diversified stack of tools, coordinated under a single point of contact. No handoffs, no finger-pointing between vendors.",
  },
  {
    num: "03",
    label: "A number you can call",
    body: "Pick the On-Call retainer and we're on a flat monthly fee for fixes, improvements, and unlimited new agents. Skip the retainer and pay per call. Either way, you reach a person.",
  },
];

export default function WhyTharrosSection() {
  return (
    <section id="why" className="rhythm-breath bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 03" label="Why Tharros" tone="dark" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-12 md:mb-16">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 text-[color:var(--ink-on-dark)] max-w-[18ch]">
              Built for small <br className="hidden md:block" />
              <span className="text-[color:var(--accent-on-dark)]">business owners.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:self-end lg:pb-2">
            <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[42ch]">
              Keep it Local, Keep it Canadian.
            </p>
          </AnimatedSection>
        </div>

        {/* Triptych: three poster panels, oversized faint numerals */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[color:var(--rule-on-dark)]">
          {pillars.map((p, i) => (
            <AnimatedSection
              key={p.num}
              delay={i * 0.1}
              className="relative py-10 md:py-14 md:px-8 md:first:pl-0 md:last:pr-0 border-b md:border-b-0 md:border-l first:border-l-0 border-[color:var(--rule-on-dark)]"
            >
              <span
                className="num block leading-none text-[color:var(--accent-on-dark)] opacity-25 select-none"
                style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}
                aria-hidden="true"
              >
                {p.num}
              </span>
              <h3 className="type-display-3 text-[color:var(--ink-on-dark)] mt-5 mb-4">{p.label}</h3>
              <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[42ch]">{p.body}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
