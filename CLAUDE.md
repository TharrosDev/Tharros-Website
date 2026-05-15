# Claude Working Notes — Tharros Website

> Keep it Local, Keep it Canadian. 🇨🇦

This file gives an AI coding assistant the context it needs to make safe, on-brand changes to this repo. Read it before generating code.

---

## What this repo is

A Next.js 16 marketing site for **Tharros**, an Ottawa team that builds AI-integrated websites for small businesses. The current business model is:

1. **The Refresh** — website modernization only, project-based, per-call support after launch.
2. **The Integrate** — website + AI agent embedded into the site, project-based, per-call.
3. **The On-Call** — website + agent + monthly retainer for unlimited fixes and new agents.

Do **not** reintroduce older positioning ("training", "coaching", "Digital Workforce", "Setup Sprint", "Operator Program", "Fractional AI Lead", "Recovering time. Rescuing revenue."). The site was pivoted away from those models — anything matching those phrases is a regression.

---

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Lint | `npm run lint` |

Always run `npm run build` before declaring work done. The build includes TypeScript checks and static page generation.

---

## Design system

**Philosophy:** Industrial Executive. High contrast, sharp corners, command-oriented. Avoid soft consumer-app UI.

**Surfaces:**
- Dark sections — `bg-slate-950`, white text, accent strip at top/bottom (`via-white/10`).
- Light sections — `bg-white`, slate-900 text, slate-200 hairline dividers.
- Both use `industrial-grid` and (on dark) optional `scanline` overlay.

**Tokens** (defined in `app/globals.css`, exposed via Tailwind 4 `@theme inline`):

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#020617` (slate-950) | Dark surface base |
| `--color-bg-alt` | `#0f172a` (slate-900) | Secondary dark surface |
| `--color-surface` | `#1e293b` (slate-800) | Card surface on dark |
| `--color-text` | `#f8fafc` (slate-50) | Primary text on dark |
| `--color-accent-3` | `#0ea5e9` (sky-500) | **Brand accent** — every primary action, every highlighted word |
| `--color-accent-bright` | `#38bdf8` (sky-400) | Glow / hover variant |

`accent-3` is *the* brand color. Use it sparingly and intentionally — a single span of `text-accent-3` per heading, a single `primary-button`, a single underline. Sprinkling it everywhere kills its weight.

**Typography:**
- Inter, with display sizes from `text-3xl` (mobile h2) up to `text-[14rem]` (4xl monitors).
- Headings: `tracking-tighter`, `font-bold`, with `<br className="hidden md:block">` for controlled line breaks.
- Labels: `font-black uppercase tracking-[0.3em]` to `tracking-[0.4em]`. This is the "industrial executive" voice in CSS form — use it for chips, eyebrows, badges.
- Body: `text-base` / `text-lg` / `text-xl` ladder with `leading-relaxed font-medium`.

**Components & wrappers:**
- `AnimatedSection` for scroll-triggered fades and scale-ins.
- `Magnetic` for cursor-pull on CTAs.
- `clean-card` is a utility CSS class (`bg-slate-800` surface with rounded card).
- `primary-button` is the accent-3 CTA button.

**Performance:**
- All below-the-fold sections are `next/dynamic` with `SectionSkeleton` fallback.
- `useIsMobile()` switches the chat demo to `MobileChatConsole` on touch devices.
- Animations should use `will-change: transform` or `gpu-accelerated`. No animating box-shadow, no animating background-position on large surfaces.

---

## Voice and copy rules

Read [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md) for the full version. Quick rules:

- **Voice:** decisive, plain, locally grounded. Like a competent tradesperson, not an enterprise CIO.
- **Slogan:** "Keep it Local, Keep it Canadian." — appears in hero chip, footer pill, footer legal strip, why-section subhead, pricing strip, all OG/Twitter metadata, and JSON-LD. Don't remove it.
- **Always use the package names verbatim**: The Refresh, The Integrate, The On-Call. Not "Refresh package", not "Refresh tier".
- **Use "build" not "training" or "deployment".** Use "AI agent" not "chatbot" or "assistant". Use "embed into your site" not "deploy to your site". Use "site" or "website" not "web property".
- **Avoid:** "move the needle", "high-stakes", "Commercial Model", "Operational Excellence", "Neural Logic", "Inquiries" (use "questions" for end-user copy), "Digital Workforce", "Setup Sprint", "Operator Program", "Tailored Builds for Tailored Businesses" (double-tailored is clunky).
- **Apostrophes in JSX:** `&apos;` works in JSX text content only. Inside JS string literals (object props rendered via `{obj.prop}`), use a real `'` character. Same rule for `&mdash;` — JSX text only; use real `—` in JS strings.

---

## Code style

- **TypeScript everywhere**, strict mode.
- **Server components by default**, `"use client"` only when needed (forms, motion, hooks).
- **Tailwind classes ordered roughly:** layout → sizing → spacing → color → typography → effects → state. Long classNames are fine; readability beats density.
- **No new wrapper folders.** Wrappers (`*Wrapper.tsx`) sit next to the components they wrap.
- **No comments explaining what the code does.** Only comment when the *why* would surprise a future reader (a subtle invariant, an SDK quirk, a perf workaround).
- **No `console.log` in committed code.** `console.error` is fine for genuinely unexpected branches.

---

## What's orphaned

- `components/IntakeAgent.tsx` and `components/IntakeAgentWrapper.tsx` are unused leftovers from a previous AI-driven intake design. The current `/intake` page uses `IntakeForm.tsx` (Formspree). Do not import IntakeAgent into anything. Don't refactor it for the sake of refactoring — if the user asks for changes to the intake, work in `IntakeForm.tsx`.

---

## Agent (chat demo) logic

- **Integration:** `@relevanceai/sdk` (`Client`, `Key`, `Agent`).
- **State:** All chat state lives in `ChatDemoSection.tsx`. Don't introduce a global store — three sections of state in one component is fine here.
- **Session limit:** 3 prompts per visitor, persisted in `localStorage` under `pc-<AGENT_ID>`. The embed key and conversation prefix are persisted under `r-<AGENT_ID>`.
- **Recommended questions** come from `agent.config.recommended_questions` or `agent.metadata.recommended_questions` (SDK fallback chain in code). Don't hardcode them.
- **Mobile path:** `MobileChatConsole` — separate render path triggered by `useIsMobile()`.
- **Demo agent voice:** plain, decisive, locally grounded. Mirrors the brand's content rules above. The training material the live agent reads is in [`THARROS_KNOWLEDGE_BASE.md`](./THARROS_KNOWLEDGE_BASE.md) — keep it in sync with site copy.

---

## SEO & metadata

The SEO surface area is large. Before touching `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/intake/page.tsx`, `app/clients/page.tsx`, or `public/manifest.json`, read [`docs/SEO.md`](./docs/SEO.md).

Key rules:
- Don't break the `@id`-linked JSON-LD graph. Every Organization/LocalBusiness/Service/WebSite reference must resolve.
- Keep "Keep it Local, Keep it Canadian." in `Organization.slogan` and `LocalBusiness.slogan`.
- FAQ entries are SERP rich-snippet bait — when site copy changes (pricing model, retainer terms, service area), update the FAQ block in `app/layout.tsx` to match.

---

## Common pitfalls

- **The site uses Tailwind 4**, not Tailwind 3. No `tailwind.config.ts` — config lives in `app/globals.css` via `@theme inline`.
- **Next.js 16 with Turbopack.** Some older RSC patterns don't apply; check `node_modules/next/dist/docs/` if anything looks unfamiliar.
- **React 19.** Effects fire under stricter rules. `useEffect` cleanup needs to be exact.
- The intake form is **Formspree-based**, not a custom endpoint. The form ID is hardcoded.
- The demo chat uses **`localStorage`** for both rate-limiting and key persistence. SSR-safe by checking `typeof window !== "undefined"` first.

---

## When in doubt

- Read the existing section components before writing a new one — they're consistent in pattern.
- Ask the user before doing anything that touches packaging copy or the JSON-LD graph; both have downstream SEO consequences.
- Don't add backwards-compat shims when removing code. The site is small; delete cleanly.
