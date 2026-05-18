"use client";

// OnboardingApp.tsx — Root client component. Holds form state, drives the
// wizard / review / thanks flow, persists to localStorage, and posts to
// /api/brief on submission.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OB_STEPS, defaultState, stepComplete } from "./lib/schema";
import { buildPrompt } from "./lib/prompt";
import {
  clearDraft, loadDraft, loadDraftMeta, newSubmissionId,
  saveDraft, saveSubmission,
} from "./lib/storage";
import type { FieldValue, FormState } from "./lib/types";
import { Wizard } from "./Wizard";
import { Review } from "./Review";
import { Thanks } from "./Thanks";

import "./onboarding.css";

export function OnboardingApp() {
  // ----- Form state (hydrates from localStorage on mount) -----
  const [state, setState] = useState<FormState>(() => defaultState());
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const saveTimer = useRef<number | null>(null);

  // Hydrate after mount (Next.js: localStorage isn't available during SSR)
  useEffect(() => {
    const loaded = loadDraft();
    if (loaded) setState(loaded);
    const meta = loadDraftMeta();
    if (meta) {
      if (typeof meta.stepIndex === "number") setStepIndex(meta.stepIndex);
      if (Array.isArray(meta.visited)) setVisited(new Set(meta.visited));
    }
  }, []);

  // Mark a step as visited once it becomes the current step.
  useEffect(() => {
    if (stepIndex >= 0 && stepIndex < OB_STEPS.length) {
      setVisited((prev) => {
        if (prev.has(stepIndex)) return prev;
        const next = new Set(prev);
        next.add(stepIndex);
        return next;
      });
    }
  }, [stepIndex]);

  const setField = useCallback((id: string, v: FieldValue | ((prev: FieldValue) => FieldValue)) => {
    setState((prev) => ({
      ...prev,
      // Accept either a value or a functional updater so rapid synchronous
      // toggles (chips, checkboxes) don't read stale state through the
      // child's prop closure.
      [id]: typeof v === "function" ? (v as (prev: FieldValue) => FieldValue)(prev[id]) : v,
    }));
  }, []);

  // A step is "done" only if visited AND valid.
  const completedSteps = useMemo(() => {
    const set = new Set<number>();
    OB_STEPS.forEach((step, i) => {
      if (visited.has(i) && stepComplete(step, state)) set.add(i);
    });
    return set;
  }, [state, visited]);

  // Debounced auto-save on every change.
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveDraft(state, stepIndex, [...visited]);
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state, stepIndex, visited]);

  /* ----- Submit ----- */
  const submit = useCallback(async () => {
    setSubmitting(true);
    const prompt = buildPrompt(state);
    const record = {
      id: newSubmissionId(),
      timestamp: new Date().toISOString(),
      state: { ...state },
      prompt,
    };

    // Local backup (always)
    saveSubmission(record);

    // Forward to server — which forwards to Zapier. Don't block thank-you on
    // network errors; we already saved locally and the user expects a reply.
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "tharros-onboarding", ...record }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn("[/api/brief] non-200:", res.status, body);
      }
    } catch (e) {
      console.warn("[/api/brief] network error:", e);
    }

    clearDraft();
    setSubmitted(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  const reset = useCallback(() => {
    clearDraft();
    setState(defaultState());
    setVisited(new Set());
    setStepIndex(-1);
    setSubmitted(false);
    window.scrollTo({ top: 0 });
  }, []);

  const goToReview = useCallback(() => setStepIndex(OB_STEPS.length), []);

  /* ----- Render ----- */
  return (
    <div className="ob-shell">
      <div className="ob-shell__bg" aria-hidden="true">
        <div className="industrial-grid--dark" />
        <div className="panel" />
        <div className="glow glow--a" />
        <div className="glow glow--b" />
      </div>

      <main className="ob-stage">
        {submitted ? (
          <Thanks state={state} onReset={reset} />
        ) : stepIndex === OB_STEPS.length ? (
          <Review
            state={state}
            onEdit={(i) => setStepIndex(i)}
            onBack={() => setStepIndex(OB_STEPS.length - 1)}
            onSubmit={submit}
            submitting={submitting}
          />
        ) : (
          <Wizard
            state={state}
            setField={setField}
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            completedSteps={completedSteps}
            onReview={goToReview}
          />
        )}
      </main>
    </div>
  );
}
