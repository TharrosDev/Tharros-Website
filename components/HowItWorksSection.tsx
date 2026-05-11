import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    headline: "Consult",
    body: "We spend 30 minutes understanding your business, your biggest time drains, and which repetitive conversations are costing you the most. No sales pitch — just listening.",
  },
  {
    number: "02",
    headline: "Build",
    body: "We build and configure your agent in 3–5 days. You review it, request changes, and we refine until it sounds exactly like your business. No code on your end.",
  },
  {
    number: "03",
    headline: "Launch",
    body: "We deploy it to your website or messaging channel. We monitor the first two weeks, tune responses, and hand you a system that runs itself.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      <AnimatedSection>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">
          How it works
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-4 max-w-3xl mx-auto leading-tight">
          From conversation to{" "}
          <span className="text-accent">live in under a week</span>
        </h2>
        <p className="text-subdued text-center max-w-xl mx-auto mb-16 text-lg">
          Three steps. No jargon. No six-week enterprise rollout.
        </p>
      </AnimatedSection>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <AnimatedSection key={step.number} delay={i * 0.15}>
            <div className="flex flex-col items-center text-center md:px-8">
              <div className="w-20 h-20 rounded-full border-2 border-accent bg-bg flex items-center justify-center mb-6">
                <span className="text-accent font-bold text-2xl">
                  {step.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">
                {step.headline}
              </h3>
              <p className="text-subdued text-sm leading-relaxed">{step.body}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
