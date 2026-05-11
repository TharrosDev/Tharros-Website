import AnimatedSection from "./AnimatedSection";

const pillars = [
  {
    icon: "🇨🇦",
    headline: "Ottawa-local",
    body: "We know Kanata trades companies and Centretown law offices. We build agents that understand local context, local pricing questions, and local service areas.",
  },
  {
    icon: "⚡",
    headline: "Fast turnaround",
    body: "Most agencies quote 6–8 weeks. We ship in 3–5 days. Because a small business owner waiting two months for an AI chat widget is a small business owner bleeding leads.",
  },
  {
    icon: "🔧",
    headline: "No code required",
    body: "You don't touch a line of code. You don't manage a dashboard. You approve the agent's responses in plain English and we handle the rest.",
  },
];

export default function WhyTharrosSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">
            Why Tharros
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-4 max-w-3xl mx-auto leading-tight">
            Built for small businesses,{" "}
            <span className="text-accent">not enterprise teams</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-16 text-lg">
            Corporate AI vendors want to sell you a platform. We want to solve
            one specific problem for your business, affordably, this week.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.headline} delay={i * 0.12}>
              <div className="rounded-2xl border border-border bg-bg p-8 h-full flex flex-col gap-4">
                <span className="text-4xl" aria-hidden>
                  {pillar.icon}
                </span>
                <h3 className="text-xl font-bold text-text">
                  {pillar.headline}
                </h3>
                <p className="text-subdued text-sm leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl border border-accent/20 bg-bg p-10 max-w-3xl mx-auto text-center">
            <p className="text-accent text-3xl mb-4" aria-hidden>
              &ldquo;
            </p>
            <p className="text-text text-lg md:text-xl leading-relaxed mb-6 font-medium">
              Ottawa small businesses don&apos;t need a corporate AI strategy. They
              need something that works on Tuesday morning when the phone
              won&apos;t stop ringing.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                T
              </div>
              <div className="text-left">
                <p className="text-text text-sm font-semibold">
                  Magnus Abdelnour
                </p>
                <p className="text-subdued text-xs">Founder, Tharros</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
