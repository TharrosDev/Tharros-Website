# Claude Working Notes — Tharros Website

> Keep it Local, Keep it Canadian. 🇨🇦

This file gives an AI coding assistant the context it needs to make safe, on-brand changes to this repo. Read it before generating code.

---

## What this repo is

A Next.js 16 marketing site for **Tharros**, an Ottawa team that builds AI-integrated websites for small businesses. The current business model is three packages, listed by ascending price:

1. **The Refresh** — website modernization only (site, no agent), project-based, per-call support after launch. From **$1,000** (launch from $250).
2. **The On-Call** — website + a flat monthly retainer for unlimited site fixes and edits, **no embedded agent**. From **$1,500 + $150/mo** (launch from $500).
3. **The Integrate** — website + embedded AI agent + a monthly retainer for fixes, agent upkeep, and unlimited new agents. **Flagship / recommended tier.** From **$3,000 + $300/mo**.

Pricing model: the site shows **"from $X" starting anchors**; the final number is scoped on a free discovery call. (Earlier the site showed no prices at all — that "no fixed list" stance is retired.) A **launch discount** runs through **Aug 31, 2026** on The Refresh ($250) and The On-Call ($500); see `components/LaunchCountdown.tsx`.

Do **not** reintroduce older positioning ("training", "coaching", "Digital Workforce", "Setup Sprint", "Operator Program", "Fractional AI Lead", "Recovering time. Rescuing revenue."), and do **not** revert The Integrate to a no-retainer / pay-per-call tier or move the embedded agent into The On-Call — the agent lives only in The Integrate now. Anything matching those is a regression.

---

## Pages & routes

The marketing site is split across three primary pages plus the brief/clients routes. Each section component lives in `components/` and renders on exactly **one** page, so its `§ 0X` eyebrow numeral and top padding are tuned for that page — don't reuse a section on another page without re-checking both.

| Route | File | Sections (in order) |
|---|---|---|
| `/` (Home) | `app/page.tsx` | `HeroSection` (§00) → `WorkReel` (full-bleed selected-work reel, no §-numeral) → `ProblemSection` (§01) → `ChatDemoSectionWrapper` (§02) → `NextStep` (§03) |
| `/product` | `app/product/page.tsx` | `WhatWeBuildsSection` (§01, the 3 agents) → `HowItWorksSection` (§02, process) → `WhyTharrosSection` (§03) → `NextStep` |
| `/pricing` | `app/pricing/page.tsx` | `LaunchCountdown` (launch-discount banner + live countdown, shown while the promo is active) → `ModelTiersSection` (§01, package comparison + starting prices) → `PricingSection` (§02, pricing factors) |
| `/clients` | `app/clients/page.tsx` | `ClientsSection` |
| `/brief` | `app/brief/page.tsx` | Onboarding wizard (see below) |

Notes:
- **`WorkReel`** (`components/WorkReel.tsx` + `WorkReel.module.css`) is the full-bleed counter-scrolling showcase reel sitting between the hero and `ProblemSection` on Home. It's purely presentational — `aria-hidden`, no `§ 0X` eyebrow — and renders as a server component (pure-CSS marquee). Two rows of browser-mockup "builds" scroll in opposite directions; scroll speed is the `SPEED` constant (higher = faster). It closes on a "Who we build for" client-types legend strip whose CTA links to `/brief`. Edges run full-bleed (no side fade) under `prefers-reduced-motion` it becomes a static horizontally-scrollable row.
- **First-on-page sections** (`WhatWeBuildsSection`, `ModelTiersSection`) carry `pt-28 md:pt-32 pb-[var(--rhythm-default)]` instead of `rhythm-default` so their content clears the fixed navbar. The `padding-block` shorthand from `.rhythm-default` can't be partially overridden in the same `@layer utilities`, so use explicit `pt`/`pb` utilities here. On `/pricing`, `LaunchCountdown` carries the nav clearance while the promo is active and `ModelTiersSection` takes a `isFirstOnPage={false}` prop to drop to normal top rhythm; the page gates the banner with `Date.now() < LAUNCH_END` (server-side) so when the promo ends, `ModelTiersSection` becomes first-on-page again and regains its own clearance.
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

**Read [`DESIGN.md`](./DESIGN.md) first.** It's the canonical spec for the **Redline** system (May 2026 rebuild; replaced the calm "Field Engineer" cobalt system). Quick summary:

**Philosophy:** Redline. Vibrant, high-energy marketing surface in white, black, and one committed red. Built to feel alive and eye-catching, the deliberate opposite of the old restrained cobalt system. Oversized weight-700 Geist type, square-cut buttons, bold 2px black / 3px red rules, full-black drama sections, red-drenched CTA strips, and kinetic motion (marquees, scroll-linked fills, sliding red blocks, count-up numerals). Mono metadata layer (Geist Mono numerals, `§ 0X` markers) keeps the grounded tradesperson voice. Still rejects the slate-on-sky AI-SaaS reflex, glassmorphism, and identical icon-card grids.

**Surfaces:**
- Light sections (default): `bg-[color:var(--surface)]` (warm near-white `oklch(99% 0.002 25)`), ink text, `--rule` dividers (lean on 2px black `border-t-2 border-[color:var(--ink)]` for structure). `--surface-alt` for alternate light sections.
- Dark sections (footer, WhatWeBuilds agent rows): `bg-[color:var(--surface-dark)]` (warm near-black `oklch(15% 0.012 25)`), ink-on-dark text, `--rule-on-dark` dividers. `WhatWeBuilds` is a hybrid: a light header band (§01 eyebrow + heading), then a black band for the agent rows. (`WhyTharros` and the `ChatDemo` console are now white.)
- **Live agent console (ChatDemo, §02 Home)** is now on a **white** surface: `border-2` ink frame, solid-black machine header bar (red live dot, mono counter), agent messages plain ink / user messages in right-aligned black bubbles, red Send + suggested-question chips. `ChatDemoSectionWrapper` loads it `ssr: false` with a white skeleton fallback. Console restyle is purely presentational; the Relevance SDK logic, 3-prompt localStorage limit, and `useIsMobile` mobile swap are untouched.
- Red-drenched strips: `NextStep` uses `bg-[color:var(--red-deep)]` with white text + `.btn-ink` CTA.
- No grid overlays. No scanlines. No decorative blurs. No shadows.

**Tokens** (defined in `app/globals.css`, OKLCH only, surfaced to Tailwind via `@theme inline`):

| Token | Value | Use |
|---|---|---|
| `--surface` | `oklch(99% 0.002 25)` | Default page background (warm near-white) |
| `--surface-alt` | `oklch(96.3% 0.005 25)` | Alternate light sections |
| `--surface-dark` | `oklch(15% 0.012 25)` | Black drama sections |
| `--ink` | `oklch(17% 0.012 25)` | Primary text on light |
| `--ink-muted` | `oklch(43% 0.016 25)` | Body / secondary text |
| `--ink-on-dark` | `oklch(97% 0.002 25)` | Primary text on dark |
| `--rule` | `oklch(89% 0.004 25)` | Hairline divider |
| `--red` | `oklch(56% 0.235 25)` | Vibrant red — large text spans, blocks, ticks |
| `--red-deep` (`--accent`) | `oklch(48% 0.225 25)` | Button fill / white-on-red / small red text |
| `--red-bright` (`--accent-on-dark`) | `oklch(66% 0.225 25)` | Red lifted for dark surfaces |
| `--red-soft` (`--accent-soft`) | `oklch(96% 0.035 25)` | Wash (flagship Integrate column) |

Red is the only pigment, but it is **committed, not rationed**: bold red CTAs, one red span per heading, red eyebrow ticks, red-drenched strips, flagship wash. Use vibrant `--red` for large text, `--red-deep` (= `--accent`) wherever white text rides red or small red text sits on white (keeps AA).

**Typography:**
- Geist (display + body) and Geist Mono (numerals, metadata, eyebrows, diagram labels). No third family.
- Type ladder lives in `globals.css` as `.type-display-1` ... `.type-meta` utility classes. Use them; do not hand-roll per-breakpoint font sizes.
- Every meaningful number renders in Geist Mono with `tabular-nums` via the `.num` utility.

**Spacing & structure:**
- `.page-frame` — 12-col asymmetric container, left-set, `max-width: 1480px`.
- `.rhythm-tight | .rhythm-default | .rhythm-breath` — three named vertical paddings via `clamp()`. Stop adding per-section `py-N md:py-M xl:py-O`.
- `.eyebrow` + `§ 0X` mono numeral opens every section.

**Components & wrappers:**
- `.btn-primary` (red fill, white text), `.btn-ink` (black fill, white text, for red surfaces), and `.btn-ghost` / `.btn-ghost-on-dark` / `.btn-ghost-on-red` are the buttons. Square corners (0 radius), min-height 50px. New kinetic helpers in `globals.css`: `.marquee` (+ `components/Marquee.tsx`), `.big-num` (oversized numeral motif), `.red-block`, `.rule-h-bold` / `.rule-h-red`, `.accent-text` (red headline span).
- `AnimatedSection` for scroll-triggered slide-up reveals. Respects `useReducedMotion`.
- `<dl class="meta-row">` is the metadata-row pattern (mono `<dt>` faint + `<dd>` ink).
- **No schematic diagrams.** Redline replaced the old SVG wiring/pipeline schematics with bold motifs: oversized numerals (`.big-num`), sliding red blocks (`.red-block` + motion `scaleX`), marquees, the kinetic HowItWorks rail, and the count-up LaunchCountdown. `components/diagrams/` and the `signal-stack` utility are legacy; don't revive them.
- No card pattern (except `ClientCard`). No shadows. Surfaces are flat at rest.

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
- **Always use the package names verbatim**: The Refresh, The On-Call, The Integrate. Not "Refresh package", not "Refresh tier".
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
