# Tharros

**Website modernization, AI agent integration, and an On-Call retainer for Ottawa small businesses.**

> Keep it Local, Keep it Canadian. 🇨🇦

This repository hosts the Tharros marketing site — a Next.js application at [https://tharros.ca](https://tharros.ca) — and a separate embeddable Preact chat widget under [`my-chat/`](./my-chat/).

---

## Table of Contents

- [What Tharros Does](#what-tharros-does)
- [The Three Packages](#the-three-packages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Architecture Overview](#architecture-overview)
- [SEO & Metadata](#seo--metadata)
- [Deployment](#deployment)
- [Branch & Contribution Conventions](#branch--contribution-conventions)
- [Further Docs](#further-docs)
- [License](#license)

---

## What Tharros Does

Tharros is an Ottawa-based team that builds and integrates AI agents into modernized small business websites — then stays on call for fixes, improvements, and new agents. One team, one point of contact, working across a diversified stack of tools tuned to the job.

The service model is deliberately small-business shaped:

- A modern site that reflects the operation behind it.
- An AI agent that handles inquiries, captures leads, or covers after-hours intake — embedded directly into the site.
- A phone number you can actually call when things change. Pay per call like a plumber, or put it on a flat monthly retainer.

## The Three Packages

Listed by ascending price. Each shows a "from $X" starting anchor; the final number is scoped on a free discovery call.

| Package | What it is | Starting price | After-launch |
|---|---|---|---|
| **The Refresh** | Modern website only (no agent) | from $1,000 | Per-call support |
| **The On-Call** | Site + monthly retainer (no agent) | from $1,500 + $150/mo | Unlimited site fixes & edits |
| **The Integrate** | Site + AI agent + monthly retainer | from $3,000 + $300/mo | Unlimited fixes, agent upkeep & new agents |

**Launch discount (through Aug 31, 2026):** The Refresh from **$250**, The On-Call build from **$500** (retainer unchanged). The Integrate is not discounted.

The site walks visitors through these packages, demos a live agent, and points to the Discovery Briefing wizard at `/brief`.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 (CSS-first config via `@theme`) |
| Animation | `motion/react` (Framer Motion successor) |
| Live agent demo | `@relevanceai/sdk` |
| Analytics | `@vercel/analytics` |
| Hosting | Vercel (recommended) |

Sub-project (`my-chat/`) — an embeddable chat widget for client deployments:

| Layer | Tech |
|---|---|
| Framework | Preact 10 + Vite 7 |
| State | `@preact/signals` |
| UI | Radix UI + Tailwind CSS 4 + Lucide icons |
| Data fetching | SWR |
| Agent | `@relevanceai/sdk` |
| Tooling | Biome |

## Project Structure

```
.
├── app/                       Next.js App Router
│   ├── layout.tsx             Root layout, metadata, JSON-LD graph
│   ├── page.tsx               Home page composition
│   ├── globals.css            Tailwind 4 theme + design tokens
│   ├── robots.ts              Bot allowlist (search + AI)
│   ├── sitemap.ts             Sitemap with hreflang
│   ├── brief/page.tsx         Discovery Briefing wizard (9 steps)
│   ├── admin/briefs/page.tsx  Admin view of submissions (auth-gated)
│   ├── api/brief/route.ts     Server-side Zapier forwarder
│   └── clients/page.tsx       Build & integration case studies
│
├── components/                All UI sections (see below)
├── hooks/                     useIsMobile (viewport hook)
├── public/                    Static assets, og-image, manifest
│
├── my-chat/                   Embeddable Preact chat widget
│   ├── src/components/        Widget sub-components
│   └── ...
│
├── docs/                      Internal documentation
│   ├── ARCHITECTURE.md        Technical architecture deep-dive
│   ├── CONTENT_GUIDE.md       Voice, copy, terminology rules
│   └── SEO.md                 SEO implementation reference
│
├── CLAUDE.md                  AI coding-assistant guidelines
├── AGENTS.md                  Repo guide for coding agents
├── CONTRIBUTING.md            Contribution conventions
├── THARROS_KNOWLEDGE_BASE.md  Source of truth for the live demo agent
└── README.md                  You are here
```

### Component map

The marketing site is split across three pages. Each section component renders on exactly one page (in order):

**`/` — Home (`app/page.tsx`)**

| Order | Component | Background | Purpose |
|---:|---|---|---|
| 1 | `HeroSection` | dark | Headline, primary CTA, slogan chip |
| 2 | `WorkReel` | light | Full-bleed counter-scrolling showcase reel of example builds + "Who we build for" client-types legend (CTA → `/brief`) |
| 3 | `ProblemSection` | light | Three pain points (missed calls, repeat questions, admin) |
| 4 | `ChatDemoSectionWrapper` → `ChatDemoSection` | dark | Live Relevance AI agent demo — ends the page |
| – | `NextStep` | dark | Cross-page CTA → Product / Pricing |

**`/product` — Product (`app/product/page.tsx`)**

| Order | Component | Background | Purpose |
|---:|---|---|---|
| 1 | `WhatWeBuildsSection` | dark | The three agent patterns |
| 2 | `HowItWorksSection` | light | Discovery → Build & Integrate → Launch & Support |
| 3 | `WhyTharrosSection` | dark | Three pillars + founder quote |
| – | `NextStep` | dark | Cross-page CTA → Pricing / brief |

**`/pricing` — Pricing (`app/pricing/page.tsx`)**

| Order | Component | Background | Purpose |
|---:|---|---|---|
| – | `LaunchCountdown` | light | Launch-discount banner + live countdown (shown while promo active, ends Aug 31, 2026) |
| 1 | `ModelTiersSection` | light | The Refresh / The On-Call / The Integrate comparison + starting prices |
| 2 | `PricingSection` | light | Pricing factors + "starting prices, scoped to the work" (carries its own CTA) |

> **No site footer.** Pages don't render `FooterSection` — it exists in `components/` but is unused. Pages end on `NextStep` (Home/Product), `PricingSection` (Pricing), or `ClientsSection` (Clients).

Cross-cutting components: `NavBar`, `PageTransition`, `BackToTop`, `AnimatedSection`, `Magnetic`, `SectionSkeleton`, `MobileChatConsole`, `NextStep`.

The discovery briefing lives at `/brief` (9-step wizard in `components/onboarding/`). Submissions POST to `/api/brief` which forwards to Zapier server-side; `/admin/briefs` is the auth-gated admin view.

## Local Development

```bash
# Install
npm install

# Dev server (Turbopack)
npm run dev          # http://localhost:3000

# Production build
npm run build

# Lint
npm run lint
```

Working on the chat widget:

```bash
cd my-chat
npm install
npm run dev          # http://localhost:5173
npm run build        # emits to dist/
npm run preview
```

## Environment Variables

The live agent demo on the home page reads three vars at build time:

```env
NEXT_PUBLIC_RELEVANCE_REGION=...
NEXT_PUBLIC_RELEVANCE_PROJECT=...
NEXT_PUBLIC_RELEVANCE_AGENT_ID=...
```

The embeddable widget (`my-chat/`) reads:

```env
VITE_REGION=...
VITE_PROJECT=...
VITE_AGENT_ID=...
VITE_WORKFORCE_ID=...
```

Without these vars, the home-page agent will display `Agent not configured` and the demo will degrade gracefully.

## Architecture Overview

A short list of the choices that matter most when reading the code:

- **Three-page marketing site.** Content is split across `/` (Home), `/product`, and `/pricing` — see the component map above. `HeroSection` and `WorkReel` ship eagerly on Home; every other section is loaded via `next/dynamic` with a `SectionSkeleton` fallback, keeping the initial JS payload tight on mobile. There is no site footer.
- **The live agent runs client-only.** `ChatDemoSection` is wrapped in `ChatDemoSectionWrapper` and uses the Relevance AI SDK directly in the browser; an `EmbedKey` is generated once per visitor and persisted in `localStorage`. Three free prompts per session, enforced via `localStorage` counter.
- **Mobile chat path is separate.** `MobileChatConsole` renders a touch-optimized layout when `useIsMobile()` returns true; the desktop console is inlined in `ChatDemoSection`.
- **Animation primitives, not animation soup.** `AnimatedSection` wraps scroll-triggered fades/scales; `Magnetic` adds cursor-pull to CTAs; `PageTransition` cross-fades between routes. Effects use GPU-accelerated transforms and `will-change: transform`.
- **Design tokens are real CSS variables.** See `app/globals.css` — `--color-bg`, `--color-accent-3`, etc. are exposed to Tailwind 4 via `@theme inline`. The `text-accent-3`, `bg-bg`, `border-border` classes work because of this.
- **JSON-LD is a linked graph, not a list.** `app/layout.tsx` builds one Organization, one LocalBusiness, one Service, one WebSite, one FAQPage, one Person, one SiteNavigationElement, and one BreadcrumbList — all cross-referenced by `@id`. Individual pages inject their own `WebPage` / `ContactPage` / `CollectionPage` + `BreadcrumbList` (e.g. `/product` and `/pricing` each add a `WebPage` linked to `#service`).

For more, see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## SEO & Metadata

This site treats SEO as a feature, not a checklist:

- Linked-entity JSON-LD graph (Organization → LocalBusiness → Service → WebSite → FAQPage → Person → BreadcrumbList).
- FAQPage with 10 questions covering pricing, retainer model, service area, agent types, and onboarding — eligible for SERP rich snippets.
- Geo meta tags (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) for Ottawa local SEO.
- Per-page metadata with `hreflang` alternates (`en-CA`, `x-default`).
- `robots.ts` with explicit allowlists for all major search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, etc.) and disallows for spam scrapers.
- `sitemap.ts` with per-URL hreflang alternates.
- Open Graph + Twitter cards with locale-correct copy.
- Web App Manifest with shortcuts, maskable icons, and `en-CA` locale.

Full reference: [`docs/SEO.md`](./docs/SEO.md).

## Deployment

The site is designed to deploy on Vercel:

1. Connect the repo.
2. Set the four `NEXT_PUBLIC_RELEVANCE_*` environment variables.
3. Push to `main` to deploy production, or to any other branch for a preview deployment.

The `my-chat/` widget builds independently (`cd my-chat && npm run build`) and is intended to be self-hosted at a client subdomain or embedded into client sites via a small `<script>` tag.

## Branch & Contribution Conventions

- **Default branch**: `main` (production).
- **Feature branches**: `claude/<topic>-<slug>` for AI-assisted work, or `feat/<topic>` for human-led work.
- **Commits**: Imperative subject, concise body that explains *why*. No emoji prefixes.
- **Builds must pass** before merge: `npm run build` should compile + typecheck cleanly.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for full guidance.

## Further Docs

- **[`CLAUDE.md`](./CLAUDE.md)** — Guidelines for AI coding assistants working in this repo.
- **[`AGENTS.md`](./AGENTS.md)** — Repo conventions for autonomous coding agents.
- **[`THARROS_KNOWLEDGE_BASE.md`](./THARROS_KNOWLEDGE_BASE.md)** — Source of truth for the live demo agent's training material.
- **[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)** — Technical deep-dive.
- **[`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md)** — Voice, copy, and terminology rules.
- **[`docs/SEO.md`](./docs/SEO.md)** — Full SEO implementation reference.
- **[`my-chat/README.md`](./my-chat/README.md)** — Embeddable widget docs.

## License

Private. All rights reserved by Tharros.
