# Architecture

Technical reference for the Tharros website. Read this when you need to understand *why* the code is shaped the way it is, not just *what* it does.

> Companion to [`../README.md`](../README.md) and [`../CLAUDE.md`](../CLAUDE.md).

---

## High-level shape

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Edge / CDN                        │
│  Static HTML, JSON-LD, sitemap.xml, robots.txt, og-image.jpg    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Next.js 16 App Router                     │
│                                                                 │
│   app/layout.tsx ─── Global JSON-LD graph, metadata, NavBar     │
│   app/page.tsx ───── Home page composition                      │
│   app/brief/ ─────── Discovery Briefing wizard (9-step)         │
│   app/admin/briefs ─ Auth-gated admin (middleware Basic auth)   │
│   app/api/brief/ ─── Zapier-forwarding submission endpoint      │
│   app/clients/ ───── Build case studies                         │
│                                                                 │
│   Server-rendered shell. Below-the-fold sections are dynamic.   │
└─────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│  Eager (in initial JS)   │         │  Lazy (next/dynamic)     │
│                          │         │                          │
│  HeroSection             │         │  ProblemSection          │
│  FooterSection           │         │  ChatDemoSection         │
│  NavBar                  │         │  ModelTiersSection       │
│  PageTransition          │         │  WhatWeBuildsSection     │
│                          │         │  HowItWorksSection       │
│                          │         │  WhyTharrosSection       │
│                          │         │  PricingSection          │
└──────────────────────────┘         └──────────────────────────┘
                                                  │
                                                  ▼
                                     ┌──────────────────────────┐
                                     │  Relevance AI SDK        │
                                     │  (client-only, in        │
                                     │   ChatDemoSection only)  │
                                     └──────────────────────────┘
```

---

## Rendering model

- **Server components by default.** Most sections are server components — they emit static markup and ship zero client JS for their contents.
- **`"use client"` only where needed.** Sections using `motion/react`, refs, effects, or browser APIs are client components. This is currently every section except `WhyTharrosSection` (and even that contains client-side `AnimatedSection` children).
- **Dynamic imports for below-the-fold sections.** `app/page.tsx` uses `next/dynamic` with a `SectionSkeleton` fallback for every section except `HeroSection` and `FooterSection`. This keeps the initial JS payload small on mobile, where TTI is most fragile.
- **`PageTransition`** wraps `{children}` in the root layout and cross-fades between routes.

---

## The chat demo

The single most complex piece of code in this repo lives in `components/ChatDemoSection.tsx`.

### Lifecycle

1. **Mount.** Component reads `pc-<AGENT_ID>` from `localStorage` to recover the visitor's prior prompt count. Reads `r-<AGENT_ID>` to recover an existing Relevance AI embed key + conversation prefix, or generates a new one via `Key.generateEmbedKey`.
2. **Agent fetch.** `Agent.get(AGENT_ID, client)` returns an `Agent` instance. The component immediately reads `agent.config.recommended_questions` (with metadata + suggested_queries fallbacks) and surfaces them as starter chips.
3. **Greeting.** A single hardcoded greeting message is inserted into the message list so the console isn't empty.
4. **Send loop.** On submit, the component:
   - Increments the user message count (persisted to `localStorage`).
   - Appends a user message.
   - Calls `agent.sendMessage(text, currentTask)` to get a `Task` instance.
   - Subscribes to `message` events on the task and appends agent messages as they arrive.
5. **Rate limit.** When the count reaches `MAX_PROMPTS` (3), the input disables and the placeholder changes.

### Why two render paths

`useIsMobile()` switches between two consoles:

- **`ChatDemoSection`** has the desktop console inlined. Tall, bordered, with a fixed `Session Limit: 3 Questions` strip.
- **`MobileChatConsole`** is a separate component used on touch devices. Touch-optimized layout, fixed input at bottom.

Both share the same message state, send handler, and rate limit — passed in as props.

### Persistence keys

| Key | Value | Purpose |
|---|---|---|
| `pc-<AGENT_ID>` | Integer | Prompt count for rate limiting |
| `r-<AGENT_ID>` | `{ embedKey, conversationPrefix }` | Reuse agent session across reloads |

---

## Design tokens

`app/globals.css` defines CSS variables and exposes them to Tailwind 4 via `@theme inline`:

```css
:root {
  --color-bg:        #020617;     /* slate-950 */
  --color-bg-alt:    #0f172a;     /* slate-900 */
  --color-surface:   #1e293b;     /* slate-800 */
  --color-surface-2: #334155;     /* slate-700 */
  --color-text:      #f8fafc;     /* slate-50 */
  --color-subdued:   #94a3b8;     /* slate-400 */
  --color-muted:     #475569;     /* slate-600 */
  --color-border:    rgba(255, 255, 255, 0.08);
  --color-accent:    #ffffff;
  --color-accent-2:  #e2e8f0;
  --color-accent-3:  #0ea5e9;     /* sky-500 — brand accent */
  --color-accent-bright: #38bdf8; /* sky-400 */
}
```

Tailwind 4 reads these via `@theme inline { --color-accent-3: var(--color-accent-3); … }`, which is what makes `text-accent-3`, `bg-bg`, `border-border` work as utility classes.

There's no `tailwind.config.ts`. Tailwind 4 is CSS-first.

### Utility classes worth knowing

- `industrial-grid` — geometric grid overlay used as section background.
- `scanline` — subtle CRT scanline effect on dark surfaces.
- `clean-card` — slate-800 card surface with rounded corners.
- `primary-button` — accent-3 CTA button.
- `gpu-accelerated` — applies `transform: translateZ(0)` and `will-change: transform` for hardware-accelerated layers.
- `content-visibility-auto` — opt-in `content-visibility: auto` for off-screen sections.

---

## Animations

Three layers, in increasing order of cost:

1. **CSS transitions.** Hover states, color changes, border morphs. Cheap and pervasive.
2. **`AnimatedSection`.** Scroll-triggered fades and scale-ins using `motion/react`'s `whileInView`. Most sections use this for entry animation.
3. **`Magnetic`.** Mouse-following pull on primary CTAs. Uses `motion/react`'s motion values and `useTransform` for buttery-smooth movement.

Rules:
- Animate `transform` and `opacity`. Don't animate `top`, `left`, `width`, `height`, or `box-shadow`.
- Use `will-change: transform` on the animating element, not its parent.
- Use the `[0.22, 1, 0.36, 1]` cubic-bezier (the "easeOutQuint"-shaped ease) for tactile, snappy feeling motion. It appears throughout the codebase.

---

## SEO architecture

See [`SEO.md`](./SEO.md) for the full reference. Summary:

- **One JSON-LD graph in `app/layout.tsx`** — Organization, LocalBusiness, Service, WebSite, FAQPage, Person, SiteNavigationElement, BreadcrumbList, all cross-referenced by `@id`.
- **Per-page JSON-LD** for `/clients` (CollectionPage + Article entries) — injects its own `BreadcrumbList`.
- **Geo meta tags** in the `other` field of root metadata.
- **`hreflang`** alternates in every page's metadata.
- **`robots.ts`** explicitly allows search + AI crawlers, blocks scraper bots.
- **`sitemap.ts`** declares hreflang per URL.
- **Web App Manifest** with `id`, `scope`, `categories`, shortcuts, maskable icons.

---

## Discovery Briefing wizard

`/brief` is a 9-step wizard rendered by `components/onboarding/OnboardingApp.tsx` (client component). Schema, prompt builder, and storage helpers live in `components/onboarding/lib/`. Draft state persists to `localStorage` between steps; on submit, the client POSTs to `/api/brief/route.ts` which forwards to Zapier via the server-side `THARROS_WEBHOOK_URL` env var (kept off the client bundle).

`/admin/briefs` is a local-backup admin view of submissions cached in the operator's browser. It's gated by HTTP Basic auth via `middleware.ts` (username `magnus`, password from `ADMIN_PASSWORD`).

---

## Build pipeline

- **`npm run build`** runs Turbopack-powered Next.js production build. Output: `.next/`.
- Static pages are pre-rendered at build time (`/`, `/brief`, `/admin/briefs`, `/clients`, `/icon.svg`, `/robots.txt`, `/sitemap.xml`).
- The build also typechecks the entire repo.

Builds should be deterministic. If a build fails, the problem is real — don't bypass it with `--no-verify` or `--no-typescript-check`.

---

## Deployment

- **Target:** Vercel (Next.js host of record).
- **Branch model:** Push to `main` → production deploy. Push to any other branch → preview deploy.
- **Env vars to set in Vercel:** `NEXT_PUBLIC_RELEVANCE_REGION`, `NEXT_PUBLIC_RELEVANCE_PROJECT`, `NEXT_PUBLIC_RELEVANCE_AGENT_ID`.

The `my-chat/` widget builds independently and deploys to its own host (CDN, subdomain, or client-site embed).
