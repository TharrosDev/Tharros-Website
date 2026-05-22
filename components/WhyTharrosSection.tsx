import AnimatedSection from "./AnimatedSection";

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
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">§ 05</span>
            <span className="h-px w-8 bg-[color:var(--rule-on-dark-strong)]" />
            <span className="type-meta-strong text-[color:var(--ink-on-dark-muted)]">Why Tharros</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-12 gap-x-6 gap-y-4 mb-16 md:mb-20">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h2 className="type-display-2 text-[color:var(--ink-on-dark)] max-w-[18ch]">
              Built for small <br className="hidden md:block" />
              <span className="text-[color:var(--accent-on-dark)]">business owners.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:pt-2">
            <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[42ch]">
              Keep it Local, Keep it Canadian. End-to-end web and AI, with a number you can actually call.
            </p>
          </AnimatedSection>
        </div>

        <div className="border-t border-[color:var(--rule-on-dark)] mb-16 md:mb-24">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.num} delay={i * 0.08}>
              <div className="grid grid-cols-12 gap-x-6 py-10 md:py-14 border-b border-[color:var(--rule-on-dark)] items-start">
                <div className="col-span-12 md:col-span-1">
                  <span className="num text-sm text-[color:var(--ink-on-dark-muted)]">{p.num}</span>
                </div>
                <h3 className="col-span-12 md:col-span-4 type-display-3 text-[color:var(--ink-on-dark)] mt-3 md:mt-0">
                  {p.label}
                </h3>
                <p className="col-span-12 md:col-span-7 type-body text-[color:var(--ink-on-dark-muted)] mt-3 md:mt-0 max-w-[60ch]">
                  {p.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Founder line — no portrait, treated as a quoted manifesto */}
        <AnimatedSection delay={0.1}>
          <figure className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 md:col-span-2 flex md:flex-col items-center md:items-start gap-4 md:gap-2 mb-6 md:mb-0">
              <div className="w-12 h-12 border border-[color:var(--rule-on-dark-strong)] flex items-center justify-center">
                <span className="num text-base text-[color:var(--accent-on-dark)]">M</span>
              </div>
              <div className="flex flex-col">
                <span className="type-meta text-[color:var(--ink-on-dark)]">Magnus Abdelnour</span>
                <span className="type-meta text-[color:var(--ink-on-dark-muted)]">Founder</span>
              </div>
            </div>
            <blockquote className="col-span-12 md:col-span-10 md:pl-8 md:border-l md:border-[color:var(--rule-on-dark)]">
              <p className="type-display-3 text-[color:var(--ink-on-dark)] max-w-[28ch]">
                &ldquo;Ottawa small businesses don&apos;t need another agency. They need one number
                to call when the site is broken, the <span className="text-[color:var(--accent-on-dark)]">agent needs tweaking</span>,
                or a new one needs to exist by Friday.&rdquo;
              </p>
            </blockquote>
          </figure>
        </AnimatedSection>
      </div>
    </section>
  );
}
