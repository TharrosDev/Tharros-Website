import type { ReactNode } from "react";
import type { FieldDef, FieldValue } from "./types";

export function isEmpty(v: FieldValue): boolean {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

export function formatFileSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

export function renderValue(field: FieldDef, v: FieldValue): ReactNode {
  if ((field.kind === "chips" || field.kind === "checks") && Array.isArray(v)) {
    const display = field.kind === "checks"
      ? v.map((x) => field.options?.find((o) => o.v === x)?.label ?? x)
      : v;
    return display.map((x) => <span className="pill" key={x}>{x}</span>);
  }
  if (field.kind === "radio" && typeof v === "string") {
    return field.options?.find((o) => o.v === v)?.label ?? v;
  }
  if (field.kind === "slider" && typeof v === "number") {
    return (field.labels || [])[v] || `${v}`;
  }
  if (field.kind === "colors" && typeof v === "string") {
    const opt = field.options?.find((o) => o.v === v);
    return (
      <span className="ob-review__swatch">
        <span className="ob-review__swatch-chip" style={{ background: v }} />
        <span className="ob-review__swatch-hex">{v.toUpperCase()}</span>
        {opt && <span className="ob-review__swatch-name">· {opt.label}</span>}
      </span>
    );
  }
  if (field.kind === "file" && v && typeof v === "object" && !Array.isArray(v)) {
    return `${v.name} (${formatFileSize(v.size)})`;
  }
  if (field.kind === "url" && typeof v === "string") {
    return (
      <a href={v} target="_blank" rel="noopener noreferrer" className="ob-review__url">
        {v}
      </a>
    );
  }
  return typeof v === "string" || typeof v === "number" ? String(v) : null;
}

export function ReviewRow({
  label,
  value,
  empty,
}: {
  label: string;
  value: ReactNode;
  empty: boolean;
}) {
  return (
    <>
      <dt>{label}</dt>
      <dd className={empty ? "empty" : ""}>{value}</dd>
    </>
  );
}
