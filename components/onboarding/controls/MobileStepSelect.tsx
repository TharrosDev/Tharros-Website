"use client";

import { useEffect, useRef, useState } from "react";

interface StepItem { id: string; name: string; locked: boolean }
interface Props {
  steps: StepItem[];
  current: number;
  onPick: (i: number) => void;
}

export function MobileStepSelect({ steps, current, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const c = steps[current];
  if (!c) return null;

  return (
    <div className="ob-msteps" ref={wrapRef}>
      <button
        type="button"
        className="ob-msteps__trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="eyebrow">
          Step {String(current + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}
        </span>
        <strong>{c.name}</strong>
        <span className="caret" aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <ul className="ob-msteps__menu" role="listbox">
          {steps.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === current}>
              <button
                type="button"
                disabled={s.locked}
                className={i === current ? "is-current" : ""}
                onClick={() => { if (!s.locked) { onPick(i); setOpen(false); } }}
              >
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span className="label">{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
