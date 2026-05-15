# Tharros Embeddable Chat Widget

A standalone Preact + Vite chat widget that embeds a Relevance AI agent into client sites. Built as a sibling to the main Tharros Next.js site at [https://tharros.ca](https://tharros.ca).

> Keep it Local, Keep it Canadian. 🇨🇦

---

## Why this exists

The main Tharros site renders a live demo agent on the homepage via `components/ChatDemoSection.tsx` (React + Next.js). This sub-project (`my-chat/`) is the *production* deliverable — a small, tree-shaken chat widget that gets dropped into client sites as part of The Integrate and The On-Call packages.

It's deliberately a separate stack:

- **Preact** instead of React — smaller runtime (~3kB vs ~45kB) for client embeds.
- **Vite** instead of Next.js — produces a single static bundle, no server runtime.
- **Signals** instead of hooks — finer-grained reactivity for chat state.
- **Tailwind 4** — same design tokens as the main site for visual consistency.

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Preact 10 |
| State | `@preact/signals` |
| UI primitives | Radix UI (`@radix-ui/react-avatar`, `@radix-ui/react-scroll-area`) |
| Icons | Lucide |
| Data fetching | SWR |
| Agent SDK | `@relevanceai/sdk` |
| Styling | Tailwind CSS 4 |
| Build | Vite 7 |
| Tooling | Biome |

---

## Project structure

```
my-chat/
├── index.html                Entry HTML
├── src/
│   ├── index.tsx             Render root
│   ├── client.ts             Relevance AI client init
│   ├── constant.ts           Env var bindings
│   ├── signals.ts            Shared reactive state
│   ├── style.css             Tailwind + custom styles
│   └── components/
│       ├── app.tsx           Top-level chat shell
│       ├── header.tsx        Title bar + status
│       ├── footer.tsx        Input + send
│       ├── empty-state.tsx   Pre-conversation prompt
│       ├── agent-message.tsx Agent bubble
│       ├── agent-typing.tsx  Typing indicator
│       └── user-message.tsx  User bubble
├── biome.json                Biome config
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # outputs to dist/
npm run preview      # serve the production build locally
```

---

## Environment variables

The widget reads four `VITE_*` env vars at build time (see `src/constant.ts`):

```env
VITE_REGION=...           # Relevance AI region
VITE_PROJECT=...          # Relevance AI project ID
VITE_AGENT_ID=...         # Agent to load
VITE_WORKFORCE_ID=...     # Workforce ID (if applicable)
```

Set these in `.env.local` for development. For production, inject them at build time via your CI or hosting platform.

---

## Embedding

Once built, the widget produces a static bundle in `dist/`. Embed it into a client site by:

1. Hosting `dist/` on a CDN or subdomain (e.g. `chat.client-site.ca`).
2. Adding a small `<script>` tag and target `<div id="app">` to the client site.

The exact embed snippet depends on the deployment target — coordinate with whoever maintains the client site's templates.

---

## Voice and style

The widget shares the main site's design system and brand voice:

- Industrial Executive aesthetic — high contrast, sharp corners.
- Sky-500 (`#0ea5e9`) as the accent color, used sparingly.
- Decisive, plain language. Not chatty. Not corporate.
- Always grounded in the client's local context (Ottawa, Kanata, etc. when relevant).

See [`../docs/CONTENT_GUIDE.md`](../docs/CONTENT_GUIDE.md) for the full voice reference.

---

## Tooling notes

- **Biome** handles formatting and linting (`biome.json`). Run `npx biome check src/` to validate.
- **TypeScript strict mode** is on. The `@/` import alias points to `src/`.
- No tests yet — the widget is small enough that the demo loop is the test. Add tests if the widget grows.

---

## Relationship to the main site

| Concern | Main site (`/`) | This widget (`my-chat/`) |
|---|---|---|
| Purpose | Marketing site, demo agent | Production embeddable agent |
| Framework | Next.js 16 + React 19 | Preact 10 + Vite |
| Routing | App Router | Single page |
| State | React hooks in `ChatDemoSection.tsx` | `@preact/signals` |
| Bundle target | Full site | Single embeddable script |
| SEO | Heavy JSON-LD, FAQPage | None (it's an iframe/script embed) |

If the chat logic in the main site's `ChatDemoSection.tsx` diverges meaningfully from this widget, that's worth examining — they should stay conceptually aligned even if they're different implementations.
