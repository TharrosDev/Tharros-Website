"use client";

import { useRef, useState, useEffect } from "react";
import { OB_STEPS } from "./lib/schema";
import { deleteSubmission, loadSubmissions } from "./lib/storage";
import { isEmpty, renderValue, ReviewRow } from "./lib/render";
import type { Submission, FieldValue } from "./lib/types";

import "./onboarding.css";

type Tab = "prompt" | "json" | "data";

const str = (v: FieldValue, fallback = "—"): string =>
  typeof v === "string" && v ? v : fallback;

export function AdminApp() {
  const initial = loadSubmissions();
  const [submissions, setSubmissions] = useState<Submission[]>(initial);
  const [currentId, setCurrentId] = useState<string | null>(initial[0]?.id ?? null);
  const [tab, setTab] = useState<Tab>("prompt");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

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
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy failed");
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
    const name = str(current.state.businessName, "Untitled");
    if (!window.confirm(`Delete brief from "${name}"? This can't be undone.`)) return;
    deleteSubmission(current.id);
    refresh();
  };

  const slugForCurrent = current ? slugify(str(current.state.businessName, "client")) : "client";

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
          <div className="admin-list">
            <div className="admin-list__head">
              <span className="admin-list__dot" />
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
                  <div className="admin-list__name">{str(r.state.businessName, "Untitled brief")}</div>
                  <div className="admin-list__meta">
                    {str(r.state.ownerName)} · {new Date(r.timestamp).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="admin-detail">
            {!current ? (
              <div className="admin-detail__empty">
                Pick a submission to view the merged prompt.
              </div>
            ) : (
              <>
                <div className="admin-detail__head">
                  <div className="admin-detail__row">
                    <h2 className="admin-detail__title">
                      {str(current.state.businessName, "Untitled brief")}
                    </h2>
                    <span className="admin-detail__chip">
                      {str(current.state.city)} · {str(current.state.industry)}
                    </span>
                  </div>
                  <div className="admin-detail__sub">
                    {typeof current.state.email === "string" && (
                      <a href={`mailto:${current.state.email}`} className="admin-detail__email">
                        {current.state.email}
                      </a>
                    )}
                    {typeof current.state.phone === "string" && current.state.phone && <> · {current.state.phone}</>}
                    {typeof current.state.bestTime === "string" && current.state.bestTime && <> · best at {current.state.bestTime}</>}
                    <span className="admin-detail__received">· received {new Date(current.timestamp).toLocaleString()}</span>
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
                      <button
                        type="button"
                        className="admin-btn is-secondary"
                        onClick={() => download(`tharros-brief-${slugForCurrent}.md`, current.prompt, "text/markdown")}
                      >
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
                      <button
                        type="button"
                        className="admin-btn is-secondary"
                        onClick={() => download(`tharros-brief-${slugForCurrent}.json`, JSON.stringify(current, null, 2), "application/json")}
                      >
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

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "client";
}
