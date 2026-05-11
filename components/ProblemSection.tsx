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
    <section id="problem" className="py-28 px-6 md:px-12 relative">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(99,102,241,0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-4 text-center">The problem</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-5 max-w-3xl mx-auto leading-tight">
            Ottawa small businesses are drowning in{" "}
            <span className="gradient-text">things that shouldn&apos;t need them</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-16 text-lg leading-relaxed">
            You started your business to do the work you&apos;re good at — not to
            manage an inbox, a phone, and a booking calendar at 10pm.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <AnimatedSection key={pain.headline} delay={i * 0.12}>
              <div className="glass-card p-8 h-full flex flex-col gap-4 group relative overflow-hidden">
                {/* Accent left stripe */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-gradient-to-b from-accent via-accent-2 to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />

                <div className="pl-3">
                  <div className="icon-container mb-4">
                    <span className="text-2xl">{pain.icon}</span>
                  </div>
                  <span className="section-label text-xs">{pain.stat}</span>
                  <h3 className="text-xl font-bold text-text mt-2 mb-3">{pain.headline}</h3>
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
