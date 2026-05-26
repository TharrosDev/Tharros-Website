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
      <div className="bg-[color:var(--surface)] pt-28 md:pt-32 pb-[var(--rhythm-tight)]">
        <div className="page-frame">
          <SectionEyebrow numeral="§ 01" label="Agents we build" />

          <AnimatedSection>
            <h2 className="type-display-2 max-w-[16ch]">
              Three agents.<br />
              <span className="accent-text">Built into your site.</span>
            </h2>
          </AnimatedSection>
        </div>
      </div>

      {/* Dark content band */}
      <div className="bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)] pt-[var(--rhythm-tight)] pb-[var(--rhythm-default)]">
        <div className="page-frame">
          <AnimatedSection>
            <ol className="grid grid-cols-1 md:grid-cols-3 border-t-2 border-[color:var(--rule-on-dark-strong)]">
              {agents.map((agent, i) => (
                <li
                  key={agent.num}
                  className={`flex flex-col py-9 px-0 md:px-6 border-[color:var(--rule-on-dark)] ${
                    i === 0 ? "md:pl-0" : "border-t md:border-t-0 md:border-l"
                  }`}
                >
                  <span className="big-num big-num--red text-[5rem] md:text-[6rem] leading-[0.8]">
                    {agent.num}
                  </span>
                  <div className="type-meta-strong text-[color:var(--red-bright)] mt-6">{agent.tagline}</div>
                  <h3 className="type-display-3 text-[color:var(--ink-on-dark)] mt-3">{agent.name}</h3>
                  <p className="type-body text-[color:var(--ink-on-dark-muted)] mt-3.5">{agent.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-6">
                    {agent.examples.map((ex) => (
                      <span key={ex} className="num text-[11px] text-[color:var(--ink-on-dark-faint)]">
                        {ex.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Flow strip — bold horizontal sequence, last stage in red */}
                  <div
                    className="flex items-center gap-2.5 mt-auto pt-7 flex-wrap"
                    aria-hidden="true"
                  >
                    {agent.flow.map((stage, si) => (
                      <span key={stage} className="flex items-center gap-2.5">
                        <span
                          className={`num text-[11px] tracking-[0.14em] uppercase ${
                            si === agent.flow.length - 1
                              ? "text-[color:var(--red-bright)] font-semibold"
                              : "text-[color:var(--ink-on-dark-muted)]"
                          }`}
                        >
                          {stage}
                        </span>
                        {si < agent.flow.length - 1 && (
                          <span className="w-5 h-[2px] bg-[color:var(--red)]" />
                        )}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
