# Field Engineer Evolution — Site UI/UX Overhaul

Date: 2026-05-24
Branch: `redesign/field-engineer`
Register: brand (see `PRODUCT.md`)
Status: approved design, in implementation

## Thesis

The site becomes an engineer's drawing set that plots itself as the visitor reads it. Today every section uses the same plate (`§ 0X` eyebrow → 8/4 headline+lead → hairline → numbered rows). The evolution gives each section a distinct composition while keeping one drafting language (cobalt, Geist + Geist Mono, hairlines, draw-on schematics). The schematic stops being decoration in two corners and becomes the spine of the page.

Variation in composition, unity in voice.

## Scope

Whole-site, production-ready. Home page sections + NavBar + Footer + shared motion primitives. No copy/positioning changes beyond microcopy. No JSON-LD changes. The `/brief` wizard, `/clients`, and chat demo internals are out of scope except where they consume shared CSS utilities.

## Guardrails (non-negotiable, from DESIGN.md + CLAUDE.md)

- Cobalt `oklch(50% 0.20 260)` is the only saturated color. No second pigment.
- Geist (display + body) and Geist Mono (numerals, metadata, diagram labels) only. No third family.
- No cards, no `box-shadow`, no glassmorphism/backdrop-blur, no grid overlays, no scanlines.
- `§ 0X` mono eyebrow grammar stays on every section.
- No em dashes in prose. Package names verbatim (The Refresh, The Integrate, The On-Call). Slogan stays in all existing locations.
- WCAG 2.1 AAA where feasible, AA floor. `prefers-reduced-motion` honored everywhere.
- Animate only compositor-friendly props (transform, opacity, SVG pathLength/offsetDistance). Never animate layout props.
- Below-the-fold sections stay `next/dynamic`. Reveal motion must not hide SSR content if JS is slow (no opacity-only dependency on reading content; decorative-only elements may use opacity).

## Shared motion system

New directory `components/diagrams/` with reusable primitives, plus motion utilities in `globals.css`.

1. **Draw-on**: use `motion/react` `useInView(ref, { once: true, margin: "-15%" })` + `motion.path`/`motion.rect`/`motion.line` with `initial={{ pathLength: 0 }}` → `animate={{ pathLength: 1 }}`. Wrap as `<DrawPath>` / schematic node helpers so sections don't repeat the boilerplate.
2. **Signal pulse**: a cobalt dot riding a connector path via CSS `offset-path` + animated `offsetDistance` 0% → 100% (motion `animate` loop). Pauses when off-screen (gate on `useInView`). Off under reduced-motion.
3. **Reveal choreography**: keep `AnimatedSection` slide-up (no opacity dependency) for reading content; add intentional per-section stagger via `delay` props. Decorative diagram layers may add opacity.
4. **Micro-interactions** (CSS, in `globals.css`): `.btn-primary` arrow nudge on hover, ghost-button border draw, table row hover wash, diagram node hover, nav active-section state.

Reduced-motion: a single `useReducedMotion()` check per animated component renders the fully-drawn static end-state (current static diagrams are the fallback).

## Per-section design

### Hero (signature centerpiece)
- Right-field wiring schematic draws itself on load (nodes stroke in, connectors trace, accent Agent node fills last, ~1.2s, `ease-out-expo`), then goes live: a cobalt signal-dot loops Visitor → Site → Agent → You along the connectors, with a mono readout (`SIGNAL · ROUTING` → `· DELIVERED`).
- Node hover lifts + surfaces sublabel; pointer-move parallax (few px) on diagram layers.
- Mobile compact diagram draws once, no pulse, no parallax.
- Reduced motion: static fully-drawn diagram, current static SVG is the fallback.

### §01 Problem
- Three pains become a descending indented cascade (escalating stakes), with a faint cobalt "drain" line drawing down the left margin tying 01 → 02 → 03. Replaces the flat table rows.

### §02 Builds (comparison table)
- Centerpiece. Included `●` markers pop in sequence per column on scroll-in. On-Call column gets a drawn-in `RECOMMENDED` plate tag + refined wash + full row-hover wash. Table structure unchanged.

### §03 Agents (dark)
- The three data-flow diagrams animate a signal through them on entry and are differentiated (escalate / qualify / collect read distinctly, not three identical 3-node rows). Peak of the diagrammatic identity.

### §04 Process
- Plain vertical rail becomes a real pipeline schematic that draws down on scroll; each stage-node lights cobalt as it enters the viewport (scroll-linked); signal travels the pipeline.

### §05 Why (dark)
- Re-composed as a manifesto: pillars become a horizontal triptych (not the vertical rows used elsewhere); founder quote becomes a large near-full-bleed typographic peak with generous breathing room. Keeps `rhythm-breath`.

### §06 Pricing
- Stays terse/tight. Light refinement; drafted A/B/C bracket detail. Deliberate quiet close after the loud table.

### NavBar
- Active-section scroll-spy: current section's mono number lights cobalt. Refined scrolled transition.

### Footer
- `END OF DRAWING` terminal plate marker. Refinement.

### Bug fixes / drift
- `app/page.tsx`: remove `bg-slate-950` wrapper (the literal banned AI-SaaS color), replace with `--surface-dark` or none.
- Keep the uncommitted dark-ink AAA legibility bump in `globals.css`.

## Key states & a11y

- Every animated element: reduced-motion static fallback.
- Diagrams are `aria-hidden` (decorative); meaning is carried by adjacent text + meta-rows.
- Keyboard focus rings preserved (cobalt `:focus-visible`).
- Signal loops pause off-screen (perf).

## Acceptance criteria

- No two home sections share the same body composition.
- Schematics appear as a through-line (hero, agents, process at minimum) and animate on entry.
- `npm run build` passes (TypeScript + static generation).
- No new color, font, card, shadow, grid-overlay, or scanline introduced.
- Reduced-motion renders a complete, legible static site.
- `bg-slate-950` removed from `page.tsx`.

## Out of scope

Copy/positioning rewrites, JSON-LD, pricing numbers, the `/brief` wizard internals, the Relevance chat demo internals, new content sections (testimonials/case studies).
