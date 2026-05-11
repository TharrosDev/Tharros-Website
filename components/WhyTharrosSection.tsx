import AnimatedSection from "./AnimatedSection";

const pillars = [
  {
    icon: "🍁",
    headline: "Ottawa-local",
    body: "We know Kanata trades companies and Centretown law offices. We build agents that understand local context, local pricing questions, and local service areas.",
  },
  {
    icon: "⚡",
    headline: "Fast turnaround",
    body: "Most agencies quote 6–8 weeks. We ship in 1–2 weeks. Because a small business owner waiting two months for an AI chat widget is a small business owner bleeding leads.",
  },
  {
    icon: "🔧",
    headline: "No code required",
    body: "You don't touch a line of code. You don't manage a dashboard. You approve the agent's responses in plain English and we handle the rest.",
  },
];

export default function WhyTharrosSection() {
  return (
    <section id="why" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-4 text-center">Why Tharros</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-5 max-w-3xl mx-auto leading-tight">
            Built for small businesses,{" "}
            <span className="accent-text">not enterprise teams</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-14 md:mb-16 text-base md:text-lg leading-relaxed">
            Corporate AI vendors want to sell you a platform. We want to solve
            one specific problem for your business, affordably, within the week.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-14 md:mb-16">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.headline} delay={i * 0.1}>
              <div className="clean-card p-7 md:p-8 h-full flex flex-col gap-4 group">
                <div className="icon-container">
                  <span aria-hidden="true">{pillar.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text">{pillar.headline}</h3>
                <p className="text-subdued text-sm leading-relaxed">{pillar.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Founder quote */}
        <AnimatedSection delay={0.15} variant="scale-in">
          <div className="max-w-3xl mx-auto">
            <div className="clean-card p-8 md:p-10 text-center border-accent-3/20">
              <p className="text-accent-3 text-4xl mb-4 leading-none" aria-hidden="true">
                &ldquo;
              </p>
              <p className="text-text text-base md:text-xl leading-relaxed mb-8 font-medium max-w-2xl mx-auto">
                Ottawa small businesses don&apos;t need a corporate AI strategy. They
                need something that works on Tuesday morning when the phone
                won&apos;t stop ringing.
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <div className="text-left">
                  <p className="text-text text-sm font-semibold">
                    Magnus Abdelnour
                  </p>
                  <p className="text-subdued text-xs">Founder, Tharros</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
