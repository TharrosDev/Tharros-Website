# Contributing to Tharros Website

> Keep it Local, Keep it Canadian. 🇨🇦

Welcome. This repo is small and tightly opinionated. Read the documentation first — most "how should I do X?" questions are answered there.

---

## Required reading

Before opening a PR:

- [`README.md`](./README.md) — Project orientation.
- [`CLAUDE.md`](./CLAUDE.md) — Design system, voice, code style.
- [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md) — Required if you're touching any visible copy.
- [`docs/SEO.md`](./docs/SEO.md) — Required if you're touching `app/layout.tsx`, page metadata, robots, sitemap, or the manifest.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Helpful background.

---

## Local setup

```bash
git clone <repo>
cd Tharros-Website
npm install
npm run dev          # http://localhost:3000
```

Working on the embeddable chat widget:

```bash
cd my-chat
npm install
npm run dev          # http://localhost:5173
```

---

## Branch model

- **`main`** — production. Auto-deploys to https://tharros.ca via Vercel.
- **Feature branches** — branch from `main`, name them:
  - `feat/<topic>` for human-led work
  - `fix/<topic>` for bug fixes
  - `docs/<topic>` for documentation
  - `claude/<topic>-<random>` for AI-assisted branches

Don't push directly to `main`. Don't force-push to `main` ever.

---

## Commit messages

- Imperative subject (`Update`, `Add`, `Fix`, `Remove`). No "feat:"/"fix:" Conventional Commits prefixes — the repo doesn't use them.
- Subject under 72 chars when possible.
- Body explains *why* the change exists, not *what* it did. The diff shows what.
- No emoji prefixes.
- One logical change per commit. Multiple commits per PR is encouraged — easier to review and revert.

Example:

```
Tighten ChatDemo copy in small-business voice

The live agent demo was still themed as enterprise SaaS ("Commercial
Model", "Operational Excellence"), which clashed with the rest of the
site's on-call positioning.

- Section headline: "commands results" -> "shows up"
- Feature trio rewritten to plain language
- Console labels: "Operational" -> "Online"
```

---

## Code review checklist

Before requesting review, verify all of these:

- [ ] `npm run build` succeeds (this includes TypeScript checks).
- [ ] `npm run lint` passes with zero warnings.
- [ ] Copy changes follow [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md).
- [ ] No reintroduction of older positioning ("training", "Digital Workforce", "Recovering time. Rescuing revenue.", "Setup Sprint", "Operator Program", "Fractional AI Lead").
- [ ] Brand slogan "Keep it Local, Keep it Canadian." is preserved.
- [ ] Package names use exact casing: "The Refresh", "The Integrate", "The On-Call".
- [ ] If JSON-LD changed, validated via [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] If a new page was added, it's in `app/sitemap.ts`.
- [ ] If site copy changed, `THARROS_KNOWLEDGE_BASE.md` was updated (if affected).
- [ ] No `console.log` left in committed code.
- [ ] No new dependencies without a clear reason.

---

## When to ask before acting

- **Touching the JSON-LD graph.** Structured data has downstream SERP consequences. Validate before merging.
- **Removing copy that includes "Keep it Local, Keep it Canadian."** Always ask first.
- **Changing package names, slogans, or pricing language.** Brand-level decisions.
- **Adding a new top-level dependency.** The dependency list is intentionally small.
- **Adding state management (Redux, Zustand, Jotai).** The site doesn't need one. Have a hard reason.

---

## Things you can do without asking

- Fix typos, grammar, broken Markdown.
- Refactor a section component to be cleaner without changing its visible output.
- Tighten CSS class lists without changing the rendered design.
- Update a comment that's misleading.
- Improve TypeScript types.
- Replace a hardcoded value with a constant if it's used in two or more places.

---

## Code style

- **TypeScript strict mode** is on. Don't disable it locally.
- **Tailwind 4** is CSS-first — config lives in `app/globals.css`. Don't create `tailwind.config.ts`.
- **Server components by default.** Add `"use client"` only when actually needed (effects, refs, motion, browser APIs).
- **No comments explaining what the code does.** Comment only when the *why* would surprise a future reader.
- **Component files are flat** (no nested folders). Wrappers (`*Wrapper.tsx`) sit next to the components they wrap.
- **Hooks live in `hooks/`** and follow the `use<Name>.ts` naming convention.

---

## Submitting a PR

1. Push your branch.
2. Open a PR against `main`.
3. PR description should:
   - **Summary** — 1-3 bullets of what changed.
   - **Test plan** — bullet checklist of what to verify.
   - Link the relevant doc updates if you made them.
4. Tag the relevant reviewer (Magnus by default).
5. Don't merge your own PR unless explicitly told to.

---

## Reporting issues

If you find a bug, a regression, or copy that doesn't match this guide:

- Open an issue with a clear title and reproduction steps.
- For copy issues, quote the exact text and link to the file.
- For SEO/structured-data issues, paste the relevant snippet and the validator output.

---

## License

Private. All work in this repo is property of Tharros.
