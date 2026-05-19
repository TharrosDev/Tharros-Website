// types.ts — Shared types for the onboarding system.

export type FieldKind =
  | "text"
  | "textarea"
  | "url"
  | "chips"
  | "checks"
  | "radio"
  | "slider"
  | "colors"
  | "file";

export type FieldOption = {
  /** Stored value */
  v: string;
  /** Label shown in the UI */
  label: string;
  /** Optional secondary line under the label */
  hint?: string;
};

export interface FieldDef {
  id: string;
  kind: FieldKind;
  label: string;
  hint?: string;
  placeholder?: string;
  /** If true, leaving the field blank is allowed when advancing the step. */
  optional?: boolean;
  /** For `text` fields, override the HTML input type (e.g. `email`). */
  inputType?: string;
  /** For `chips`, hint suggestions the user can click to add. */
  suggest?: string[];
  /** For `checks` / `radio` / `colors`, the list of options. */
  options?: FieldOption[];
  /** Slider config */
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  /** Slider tick labels (one per integer position). */
  labels?: string[];
  /** File-input accept attribute. */
  accept?: string;
  /** For `file` kind — allow multiple files (stored as FileInfo[]). */
  multiple?: boolean;
  /** For `textarea` kind — rows hint. */
  rows?: number;
  /** When supplied and returns false, the field is hidden, treated as
   *  satisfied in `stepComplete`, and skipped in the merged prompt. */
  visibleWhen?: (state: FormState) => boolean;
}

export interface StepDef {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
}

/** Metadata for an uploaded file. `path` + `url` are populated after the
 *  upload to Supabase Storage completes; `status` drives the row UI. */
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  path?: string;
  url?: string;
  status?: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
}

/** All possible value types a field can hold. */
export type FieldValue = string | string[] | number | FileInfo | FileInfo[] | null;

/** The whole form state, keyed by field id. */
export type FormState = Record<string, FieldValue>;

/** A completed submission record. */
export interface Submission {
  id: string;
  timestamp: string;
  state: FormState;
  prompt: string;
}
