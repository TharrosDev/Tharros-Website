import AnimatedSection from "./AnimatedSection";

const pains = [
  {
    icon: "📞",
    stat: "After hours",
    headline: "Missed calls = missed revenue",
    body: "A lead that calls at 8pm and gets voicemail calls your competitor at 8:01pm. Your business loses money while you sleep.",
  },
  {
    icon: "🔁",
    stat: "Every day",
    headline: "The same questions, over and over",
    body: "\"What are your hours?\" \"Do you service my area?\" \"How much does it cost?\" Your time is worth more than answering these on repeat.",
  },
  {
    icon: "📋",
    stat: "Hours per week",
    headline: "Admin that never ends",
    body: "Booking confirmations, intake forms, follow-up emails — the paperwork that comes with running a small business quietly eats your week.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-4 text-center">The problem</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-5 max-w-3xl mx-auto leading-tight">
            Ottawa small businesses are drowning in{" "}
            <span className="accent-text">things that shouldn&apos;t need them</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-14 md:mb-16 text-base md:text-lg leading-relaxed">
            You started your business to do the work you&apos;re good at — not to
            manage an inbox, a phone, and a booking calendar at 10pm.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.headline} delay={i * 0.1}>
              <div className="clean-card p-7 md:p-8 h-full flex flex-col gap-4 group relative overflow-hidden">
                {/* Accent left stripe */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-accent-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="pl-2 group-hover:pl-4 transition-all duration-300">
                  <div className="icon-container mb-4">
                    <span aria-hidden="true">{pain.icon}</span>
                  </div>
                  <span className="section-label text-xs">{pain.stat}</span>
                  <h3 className="text-lg md:text-xl font-bold text-text mt-2 mb-2">{pain.headline}</h3>
                  <p className="text-subdued leading-relaxed text-sm">{pain.body}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
