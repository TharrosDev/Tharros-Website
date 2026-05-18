"use client";

// AdminApp.tsx — Admin view (`/admin/briefs`). Lists submissions stored in
// localStorage (a local backup of what's already in Zapier Tables), shows the
// merged Markdown prompt for quick copy/paste, and offers raw JSON / pretty
// views.
//
// Auth: this component does NO auth. Gate the /admin/briefs route via
// middleware.ts (see nextjs-port/README.md).

import { useState } from "react";
import { OB_STEPS } from "./lib/schema";
import { deleteSubmission, loadSubmissions } from "./lib/storage";
import type { FieldDef, FieldValue, Submission } from "./lib/types";
import type { ReactNode } from "react";

import "./onboarding.css";

type Tab = "prompt" | "json" | "data";

export function AdminApp() {
  const [submissions, setSubmissions] = useState<Submission[]>(() => loadSubmissions());
  const [currentId, setCurrentId] = useState<string | null>(
    () => loadSubmissions()[0]?.id ?? null,
  );
  const [tab, setTab] = useState<Tab>("prompt");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useState<{ id: ReturnType<typeof setTimeout> | null }>({ id: null })[0];

  const refresh = () => {
    const list = loadSubmissions();
    setSubmissions(list);
    if (!list.find((r) => r.id === currentId)) {
      setCurrentId(list[0]?.id ?? null);
    }
  };

  const current = submissions.find((r) => r.id === currentId);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.id) clearTimeout(toastTimer.id);
    toastTimer.id = setTimeout(() => setToast(null), 1800);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); showToast("Copied"); } catch {}
      document.body.removeChild(ta);
    }
  };

  const download = (filename: string, text: string, mime = "text/plain") => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const removeCurrent = () => {
    if (!current) return;
    if (!window.confirm(`Delete brief from "${current.state.businessName || "Untitled"}"? This can’t be undone.`)) return;
    deleteSubmission(current.id);
    refresh();
  };

  return (
    <div className="admin-shell">
      <div className="admin-shell__bg industrial-grid--dark" />
      <div className="admin-inner">
        <div className="admin-bar">
          <span className="admin-bar__title">● Admin · Tharros briefs</span>
          <span className="admin-bar__sub">
            {submissions.length} submission{submissions.length === 1 ? "" : "s"} cached locally
          </span>
          <a href="/" className="admin-bar__exit">← Exit</a>
        </div>

        <div className="admin-grid">
          {/* ----- Submissions list ----- */}
          <div className="admin-list">
            <div className="admin-list__head">
              <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--color-accent-3)" }} />
              Submissions
            </div>
            {submissions.length === 0 ? (
              <div className="admin-list__empty">
                No submissions cached on this device.<br />
                Submissions sync from Zapier Tables — this view is a local backup only.
              </div>
            ) : (
              submissions.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  className={`admin-list__item ${currentId === r.id ? "is-current" : ""}`}
                  onClick={() => setCurrentId(r.id)}
                >
                  <div className="admin-list__name">
                    {typeof r.state.businessName === "string" ? r.state.businessName : "Untitled brief"}
                  </div>
                  <div className="admin-list__meta">
                    {(typeof r.state.ownerName === "string" ? r.state.ownerName : "—")} · {new Date(r.timestamp).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* ----- Detail ----- */}
          <div className="admin-detail">
            {!current ? (
              <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--color-text-soft)" }}>
                Pick a submission to view the merged prompt.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                    <h2 style={{
                      margin: 0, fontWeight: 700, fontSize: 26,
                      letterSpacing: "-0.02em", color: "#fff",
                    }}>
                      {typeof current.state.businessName === "string" ? current.state.businessName : "Untitled brief"}
                    </h2>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.25em",
                      textTransform: "uppercase", color: "var(--color-text-soft)",
                    }}>
                      {typeof current.state.city === "string" ? current.state.city : "—"} ·{" "}
                      {typeof current.state.industry === "string" ? current.state.industry : "—"}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-text-soft)" }}>
                    {typeof current.state.email === "string" && (
                      <a href={`mailto:${current.state.email}`} style={{ color: "var(--color-accent-bright)" }}>
                        {current.state.email}
                      </a>
                    )}
                    {typeof current.state.phone === "string" && current.state.phone && <> · {current.state.phone}</>}
                    {typeof current.state.bestTime === "string" && current.state.bestTime && <> · best at {current.state.bestTime}</>}
                    <span style={{ marginLeft: 12 }}>· received {new Date(current.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="admin-detail__tabs">
                  <button type="button" className={tab === "prompt" ? "is-on" : ""} onClick={() => setTab("prompt")}>
                    Merged prompt
                  </button>
                  <button type="button" className={tab === "json" ? "is-on" : ""} onClick={() => setTab("json")}>
                    Raw JSON
                  </button>
                  <button type="button" className={tab === "data" ? "is-on" : ""} onClick={() => setTab("data")}>
                    Pretty view
                  </button>
                </div>

                {tab === "prompt" && (
                  <>
                    <pre className="code">{current.prompt}</pre>
                    <div className="admin-actions">
                      <button type="button" className="admin-btn" onClick={() => copyText(current.prompt)}>
                        Copy prompt
                      </button>
                      <button type="button" className="admin-btn is-secondary"
                        onClick={() => download(`tharros-brief-${slugify(typeof current.state.businessName === "string" ? current.state.businessName : "client")}.md`, current.prompt, "text/markdown")}>
                        Download .md
                      </button>
                      <button type="button" className="admin-btn is-danger" onClick={removeCurrent}>
                        Delete
                      </button>
                    </div>
                  </>
                )}

                {tab === "json" && (
                  <>
                    <pre className="code">{JSON.stringify(current, null, 2)}</pre>
                    <div className="admin-actions">
                      <button type="button" className="admin-btn" onClick={() => copyText(JSON.stringify(current, null, 2))}>
                        Copy JSON
                      </button>
                      <button type="button" className="admin-btn is-secondary"
                        onClick={() => download(`tharros-brief-${slugify(typeof current.state.businessName === "string" ? current.state.businessName : "client")}.json`, JSON.stringify(current, null, 2), "application/json")}>
                        Download .json
                      </button>
                    </div>
                  </>
                )}

                {tab === "data" && (
                  <div className="ob-review">
                    {OB_STEPS.map((step, i) => (
                      <div className="ob-review__block" key={step.id}>
                        <div className="ob-review__head">
                          <h4>{String(i + 1).padStart(2, "0")} · {step.name}</h4>
                        </div>
                        <dl className="ob-review__dl">
                          {step.fields.map((f) => {
                            const v = current.state[f.id];
                            const empty = isEmpty(v);
                            return (
                              <PrettyRow
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
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function PrettyRow({ label, value, empty }: { label: string; value: ReactNode; empty: boolean }) {
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
  if ((field.kind === "chips" || field.kind === "checks") && Array.isArray(v)) {
    const display = field.kind === "checks"
      ? v.map((x) => {
          const o = field.options?.find((o) => o.v === x);
          return o ? o.label : x;
        })
      : v;
    return display.map((x) => <span className="pill" key={x}>{x}</span>);
  }
  if (field.kind === "radio" && typeof v === "string") {
    const opt = field.options?.find((o) => o.v === v);
    return opt ? opt.label : v;
  }
  if (field.kind === "slider" && typeof v === "number") {
    return (field.labels || [])[v] || `${v}`;
  }
  if (field.kind === "colors" && typeof v === "string") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 18, height: 18, borderRadius: 5,
          background: v, border: "1px solid rgba(255,255,255,0.2)",
        }} />
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>{v.toUpperCase()}</span>
      </span>
    );
  }
  if (field.kind === "file" && v && typeof v === "object" && !Array.isArray(v)) {
    return `${v.name} (${(v.size / 1024).toFixed(1)} kB)`;
  }
  if (field.kind === "url" && typeof v === "string") {
    return (
      <a href={v} target="_blank" rel="noopener noreferrer"
         style={{ color: "var(--color-accent-bright)", textDecoration: "underline" }}>
        {v}
      </a>
    );
  }
  return typeof v === "string" || typeof v === "number" ? String(v) : null;
}

function slugify(s: string): string {
  return (s || "client").toString().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}
