"use client";

// Review.tsx — Final summary screen before submission.

import type { ReactNode } from "react";
import { OB_STEPS } from "./lib/schema";
import type { FieldDef, FieldValue, FormState } from "./lib/types";
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
            Skim what you’ve put together. You can jump back to any section to
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
            A quick scan of everything you’ve put in. Send when ready.
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
                      <FragmentRow
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
              className="primary-button primary-button--lg"
              onClick={onSubmit}
              disabled={submitting}
              style={{
                display: "inline-flex", gap: 12,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              <span className="label">{submitting ? "Sending…" : "Send brief"}</span>
              <span className="sweep" />
              <IconArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ label, value, empty }: { label: string; value: ReactNode; empty: boolean }) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={empty ? "empty" : ""}>{value}</dd>
    </>
  );
}

function isEmpty(v: FieldValue): boolean {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

function renderValue(field: FieldDef, v: FieldValue): ReactNode {
  if (field.kind === "chips" && Array.isArray(v)) {
    return v.map((x) => <span className="pill" key={x}>{x}</span>);
  }
  if (field.kind === "checks" && Array.isArray(v)) {
    return v.map((x) => {
      const opt = field.options?.find((o) => o.v === x);
      return <span className="pill" key={x}>{opt ? opt.label : x}</span>;
    });
  }
  if (field.kind === "radio" && typeof v === "string") {
    const opt = field.options?.find((o) => o.v === v);
    return opt ? opt.label : v;
  }
  if (field.kind === "slider" && typeof v === "number") {
    return (field.labels || [])[v] || `${v}`;
  }
  if (field.kind === "colors" && typeof v === "string") {
    const opt = field.options?.find((o) => o.v === v);
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 18, height: 18, borderRadius: 5,
          background: v, border: "1px solid rgba(255,255,255,0.2)",
        }} />
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{v.toUpperCase()}</span>
        {opt && <span style={{ color: "rgba(255,255,255,0.55)" }}>· {opt.label}</span>}
      </span>
    );
  }
  if (field.kind === "file" && v && typeof v === "object" && !Array.isArray(v)) {
    return `${v.name} (${(v.size / 1024).toFixed(1)} kB)`;
  }
  if (field.kind === "url" && typeof v === "string") {
    return (
      <a href={v} target="_blank" rel="noopener noreferrer"
         style={{ color: "#38bdf8", textDecoration: "underline" }}>
        {v}
      </a>
    );
  }
  return typeof v === "string" || typeof v === "number" ? String(v) : null;
}
