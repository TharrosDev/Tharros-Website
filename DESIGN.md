---
name: Tharros Website
description: Field Engineer — typographic and diagrammatic marketing surface for an Ottawa AI + web shop.
colors:
  surface: "oklch(98% 0.004 80)"
  surface-elevated: "oklch(99.2% 0.003 80)"
  surface-dark: "oklch(20% 0.012 250)"
  surface-dark-elevated: "oklch(24% 0.014 250)"
  ink: "oklch(18% 0.02 250)"
  ink-muted: "oklch(50% 0.015 250)"
  ink-faint: "oklch(72% 0.01 250)"
  ink-on-dark: "oklch(96% 0.003 80)"
  ink-on-dark-muted: "oklch(72% 0.008 250)"
  rule: "oklch(90% 0.005 250)"
  rule-strong: "oklch(82% 0.008 250)"
  rule-on-dark: "oklch(30% 0.012 250)"
  rule-on-dark-strong: "oklch(38% 0.014 250)"
  accent: "oklch(50% 0.20 260)"
  accent-strong: "oklch(42% 0.22 260)"
  accent-soft: "oklch(95% 0.04 260)"
  accent-on-dark: "oklch(72% 0.18 260)"
typography:
  display-1:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.75rem, 2.6rem + 5.8vw, 8.5rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display-2:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 2.1rem + 3.2vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: "-0.028em"
  display-3:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.8vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  sm: "0.25rem"
  md: "0.375rem"
spacing:
  tight: "clamp(2.5rem, 4vw, 4rem)"
  default: "clamp(4rem, 8vw, 8rem)"
  breath: "clamp(6rem, 12vw, 14rem)"
components:
  btn-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink-on-dark}"
    rounded: "{rounded.md}"
    padding: "0.875rem 1.5rem"
    height: "48px"
  btn-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.875rem 1.25rem"
    height: "48px"
---

# Design System: Tharros Website

## 1. Overview

**Creative North Star: "Field Engineer"**

A typographic and diagrammatic marketing surface that signals two things at once: cutting-edge technical practice (Geist, Geist Mono, schematic SVG diagrams, cobalt pigment, asymmetric layouts) and grounded, plain-spoken Ottawa tradesperson (hairline rules, tabular metadata, no decorative noise, declarative copy). The metaphor is a structural engineer's letterhead crossed with a plumber's invoice: everything earns its place.

This system explicitly rejects the slate-on-sky AI-SaaS reflex (the training-data answer for "AI agency"). It rejects glassmorphism, decorative blurs, animated rings, hero-metric templates, and identical icon-card grids. It rejects the editorial-magazine second-order trap (display serif italic + drop caps + ruled columns) that catches first-time refusers of the SaaS reflex.

**Key Characteristics:**
- Single family (Geist) for display and body; Geist Mono for numerals, metadata, and engineer-drawing labels.
- One committed accent: cobalt `oklch(50% 0.20 260)`. Rare appearances.
- Hairline rules as the primary divider. Cards are absent.
- Asymmetric long-form layouts on a 12-column grid; headlines left-set.
- Schematic SVG content (wiring, data-flow, pipeline) replaces stock imagery.
- Motion is restrained: a single staggered page-load reveal; no scattered micro-interactions.

## 2. Colors

A two-surface palette with a single saturated accent. Restrained on light surfaces, committed when used.

### Primary
- **Cobalt** (`oklch(50% 0.20 260)`): the only saturated color in the system. Used on primary buttons, the accented agent node in diagrams, single highlighted spans in headlines, the `On-Call` column wash in the comparison table. Should appear on ≤10% of any visible surface.
- **Cobalt Strong** (`oklch(42% 0.22 260)`): hover state for primary buttons. Slightly darker, slightly more saturated.
- **Cobalt Soft** (`oklch(95% 0.04 260)`): the wash. Used on the On-Call column in `ModelTiersSection`, and as text selection background. Whisper of accent without commitment.
- **Cobalt On-Dark** (`oklch(72% 0.18 260)`): lifted variant for accent text on graphite surfaces. Brighter so it reads at distance.

### Neutral (light surfaces)
- **Bone-Warm Surface** (`oklch(98% 0.004 80)`): the primary page background. Warm-tinted, never pure white. Used on home, clients hero, and most sections.
- **Bone-Warm Elevated** (`oklch(99.2% 0.003 80)`): faintly lifted from surface. Used for inset previews (the client screenshot frame, placeholder card backgrounds).
- **Ink** (`oklch(18% 0.02 250)`): primary text. Near-black with a cool tint toward cobalt's hue family.
- **Ink Muted** (`oklch(50% 0.015 250)`): secondary text, lead paragraphs, body in metadata rows.
- **Ink Faint** (`oklch(72% 0.01 250)`): tertiary marks (the `§ 0X` numerals, `<dt>` labels).
- **Rule** (`oklch(90% 0.005 250)`): default hairline divider.
- **Rule Strong** (`oklch(82% 0.008 250)`): emphasized hairline, used under section eyebrows and on the spine of the pipeline rail.

### Neutral (dark surfaces)
- **Tool-Steel Graphite** (`oklch(20% 0.012 250)`): dark surface for `WhatWeBuildsSection`, `WhyTharrosSection`, footer, ChatDemoSection. Colder than slate-950, more "machined."
- **Graphite Elevated** (`oklch(24% 0.014 250)`): card-like inset on dark surface (legacy alias).
- **Ink On-Dark** (`oklch(96% 0.003 80)`): primary text on graphite.
- **Ink On-Dark Muted** (`oklch(72% 0.008 250)`): secondary text on graphite.
- **Rule On-Dark** (`oklch(30% 0.012 250)`): hairline on graphite.

### Named Rules
**The One Pigment Rule.** Cobalt is the only saturated color in the system. Every accent, highlight, focus ring, and active state uses cobalt or one of its three variants. No greens, no warm accents, no secondary brand colors. The restraint is the point.

**The No Pure Black or White Rule.** Every neutral is tinted toward cobalt's hue family (chroma 0.004–0.02). Pure `#fff` and `#000` are forbidden; they read industrial-cold and break the warm-graphite system.

## 3. Typography

**Display Font:** Geist (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Geist (same family, lighter weight)
**Mono Font:** Geist Mono (with `ui-monospace, SF Mono, Menlo, monospace`)

**Character:** A single family carries display, body, and UI. Geist is contemporary geometric with enough humanist warmth to avoid the cold-grotesk trap. Geist Mono carries every numeral, metadata label, engineer-drawing caption, and `§ 0X` section marker — this is where the "tradesperson invoice" voice lives.

### Hierarchy
- **Display-1** (600, `clamp(3.75rem → 8.5rem)`, line-height 0.92, tracking -0.04em): hero headline, clients page H1.
- **Display-2** (600, `clamp(2.75rem → 4.75rem)`, line-height 1.0, tracking -0.028em): section H2s.
- **Display-3** (600, `clamp(1.75rem → 2.75rem)`, line-height 1.05, tracking -0.022em): section H3s, founder quote, package names in the comparison table.
- **Lead** (400, `clamp(1.125rem → 1.5rem)`, line-height 1.45, max-width 62ch): subheadlines, lead paragraphs that follow an H2.
- **Body** (400, `clamp(1rem → 1.125rem)`, line-height 1.6, max-width 60ch): primary reading text.
- **Meta** (Mono, 500, 0.6875rem, tracking 0.12em, uppercase): every label, eyebrow, `<dt>` in metadata rows, diagram callouts, section markers.

### Named Rules
**The Mono Numeral Rule.** Every number that carries meaning (`01`, `02`, `§ 03`, file numbers, dates, hour ranges) renders in Geist Mono with `tabular-nums`. Mixing proportional digits into the metadata layer breaks the engineer-drawing voice.

**The Single Family Rule.** Geist for display and body, Geist Mono for the engineer-drawing layer. No third family. Display serifs, hand-drawn scripts, and Inter are all prohibited.

## 4. Elevation

This system uses no shadows. Depth comes from tonal layering (bone surface → bone-elevated → graphite), hairline rules, and the cobalt accent. The legacy `clean-card` and `box-shadow` patterns from the previous design have been removed; surfaces are flat at rest and respond to state through border-color and accent rings only.

### Named Rules
**The No Shadow Rule.** Elevation is conveyed by hairlines, surface tone, and cobalt accents. `box-shadow` is forbidden in new components. Hover states change `border-color` or apply the cobalt ring, not a shadow.

## 5. Components

### Buttons
- **Shape:** rectangular, faintly rounded corners (`0.375rem` / 6px). Decisive, not pill.
- **Primary (`btn-primary`):** cobalt background, ink-on-dark text, weight 500, tracking near-default. Min-height 48px desktop / 52px mobile. Hover: cobalt-strong background + `translateY(-1px)`. No shadow.
- **Ghost (`btn-ghost`):** transparent background, rule-strong border, ink text. Hover: border darkens to ink. On dark surfaces use `btn-ghost-on-dark` (lifted border + ink-on-dark text).
- **Focus:** 2px solid cobalt outline at 2px offset (or accent-on-dark on graphite). Never removed.

### Cards / Containers
**The system has no card pattern.** What was previously a card grid is now either: (a) numbered rows on a hairline divider, (b) a real `<table>`, or (c) editorial vignettes with a wiring diagram. If a future need genuinely requires a card, it must use only `border` and `border-radius: 0.375rem`; no shadows, no nested cards.

### Inputs / Fields
Inherited from the onboarding wizard (`components/onboarding/onboarding.css`). Out of scope for the marketing surface.

### Navigation
- **Style:** fixed top-bar, full-width, no pill shape. Transparent until the user scrolls 24px, then bone-surface with a hairline rule at the bottom.
- **Links:** mono section number + Geist label (`01 Demo`, `02 Builds`). Faint section number turns cobalt on hover.
- **Mobile:** full-bleed overlay menu with display-3 link labels, mono section numbers, primary CTA pinned to bottom.

### Signature: Eyebrow + Spine
Every section opens with a mono eyebrow: `§ 0X` numeral + hairline rule + uppercase mono label. This is the engineer-drawing convention that ties the system together. The 12-column page-frame grid is left-set; H2s, leads, and content stay in `col-span-8`, with the right `col-span-4` reserved for metadata, diagrams, or breathing room.

### Signature: Diagrams
SVG schematics replace photography. Two stroke weights: 1px hairline (default), 1.5px (accent). Cobalt fill at 6–8% opacity inside accent rectangles. Mono labels at 8–10px with `letterSpacing: 1.2`. Diagrams carry meaning, not decoration: site-wiring (hero), agent data-flow (`WhatWeBuildsSection`), placeholder schematic (`/clients` empty state).

### Signature: Metadata Row
A horizontal `<dl>` with mono `<dt>` (ink-faint) and `<dd>` (ink). Used for contact strips, file metadata on client rows, and footer office details. Replaces the "icon + label + caption" pattern.

## 6. Do's and Don'ts

### Do:
- **Do** use cobalt sparingly: one accented span per headline, one primary CTA per fold, one column wash per table.
- **Do** lead every section with a `§ 0X` mono eyebrow followed by a hairline and uppercase label.
- **Do** render every number that carries meaning in Geist Mono with `tabular-nums`.
- **Do** use hairline rules (`oklch(90% 0.005 250)` / `oklch(30% 0.012 250)` on dark) as the primary divider.
- **Do** reach for a real `<table>` or a numbered row list before reaching for cards.
- **Do** keep body line length to 60ch and lead paragraphs to 62ch.
- **Do** use `clamp()` for display sizes; never hand-roll per-breakpoint font-size ladders.
- **Do** scope reveals to a single staggered page-load; use slide-up only (no opacity dependency).
- **Do** show the `prefers-reduced-motion` killswitch respect at the CSS layer.

### Don't:
- **Don't** use `#fff` or `#000`. Every neutral is tinted toward cobalt's hue family.
- **Don't** add a second saturated color. Cobalt is the only pigment.
- **Don't** use `box-shadow` for elevation. Use hairlines and surface tone.
- **Don't** use glassmorphism, `backdrop-blur`, or decorative blur effects.
- **Don't** add `animate-ping`, decorative glow blobs, or hover progress bars.
- **Don't** use side-stripe borders (`border-left` greater than 1px as a colored accent).
- **Don't** use gradient text (`background-clip: text` on a gradient).
- **Don't** use the hero-metric template (big number, small label, supporting stats, gradient accent).
- **Don't** build identical card grids: H2 + subhead + 3 cards of icon-title-body.
- **Don't** use em dashes (—) in body copy. Use periods, colons, semicolons, commas, or parentheses. Em-dash glyphs are allowed only as typographic markers in tables and diagrams, not in prose.
- **Don't** introduce a third font family. Geist + Geist Mono only.
- **Don't** name the SaaS palette by reflex: slate-950 + sky-500 is the training-data answer this system explicitly rejects.
- **Don't** repeat the `subject. <grey>second-line.</grey>` headline template in more than one section per page.
