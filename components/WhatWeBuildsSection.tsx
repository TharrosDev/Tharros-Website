"use client";

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
    diagram: "inquiry",
  },
  {
    num: "02",
    name: "Lead Capture Agent",
    tagline: "Turn website visitors into qualified leads.",
    description:
      "Greets visitors, asks smart qualifying questions, and routes contact info to your inbox while you're on the job or asleep.",
    examples: ["Lawyers", "Accountants", "Consultants", "Contractors"],
    diagram: "lead",
  },
  {
    num: "03",
    name: "After-Hours Intake Agent",
    tagline: "Capture every lead, even when you're off the clock.",
    description:
      "Handles inbound messages after business hours, collects job details and urgency, and sends a clean summary at dawn.",
    examples: ["Emergency trades", "Property managers", "Auto repair", "Clinics"],
    diagram: "afterhours",
  },
] as const;

export default function WhatWeBuildsSection() {
  return (
    <section id="solutions" className="rhythm-default bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)]">
      <div className="page-frame">
        <SectionEyebrow numeral="§ 03" label="Agents we build" tone="dark" />

        <AnimatedSection className="mb-12 md:mb-16">
          <h2 className="type-display-2 text-[color:var(--ink-on-dark)] max-w-[18ch]">
            Three agents.<br />
            <span className="text-[color:var(--accent-on-dark)]">Built into your site.</span>
          </h2>
        </AnimatedSection>

        <div className="border-t border-[color:var(--rule-on-dark)]">
          {agents.map((agent, i) => (
            <AnimatedSection key={agent.num} delay={i * 0.08}>
              <div className="grid grid-cols-12 gap-x-6 py-12 md:py-16 border-b border-[color:var(--rule-on-dark)] items-start">
                <div className="col-span-12 md:col-span-1">
                  <span className="num text-sm text-[color:var(--ink-on-dark-muted)]">{agent.num}</span>
                </div>

                <div className="col-span-12 md:col-span-6 mt-4 md:mt-0">
                  <div className="type-meta text-[color:var(--accent-on-dark)] mb-4">{agent.tagline}</div>
                  <h3 className="type-display-3 text-[color:var(--ink-on-dark)] mb-5">{agent.name}</h3>
                  <p className="type-body text-[color:var(--ink-on-dark-muted)] max-w-[52ch] mb-6">
                    {agent.description}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {agent.examples.map((ex) => (
                      <span key={ex} className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">
                        {ex.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-5 mt-8 md:mt-0">
                  <AgentDiagram kind={agent.diagram} />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentDiagram({ kind }: { kind: "inquiry" | "lead" | "afterhours" }) {
  const nodes: Record<string, { label: string; sub: string; accent?: boolean }[]> = {
    inquiry:    [
      { label: "Visitor",  sub: "Asks a question" },
      { label: "Agent",    sub: "Answers in scope", accent: true },
      { label: "Escalate", sub: "When it can't" },
    ],
    lead:       [
      { label: "Visitor",  sub: "Lands on site" },
      { label: "Agent",    sub: "Qualifies", accent: true },
      { label: "Inbox",    sub: "You get the lead" },
    ],
    afterhours: [
      { label: "Visitor",  sub: "Messages at 11pm" },
      { label: "Agent",    sub: "Collects details", accent: true },
      { label: "Summary",  sub: "Sent at dawn" },
    ],
  };
  const list = nodes[kind];

  return (
    <svg viewBox="0 0 360 200" className="diagram-dark w-full h-auto" fill="none" aria-hidden="true">
      {list.map((n, i) => {
        const x = 10 + i * 120;
        return (
          <g key={i} className={n.accent ? "accent" : ""}>
            <rect
              x={x}
              y={70}
              width={110}
              height={60}
              stroke="currentColor"
              strokeWidth={n.accent ? 1.5 : 1}
              fill={n.accent ? "currentColor" : "none"}
              fillOpacity={n.accent ? 0.08 : 0}
            />
            <text x={x + 12} y={94} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="currentColor" opacity="0.55">
              {String(i + 1).padStart(2, "0")}
            </text>
            <text x={x + 12} y={111} fontFamily="var(--font-sans)" fontSize="13" fontWeight={n.accent ? 600 : 500} fill="currentColor">
              {n.label}
            </text>
            <text x={x + 12} y={124} fontFamily="var(--font-sans)" fontSize="10" fill="currentColor" opacity="0.7">
              {n.sub}
            </text>
            {i < list.length - 1 && (
              <line x1={x + 110} y1={100} x2={x + 120} y2={100} stroke="currentColor" strokeWidth="1" opacity="0.5" strokeDasharray="2 3" />
            )}
          </g>
        );
      })}
      <text x="10" y="170" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.45">
        FIG · DATA FLOW
      </text>
    </svg>
  );
}
