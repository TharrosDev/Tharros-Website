import AnimatedSection from "./AnimatedSection";

const pillars = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
        <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2c0 7.3 8 11.8 8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    headline: "Ottawa-local",
    body: "We know Kanata trades companies and Centretown law offices. We build agents that understand local context, local pricing questions, and local service areas.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    headline: "Fast turnaround",
    body: "Most agencies quote 6-8 weeks. We ship in 1-2 weeks. Because a small business owner waiting two months for an AI chat widget is a small business owner bleeding leads.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    headline: "No code required",
    body: "You don't touch a line of code. You don't manage a dashboard. You approve the agent's responses in plain English and we handle the rest.",
  },
];

export default function WhyTharrosSection() {
  return (
    <section id="why" className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-6 text-center">Why Tharros</p>
          <h2 className="text-4xl md:text-6xl xl:text-7xl font-bold text-center text-text mb-8 max-w-4xl xl:max-w-5xl mx-auto leading-[1.1] tracking-tight">
            Built for <span className="accent-text">small businesses</span>
          </h2>
          <p className="text-subdued text-center max-w-2xl xl:max-w-3xl mx-auto mb-10 md:mb-24 text-lg md:text-xl xl:text-2xl leading-relaxed">
            We solve specific problems for your business, affordably, and
            efficiently.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-16">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.headline}>
              <div className="clean-card p-5 md:p-6 xl:p-8 h-full flex flex-col gap-5 group hover:shadow-xl hover:border-accent-3/20 transition-all duration-500">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-accent-3/10 group-hover:text-accent-3 transition-colors duration-500">
                  <span aria-hidden="true" className="scale-90 md:scale-100">{pillar.icon}</span>
                </div>
                <h3 className="text-base md:text-lg xl:text-xl font-bold text-text leading-tight">{pillar.headline}</h3>
                <p className="text-subdued text-[13px] md:text-sm xl:text-base leading-relaxed">{pillar.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Founder quote */}
        <AnimatedSection variant="scale-in">
          <div className="max-w-2xl md:max-w-3xl xl:max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-[1.2rem] md:rounded-[2rem] p-6 md:p-10 xl:p-16 text-center relative overflow-hidden shadow-xl">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
              
              <p className="text-accent-3 text-4xl mb-4 leading-none select-none opacity-50" aria-hidden="true">
                &ldquo;
              </p>
              <p className="text-white text-base md:text-xl xl:text-2xl leading-[1.5] mb-8 font-medium max-w-2xl mx-auto relative z-10 tracking-tight">
                Ottawa small businesses don&apos;t need a corporate AI strategy. They
                need something that works on Tuesday morning when the phone
                won&apos;t stop ringing.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-sm shadow-lg">
                  M
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-tight">
                    Magnus Abdelnour
                  </p>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Founder, Tharros</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
