"use client";

import { OB_STEPS } from "./lib/schema";
import { isEmpty, renderValue, ReviewRow } from "./lib/render";
import type { FormState } from "./lib/types";
import { IconArrowRight } from "./controls/icons";

interface ReviewProps {
  state: FormState;
  onEdit: (stepIndex: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

export function Review({ state, onEdit, onBack, onSubmit, submitting }: ReviewProps) {
  return (
    <div className="ob-stage__inner">
      <aside className="ob-side">
        <div className="ob-side__sticky">
          <span className="ob-side__eyebrow"><span className="bar" />Final Check</span>
          <h2 className="ob-side__title">
            Review your <br/><span className="accent">brief.</span>
          </h2>
          <p className="ob-side__sub">
            Skim what you&apos;ve put together. You can jump back to any section to
            tweak it before sending.
          </p>
        </div>
      </aside>

      <div className="ob-main ob-step-enter">
        <div className="ob-card">
          <span className="ob-card__corner tl" />
          <span className="ob-card__corner tr" />
          <span className="ob-card__corner bl" />
          <span className="ob-card__corner br" />

          <div className="ob-card__head">
            <span className="ob-card__chip">Review</span>
            <span className="ob-card__pos">Final check</span>
          </div>
          <h1 className="ob-card__title">Looks good?</h1>
          <p className="ob-card__sub">
            A quick scan of everything you&apos;ve put in. Send when ready.
          </p>

          <div className="ob-review">
            {OB_STEPS.map((step, i) => (
              <div className="ob-review__block" key={step.id}>
                <div className="ob-review__head">
                  <h4>{String(i + 1).padStart(2, "0")} · {step.name}</h4>
                  <button type="button" className="ob-review__edit" onClick={() => onEdit(i)}>
                    Edit
                  </button>
                </div>
                <dl className="ob-review__dl">
                  {step.fields.map((f) => {
                    const v = state[f.id];
                    const empty = isEmpty(v);
                    return (
                      <ReviewRow
                        key={f.id}
                        label={f.label}
                        value={empty ? "— not provided —" : renderValue(f, v)}
                        empty={empty}
                      />
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>

          <div className="ob-actions">
            <button type="button" className="ob-back" onClick={onBack} disabled={submitting}>
              <span className="rule" />Back to last step
            </button>
            <div className="ob-actions__spacer" />
            <button
              type="button"
              className="primary-button primary-button--lg ob-primary-action"
              onClick={onSubmit}
              disabled={submitting}
              data-busy={submitting || undefined}
            >
              <span className="label">{submitting ? "Sending…" : "Send brief"}</span>
              <IconArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
