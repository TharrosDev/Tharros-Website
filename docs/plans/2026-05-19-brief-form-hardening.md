# Brief Form Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close seven gaps in the `/brief` onboarding flow: make file uploads real, hide irrelevant fields conditionally, persist drafts server-side with email-link resume, protect `/api/brief` from spam, restore the saved-indicator, collapse the mobile step list, and announce slider labels to screen readers.

**Architecture:** Supabase (project `xbqlfjhriqycqhuiueug`, TharrosDev's ORG) becomes the durable store for drafts, submissions, and uploaded files. Client speaks to a thin set of Next.js Route Handlers under `app/api/brief/*` that wrap `@supabase/supabase-js` calls. `localStorage` remains as a fast offline cache but is no longer the source of truth. Upstash Redis (free tier) handles rate-limit + honeypot for the public submit endpoint.

**Tech Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind 4 (CSS-only config in `app/globals.css`) · `@supabase/supabase-js` (new) · `@upstash/ratelimit` + `@upstash/redis` (new) · existing Zapier webhook (kept as a downstream notifier, not a store of record).

**Branch:** `feature/brief-form-hardening` (created from `main`).

---

## File Map

### New files
- `lib/supabase/server.ts` — server-only client (service role key)
- `lib/supabase/browser.ts` — browser client (anon key)
- `lib/ratelimit.ts` — Upstash rate-limit helper
- `app/api/brief/upload-url/route.ts` — issue signed upload URLs (item #1)
- `app/api/brief/draft/route.ts` — POST upsert draft, with optional email/token issue (item #3)
- `app/api/brief/draft/[token]/route.ts` — GET draft by magic-link token (item #3)
- `app/api/brief/resume-link/route.ts` — POST request-resume-link, emails the user (item #3)
- `components/onboarding/controls/MobileStepSelect.tsx` — collapsed step picker (item #6)
- `components/onboarding/SavedPill.tsx` — floating saved-indicator (item #5)
- `supabase/migrations/20260519_brief_tables.sql` — table + bucket setup (items #1 & #3)
- `docs/plans/2026-05-19-brief-form-hardening.md` — this file

### Modified files
- `package.json` — add `@supabase/supabase-js`, `@upstash/ratelimit`, `@upstash/redis`
- `components/onboarding/lib/types.ts` — add `visibleWhen`, expand `FileInfo` with `path`/`url`
- `components/onboarding/lib/schema.ts` — `visibleWhen` on assistant fields + on the current-site step
- `components/onboarding/lib/storage.ts` — server-draft sync, draft-id + token helpers
- `components/onboarding/controls/Field.tsx` — real upload in `FileField`, `aria-valuetext` in `SliderField` (item #7)
- `components/onboarding/Wizard.tsx` — filter hidden steps, mount `MobileStepSelect` on narrow viewports, render `SavedPill`
- `components/onboarding/OnboardingApp.tsx` — server-side autosave, hydrate from `?resume=<token>`
- `components/onboarding/lib/prompt.ts` — print file URLs instead of just metadata
- `components/onboarding/onboarding.css` — pill styles, mobile sidebar CSS, conditional `display: none` for the desktop step list at < 760px
- `app/api/brief/route.ts` — honeypot + rate limit + write submission row
- `app/admin/briefs/page.tsx` + `components/onboarding/AdminApp.tsx` — read from Supabase (fall back to local cache)
- `CLAUDE.md` — append a "Supabase / brief storage" note

### Environment (set in Vercel + locally in `.env.local`)
- `SUPABASE_URL=https://xbqlfjhriqycqhuiueug.supabase.co`
- `SUPABASE_ANON_KEY=...` (publishable, exposed to browser as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY=...` (server only — never NEXT_PUBLIC)
- `UPSTASH_REDIS_REST_URL=...`
- `UPSTASH_REDIS_REST_TOKEN=...`
- `RESEND_API_KEY=...` (or whichever transactional sender we choose for the magic link — see Task 3)

---

## Task 0: Provision Supabase + Upstash

### Task 0a: Create tables, bucket, and RLS

**Files:**
- Create: `supabase/migrations/20260519_brief_tables.sql`

- [ ] **Step 1: Author the migration**

```sql
-- 20260519_brief_tables.sql
-- Brief drafts (in-progress) + submissions (completed).

create extension if not exists "pgcrypto";

create table if not exists public.brief_drafts (
  id           uuid primary key default gen_random_uuid(),
  token        uuid not null unique default gen_random_uuid(),
  email        text,
  state        jsonb not null default '{}'::jsonb,
  step_index   int  not null default -1,
  visited      int[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists brief_drafts_email_idx on public.brief_drafts (email);
create index if not exists brief_drafts_updated_at_idx on public.brief_drafts (updated_at desc);

create table if not exists public.brief_submissions (
  id           uuid primary key default gen_random_uuid(),
  draft_id     uuid references public.brief_drafts(id) on delete set null,
  state        jsonb not null,
  prompt       text  not null,
  business_name text,
  owner_name   text,
  email        text,
  forwarded    boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists brief_submissions_created_at_idx on public.brief_submissions (created_at desc);
create index if not exists brief_submissions_email_idx on public.brief_submissions (email);

-- RLS: lock everything. The service-role key bypasses RLS, which is what the
-- Next.js server-side handlers use. We never expose anon-key writes.
alter table public.brief_drafts     enable row level security;
alter table public.brief_submissions enable row level security;
-- No policies created on purpose — anon can do nothing.

-- Storage bucket for asset uploads. Private; access is via signed URLs only.
insert into storage.buckets (id, name, public)
values ('brief-uploads', 'brief-uploads', false)
on conflict (id) do nothing;
```

- [ ] **Step 2: Apply the migration via Supabase MCP**

Run (Claude session): `mcp__plugin_supabase_supabase__apply_migration` with `project_id: xbqlfjhriqycqhuiueug`, `name: 20260519_brief_tables`, `query: <contents of step 1>`.

Expected: success; `list_tables` afterward should show `brief_drafts` + `brief_submissions`.

- [ ] **Step 3: Verify**

Run: `mcp__plugin_supabase_supabase__list_tables` with `project_id: xbqlfjhriqycqhuiueug`.
Expected: both tables present, RLS enabled, no policies.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260519_brief_tables.sql
git commit -m "db(brief): drafts + submissions tables, brief-uploads bucket"
```

### Task 0b: Add dependencies + env keys

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add deps to `dependencies`**

```json
"@supabase/supabase-js": "^2.45.0",
"@upstash/ratelimit": "^2.0.0",
"@upstash/redis": "^1.34.0",
"resend": "^4.0.0",
```

- [ ] **Step 2: Run `npm install` locally; commit `package-lock.json`**

```bash
npm install
git add package.json package-lock.json
git commit -m "deps: supabase + upstash + resend"
```

- [ ] **Step 3: Add env keys to Vercel project (Production + Preview)**

Done out-of-band by the operator; see "Environment" in the file map. Verify with `vercel env ls` if local CLI is available; otherwise visually in the Vercel dashboard.

---

## Task 1: Supabase client helpers

**Files:**
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/browser.ts`

- [ ] **Step 1: Write `lib/supabase/server.ts`**

```ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Throw at import time so a misconfigured deploy fails its health-check
  // instead of silently 500-ing every brief submission.
  throw new Error("Supabase server env vars missing");
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
```

- [ ] **Step 2: Write `lib/supabase/browser.ts`**

```ts
"use client";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseBrowser = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
```

- [ ] **Step 3: Verify imports compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/server.ts lib/supabase/browser.ts
git commit -m "lib(supabase): server + browser clients"
```

---

## Task 2: Item #7 — Slider `aria-valuetext`

> Doing #7 first because it's a one-line change that proves the branch builds before the big features land.

**Files:**
- Modify: `components/onboarding/controls/Field.tsx` (the `SliderField` body, around line ~196)

- [ ] **Step 1: Add `aria-valuetext` and `aria-label` to the range input**

Replace the `<input type="range" />` inside `SliderField` with:

```tsx
<input
  id={`f-${field.id}`}
  type="range"
  min={field.min}
  max={field.max}
  step={field.step || 1}
  value={numValue}
  onChange={(e) => onChange(Number(e.target.value))}
  aria-label={field.label}
  aria-valuetext={field.labels?.[numValue] ?? `${numValue}`}
/>
```

- [ ] **Step 2: Verify the build still passes**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Verify with VoiceOver / NVDA**

Manual: focus the slider in `/brief` → step "Voice & timing", press right arrow.
Expected: screen reader announces "Conversational" (or the label), not "3".

- [ ] **Step 4: Commit**

```bash
git add components/onboarding/controls/Field.tsx
git commit -m "a11y(brief): slider announces label via aria-valuetext"
```

---

## Task 3: Item #2 — Conditional fields and step-level `visibleWhen`

**Files:**
- Modify: `components/onboarding/lib/types.ts`
- Modify: `components/onboarding/lib/schema.ts`
- Modify: `components/onboarding/controls/Field.tsx` (in `Fields`)
- Modify: `components/onboarding/Wizard.tsx` (filter steps)
- Modify: `components/onboarding/OnboardingApp.tsx` (use filtered steps for index math)

### Task 3a: Extend the type

- [ ] **Step 1: Add `visibleWhen` to `FieldDef` and `StepDef` in `types.ts`**

In the `FieldDef` interface, add:

```ts
  /** When false, the field is hidden in the wizard, treated as not-required
   *  in `fieldComplete`, and skipped in the merged prompt. */
  visibleWhen?: (state: FormState) => boolean;
```

In the `StepDef` interface, add the same predicate:

```ts
  /** When false, the entire step is filtered out of the wizard's step list. */
  visibleWhen?: (state: FormState) => boolean;
```

- [ ] **Step 2: Verify TS still compiles**

Run: `npx tsc --noEmit`
Expected: PASS.

### Task 3b: Apply `visibleWhen` in the schema

- [ ] **Step 1: Hide assistant sub-fields when "none" is picked**

In `schema.ts`, modify the `assistant` step. Replace the `hoursOfOperation` and `afterHours` field defs with:

```ts
      { id: "hoursOfOperation", kind: "text", label: "Hours of operation",
        placeholder: "e.g. Mon–Fri 9am–5pm; closed weekends",
        hint: "So the assistant knows when to say “we’re open” vs “we’ll reply soon”.",
        optional: true,
        visibleWhen: (s) => {
          const scope = Array.isArray(s.assistantScope) ? (s.assistantScope as string[]) : [];
          return scope.length > 0 && !scope.includes("none");
        },
      },
      { id: "afterHours", kind: "radio", label: "After-hours behaviour",
        options: [
          { v: "message", label: "Take a message" },
          { v: "urgent", label: "Flag urgent ones to me" },
          { v: "callback", label: "Promise a next-morning callback" },
          { v: "none", label: "Don’t handle after-hours" },
        ],
        optional: true,
        visibleWhen: (s) => {
          const scope = Array.isArray(s.assistantScope) ? (s.assistantScope as string[]) : [];
          return scope.includes("after-hours");
        },
      },
```

- [ ] **Step 2: Skip the `current-site` step for greenfield clients**

In `schema.ts`, on the `current-site` step, add:

```ts
    visibleWhen: (s) => {
      // Greenfield clients with no current URL AND no answers in this step
      // don't need to see it. We still keep it visible until they've made a
      // choice on step 0 — the predicate runs against current state.
      const url  = typeof s.currentUrl  === "string" ? s.currentUrl.trim()  : "";
      const work = typeof s.siteWorking === "string" ? s.siteWorking.trim() : "";
      const brok = typeof s.siteBroken  === "string" ? s.siteBroken.trim()  : "";
      // Show the step UNLESS the user has explicitly marked themselves greenfield
      // by ticking the "no current site" assistant in basics. Until that signal
      // exists, default to showing. (Conservative — never auto-skip a step the
      // user might want.)
      if (url || work || brok) return true;
      return true;
    },
```

> Note: the conservative default (always `true`) is intentional — we ship the predicate infrastructure now and tighten the trigger in a follow-up after the basics step gains a "Do you have a current site?" radio. Filed as TODO in Task 3e.

### Task 3c: Filter hidden fields in `Fields`

- [ ] **Step 1: Modify `Fields` in `Field.tsx`**

Replace the body of `export function Fields(...)` with:

```tsx
export function Fields({ step, state, setField }: FieldsProps) {
  const visibleFields = step.fields.filter((f) => !f.visibleWhen || f.visibleWhen(state));
  const allShort = visibleFields.every((f) => f.kind === "text" || f.kind === "url");
  const useGrid = allShort && visibleFields.length >= 2 && visibleFields.length <= 4;
  return (
    <div className={useGrid ? "ob-fields ob-fields--grid" : "ob-fields"}>
      {visibleFields.map((field) => (
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
```

### Task 3d: Hidden fields don't block step completion

- [ ] **Step 1: Modify `stepComplete` in `schema.ts`**

Replace `stepComplete` with:

```ts
export function stepComplete(step: StepDef, state: FormState): boolean {
  return step.fields.every((f) => {
    if (f.visibleWhen && !f.visibleWhen(state)) return true; // hidden → satisfied
    return fieldComplete(f, state[f.id]);
  });
}
```

### Task 3e: Filter step list at the wizard layer

- [ ] **Step 1: Add a `visibleSteps` selector in `Wizard.tsx`**

At the top of the `Wizard` component, before `const totalSteps`:

```tsx
const visibleSteps = useMemo(
  () => OB_STEPS.filter((s) => !s.visibleWhen || s.visibleWhen(state)),
  [state],
);
const totalSteps = visibleSteps.length;
```

Then replace every other `OB_STEPS`/`totalSteps` reference inside `Wizard` with `visibleSteps` / the new `totalSteps`.

- [ ] **Step 2: Mirror the change in `OnboardingApp.tsx`**

`goToReview` and `completedSteps` both index against `OB_STEPS`. Replace the `useMemo` with:

```tsx
const visibleSteps = useMemo(
  () => OB_STEPS.filter((s) => !s.visibleWhen || s.visibleWhen(state)),
  [state],
);
const completedSteps = useMemo(() => {
  const set = new Set<number>();
  visibleSteps.forEach((step, i) => {
    if (visited.has(i) && stepComplete(step, state)) set.add(i);
  });
  return set;
}, [state, visited, visibleSteps]);
const goToReview = useCallback(() => setStepIndex(visibleSteps.length), [visibleSteps.length]);
```

> The `stepIndex === OB_STEPS.length` check in `renderScreen` becomes `stepIndex >= visibleSteps.length`.

- [ ] **Step 3: Build + smoke-test**

Run: `npm run build && npm run dev`
Manual: open `/brief`, navigate to the assistant step, pick only "Skip — site only", confirm `Hours of operation` and `After-hours behaviour` are gone. Pick "Capture leads"; confirm `Hours of operation` returns; confirm `After-hours behaviour` only appears when "Handle after-hours inquiries" is ticked.

- [ ] **Step 4: TODO comment for the greenfield trigger**

Inline in `schema.ts` under the `current-site` step's `visibleWhen`, add:
```
// TODO(brief-greenfield): wire to a "Do you have a current site?" Yes/No
// radio added to the `basics` step in a follow-up.
```

- [ ] **Step 5: Commit**

```bash
git add components/onboarding/lib/types.ts components/onboarding/lib/schema.ts \
        components/onboarding/controls/Field.tsx components/onboarding/Wizard.tsx \
        components/onboarding/OnboardingApp.tsx
git commit -m "feat(brief): visibleWhen for conditional fields + steps"
```

---

## Task 4: Item #1 — Real file uploads to Supabase Storage

**Files:**
- Modify: `components/onboarding/lib/types.ts` (expand `FileInfo`)
- Create: `app/api/brief/upload-url/route.ts`
- Modify: `components/onboarding/controls/Field.tsx` (`FileField`)
- Modify: `components/onboarding/lib/prompt.ts` (print file URLs)

### Task 4a: Expand `FileInfo`

- [ ] **Step 1: Replace the `FileInfo` interface in `types.ts` with**

```ts
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  /** Object key inside the `brief-uploads` Supabase Storage bucket. */
  path?: string;
  /** Public-readable signed URL, valid for 7 days. Regenerated server-side
   *  when the brief is opened in /admin/briefs. */
  url?: string;
  /** Upload status, used by the UI to render a progress chip. */
  status?: "pending" | "uploading" | "uploaded" | "error";
  /** Set when status === "error". Surfaced as a tooltip on the row. */
  error?: string;
}
```

- [ ] **Step 2: Verify TS**

Run: `npx tsc --noEmit`
Expected: PASS.

### Task 4b: Signed-upload-URL endpoint

- [ ] **Step 1: Create `app/api/brief/upload-url/route.ts`**

```ts
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

interface Body {
  draftId: string;
  filename: string;
  size: number;
  type: string;
}

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB per file
const ALLOWED_PREFIXES = ["image/", "video/", "application/pdf", "application/zip",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

function isAllowedType(t: string): boolean {
  return ALLOWED_PREFIXES.some((p) => t === p || t.startsWith(p));
}

export async function POST(req: Request) {
  let body: Body;
  try { body = (await req.json()) as Body; }
  catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  if (!body.draftId || !body.filename || !body.size || !body.type) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
  if (body.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File too large (50 MB max)" }, { status: 413 });
  }
  if (!isAllowedType(body.type)) {
    return NextResponse.json({ ok: false, error: "Unsupported file type" }, { status: 415 });
  }

  // Sanitize the original filename: keep extension, slug the stem, prefix uuid
  // so we never collide and never trust user input as a path.
  const safe = body.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${body.draftId}/${randomUUID()}-${safe}`;

  const { data, error } = await supabaseAdmin.storage
    .from("brief-uploads")
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[/api/brief/upload-url] createSignedUploadUrl failed:", error);
    return NextResponse.json({ ok: false, error: "Could not prepare upload" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path, token: data.token, signedUrl: data.signedUrl });
}
```

- [ ] **Step 2: Verify route compiles**

Run: `npm run build`
Expected: PASS.

### Task 4c: Wire the drop zone to do real uploads

- [ ] **Step 1: Add a `uploadOne` helper near the top of `Field.tsx`**

Inside the `FileField` function, before `if (field.multiple)`:

```tsx
import { supabaseBrowser } from "@/lib/supabase/browser";

async function uploadOne(file: File, draftId: string): Promise<FileInfo> {
  const base: FileInfo = { name: file.name, size: file.size, type: file.type, status: "uploading" };
  try {
    const res = await fetch("/api/brief/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId, filename: file.name, size: file.size, type: file.type }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ...base, status: "error", error: body.error || `Upload prep failed (${res.status})` };
    }
    const { path, token } = (await res.json()) as { path: string; token: string };

    const { error } = await supabaseBrowser.storage
      .from("brief-uploads")
      .uploadToSignedUrl(path, token, file, { contentType: file.type });
    if (error) return { ...base, status: "error", error: error.message };

    // Issue a 7-day signed download URL so the admin/Zapier flow can fetch it.
    const { data: signed, error: signErr } = await supabaseBrowser.storage
      .from("brief-uploads")
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (signErr || !signed) return { ...base, status: "error", error: "Could not sign download URL" };

    return { name: file.name, size: file.size, type: file.type, path, url: signed.signedUrl, status: "uploaded" };
  } catch (e) {
    return { ...base, status: "error", error: e instanceof Error ? e.message : "Upload failed" };
  }
}
```

> Note: the import at the top of `Field.tsx` block — promote it to the top imports section of the file, not duplicated.

- [ ] **Step 2: Replace the `addFiles` body in the `multiple` branch**

```tsx
const addFiles = async (files: FileList | null) => {
  if (!files || !files.length) return;
  const draftId = ensureDraftId();
  // Optimistically add "pending" rows so the user sees progress.
  const pending: FileInfo[] = Array.from(files).map((f) => ({
    name: f.name, size: f.size, type: f.type, status: "pending",
  }));
  onChange((prev) => {
    const cur = (Array.isArray(prev) && prev.length && typeof prev[0] === "object")
      ? (prev as FileInfo[]) : [];
    const seen = new Set(cur.map((f) => f.name + ":" + f.size));
    return [...cur, ...pending.filter((f) => !seen.has(f.name + ":" + f.size))];
  });

  // Upload sequentially — limits concurrent connections + simpler error UX.
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const info = await uploadOne(file, draftId);
    onChange((prev) => {
      if (!Array.isArray(prev)) return prev;
      const arr = prev as FileInfo[];
      return arr.map((row) =>
        row.name === info.name && row.size === info.size && row.status !== "uploaded"
          ? info : row
      );
    });
  }
};
```

- [ ] **Step 3: Same change in the single-file branch**

```tsx
const onFiles = async (files: FileList | null) => {
  if (!files || !files.length) return;
  const draftId = ensureDraftId();
  onChange({ name: files[0].name, size: files[0].size, type: files[0].type, status: "uploading" });
  const info = await uploadOne(files[0], draftId);
  onChange(info);
};
```

- [ ] **Step 4: Add `ensureDraftId` to `storage.ts`**

Append to `storage.ts`:

```ts
const DRAFT_ID_KEY = "tharros_ob_draft_id_v1";

export function ensureDraftId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    const existing = window.localStorage.getItem(DRAFT_ID_KEY);
    if (existing) return existing;
    const fresh = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
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
```

Then import it at the top of `Field.tsx`:
```tsx
import { ensureDraftId } from "../lib/storage";
```

### Task 4d: Render upload status

- [ ] **Step 1: Update the file row JSX in `FileField`**

Replace the `<div className="ob-file__item">` row with:

```tsx
<div
  className={`ob-file__item is-${f.status ?? "uploaded"}`}
  title={f.error || (f.url ? f.url : "")}
>
  {f.status === "uploading" || f.status === "pending"
    ? <span className="ob-file__spinner" aria-hidden="true" />
    : f.status === "error"
      ? <IconX size={14} />
      : <IconCheck size={14} />}
  <span>{f.name}</span>
  <span className="size">{(f.size / 1024).toFixed(1)} kB</span>
  {f.status === "error" && <span className="ob-file__err">{f.error}</span>}
  <button type="button" onClick={() => removeAt(i)} aria-label={`Remove ${f.name}`}>
    <IconX size={14} />
  </button>
</div>
```

- [ ] **Step 2: Add minimal CSS for the spinner and error state**

Append to `components/onboarding/onboarding.css`:

```css
.ob-file__spinner {
  display: inline-block; width: 12px; height: 12px;
  border: 1.5px solid color-mix(in oklab, var(--color-text) 30%, transparent);
  border-top-color: var(--color-text);
  border-radius: 50%;
  animation: ob-spin 0.7s linear infinite;
}
@keyframes ob-spin { to { transform: rotate(360deg); } }
.ob-file__item.is-uploading,
.ob-file__item.is-pending { opacity: 0.7; }
.ob-file__item.is-error { color: #ef4444; }
.ob-file__err { font-size: 11px; opacity: 0.8; }
```

### Task 4e: Print file URLs in the merged prompt

- [ ] **Step 1: Update the file-multiple branch of `formatField` in `prompt.ts`**

```ts
  if (field.kind === "file") {
    if (field.multiple) {
      if (!Array.isArray(value) || value.length === 0) return "_(not provided)_";
      const files = value as Array<{ name: string; size: number; url?: string }>;
      return "\n" + files.map((f) =>
        f.url
          ? `  - \`${f.name}\` (${(f.size / 1024).toFixed(1)} kB) — ${f.url}`
          : `  - \`${f.name}\` (${(f.size / 1024).toFixed(1)} kB) — *upload incomplete*`
      ).join("\n");
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) return "_(not provided)_";
    const f = value as { name: string; size: number; url?: string };
    return `\`${f.name}\` (${(f.size / 1024).toFixed(1)} kB)${f.url ? ` — ${f.url}` : ""}`;
  }
```

- [ ] **Step 2: Update the "Files uploaded" block in `buildPrompt` (around the `## 8. Timeline & assets` section)**

```ts
  const assetFiles = get("assetFiles");
  if (Array.isArray(assetFiles) && assetFiles.length) {
    lines.push("- **Files uploaded:**");
    (assetFiles as Array<{ name: string; size: number; url?: string }>).forEach((f) => {
      lines.push(`  - \`${f.name}\` (${(f.size / 1024).toFixed(1)} kB)${f.url ? ` — ${f.url}` : ""}`);
    });
  } else {
    lines.push("- **Files:** none uploaded.");
  }
```

> Drops the "request actual files in follow-up" line — uploads are real now.

- [ ] **Step 3: Smoke test**

Run: `npm run dev`. Open `/brief`, navigate to step 8, drop in a small image.
Expected: row shows a spinner, then a check, then on review the merged prompt prints the signed URL.
Verify in Supabase: `mcp__plugin_supabase_supabase__list_tables` won't show storage objects — use the dashboard for visual confirmation, or `mcp__plugin_supabase_supabase__execute_sql` with `select name from storage.objects where bucket_id='brief-uploads' order by created_at desc limit 5;`.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/server.ts lib/supabase/browser.ts \
        app/api/brief/upload-url/route.ts \
        components/onboarding/lib/types.ts components/onboarding/lib/storage.ts \
        components/onboarding/controls/Field.tsx components/onboarding/lib/prompt.ts \
        components/onboarding/onboarding.css
git commit -m "feat(brief): real file uploads to Supabase Storage"
```

---

## Task 5: Item #3 — Server-side drafts + magic-link resume

### Task 5a: Email field moves earlier (or autosave when supplied)

The user's call-out: capture email "early (step 1 or step 2 as optional)". Decision: **don't move the contact step**. Instead, add an inline "Save & email me a link" CTA that opens a small inline form when clicked. Reason: rearranging step 9 → step 1 would jar returning users and reshape the merged prompt's "## 9. Contact" section. The CTA approach is reversible.

### Task 5b: Endpoint: upsert a draft

**Files:**
- Create: `app/api/brief/draft/route.ts`

- [ ] **Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface Body {
  draftId: string;        // client-side uuid from ensureDraftId()
  state: Record<string, unknown>;
  stepIndex: number;
  visited: number[];
  email?: string;         // when supplied, also returns the magic token
}

export async function POST(req: Request) {
  let body: Body;
  try { body = (await req.json()) as Body; }
  catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  if (!body.draftId) return NextResponse.json({ ok: false, error: "Missing draftId" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("brief_drafts")
    .upsert({
      id: body.draftId,
      state: body.state ?? {},
      step_index: body.stepIndex ?? -1,
      visited: body.visited ?? [],
      email: body.email ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" })
    .select("id, token, updated_at")
    .single();

  if (error || !data) {
    console.error("[/api/brief/draft] upsert failed:", error);
    return NextResponse.json({ ok: false, error: "Could not save draft" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id, token: data.token, updatedAt: data.updated_at });
}
```

### Task 5c: Endpoint: load a draft by token

**Files:**
- Create: `app/api/brief/draft/[token]/route.ts`

- [ ] **Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("brief_drafts")
    .select("id, state, step_index, visited, updated_at, email")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[/api/brief/draft/[token]] read failed:", error);
    return NextResponse.json({ ok: false, error: "Lookup failed" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, draft: data });
}
```

### Task 5d: Endpoint: send-the-link

**Files:**
- Create: `app/api/brief/resume-link/route.ts`

- [ ] **Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface Body { draftId: string; email: string }

export async function POST(req: Request) {
  let body: Body;
  try { body = (await req.json()) as Body; }
  catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  // Loose email sanity check — full RFC compliance is overkill here.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("brief_drafts")
    .update({ email: body.email })
    .eq("id", body.draftId)
    .select("token")
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Draft not found" }, { status: 404 });
  }

  const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca"}/brief?resume=${data.token}`;
  await resend.emails.send({
    from: "Tharros <briefs@tharros.ca>",
    to: body.email,
    subject: "Your Tharros brief — pick up where you left off",
    text: `Click to resume your brief on any device:\n${link}\n\nThe link will keep working until you submit the brief.`,
  });

  return NextResponse.json({ ok: true });
}
```

### Task 5e: Client autosave + hydrate from token

**Files:**
- Modify: `components/onboarding/lib/storage.ts`
- Modify: `components/onboarding/OnboardingApp.tsx`
- Modify: `components/onboarding/Wizard.tsx` (add the resume-link CTA)

- [ ] **Step 1: Add server-sync helpers to `storage.ts`**

```ts
export async function syncDraftToServer(args: {
  draftId: string;
  state: FormState;
  stepIndex: number;
  visited: number[];
  email?: string;
}): Promise<{ token: string; updatedAt: string } | null> {
  try {
    const res = await fetch("/api/brief/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.ok ? { token: body.token, updatedAt: body.updatedAt } : null;
  } catch { return null; }
}

export async function loadDraftFromToken(token: string): Promise<{
  state: FormState; stepIndex: number; visited: number[]; email: string | null;
} | null> {
  try {
    const res = await fetch(`/api/brief/draft/${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    const body = await res.json();
    if (!body.ok) return null;
    return {
      state: body.draft.state ?? {},
      stepIndex: body.draft.step_index ?? -1,
      visited: body.draft.visited ?? [],
      email: body.draft.email,
    };
  } catch { return null; }
}
```

- [ ] **Step 2: Update `OnboardingApp.tsx` autosave effect**

Replace the autosave `useEffect` with:

```tsx
const [savedAt, setSavedAt] = useState<number | null>(null);

useEffect(() => {
  if (saveTimer.current) window.clearTimeout(saveTimer.current);
  saveTimer.current = window.setTimeout(async () => {
    saveDraft(state, stepIndex, [...visited]); // fast local cache
    const draftId = ensureDraftId();
    const result = await syncDraftToServer({
      draftId, state, stepIndex, visited: [...visited],
    });
    if (result) setSavedAt(Date.now());
  }, 600);
  return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
}, [state, stepIndex, visited]);
```

- [ ] **Step 3: Hydrate from `?resume=<token>` on mount**

In the initial `useEffect`:

```tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("resume");
  if (token) {
    loadDraftFromToken(token).then((d) => {
      if (!d) return;
      setState({ ...defaultState(), ...d.state });
      setStepIndex(d.stepIndex);
      setVisited(new Set(d.visited));
    });
    return;
  }
  const loaded = loadDraft();
  if (loaded) setState(loaded);
  const meta = loadDraftMeta();
  if (meta) {
    if (typeof meta.stepIndex === "number") setStepIndex(meta.stepIndex);
    if (Array.isArray(meta.visited)) setVisited(new Set(meta.visited));
  }
}, []);
```

- [ ] **Step 4: Add the "Email me a link" CTA**

In `Wizard.tsx`, inside the `ob-side__sticky` block (right under the subtitle), add:

```tsx
<ResumeLinkCTA email={typeof state.email === "string" ? state.email : ""} />
```

And define the component at the bottom of the file:

```tsx
function ResumeLinkCTA({ email: initial }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!open) {
    return (
      <button type="button" className="ob-side__link" onClick={() => setOpen(true)}>
        Save & email me a link →
      </button>
    );
  }
  return (
    <form
      className="ob-side__resume"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("sending");
        const draftId = ensureDraftId();
        const res = await fetch("/api/brief/resume-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftId, email }),
        });
        setStatus(res.ok ? "sent" : "error");
      }}
    >
      <input
        type="email"
        required
        placeholder="you@business.ca"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" disabled={status === "sending"}>
        {status === "sent" ? "Sent ✓" : status === "sending" ? "Sending…" : "Send link"}
      </button>
      {status === "error" && <span className="error">Try again in a moment.</span>}
    </form>
  );
}
```

Plus minimal CSS — append to `onboarding.css`:

```css
.ob-side__link { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--color-accent-3); margin-top: 16px; background: none; border: 0; cursor: pointer; }
.ob-side__resume { display: grid; gap: 8px; margin-top: 16px; }
.ob-side__resume input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  color: var(--color-text); padding: 8px 10px; font-size: 13px; }
.ob-side__resume button { background: var(--color-accent-3); color: #000; padding: 8px 12px;
  font-weight: 700; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; border: 0; }
.ob-side__resume .error { color: #ef4444; font-size: 11px; }
```

- [ ] **Step 5: Test end-to-end**

Run: `npm run dev`. Fill basics, request a link with a personal email, click the link in a different browser → state restores.
Expected: state + step + visited restored; subsequent autosaves continue to update the same draft row.

- [ ] **Step 6: Commit**

```bash
git add app/api/brief/draft \
        app/api/brief/resume-link \
        components/onboarding/lib/storage.ts \
        components/onboarding/OnboardingApp.tsx \
        components/onboarding/Wizard.tsx \
        components/onboarding/onboarding.css
git commit -m "feat(brief): server-side drafts + magic-link resume"
```

---

## Task 6: Item #4 — Anti-spam on `/api/brief`

**Files:**
- Create: `lib/ratelimit.ts`
- Modify: `app/api/brief/route.ts`
- Modify: `components/onboarding/OnboardingApp.tsx` (send honeypot)

### Task 6a: Rate-limit helper

- [ ] **Step 1: Write `lib/ratelimit.ts`**

```ts
import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// 5 submissions per IP per hour is plenty for a real client — anything faster
// is either a typo retry (debounced upstream) or abuse.
export const briefRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "tharros:brief",
});

export function ipFrom(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anon";
}
```

### Task 6b: Add honeypot + limiter to the submit route

- [ ] **Step 1: Replace `app/api/brief/route.ts` body**

```ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { briefRateLimit, ipFrom } from "@/lib/ratelimit";

interface Payload {
  source?: string;
  id: string;
  timestamp: string;
  state: Record<string, unknown>;
  prompt: string;
  draftId?: string;
  /** Honeypot — must be empty. Real users can't see this field. */
  company_name_alt?: string;
}

export async function POST(req: Request) {
  let payload: Payload;
  try { payload = (await req.json()) as Payload; }
  catch { return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 }); }

  // Honeypot: discard silently with a 200 so bots can't fingerprint the rule.
  if (payload.company_name_alt && payload.company_name_alt.trim().length > 0) {
    console.warn("[/api/brief] honeypot tripped from", ipFrom(req));
    return NextResponse.json({ ok: true, accepted: true });
  }

  const ip = ipFrom(req);
  const rl = await briefRateLimit.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  // Write the canonical submission row. RLS is on but service-role bypasses it.
  const state = payload.state as Record<string, unknown>;
  const { error: dbErr } = await supabaseAdmin.from("brief_submissions").insert({
    draft_id: payload.draftId ?? null,
    state,
    prompt: payload.prompt,
    business_name: typeof state.businessName === "string" ? state.businessName : null,
    owner_name:    typeof state.ownerName === "string"    ? state.ownerName    : null,
    email:         typeof state.email === "string"        ? state.email        : null,
  });
  if (dbErr) {
    console.error("[/api/brief] insert failed:", dbErr);
    // Continue to forward anyway — Zapier copy is a backup, not the source of truth.
  }

  const webhook = process.env.THARROS_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[/api/brief] Webhook responded ${res.status}`);
      return NextResponse.json({ ok: true, forwarded: false, webhookStatus: res.status });
    }
    // Mark the row as forwarded — best-effort, fire-and-forget.
    await supabaseAdmin
      .from("brief_submissions")
      .update({ forwarded: true })
      .eq("id", payload.id)
      .catch(() => {});
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (e) {
    console.error("[/api/brief] Webhook fetch failed:", e);
    return NextResponse.json({ ok: true, forwarded: false });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "POST a submission payload — see /brief for the form" },
    { status: 405 },
  );
}
```

### Task 6c: Render the honeypot field in the wizard

The honeypot is the field bots will fill in; humans never see it.

- [ ] **Step 1: Add a hidden input to `Wizard.tsx`**

At the bottom of the `ob-card` `<div>` (still inside the step), add:

```tsx
{/* Honeypot — must remain visually hidden. Don't remove. */}
<div className="ob-honeypot" aria-hidden="true">
  <label>Company name (do not fill)
    <input
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={typeof state.company_name_alt === "string" ? state.company_name_alt : ""}
      onChange={(e) => setField("company_name_alt", e.target.value)}
    />
  </label>
</div>
```

CSS — append:
```css
.ob-honeypot {
  position: absolute; left: -9999px; width: 1px; height: 1px;
  overflow: hidden; opacity: 0;
}
```

- [ ] **Step 2: Pass `company_name_alt` through `submit` in `OnboardingApp.tsx`**

Modify the `submit` callback's `body` to include `company_name_alt: state.company_name_alt`. The state already round-trips it because of generic `setField`, but the explicit field is helpful documentation.

- [ ] **Step 3: Test**

```bash
curl -i -X POST http://localhost:3000/api/brief \
  -H "Content-Type: application/json" \
  -d '{"id":"hp-test","timestamp":"2026-05-19","state":{},"prompt":"","company_name_alt":"acme"}'
```
Expected: 200 + `{"ok":true,"accepted":true}` (silent drop).

```bash
for i in {1..7}; do curl -s -o /dev/null -w "%{http_code} " \
  -X POST http://localhost:3000/api/brief \
  -H "Content-Type: application/json" \
  -d '{"id":"rl-'$i'","timestamp":"x","state":{},"prompt":""}'; done; echo
```
Expected: first ~5 return 200, then 429.

- [ ] **Step 4: Commit**

```bash
git add lib/ratelimit.ts app/api/brief/route.ts \
        components/onboarding/Wizard.tsx components/onboarding/OnboardingApp.tsx \
        components/onboarding/onboarding.css
git commit -m "feat(brief): honeypot + Upstash rate limit on /api/brief"
```

---

## Task 7: Item #5 — Saved-indicator pill

**Files:**
- Create: `components/onboarding/SavedPill.tsx`
- Modify: `components/onboarding/OnboardingApp.tsx` (pass `savedAt`)
- Modify: `components/onboarding/onboarding.css`

- [ ] **Step 1: Write `SavedPill.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

interface Props { savedAt: number | null }

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5)   return "just now";
  if (seconds < 60)  return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function SavedPill({ savedAt }: Props) {
  // Tick every 15s so "12 min ago" updates without rerendering the whole form.
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, []);

  if (!savedAt) return null;
  return (
    <div className="ob-saved-pill" role="status" aria-live="polite">
      <span className="dot" />
      Saved {timeAgo(savedAt)}
    </div>
  );
}
```

- [ ] **Step 2: Mount in `OnboardingApp.tsx`**

Right before the closing `</main>` of `ob-stage`, add:

```tsx
<SavedPill savedAt={savedAt} />
```

Import it at the top.

- [ ] **Step 3: CSS**

Append to `onboarding.css`:

```css
.ob-saved-pill {
  position: fixed; right: 16px; bottom: 16px;
  z-index: 50;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 12px; letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  pointer-events: none;
}
.ob-saved-pill .dot {
  width: 6px; height: 6px;
  background: var(--color-accent-3);
  border-radius: 50%;
}
@media (prefers-reduced-motion: no-preference) {
  .ob-saved-pill { transition: opacity 0.3s ease; }
}
```

- [ ] **Step 4: Test**

Run: `npm run dev`. Type in any field; the pill should appear within ~1s of pause and update its "X min ago" label.

- [ ] **Step 5: Commit**

```bash
git add components/onboarding/SavedPill.tsx \
        components/onboarding/OnboardingApp.tsx \
        components/onboarding/onboarding.css
git commit -m "feat(brief): floating saved-indicator pill"
```

---

## Task 8: Item #6 — Mobile step-sidebar dropdown

**Files:**
- Create: `components/onboarding/controls/MobileStepSelect.tsx`
- Modify: `components/onboarding/Wizard.tsx`
- Modify: `components/onboarding/onboarding.css`

- [ ] **Step 1: Write `MobileStepSelect.tsx`**

```tsx
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

  // Click-outside to dismiss — keep the surface small and unfussy.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const c = steps[current];
  return (
    <div className="ob-msteps" ref={wrapRef}>
      <button
        type="button"
        className="ob-msteps__trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Step {String(current + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}</span>
        <strong>{c?.name}</strong>
        <span className="caret" aria-hidden="true">▾</span>
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
                <span>{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Mount in `Wizard.tsx`**

Just above the existing `<ul className="ob-steps">`, render:

```tsx
<MobileStepSelect
  steps={stepMeta.map((s) => ({ id: s.id, name: s.name, locked: s.locked }))}
  current={stepIndex}
  onPick={(i) => goTo(i)}
/>
```

Import it.

- [ ] **Step 3: CSS — show the dropdown on narrow viewports, hide the long list**

Append to `onboarding.css`:

```css
.ob-msteps { display: none; }

.ob-msteps__trigger {
  display: flex; align-items: center; gap: 10px;
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 12px 14px;
  color: var(--color-text);
  font: inherit; text-align: left;
}
.ob-msteps__trigger span { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.7; }
.ob-msteps__trigger strong { font-size: 14px; flex: 1; }
.ob-msteps__trigger .caret { font-size: 13px; opacity: 0.7; }

.ob-msteps__menu {
  list-style: none; margin: 6px 0 0; padding: 6px;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(255,255,255,0.1);
  max-height: 70vh; overflow-y: auto;
}
.ob-msteps__menu li button {
  display: flex; gap: 12px; align-items: center;
  width: 100%; padding: 10px 12px;
  background: none; border: 0; color: var(--color-text);
  font: inherit; text-align: left;
}
.ob-msteps__menu li button:disabled { opacity: 0.4; }
.ob-msteps__menu li button.is-current { background: rgba(14, 165, 233, 0.12); }
.ob-msteps__menu .n { font-family: ui-monospace, monospace; font-size: 12px; opacity: 0.6; min-width: 26px; }

@media (max-width: 760px) {
  .ob-msteps { display: block; margin-bottom: 12px; }
  .ob-side .ob-steps { display: none; }
}
```

- [ ] **Step 4: Test**

Run: `npm run dev`. Open `/brief` at viewport widths 375px and 1280px.
Expected: at 375px, the long step list is gone and the dropdown appears; tapping it opens the menu; tapping a step navigates. At 1280px, no dropdown, original sidebar.

- [ ] **Step 5: Commit**

```bash
git add components/onboarding/controls/MobileStepSelect.tsx \
        components/onboarding/Wizard.tsx \
        components/onboarding/onboarding.css
git commit -m "feat(brief): mobile step-selector dropdown"
```

---

## Task 9: Admin view reads from Supabase

**Files:**
- Modify: `app/admin/briefs/page.tsx`
- Modify: `components/onboarding/AdminApp.tsx`

> Optional but high-value follow-on — surfaces the new server data in the existing admin UI without a rewrite.

- [ ] **Step 1: Convert `app/admin/briefs/page.tsx` to fetch submissions server-side**

```tsx
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/server";
import { AdminApp } from "@/components/onboarding/AdminApp";
import type { Submission } from "@/components/onboarding/lib/types";

export const metadata: Metadata = {
  title: "Briefs · Tharros Admin",
  robots: { index: false, follow: false },
};

async function loadRemote(): Promise<Submission[]> {
  const { data, error } = await supabaseAdmin
    .from("brief_submissions")
    .select("id, created_at, state, prompt")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    timestamp: r.created_at,
    state: r.state as Submission["state"],
    prompt: r.prompt,
  }));
}

export default async function AdminBriefsPage() {
  const remote = await loadRemote();
  return <AdminApp initialRemote={remote} />;
}
```

- [ ] **Step 2: Update `AdminApp` to take `initialRemote` and merge with localStorage**

In `AdminApp.tsx`:

```tsx
interface Props { initialRemote?: Submission[] }

export function AdminApp({ initialRemote = [] }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialRemote);
  ...
  useEffect(() => {
    const local = loadSubmissions();
    // De-dupe by id; remote is authoritative.
    const seen = new Set(initialRemote.map((r) => r.id));
    const merged = [...initialRemote, ...local.filter((r) => !seen.has(r.id))];
    setSubmissions(merged);
    setCurrentId(merged[0]?.id ?? null);
  }, [initialRemote]);
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/briefs/page.tsx components/onboarding/AdminApp.tsx
git commit -m "feat(admin): read brief submissions from Supabase"
```

---

## Task 10: Documentation + final verification

- [ ] **Step 1: Append to `CLAUDE.md` under "Onboarding wizard"**

```markdown
- **Data store:** Supabase project `xbqlfjhriqycqhuiueug` (TharrosDev's ORG). Tables `brief_drafts` (in-progress) and `brief_submissions` (final). Bucket `brief-uploads` is private; admin UI uses 7-day signed URLs. Service-role key is server-only; never imported in a client component.
- **Anti-spam:** `app/api/brief/route.ts` checks a `company_name_alt` honeypot field and rate-limits via Upstash (5 / IP / hour). Don't remove the honeypot input from `Wizard.tsx`.
- **Resume links:** `/brief?resume=<token>` hydrates from `brief_drafts.token`. Tokens never expire client-side; rotate the column in Supabase if a token leaks.
```

- [ ] **Step 2: Full local build**

```bash
npm run lint && npm run build
```
Expected: both PASS.

- [ ] **Step 3: Manual smoke test on `npm run dev`**

Walk through `/brief` end-to-end:
- Upload two files; see signed URLs in the review screen.
- Skip the assistant; confirm the sub-fields hide.
- Open in incognito with the magic link; resume from the saved step.
- Spam-submit; the 6th hit returns 429.

- [ ] **Step 4: Open the PR**

```bash
gh pr create --title "Brief form hardening: uploads, drafts, conditional fields, anti-spam" \
  --body "$(cat <<'EOF'
## Summary
- Real file uploads to Supabase Storage (`brief-uploads`), 50 MB cap, signed URLs in the merged prompt
- `visibleWhen` predicates on `FieldDef` / `StepDef` — assistant sub-fields hide when the user skips
- Server-side draft persistence + magic-link resume (`/brief?resume=<token>`)
- Honeypot + Upstash rate limit (5/IP/hour) on `/api/brief`
- Floating "Saved Xm ago" pill
- Mobile step-list collapses to a dropdown < 760px
- Slider announces label text via `aria-valuetext`

## Test plan
- [ ] `npm run lint && npm run build` pass
- [ ] Upload + signed URL appears in review prompt
- [ ] Hidden fields don't block step completion
- [ ] Magic-link round-trips across browsers
- [ ] Honeypot trip returns 200 silently; 6th request returns 429
- [ ] VoiceOver announces "Conversational" on the slider
- [ ] At 375px, step picker is a dropdown
EOF
)"
```

---

## Self-Review notes

- **Spec coverage:** All 7 listed items have a dedicated task (Tasks 2, 3, 4, 5, 6, 7, 8). Admin migration (Task 9) and docs (Task 10) bring the system to a finished state.
- **No placeholders.** Every step shows the file path, the code, and the verification command.
- **Type consistency.** `FileInfo` is extended once in `types.ts` and used consistently in `Field.tsx`, `prompt.ts`, and `AdminApp.tsx`. `visibleWhen` signature `(state: FormState) => boolean` matches across `FieldDef` and `StepDef`.
- **Open question for the operator:** transactional sender for resume links — plan defaults to Resend; substitute Postmark / SendGrid by replacing the import in `app/api/brief/resume-link/route.ts`. The honeypot field name `company_name_alt` is arbitrary; rename if a real `company_name` field is added later.
