# AGENTS.md — Tharros Website

> A guide for autonomous coding agents working in this repository.
> Companion to [`CLAUDE.md`](./CLAUDE.md).

This file is intentionally short, mechanical, and verifiable. It tells an agent what to check, what to run, and what to avoid. The conceptual context — what Tharros is, what the design system looks like, what the brand voice sounds like — lives in `CLAUDE.md` and `docs/`.

---

## Repo at a glance

| Property | Value |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 (CSS-first config) |
| Default branch | `main` |
| Production URL | https://tharros.ca |
| Hosting | Vercel |
| Sub-project | [`my-chat/`](./my-chat/) — embeddable Preact widget |

---

## Required pre-flight checks

Before starting work:

1. Read **[`README.md`](./README.md)** for project orientation.
2. Read **[`CLAUDE.md`](./CLAUDE.md)** for design system + voice rules.
3. Read **[`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md)** before touching any user-facing copy.
4. Read **[`docs/SEO.md`](./docs/SEO.md)** before touching `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `public/manifest.json`, or any page's `metadata` export.

Before merging work:

```bash
npm run build        # must succeed (compiles + typechecks + static gen)
npm run lint         # should pass with zero warnings
```

---

## Branch conventions

- **AI-assisted branches**: `claude/<topic>-<random>` (e.g. `claude/tharros-consulting-pivot-eiFex`).
- **Human branches**: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`.
- **Never push directly to `main`.**
- **Never force-push to `main`.**
- One concern per branch. Don't combine a copy edit and a metadata overhaul.

---

## Commit conventions

- Imperative subject (`Update`, `Add`, `Fix`, `Remove`).
- Subject under 72 chars when possible.
- Body explains *why*, not what — the diff shows what.
- No emoji prefixes, no "feat:"/"fix:" Conventional Commits prefixes (the repo doesn't use them).
- One logical change per commit. Multiple commits per PR is fine.

---

## What lives where

```
app/                Routing, metadata, JSON-LD
components/         All UI (sections, wrappers, primitives)
hooks/              React hooks (currently only useIsMobile)
public/             Static assets, manifest, browserconfig, og-image
my-chat/            Standalone embeddable widget (Preact + Vite)
docs/               Internal docs (architecture, content, SEO)
```

Do **not** create new top-level directories without a clear reason.

---

## File-level rules

- **`app/layout.tsx`** is the only place global JSON-LD lives. Per-page JSON-LD goes in each page file (see `app/clients/page.tsx`).
- **`app/globals.css`** defines all design tokens. Don't redefine colors in components; use `text-accent-3`, `bg-bg`, etc.
- **`components/`** is flat. No nested folders. Wrappers sit next to the components they wrap (`ChatDemoSection.tsx` + `ChatDemoSectionWrapper.tsx`).
- **`my-chat/`** is a separate package — don't import from it into the main Next app, and vice versa.

---

## Known orphans (do not touch unless asked)

_(none — orphaned intake components were removed when the wizard moved to `/brief`.)_

---

## Hard rules

| Rule | Why |
|---|---|
| **No reintroducing "training", "coaching", "Digital Workforce", or older package names** | The site was pivoted; this is a regression |
| **Don't remove "Keep it Local, Keep it Canadian."** | Brand-critical slogan |
| **Don't break the `@id`-linked JSON-LD graph** | Breaks structured-data SERP features |
| **Don't introduce a state-management library** | The site doesn't need one |
| **Don't add `console.log` to committed code** | Use `console.error` only for genuinely unexpected branches |
| **Don't add `tailwind.config.ts`** | Tailwind 4 uses CSS-first config in `globals.css` |
| **Don't bypass `npm run build`** | The build is the source of truth for "does it work" |

---

## Soft rules

| Rule | Why |
|---|---|
| Prefer editing existing sections to creating new ones | The site has a tight component pattern; consistency matters |
| Prefer plain copy over jargon | Audience is Ottawa small businesses, not enterprise buyers |
| Prefer `text-accent-3` sparingly (1 span per heading) | The brand color earns its weight from scarcity |
| Prefer server components | Client components require `"use client"` and have a hydration cost |

---

## If you get stuck

- Read the closest analogous existing section (the home page has 9; one of them is probably similar to what you're trying to build).
- Check `node_modules/next/dist/docs/` for Next 16-specific patterns — your training data is probably for Next 14/15.
- Ask the user before touching package copy, the JSON-LD graph, or anything in `docs/`.

---

## Live demo agent (chat)

This is a coding-agent guide, but the home page also embeds a *chat* agent (Relevance AI). That agent's training material is in [`THARROS_KNOWLEDGE_BASE.md`](./THARROS_KNOWLEDGE_BASE.md). If you change site copy in a way that contradicts that knowledge base (pricing model, package names, service area), update the knowledge base to match.
