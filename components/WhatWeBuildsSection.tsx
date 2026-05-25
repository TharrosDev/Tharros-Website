import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

const agents = [
  {
    num: "01",
    name: "Customer Inquiry Agent",
    tagline: "Never let a question go unanswered.",
    description:
      "Answers services, pricing, availability, and location questions on your site. Knows when to escalate to you.",
    examples: ["Plumbers", "HVAC", "Cleaning services", "Landscapers"],
    flow: ["Ask", "Answer", "Escalate"],
  },
  {
    num: "02",
    name: "Lead Capture Agent",
    tagline: "Turn website visitors into qualified leads.",
    description:
      "Greets visitors, asks smart qualifying questions, and routes contact info to your inbox while you're on the job or asleep.",
    examples: ["Lawyers", "Accountants", "Consultants", "Contractors"],
    flow: ["Visit", "Qualify", "Inbox"],
  },
  {
    num: "03",
    name: "After-Hours Intake Agent",
    tagline: "Capture every lead, even when you're off the clock.",
    description:
      "Handles inbound messages after business hours, collects job details and urgency, and sends a clean summary at dawn.",
    examples: ["Emergency trades", "Property managers", "Auto repair", "Clinics"],
    flow: ["Message", "Collect", "Summary"],
  },
] as const;

export default function WhatWeBuildsSection() {
  return (
    <section id="solutions">
      {/* Light header band */}
      <div className="bg-[color:var(--surface-alt)] pt-28 md:pt-32 pb-[var(--rhythm-tight)]">
        <div className="page-frame">
          <SectionEyebrow numeral="§ 01" label="Agents we build" />

          <AnimatedSection>
            <h2 className="type-display-2 max-w-[18ch]">
              Three agents.<br />
              <span className="text-[color:var(--accent)]">Built into your site.</span>
            </h2>
          </AnimatedSection>
        </div>
      </div>

      {/* Dark content band */}
      <div className="bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)] pt-[var(--rhythm-tight)] pb-[var(--rhythm-default)]">
        <div className="page-frame">
          <AnimatedSection>
            <ol className="grid grid-cols-1 md:grid-cols-3 border-t border-[color:var(--rule-on-dark)]">
              {agents.map((agent, i) => (
                <li
                  key={agent.num}
                  className={`flex flex-col py-8 px-0 md:px-5 border-[color:var(--rule-on-dark)] ${
                    i === 0 ? "md:pl-0" : "border-t md:border-t-0 md:border-l"
                  }`}
                >
                  <span className="num text-sm text-[color:var(--accent-on-dark)]">{agent.num}</span>
                  <div className="type-meta text-[color:var(--accent-on-dark)] mt-4">{agent.tagline}</div>
                  <h3 className="type-display-3 text-[color:var(--ink-on-dark)] mt-3">{agent.name}</h3>
                  <p className="type-body text-[color:var(--ink-on-dark-muted)] mt-3.5">{agent.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-5">
                    {agent.examples.map((ex) => (
                      <span key={ex} className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">
                        {ex.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <ol className="signal-stack mt-auto pt-6 border-t border-[color:var(--rule-on-dark-strong)]" aria-hidden="true">
                    {agent.flow.map((stage, si) => (
                      <li key={stage} className="signal-node" data-accent={si === 1 ? "" : undefined}>
                        {stage}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
