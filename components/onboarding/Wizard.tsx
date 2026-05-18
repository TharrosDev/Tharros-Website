"use client";

// Wizard.tsx — Main 9-step wizard layout with sidebar progress.

import type { ReactNode } from "react";
import { OB_STEPS, stepComplete } from "./lib/schema";
import type { FieldValue, FormState } from "./lib/types";
import { Fields } from "./controls/Field";
import { IconArrowRight, IconCheck } from "./controls/icons";

interface WizardProps {
  state: FormState;
  // Match the wider signature accepted by <Fields> so functional updaters
  // (used by chip/check toggles) propagate without a contravariance error.
  setField: (id: string, value: FieldValue | ((prev: FieldValue) => FieldValue)) => void;
  stepIndex: number;
  setStepIndex: (i: number) => void;
  completedSteps: Set<number>;
  onReview: () => void;
}

export function Wizard({
  state, setField, stepIndex, setStepIndex, completedSteps, onReview,
}: WizardProps) {
  const totalSteps = OB_STEPS.length;

  const goTo = (i: number) => {
    if (i < -1) i = -1;
    if (i > totalSteps) i = totalSteps;
    setStepIndex(i);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const currentStep = stepIndex >= 0 && stepIndex < totalSteps ? OB_STEPS[stepIndex] : null;
  const stepValid = currentStep ? stepComplete(currentStep, state) : true;

  // ------------------------- WELCOME (intro)
  if (stepIndex === -1) {
    return (
      <div className="ob-stage__inner">
        <aside className="ob-side">
          <div className="ob-side__sticky">
            <span className="ob-side__eyebrow"><span className="bar" />Project Brief</span>
            <h2 className="ob-side__title">
              Tell us about <br/><span className="accent">your operation.</span>
            </h2>
            <p className="ob-side__sub">
              A short brief that lets us scope your site before our discovery call.
              About five minutes. Save and resume any time.
            </p>
          </div>
        </aside>

        <div className="ob-main ob-step-enter">
          <div className="ob-card">
            <span className="ob-card__corner tl" />
            <span className="ob-card__corner tr" />
            <span className="ob-card__corner bl" />
            <span className="ob-card__corner br" />

            <div className="ob-welcome">
              <span className="ob-card__chip">Welcome</span>
              <h1>What we’ll <span className="accent">cover.</span></h1>
              <p className="lede">
                Nine quick sections — the shape of your business, your customers,
                the look you want, and a couple of practical bits about timing
                and contact. No homework, no jargon. If a question doesn’t
                apply, skip it.
              </p>

              <div className="ob-welcome__meta">
                <div className="ob-welcome__meta-item">
                  <span className="label">Time</span>
                  <span className="val">About 5 minutes</span>
                </div>
                <div className="ob-welcome__meta-item">
                  <span className="label">Resume</span>
                  <span className="val">Auto-saved as you go</span>
                </div>
                <div className="ob-welcome__meta-item">
                  <span className="label">After</span>
                  <span className="val">We reply in one business day</span>
                </div>
              </div>

              <button type="button" className="primary-button primary-button--lg"
                onClick={() => goTo(0)}
                style={{ display: "inline-flex", gap: 12 }}>
                <span className="label">Start the brief</span>
                <span className="sweep" />
                <IconArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------- REVIEW
  if (stepIndex === totalSteps) {
    // Delegated to <Review> by the parent — parent flips `stepIndex` to
    // `totalSteps` and renders <Review> instead of <Wizard>.
    return null;
  }

  if (!currentStep) return null;

  // ------------------------- STEP
  return (
    <div className="ob-stage__inner">
      <aside className="ob-side">
        <div className="ob-side__sticky">
          <span className="ob-side__eyebrow">
            <span className="bar" />
            Step {String(stepIndex + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </span>
          <h2 className="ob-side__title">{splitTitle(currentStep.title)}</h2>
          <p className="ob-side__sub">{currentStep.subtitle}</p>

          <ul className="ob-steps">
            {OB_STEPS.map((s, i) => {
              const done = completedSteps.has(i) && i !== stepIndex;
              const current = i === stepIndex;
              const locked = i > stepIndex && !completedSteps.has(i);
              const classes = [
                "ob-step",
                done && "is-done",
                current && "is-current",
                locked && "is-locked",
              ].filter(Boolean).join(" ");
              return (
                <li
                  key={s.id}
                  className={classes}
                  onClick={() => { if (!locked) goTo(i); }}
                >
                  <span className="ob-step__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ob-step__name">{s.name}</span>
                  <span className="ob-step__tick"><IconCheck size={12} /></span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="ob-main">
        <div className="ob-progress" aria-hidden="true">
          {OB_STEPS.map((_, i) => (
            <span
              key={i}
              className={[
                "ob-progress__seg",
                i < stepIndex && "is-done",
                i === stepIndex && "is-current",
              ].filter(Boolean).join(" ")}
            />
          ))}
        </div>

        <div className="ob-card ob-step-enter" key={currentStep.id}>
          <span className="ob-card__corner tl" />
          <span className="ob-card__corner tr" />
          <span className="ob-card__corner bl" />
          <span className="ob-card__corner br" />

          <div className="ob-card__head">
            <span className="ob-card__chip">{currentStep.name}</span>
            <span className="ob-card__pos">
              Section {String(stepIndex + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
            </span>
          </div>
          <h1 className="ob-card__title">{currentStep.title}</h1>
          <p className="ob-card__sub">{currentStep.subtitle}</p>

          <Fields step={currentStep} state={state} setField={setField} />

          <div className="ob-actions">
            <button
              type="button"
              className={`ob-back ${stepIndex === 0 ? "is-disabled" : ""}`}
              onClick={() => stepIndex > 0 && goTo(stepIndex - 1)}
              disabled={stepIndex === 0}
            >
              <span className="rule" />Back
            </button>
            <div className="ob-actions__spacer" />
            <button
              type="button"
              className="primary-button primary-button--lg"
              onClick={() => {
                if (stepIndex === totalSteps - 1) onReview();
                else goTo(stepIndex + 1);
              }}
              disabled={!stepValid}
              style={{
                display: "inline-flex", gap: 12,
                opacity: stepValid ? 1 : 0.45,
                cursor: stepValid ? "pointer" : "not-allowed",
              }}
            >
              <span className="label">
                {stepIndex === totalSteps - 1 ? "Review brief" : "Continue"}
              </span>
              <span className="sweep" />
              <IconArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Split a title at the midpoint for the sidebar headline.
function splitTitle(title: string): ReactNode {
  if (!title) return null;
  const t = title.replace(/\.$/, "");
  const parts = t.split(" ");
  if (parts.length <= 2) return t + ".";
  const half = Math.ceil(parts.length / 2);
  return (
    <>
      {parts.slice(0, half).join(" ")}<br/>
      <span className="accent">{parts.slice(half).join(" ")}.</span>
    </>
  );
}
