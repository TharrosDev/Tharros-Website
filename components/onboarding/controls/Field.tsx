"use client";

// Field.tsx — Typed form controls for the onboarding wizard.
// One <Field> component picks the right control based on the field's `kind`.

import { useState } from "react";
import type { ChangeEvent, KeyboardEvent, DragEvent } from "react";
import type { FieldDef, FieldValue, FileInfo, FormState } from "../lib/types";
import { IconCheck, IconGlobe, IconUpload, IconX } from "./icons";

interface FieldProps {
  field: FieldDef;
  value: FieldValue;
  /** Accepts either a new value or a functional updater — use the updater
   *  form for any handler that may fire rapidly (chip toggles, check
   *  toggles) to avoid stale-closure bugs. */
  onChange: (value: FieldValue | ((prev: FieldValue) => FieldValue)) => void;
}

interface FieldsProps {
  step: { fields: FieldDef[] };
  state: FormState;
  setField: (id: string, value: FieldValue | ((prev: FieldValue) => FieldValue)) => void;
}

/* ============================================================
   LABEL
   ============================================================ */
function Label({ field }: { field: FieldDef }) {
  return (
    <label className="ob-field__label" htmlFor={`f-${field.id}`}>
      {field.label}
      {field.optional && <span className="optional">· optional</span>}
    </label>
  );
}

/* ============================================================
   TEXT
   ============================================================ */
function TextField({ field, value, onChange }: FieldProps) {
  const v = typeof value === "string" ? value : "";
  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <input
        id={`f-${field.id}`}
        type={field.inputType || "text"}
        className="ob-input"
        value={v}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={field.placeholder || ""}
        autoComplete="off"
      />
    </div>
  );
}

/* ============================================================
   URL (with leading globe glyph)
   ============================================================ */
function UrlField({ field, value, onChange }: FieldProps) {
  const v = typeof value === "string" ? value : "";
  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div className="ob-url">
        <span className="ob-url__icon"><IconGlobe /></span>
        <input
          id={`f-${field.id}`}
          type="url"
          className="ob-input"
          value={v}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "https://"}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

/* ============================================================
   CHIPS (tag input + suggested pills)
   ============================================================ */
function ChipField({ field, value, onChange }: FieldProps) {
  const arr = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState("");

  // Use functional updaters so rapid clicks (suggest pills, repeated Enter)
  // don't read stale array from a prop closure.
  const add = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;
    onChange((prev) => {
      const cur = Array.isArray(prev) ? prev : [];
      return cur.includes(cleaned) ? cur : [...cur, cleaned];
    });
  };
  const remove = (raw: string) =>
    onChange((prev) => (Array.isArray(prev) ? prev : []).filter((x) => x !== raw));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && arr.length) {
      remove(arr[arr.length - 1]);
    }
  };

  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div className="ob-chips" onClick={(e) => {
        const input = e.currentTarget.querySelector("input");
        if (input) input.focus();
      }}>
        {arr.map((v) => (
          <span className="ob-chips__chip" key={v}>
            {v}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(v); }}
              aria-label={`Remove ${v}`}
            >
              <IconX />
            </button>
          </span>
        ))}
        <input
          id={`f-${field.id}`}
          className="ob-chips__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => { if (draft) { add(draft); setDraft(""); } }}
          placeholder={arr.length ? "" : (field.placeholder || "Type and press enter…")}
        />
      </div>
      {field.suggest && (
        <div className="ob-chip-suggest">
          {field.suggest.map((s) => {
            const on = arr.includes(s);
            return (
              <button
                key={s}
                type="button"
                className={on ? "is-on" : ""}
                onClick={() => (on ? remove(s) : add(s))}
              >
                {on ? "− " : "+ "}{s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CHECKS (multi-select cards)
   ============================================================ */
function CheckField({ field, value, onChange }: FieldProps) {
  const arr = Array.isArray(value) ? value : [];
  const toggle = (v: string) => {
    onChange((prev) => {
      const cur = Array.isArray(prev) ? prev : [];
      // "none" is exclusive — selecting it clears others, selecting any other
      // clears "none".
      if (v === "none") return cur.includes("none") ? [] : ["none"];
      return cur.includes(v)
        ? cur.filter((x) => x !== v)
        : [...cur.filter((x) => x !== "none"), v];
    });
  };
  const opts = field.options || [];
  const useThree = opts.length > 6;
  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div className={`ob-checks ${useThree ? "ob-checks--three" : ""}`}>
        {opts.map((opt) => {
          const on = arr.includes(opt.v);
          return (
            <button
              key={opt.v}
              type="button"
              className={`ob-check ${on ? "is-on" : ""}`}
              onClick={() => toggle(opt.v)}
              aria-pressed={on}
            >
              <span className="ob-check__box">{on && <IconCheck />}</span>
              <span className="ob-check__main">
                <span className="ob-check__label">{opt.label}</span>
                {opt.hint && <span className="ob-check__hint">{opt.hint}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   RADIO (segmented)
   ============================================================ */
function RadioField({ field, value, onChange }: FieldProps) {
  const v = typeof value === "string" ? value : "";
  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div className="ob-radio">
        {(field.options || []).map((opt) => (
          <button
            key={opt.v}
            type="button"
            className={v === opt.v ? "is-on" : ""}
            onClick={() => onChange(opt.v)}
            aria-pressed={v === opt.v}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SLIDER
   ============================================================ */
function SliderField({ field, value, onChange }: FieldProps) {
  const numValue = typeof value === "number" ? value : (field.defaultValue ?? Math.floor(((field.min ?? 0) + (field.max ?? 0)) / 2));
  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div className="ob-slider">
        <div className="ob-slider__track">
          <input
            id={`f-${field.id}`}
            type="range"
            min={field.min}
            max={field.max}
            step={field.step || 1}
            value={numValue}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
        <div className="ob-slider__labels">
          {(field.labels || []).map((label, i) => (
            <span key={label + i} className={numValue === i ? "is-on" : ""}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COLOURS (swatches + custom picker)
   ============================================================ */
function ColorsField({ field, value, onChange }: FieldProps) {
  const v = typeof value === "string" ? value : "";
  const opts = field.options || [];
  const isPreset = opts.some((o) => o.v === v);
  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div className="ob-colors">
        {opts.map((opt) => {
          const on = v === opt.v;
          return (
            <button
              key={opt.v}
              type="button"
              className={`ob-color ${on ? "is-on" : ""}`}
              onClick={() => onChange(opt.v)}
            >
              <span className="ob-color__swatch" style={{ background: opt.v }} />
              <span>
                <span className="ob-color__label">{opt.label}</span>
                <span style={{ display: "block" }} className="ob-color__hex">{opt.v.toUpperCase()}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="ob-color-custom">
        <input
          type="color"
          value={v && !isPreset ? v : "#0ea5e9"}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Custom colour picker"
        />
        <label>
          {v && !isPreset
            ? <>Custom · <span style={{ color: "#fff", fontFamily: "ui-monospace, monospace" }}>{v.toUpperCase()}</span></>
            : "Or pick a custom hex"}
        </label>
      </div>
    </div>
  );
}

/* ============================================================
   FILE (drop / click) — stores metadata only, not the blob
   ============================================================ */
function FileField({ field, value, onChange }: FieldProps) {
  const [drag, setDrag] = useState(false);
  const v = value && typeof value === "object" && !Array.isArray(value) ? value as FileInfo : null;

  const toInfo = (f: File): FileInfo => ({ name: f.name, size: f.size, type: f.type });
  const onFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    onChange(toInfo(files[0]));
  };

  return (
    <div className="ob-field">
      <Label field={field} />
      {field.hint && <div className="ob-field__hint">{field.hint}</div>}
      <div
        className={`ob-file ${drag ? "is-drag" : ""}`}
        onDragOver={(e: DragEvent) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
      >
        <input
          id={`f-${field.id}`}
          type="file"
          accept={field.accept || undefined}
          onChange={(e) => onFiles(e.target.files)}
        />
        <div className="ob-file__icon"><IconUpload /></div>
        <div className="ob-file__title">
          {v ? "Replace file" : "Drop your logo here, or click to upload"}
        </div>
        <div className="ob-file__hint">
          {field.accept
            ? field.accept.replace(/\./g, "").toUpperCase().split(",").join(" · ")
            : "Any file"}
        </div>
      </div>
      {v && (
        <div className="ob-file__list">
          <div className="ob-file__item">
            <IconCheck size={14} />
            <span>{v.name}</span>
            <span className="size">{(v.size / 1024).toFixed(1)} kB</span>
            <button type="button" onClick={() => onChange(null)} aria-label="Remove file">
              <IconX size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ROUTER + GROUP
   ============================================================ */

export function Field({ field, value, onChange }: FieldProps) {
  switch (field.kind) {
    case "text":     return <TextField field={field} value={value} onChange={onChange} />;
    case "url":      return <UrlField field={field} value={value} onChange={onChange} />;
    case "chips":    return <ChipField field={field} value={value} onChange={onChange} />;
    case "checks":   return <CheckField field={field} value={value} onChange={onChange} />;
    case "radio":    return <RadioField field={field} value={value} onChange={onChange} />;
    case "slider":   return <SliderField field={field} value={value} onChange={onChange} />;
    case "colors":   return <ColorsField field={field} value={value} onChange={onChange} />;
    case "file":     return <FileField field={field} value={value} onChange={onChange} />;
    default:         return <TextField field={field} value={value} onChange={onChange} />;
  }
}

export function Fields({ step, state, setField }: FieldsProps) {
  const allShort = step.fields.every((f) => f.kind === "text" || f.kind === "url");
  const useGrid = allShort && step.fields.length >= 2 && step.fields.length <= 4;
  return (
    <div className={useGrid ? "ob-fields ob-fields--grid" : "ob-fields"}>
      {step.fields.map((field) => (
        <Field
          key={field.id}
          field={field}
          value={state[field.id]}
          onChange={(v) => setField(field.id, v)}
        />
      ))}
    </div>
  );
}
