// storage.ts — SSR-safe localStorage helpers for draft + submissions.
//
// In Next.js, components rendering server-side don't have localStorage, so
// every accessor guards with `typeof window !== "undefined"`. Components that
// CALL these should be 'use client' anyway, but the guards keep them safe to
// import from anywhere.

import { defaultState } from "./schema";
import type { FormState, Submission } from "./types";

const STATE_KEY = "tharros_ob_state_v1";
const SUBMISSIONS_KEY = "tharros_ob_submissions_v1";
const DRAFT_ID_KEY = "tharros_ob_draft_id_v1";

interface StoredMeta {
  state: FormState;
  stepIndex: number;
  visited?: number[];
  t: number;
}

/* ============================================================
   DRAFT (in-progress brief)
   ============================================================ */

export function loadDraft(): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredMeta;
    return { ...defaultState(), ...(parsed.state || {}) };
  } catch {
    return null;
  }
}

export function loadDraftMeta(): StoredMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredMeta;
  } catch {
    return null;
  }
}

export function saveDraft(state: FormState, stepIndex: number, visited: number[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify({
      state, stepIndex, visited, t: Date.now(),
    } satisfies StoredMeta));
  } catch {
    /* localStorage may be disabled in private browsing — fail silently */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(STATE_KEY); } catch {}
}

/* ============================================================
   SUBMISSIONS (completed briefs — local backup)
   ============================================================ */

export function saveSubmission(record: Submission): void {
  if (typeof window === "undefined") return;
  try {
    const list = loadSubmissions();
    list.unshift(record);
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {}
}

export function loadSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SUBMISSIONS_KEY) || "[]") as Submission[];
  } catch {
    return [];
  }
}

export function deleteSubmission(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = loadSubmissions().filter((r) => r.id !== id);
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  } catch {}
}

/* ============================================================
   SUBMISSION ID (timestamp + random suffix, stable per record)
   ============================================================ */

export function newSubmissionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ============================================================
   DRAFT ID (one per browser; ties uploads + server drafts together)
   ============================================================ */

export function ensureDraftId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const existing = window.localStorage.getItem(DRAFT_ID_KEY);
    if (existing) return existing;
    const fresh = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DRAFT_ID_KEY, fresh);
    return fresh;
  } catch {
    return `local-${Date.now()}`;
  }
}

export function loadDraftId(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(DRAFT_ID_KEY); } catch { return null; }
}

export function clearDraftId(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(DRAFT_ID_KEY); } catch {}
}
