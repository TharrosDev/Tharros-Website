import AnimatedSection from "./AnimatedSection";

const agents = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 18 Q14 6 24 18" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="14" cy="18" r="2.5" fill="#1e293b" />
        <circle cx="4" cy="18" r="2" fill="#3b82f6" />
        <circle cx="24" cy="18" r="2" fill="#3b82f6" />
      </svg>
    ),
    name: "Customer Inquiry Agent",
    tagline: "Never let a question go unanswered",
    description:
      "Answers your most common questions as soon as possible — services, pricing, availability, location — via your website chat or a messaging channel. Escalates to you when it needs to.",
    examples: ["Plumbers", "HVAC", "Cleaning services", "Landscapers"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="20" height="16" rx="3" stroke="#3b82f6" strokeWidth="2" />
        <path d="M9 13h10M9 17h6" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="22" cy="6" r="3.5" fill="#3b82f6" />
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
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="11" r="5" stroke="#3b82f6" strokeWidth="2" />
        <path d="M5 25c0-5 4-8 9-8s9 3 9 8" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
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
    <section id="solutions" className="py-24 md:py-28 px-6 md:px-12 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto relative">
        <AnimatedSection>
          <p className="section-label mb-4 text-center">What we build</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-text mb-5 max-w-3xl mx-auto leading-tight">
            Practical agents. Real outcomes.{" "}
            <span className="accent-text">No corporate fluff.</span>
          </h2>
          <p className="text-subdued text-center max-w-xl mx-auto mb-14 md:mb-16 text-base md:text-lg leading-relaxed">
            Every agent we build is designed around one thing: the specific
            problem your business needs solved.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.name} delay={i * 0.1}>
              <div className="clean-card p-7 md:p-8 h-full flex flex-col gap-5 group">
                <div className="icon-container">{agent.icon}</div>
                <div>
                  <p className="section-label text-xs mb-2">{agent.tagline}</p>
                  <h3 className="text-lg md:text-xl font-bold text-text mb-3">
                    {agent.name}
                  </h3>
                  <p className="text-subdued text-sm leading-relaxed">
                    {agent.description}
                  </p>
                </div>
                <div className="mt-auto pt-5">
                  <div className="subtle-divider mb-4" />
                  <p className="text-muted text-xs font-medium mb-3">
                    Great for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {agent.examples.map((ex) => (
                      <span key={ex} className="tag-pill">
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
