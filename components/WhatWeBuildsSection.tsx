import AnimatedSection from "./AnimatedSection";

const agents = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="8" fill="rgba(0,194,255,0.1)" />
        <path d="M8 20 Q16 10 24 20" stroke="#00c2ff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="16" cy="20" r="2" fill="#00c2ff" />
        <circle cx="8" cy="20" r="2" fill="#00c2ff" />
        <circle cx="24" cy="20" r="2" fill="#00c2ff" />
      </svg>
    ),
    name: "Customer Inquiry Agent",
    tagline: "Never let a question go unanswered",
    description:
      "Answers your most common questions instantly — services, pricing, availability, location — 24/7 via your website chat or a messaging channel. Escalates to you when it needs to.",
    examples: ["Plumbers", "HVAC", "Cleaning services", "Landscapers"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="8" fill="rgba(0,194,255,0.1)" />
        <rect x="8" y="10" width="16" height="12" rx="2" stroke="#00c2ff" strokeWidth="2" />
        <path d="M12 16h8M12 20h5" stroke="#00c2ff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="10" r="3" fill="#00c2ff" />
      </svg>
    ),
    name: "Lead Capture Agent",
    tagline: "Turn website visitors into booked consultations",
    description:
      "Greets visitors, asks a few smart qualifying questions, and books a call or collects contact info — automatically, while you're on the job or asleep.",
    examples: ["Lawyers", "Accountants", "Consultants", "Contractors"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="8" fill="rgba(0,194,255,0.1)" />
        <circle cx="16" cy="14" r="5" stroke="#00c2ff" strokeWidth="2" />
        <path d="M8 26c0-4.418 3.582-7 8-7s8 2.582 8 7" stroke="#00c2ff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    name: "After-Hours Intake Agent",
    tagline: "Capture every lead, even when you're off the clock",
    description:
      "Handles inbound messages after business hours, collects job details and urgency level, and sends you a clean summary first thing in the morning.",
    examples: ["Emergency trades", "Property managers", "Auto repair", "Clinics"],
  },
];

export default function WhatWeBuildsSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 text-center">
            What we build
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-4 max-w-3xl mx-auto leading-tight">
            Practical agents. Real outcomes.{" "}
            <span className="text-accent">No corporate fluff.</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-16 text-lg">
            Every agent we build is designed around one thing: the specific
            problem your business needs solved.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.name} delay={i * 0.12}>
              <div className="rounded-2xl border border-border bg-bg p-8 h-full flex flex-col gap-5">
                <div>{agent.icon}</div>
                <div>
                  <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">
                    {agent.tagline}
                  </p>
                  <h3 className="text-xl font-bold text-text mb-3">
                    {agent.name}
                  </h3>
                  <p className="text-subdued text-sm leading-relaxed">
                    {agent.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-border">
                  <p className="text-subdued text-xs font-medium mb-2">
                    Great for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {agent.examples.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-subdued"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
