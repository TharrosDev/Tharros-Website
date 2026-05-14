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
    body: "We know Kanata trades companies and Centretown law offices. Our training is rooted in local context, local pricing questions, and the real shape of small business in this city.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    headline: "Training, not handoff",
    body: "Most agencies hand you a black box and a recurring invoice. We train you through every setup decision. When we leave, your agent stays, and so does your team's ability to change it.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-3">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    headline: "No-code setup",
    body: "You don't need to be technical. We train on no-code platforms and plain-English prompts. If you can describe how your business works, you can set up your agent. We sit beside you while you do it.",
  },
];

export default function WhyTharrosSection() {
  return (
    <section className="section-padding px-6 md:px-12 xl:px-20 relative overflow-hidden bg-slate-950 industrial-grid">
      <div id="why" className="absolute top-16 md:top-24 xl:top-32 pointer-events-none" />
      {/* Background Sophistication */}
      <div className="scanline" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl xl:max-w-[90rem] 3xl:max-w-[120rem] 4xl:max-w-[140rem] mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col items-center mb-12 md:mb-16 3xl:mb-24">

            <h2 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-center text-white mb-10 md:mb-12 3xl:mb-16 max-w-4xl xl:max-w-6xl 3xl:max-w-[100rem] mx-auto leading-[1.2] tracking-tighter">
              Training built for <br className="hidden md:block" />
              <span className="text-accent-3">small business owners.</span>
            </h2>
            <p className="text-slate-300 text-center max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto mb-10 md:mb-12 3xl:mb-20 text-lg md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl leading-relaxed font-medium opacity-80">
              Keep it Local, Keep it Canadian. We close the AI skill gap on your team, efficiently, affordably, and without lock-in.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 xl:gap-12 3xl:gap-20 mb-12 md:mb-16 3xl:mb-32">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.headline} delay={i * 0.1}>
              <div className="clean-card h-full flex flex-col gap-6 md:gap-8 3xl:gap-12 group shadow-2xl relative overflow-hidden 3xl:p-16 4xl:p-20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-3/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 3xl:w-24 3xl:h-24 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all duration-700">
                  <span aria-hidden="true" className="scale-110 md:scale-125 3xl:scale-[2]">{pillar.icon}</span>
                </div>
                <div className="flex flex-col gap-4 3xl:gap-8">
                  <h3 className="text-2xl xl:text-3xl 3xl:text-5xl font-bold text-white tracking-tighter leading-tight group-hover:text-accent-3 transition-colors">{pillar.headline}</h3>
                  <p className="text-slate-400 text-lg xl:text-xl 3xl:text-3xl leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{pillar.body}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Founder quote */}
        <AnimatedSection variant="scale-in">
          <div className="max-w-5xl md:max-w-6xl xl:max-w-[80rem] 3xl:max-w-[110rem] 4xl:max-w-[130rem] mx-auto">
            <div className="bg-slate-900 border border-slate-800 hover:border-accent-3/50 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] 3xl:rounded-[5rem] px-6 py-8 md:px-20 md:py-12 3xl:px-32 3xl:py-24 text-center relative overflow-hidden group shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px] 3xl:[background-size:64px_64px]" />
              
              <div className="relative z-10">
                <p className="text-white text-lg md:text-xl xl:text-2xl 3xl:text-4xl 4xl:text-5xl leading-[1.2] mb-6 3xl:mb-12 font-bold tracking-tighter max-w-5xl 3xl:max-w-[90rem] mx-auto">
                  &ldquo;Ottawa small businesses don&apos;t need another agency. They need
                  someone who&apos;ll <span className="text-accent-3">sit beside them on Tuesday morning</span> and train
                  them to set the thing up themselves.&rdquo;
                </p>
                
                <div className="flex flex-col items-center justify-center gap-3 3xl:gap-6">
                  <div className="w-10 h-10 3xl:w-20 3xl:h-20 rounded-full bg-white flex items-center justify-center text-slate-950 font-black text-base 3xl:text-3xl shadow-2xl transition-transform group-hover:scale-110">
                    M
                  </div>
                  <div>
                    <p className="text-white text-sm 3xl:text-2xl font-bold tracking-tight">
                      Magnus Abdelnour
                    </p>
                    <p className="text-accent-3 text-[8px] 3xl:text-xs font-black uppercase tracking-[0.3em] mt-0.5">Founder | Tharros</p>
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
