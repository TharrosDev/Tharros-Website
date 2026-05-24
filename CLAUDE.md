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

## Pages & routes

The marketing site is split across three primary pages plus the brief/clients routes. Each section component lives in `components/` and renders on exactly **one** page, so its `§ 0X` eyebrow numeral and top padding are tuned for that page — don't reuse a section on another page without re-checking both.

| Route | File | Sections (in order) |
|---|---|---|
| `/` (Home) | `app/page.tsx` | `HeroSection` (§00) → `ProblemSection` (§01) → `ChatDemoSectionWrapper` (§02, ends the page) → `NextStep` |
| `/product` | `app/product/page.tsx` | `WhatWeBuildsSection` (§01, the 3 agents) → `HowItWorksSection` (§02, process) → `WhyTharrosSection` (§03) → `NextStep` |
| `/pricing` | `app/pricing/page.tsx` | `ModelTiersSection` (§01, package comparison) → `PricingSection` (§02, pricing factors) |
| `/clients` | `app/clients/page.tsx` | `ClientsSection` |
| `/brief` | `app/brief/page.tsx` | Onboarding wizard (see below) |

Notes:
- **First-on-page sections** (`WhatWeBuildsSection`, `ModelTiersSection`) carry `pt-28 md:pt-32 pb-[var(--rhythm-default)]` instead of `rhythm-default` so their content clears the fixed navbar. The `padding-block` shorthand from `.rhythm-default` can't be partially overridden in the same `@layer utilities`, so use explicit `pt`/`pb` utilities here.
- **No footer.** Pages do not render a site footer (`FooterSection.tsx` exists but is unused). Home and Product end on the `NextStep` CTA; Pricing ends on `PricingSection` (which carries its own "Book a call" CTA); Clients ends on `ClientsSection`.
- **`NextStep`** (`components/NextStep.tsx`) is the slim dark cross-page CTA strip that ends Home and Product. It is *not* a content section — keep it lightweight.
- **Nav** (`components/NavBar.tsx`) links to the page routes (`/`, `/product`, `/pricing`, `/clients`) with `usePathname` active-state highlighting — no more in-page anchor scrolling, except the hero's `#demo` "Try the agent" link on Home.
- When you add or move a page, update **four** places: `app/sitemap.ts`, the `siteNavigation` JSON-LD in `app/layout.tsx`, `NavBar.tsx`, and per-page `metadata` + `WebPage`/`BreadcrumbList` JSON-LD (follow the `/clients` page as the template).

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

**Read [`DESIGN.md`](./DESIGN.md) first.** It's the canonical spec for the Field Engineer system. Quick summary:

**Philosophy:** Field Engineer. Typographic + diagrammatic marketing surface that signals modern tech (Geist, schematic SVGs, cobalt) and grounded tradesperson (hairline rules, mono numerals, no decorative noise). Explicitly rejects the slate-on-sky AI-SaaS reflex.

**Surfaces:**
- Light sections (default): `bg-[color:var(--surface)]` (bone-warm `oklch(98% 0.004 80)`), ink text, hairline `--rule` dividers.
- Dark sections (WhyTharros, footer, ChatDemo): `bg-[color:var(--surface-dark)]` (tool-steel graphite `oklch(20% 0.012 250)`), ink-on-dark text, `--rule-on-dark` dividers. `WhatWeBuilds` is a hybrid: a light (`--surface`) header band holding the §01 eyebrow + heading, then a dark band for the agent rows.
- No grid overlays. No scanlines. No decorative blurs.

**Tokens** (defined in `app/globals.css`, OKLCH only, surfaced to Tailwind via `@theme inline`):

| Token | Value | Use |
|---|---|---|
| `--surface` | `oklch(98% 0.004 80)` | Default page background |
| `--surface-dark` | `oklch(20% 0.012 250)` | Dark sections |
| `--ink` | `oklch(18% 0.02 250)` | Primary text on light |
| `--ink-muted` | `oklch(50% 0.015 250)` | Body / secondary text |
| `--ink-on-dark` | `oklch(96% 0.003 80)` | Primary text on dark |
| `--rule` | `oklch(90% 0.005 250)` | Hairline divider |
| `--accent` | `oklch(50% 0.20 260)` | **Cobalt** — the only saturated color |
| `--accent-soft` | `oklch(95% 0.04 260)` | Wash (e.g. On-Call column) |
| `--accent-on-dark` | `oklch(72% 0.18 260)` | Cobalt lifted for dark surfaces |

Cobalt is the only pigment. ≤10% of any visible surface. Sprinkling kills the weight.

**Typography:**
- Geist (display + body) and Geist Mono (numerals, metadata, eyebrows, diagram labels). No third family.
- Type ladder lives in `globals.css` as `.type-display-1` ... `.type-meta` utility classes. Use them; do not hand-roll per-breakpoint font sizes.
- Every meaningful number renders in Geist Mono with `tabular-nums` via the `.num` utility.

**Spacing & structure:**
- `.page-frame` — 12-col asymmetric container, left-set, `max-width: 1480px`.
- `.rhythm-tight | .rhythm-default | .rhythm-breath` — three named vertical paddings via `clamp()`. Stop adding per-section `py-N md:py-M xl:py-O`.
- `.eyebrow` + `§ 0X` mono numeral opens every section.

**Components & wrappers:**
- `.btn-primary` (cobalt) and `.btn-ghost` / `.btn-ghost-on-dark` are the only buttons. Min-height 48px.
- `AnimatedSection` for scroll-triggered slide-up reveals. Respects `useReducedMotion`.
- `<dl class="meta-row">` is the metadata-row pattern (mono `<dt>` faint + `<dd>` ink).
- Diagrams are inline SVG; reference `.diagram` / `.diagram-dark` utility for theming.
- No card pattern. No shadows. Surfaces are flat at rest.

**Legacy aliases still in `globals.css`** (`.primary-button`, `.section-padding`, `.industrial-grid` no-op, `.scanline` no-op): kept only so the untouched `ChatDemoSection` and onboarding wizard still render. Do not use in new code.

**Performance:**
- All below-the-fold sections are `next/dynamic` with `SectionSkeleton` fallback.
- `useIsMobile()` switches the chat demo to `MobileChatConsole` on touch devices.
- Reveals slide-up only (no opacity dependency) so SSR'd content is always visible if JS is slow.

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

## Onboarding wizard

- The discovery-briefing route is `/brief` — a 9-step wizard at `app/brief/page.tsx` rendering `components/onboarding/OnboardingApp` (client component). Schema, prompt builder, and storage are in `components/onboarding/lib/`. Submissions POST to `/api/brief` (writes to `brief_submissions` + forwards to Zapier via `THARROS_WEBHOOK_URL`).
- **Data store:** Supabase project `xbqlfjhriqycqhuiueug` (TharrosDev's ORG). Tables `brief_drafts` (in-progress, upserted on every autosave) + `brief_submissions` (final). Private storage bucket `brief-uploads` holds asset files; admin links use 7-day signed URLs. Service-role key is server-only (`lib/supabase/server.ts`, lazy `supabaseAdmin()`); never import it from a client file.
- **Field schema** supports an optional `visibleWhen: (state) => boolean` predicate on `FieldDef` (in `lib/types.ts`). Hidden fields are treated as satisfied in `stepComplete` and filtered out of the `<Fields>` renderer — see the assistant step's `hoursOfOperation`/`afterHours` for the canonical example. Step-level filtering is **not** implemented; the wizard always walks every `OB_STEPS` entry.
- **Anti-spam:** `/api/brief` checks a `company_name_alt` honeypot input rendered by `Wizard.tsx` (must stay in the DOM but visually hidden). That's the only spam guard on the endpoint; no rate-limit is wired.
- **Admin view** at `/admin/briefs` is gated by HTTP Basic auth in `middleware.ts` (username `magnus`, password from `ADMIN_PASSWORD`). Page is `force-dynamic` and reads from Supabase on every request; AdminApp falls back to the localStorage cache for legacy briefs.

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

The SEO surface area is large. Before touching `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/product/page.tsx`, `app/pricing/page.tsx`, `app/brief/page.tsx`, `app/clients/page.tsx`, or `public/manifest.json`, read [`docs/SEO.md`](./docs/SEO.md).

Key rules:
- Don't break the `@id`-linked JSON-LD graph. Every Organization/LocalBusiness/Service/WebSite reference must resolve.
- Keep "Keep it Local, Keep it Canadian." in `Organization.slogan` and `LocalBusiness.slogan`.
- FAQ entries are SERP rich-snippet bait — when site copy changes (pricing model, retainer terms, service area), update the FAQ block in `app/layout.tsx` to match.

---

## Common pitfalls

- **The site uses Tailwind 4**, not Tailwind 3. No `tailwind.config.ts` — config lives in `app/globals.css` via `@theme inline`.
- **Next.js 16 with Turbopack.** Some older RSC patterns don't apply; check `node_modules/next/dist/docs/` if anything looks unfamiliar.
- **React 19.** Effects fire under stricter rules. `useEffect` cleanup needs to be exact.
- The demo chat uses **`localStorage`** for both rate-limiting and key persistence. SSR-safe by checking `typeof window !== "undefined"` first.

---

## When in doubt

- Read the existing section components before writing a new one — they're consistent in pattern.
- Ask the user before doing anything that touches packaging copy or the JSON-LD graph; both have downstream SEO consequences.
- Don't add backwards-compat shims when removing code. The site is small; delete cleanly.
