"use client";

import Link from "next/link";
import type { FormState } from "./lib/types";

interface ThanksProps {
  state: FormState;
  onReset: () => void;
}

export function Thanks({ state, onReset }: ThanksProps) {
  const launch = typeof state.timeline === "string" ? state.timeline : "flex";
  const owner = typeof state.ownerName === "string" ? state.ownerName : "";

  const buildWhen =
    launch === "rush" ? "Week 1" :
    launch === "soon" ? "Weeks 1–2" :
    launch === "month" ? "Weeks 1–4" :
    "On your timeline";

  const timeline = [
    {
      when: "Within 24 hours",
      what: "Brief reviewed.",
      desc: "A Tharros representative reviews your brief and replies with a proposed discovery-call time, or a couple of clarifying questions if anything needs unpacking.",
    },
    {
      when: "Week 1",
      what: "Discovery.",
      desc: "A 30-minute call to map your business, the time drains, and where a modern site and an integrated agent have the most impact. Together we scope the build that fits.",
    },
    {
      when: buildWhen,
      what: "Build & Integrate.",
      desc: "We modernize the site, and on The Integrate we embed the AI agent directly into it. You see progress as we go and sign off at each checkpoint.",
    },
    {
      when: "Launch day",
      what: "Launch & Support.",
      desc: "We publish, monitor, and stay reachable. Pay per call after launch with The Refresh, or roll into a monthly retainer: The On-Call for unlimited fixes and edits, The Integrate for that plus the agent and unlimited new builds.",
    },
  ];

  const firstName = owner.split(" ")[0] || "there";

  return (
    <div className="ob-stage__inner ob-thanks-stage">
      <div className="ob-main">
        <div className="ob-thanks">
          <div className="ob-thanks__seal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.75"
                 strokeLinecap="square" strokeLinejoin="miter">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="ob-thanks__chip">Brief Received</span>
          <h1>
            We&apos;re on it,&nbsp;<span className="accent">{firstName}.</span>
          </h1>
          <p className="lede">
            Your brief is in. A Tharros representative will reply within one
            business day. Here&apos;s what happens next.
          </p>

          <ol className="ob-timeline">
            {timeline.map((step, i) => (
              <li className="ob-timeline__step" key={i}>
                <span className="ob-timeline__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="ob-timeline__when">{step.when}</div>
                  <div className="ob-timeline__what">{step.what}</div>
                  <p className="ob-timeline__desc">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="ob-thanks__actions">
            <Link href="/" className="primary-button primary-button--lg ob-primary-action">
              <span className="label">Back to Tharros</span>
            </Link>
            <button type="button" className="ob-back" onClick={onReset}>
              <span className="rule" />Submit another brief
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
