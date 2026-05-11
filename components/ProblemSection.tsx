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
    <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">
          The problem
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-4 max-w-3xl mx-auto leading-tight">
          Ottawa small businesses are drowning in{" "}
          <span className="text-accent">things that shouldn&apos;t need them</span>
        </h2>
        <p className="text-subdued text-center max-w-xl mx-auto mb-16 text-lg">
          You started your business to do the work you&apos;re good at — not to
          manage an inbox, a phone, and a booking calendar at 10pm.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pains.map((pain, i) => (
          <AnimatedSection key={pain.headline} delay={i * 0.12}>
            <div className="rounded-2xl border border-border bg-surface p-8 h-full flex flex-col gap-4">
              <span className="text-4xl" aria-hidden>
                {pain.icon}
              </span>
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">
                {pain.stat}
              </span>
              <h3 className="text-xl font-bold text-text">{pain.headline}</h3>
              <p className="text-subdued leading-relaxed text-sm">{pain.body}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
