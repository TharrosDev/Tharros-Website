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
    launch === "asap" ? "Weeks 2–4" :
    launch === "soon" ? "Weeks 2–6" :
    launch === "quarter" ? "Weeks 2–10" :
    "On your timeline";

  const timeline = [
    {
      when: "Within 24 hours",
      what: "Magnus reads your brief.",
      desc: "Personal review. Expect a reply with a proposed discovery-call time, or a couple of clarifying questions if anything's unclear.",
    },
    {
      when: "Week 1",
      what: "Discovery call & scope.",
      desc: "A 30-minute call to walk through the brief, lock the package, and lay out a clear deliverable list with dates.",
    },
    {
      when: buildWhen,
      what: "Build & integrate.",
      desc: "Site goes up on a private staging URL. Iterations happen in 2–3 day cycles — you review, we adjust, we move.",
    },
    {
      when: "Launch day",
      what: "Live, on your domain.",
      desc: "DNS, SSL, analytics, search-console — handled. We stay on call for the first two weeks at no charge while things settle.",
    },
  ];

  const firstName = owner.split(" ")[0] || "friend";

  return (
    <div className="ob-stage__inner ob-thanks-stage">
      <div className="ob-main">
        <div className="ob-thanks">
          <div className="ob-thanks__seal">
            <span className="pulse-ring" />
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.2"
                 strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="ob-thanks__chip">Brief Received</span>
          <h1>
            We&apos;re on it,&nbsp;<span className="accent">{firstName}.</span>
          </h1>
          <p className="lede">
            Your brief is in. Magnus reads every one personally — expect a reply
            within one business day. Here&apos;s what happens next.
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
