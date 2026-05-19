"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OB_STEPS, defaultState, stepComplete } from "./lib/schema";
import { buildPrompt } from "./lib/prompt";
import {
  clearDraft, clearDraftId, ensureDraftId, loadDraft, loadDraftId, loadDraftMeta,
  newSubmissionId, saveDraft, saveSubmission, syncDraftToServer,
} from "./lib/storage";
import type { FieldValue, FormState } from "./lib/types";
import { Wizard } from "./Wizard";
import { Review } from "./Review";
import { Thanks } from "./Thanks";
import { SavedPill } from "./SavedPill";

import "./onboarding.css";

export function OnboardingApp() {
  const [state, setState] = useState<FormState>(() => defaultState());
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const saveTimer = useRef<number | null>(null);

  // localStorage isn't available during SSR — hydrate after mount.
  useEffect(() => {
    const loaded = loadDraft();
    if (loaded) setState(loaded);
    const meta = loadDraftMeta();
    if (meta) {
      if (typeof meta.stepIndex === "number") setStepIndex(meta.stepIndex);
      if (Array.isArray(meta.visited)) setVisited(new Set(meta.visited));
    }
  }, []);

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
      // Functional-updater form lets rapid synchronous toggles (chips, checks)
      // avoid stale state from the child's prop closure.
      [id]: typeof v === "function" ? (v as (prev: FieldValue) => FieldValue)(prev[id]) : v,
    }));
  }, []);

  const completedSteps = useMemo(() => {
    const set = new Set<number>();
    OB_STEPS.forEach((step, i) => {
      if (visited.has(i) && stepComplete(step, state)) set.add(i);
    });
    return set;
  }, [state, visited]);

  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      // Strip the honeypot before persisting so bot-typed values never sit in
      // localStorage or brief_drafts.state.
      const { company_name_alt: _drop, ...cleanState } = state as FormState & { company_name_alt?: string };
      void _drop;
      saveDraft(cleanState, stepIndex, [...visited]);
      setSavedAt(Date.now());
      // Mirror to Supabase. Fire-and-forget; localStorage is the fast path
      // and the server copy is a backup + the input feed for /admin/briefs.
      const draftId = ensureDraftId();
      void syncDraftToServer({ draftId, state: cleanState, stepIndex, visited: [...visited] });
    }, 600);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state, stepIndex, visited]);

  const submit = useCallback(async () => {
    setSubmitting(true);

    // Pull the honeypot value off the top level; strip it from `state` so it
    // never reaches the merged prompt or admin view.
    const { company_name_alt, ...cleanState } = state as FormState & { company_name_alt?: string };
    const honeypot = typeof company_name_alt === "string" ? company_name_alt : "";
    const draftId = loadDraftId();

    const prompt = buildPrompt(cleanState);
    const record = {
      id: newSubmissionId(),
      timestamp: new Date().toISOString(),
      state: cleanState,
      prompt,
    };

    saveSubmission(record);

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "tharros-onboarding",
          ...record,
          draftId,
          company_name_alt: honeypot,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn("[/api/brief] non-200:", res.status, body);
      }
    } catch (e) {
      console.warn("[/api/brief] network error:", e);
    }

    clearDraft();
    clearDraftId();
    setSubmitted(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  const reset = useCallback(() => {
    clearDraft();
    clearDraftId();
    setState(defaultState());
    setVisited(new Set());
    setStepIndex(-1);
    setSubmitted(false);
    setSavedAt(null);
    window.scrollTo({ top: 0 });
  }, []);

  const goToReview = useCallback(() => setStepIndex(OB_STEPS.length), []);

  function renderScreen() {
    if (submitted) return <Thanks state={state} onReset={reset} />;
    if (stepIndex === OB_STEPS.length) {
      return (
        <Review
          state={state}
          onEdit={(i) => setStepIndex(i)}
          onBack={() => setStepIndex(OB_STEPS.length - 1)}
          onSubmit={submit}
          submitting={submitting}
        />
      );
    }
    return (
      <Wizard
        state={state}
        setField={setField}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
        completedSteps={completedSteps}
        onReview={goToReview}
      />
    );
  }

  return (
    <div className="ob-shell ob-shell--light">
      <div className="ob-shell__bg" aria-hidden="true" />

      <main className="ob-stage">{renderScreen()}</main>
      <SavedPill savedAt={savedAt} />
    </div>
  );
}
