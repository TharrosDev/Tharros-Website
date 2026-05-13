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
    <section id="why" className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-24 md:mb-32">

            <h2 className="text-5xl md:text-7xl xl:text-8xl font-bold text-center text-white mb-12 max-w-4xl xl:max-w-6xl mx-auto leading-[1.1] tracking-tighter">
              Built for <br className="hidden md:block" />
              <span className="text-accent-3">small businesses.</span>
            </h2>
            <p className="text-slate-300 text-center max-w-2xl xl:max-w-4xl mx-auto mb-10 md:mb-12 text-lg md:text-2xl xl:text-3xl leading-relaxed font-medium opacity-80">
              We solve operational gaps efficiently, affordably, and decisively.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 xl:gap-20 mb-16 md:mb-24">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.headline} delay={i * 0.1}>
              <div className="clean-card p-10 md:p-12 xl:p-14 h-full flex flex-col gap-8 group shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all duration-700">
                  <span aria-hidden="true" className="scale-110 md:scale-125">{pillar.icon}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl xl:text-3xl font-bold text-white tracking-tighter leading-tight group-hover:text-accent-3 transition-colors">{pillar.headline}</h3>
                  <p className="text-slate-400 text-lg xl:text-xl leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{pillar.body}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Founder quote */}
        <AnimatedSection variant="scale-in">
          <div className="max-w-xl md:max-w-3xl xl:max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 xl:p-16 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
              
              <div className="relative z-10">

                
                <p className="text-white text-xl md:text-2xl xl:text-4xl leading-[1.2] mb-10 font-bold tracking-tighter max-w-4xl mx-auto">
                  &ldquo;Ottawa small businesses don&apos;t need a corporate AI strategy. They
                  need something that <span className="text-accent-3">works on Tuesday morning</span> when the phone
                  won&apos;t stop ringing.&rdquo;
                </p>
                
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-950 font-black text-xl shadow-2xl">
                    M
                  </div>
                  <div>
                    <p className="text-white text-lg font-bold tracking-tight">
                      Magnus Abdelnour
                    </p>
                    <p className="text-accent-3 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Founder // Tharros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

  );
}
