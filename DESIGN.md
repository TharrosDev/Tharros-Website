---
name: Tharros Website
description: Field Engineer — typographic and diagrammatic marketing surface for an Ottawa AI + web shop.
colors:
  surface: "oklch(98% 0.004 80)"
  surface-elevated: "oklch(99.2% 0.003 80)"
  surface-dark: "oklch(20% 0.012 250)"
  surface-dark-elevated: "oklch(24% 0.014 250)"
  ink: "oklch(18% 0.02 250)"
  ink-muted: "oklch(42% 0.024 250)"
  ink-faint: "oklch(48% 0.025 250)"
  ink-on-dark: "oklch(96% 0.003 80)"
  ink-on-dark-muted: "oklch(72% 0.008 250)"
  ink-on-dark-faint: "oklch(64% 0.014 250)"
  rule: "oklch(90% 0.005 250)"
  rule-strong: "oklch(82% 0.008 250)"
  rule-on-dark: "oklch(30% 0.012 250)"
  rule-on-dark-strong: "oklch(38% 0.014 250)"
  accent: "oklch(50% 0.20 260)"
  accent-strong: "oklch(42% 0.22 260)"
  accent-soft: "oklch(95% 0.04 260)"
  accent-on-dark: "oklch(78% 0.17 260)"
typography:
  display-1:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 2.6rem + 4.6vw, 7rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display-2:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 2rem + 2.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: "-0.028em"
  display-3:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.4rem + 1.2vw, 2.375rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.075rem + 0.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
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
  btn-ghost-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.ink-on-dark}"
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
- Motion is restrained: a single staggered page-load reveal plus a thin cobalt scroll-progress strip at the top of the viewport. No scattered micro-interactions.

## 2. Colors

A two-surface palette (bone-warm and tool-steel graphite) with a single saturated accent. Restrained on light surfaces, committed when the accent appears. All neutrals tinted toward the cobalt hue family (chroma 0.004–0.025); pure `#fff` and `#000` are forbidden.

### Primary
- **Cobalt** (`oklch(50% 0.20 260)`): the only saturated color in the system. Used on primary buttons, the accented agent node in diagrams, single highlighted spans in headlines, the On-Call column wash in the comparison table, the scroll-progress strip at the top of the viewport. Should appear on ≤10% of any visible surface.
- **Cobalt Strong** (`oklch(42% 0.22 260)`): hover state for primary buttons. Slightly darker, slightly more saturated.
- **Cobalt Soft** (`oklch(95% 0.04 260)`): the wash. Used on the On-Call column in `ModelTiersSection`, on focused/selected form controls in the wizard, as text selection background. Whisper of accent without commitment.
- **Cobalt On-Dark** (`oklch(78% 0.17 260)`): lifted variant for accent text on graphite surfaces. Brighter so it reads at distance and meets ~6:1 contrast.

### Neutral (light surfaces)
- **Bone-Warm Surface** (`oklch(98% 0.004 80)`): the primary page background. Warm-tinted, never pure white. Used on home, brief, clients hero, and most sections.
- **Bone-Warm Elevated** (`oklch(99.2% 0.003 80)`): faintly lifted from surface. Used for inset previews (client screenshot frame, placeholder card, wizard card body).
- **Ink** (`oklch(18% 0.02 250)`): primary text. Near-black with a cool tint toward cobalt's hue family. ~14:1 on bone surface.
- **Ink Muted** (`oklch(42% 0.024 250)`): secondary text, lead paragraphs, body in metadata rows. ~6:1 on bone (passes AA body).
- **Ink Faint** (`oklch(48% 0.025 250)`): tertiary marks (the `§ 0X` numerals, `<dt>` labels, FIG. captions). ~4.5:1 on bone (passes AA small text).
- **Rule** (`oklch(90% 0.005 250)`): default hairline divider between rows and sections.
- **Rule Strong** (`oklch(82% 0.008 250)`): emphasized hairline. Under section eyebrows, around form inputs, along the HowItWorks pipeline rail.

### Neutral (dark surfaces)
- **Tool-Steel Graphite** (`oklch(20% 0.012 250)`): dark surface for `WhyTharrosSection`, footer, ChatDemoSection, and the agent-rows band of `WhatWeBuildsSection` (whose header band is light). Colder than slate-950, more "machined."
- **Graphite Elevated** (`oklch(24% 0.014 250)`): legacy card-like inset.
- **Ink On-Dark** (`oklch(96% 0.003 80)`): primary text on graphite. ~14:1.
- **Ink On-Dark Muted** (`oklch(72% 0.008 250)`): secondary text on graphite. ~8:1.
- **Ink On-Dark Faint** (`oklch(64% 0.014 250)`): tertiary on graphite. ~4.6:1.
- **Rule On-Dark** (`oklch(30% 0.012 250)`): hairline on graphite.
- **Rule On-Dark Strong** (`oklch(38% 0.014 250)`): emphasized hairline on graphite.

### Named Rules
**The One Pigment Rule.** Cobalt is the only saturated color in the system. Every accent, highlight, focus ring, active state, and progress strip uses cobalt or one of its four variants. No greens, no warm accents, no secondary brand colors. The restraint is the point.

**The No Pure Black or White Rule.** Every neutral is tinted toward cobalt's hue family (chroma 0.004–0.025). Pure `#fff` and `#000` are forbidden; they read industrial-cold and break the warm-graphite system.

**The Contrast Floor Rule.** Body and lead text use `ink-muted` (≥4.5:1) or stronger. Tertiary marks use `ink-faint` (≥4.5:1 for small mono). Never drop below 4.5:1 for any text the user reads. Decorative SVG opacity is allowed below that.

## 3. Typography

**Display Font:** Geist (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Geist (same family, lighter weight)
**Mono Font:** Geist Mono (with `ui-monospace, SF Mono, Menlo, monospace`)

**Character:** A single family carries display, body, and UI. Geist is contemporary geometric with enough humanist warmth to avoid the cold-grotesk trap. Geist Mono carries every numeral, metadata label, engineer-drawing caption, and `§ 0X` section marker. This is where the tradesperson-invoice voice lives.

### Hierarchy
- **Display-1** (600, `clamp(3.5rem → 7rem)` / 56→112px, line-height 0.92, tracking -0.04em): hero headline, clients page H1.
- **Display-2** (600, `clamp(2.5rem → 3.75rem)` / 40→60px, line-height 1.0, tracking -0.028em): section H2s. Capped so titles lead without dwarfing their content.
- **Display-3** (600, `clamp(1.625rem → 2.375rem)` / 26→38px, line-height 1.05, tracking -0.022em): section H3s, founder quote, package names in the comparison table.
- **Lead** (400, `clamp(1.1875rem → 1.5rem)` / 19→24px, line-height 1.45, max-width 62ch): subheadlines, lead paragraphs that follow an H2.
- **Body** (400, `clamp(1.0625rem → 1.1875rem)`, line-height 1.6, max-width 60ch): primary reading text. Base 17px.
- **Meta** (Mono, 500, 0.75rem / 12px, tracking 0.12em, uppercase): every label, eyebrow, `<dt>` in metadata rows, diagram callouts, section markers, wizard step numbers.

### Named Rules
**The Mono Numeral Rule.** Every number that carries meaning (`01`, `02`, `§ 03`, FILE / 001, dates, hour ranges, wizard step indicators) renders in Geist Mono with `tabular-nums` via the `.num` utility. Mixing proportional digits into the metadata layer breaks the engineer-drawing voice.

**The Single Family Rule.** Geist for display and body, Geist Mono for the engineer-drawing layer. No third family. Display serifs, hand-drawn scripts, and Inter are all prohibited.

**The Minimum Size Rule.** No reading text smaller than 12px. Section eyebrows are `text-xs` (12px). Mono tags / file numbers / diagram captions are `text-[11px]` minimum. Body is at least 17px on the smallest viewport. 8–10px sizes are out.

## 4. Elevation

This system uses no shadows. Depth comes from tonal layering (bone surface → bone-elevated → graphite), hairline rules, and the cobalt accent. Surfaces are flat at rest and respond to state through border-color shifts and the global cobalt `:focus-visible` ring only.

### Named Rules
**The No Shadow Rule.** Elevation is conveyed by hairlines, surface tone, and cobalt accents. `box-shadow` is forbidden in new components. Hover states change `border-color`, surface tone, or apply the cobalt ring, never a shadow.

## 5. Components

### Buttons
- **Shape:** rectangular, faintly rounded corners (`0.375rem` / 6px). Decisive, not pill.
- **Primary (`btn-primary`):** cobalt background, ink-on-dark text, weight 500, tracking near-default. Min-height 48px desktop / 52px mobile. Hover: cobalt-strong background + `translateY(-1px)`. No shadow.
- **Ghost (`btn-ghost`):** transparent background, rule-strong border, ink text. Hover: border darkens to ink. On dark surfaces use `btn-ghost-on-dark` (lifted border + ink-on-dark text).
- **Focus:** 2px solid cobalt outline at 2px offset (or accent-on-dark on graphite). Never removed.

### Cards / Containers
**The system has no card pattern.** What was previously a card grid is now either: (a) numbered rows on a hairline divider, (b) a real `<table>`, or (c) editorial vignettes paired with a wiring diagram. If a future need genuinely requires a card, it must use only `border` and `border-radius: 0.375rem`; no shadows, no nested cards. The wizard's `.ob-card` is the one exception (full-bleed structural panel on bone-elevated, hairline border, no radius).

### Inputs / Fields (brief wizard)
- **Shape:** rectangular, 0 radius, hairline `rule-strong` border on bone surface.
- **Focus:** cobalt outline at 2px offset, border darkens to ink. Matches site-wide `:focus-visible`.
- **Checked checkbox / selected radio / active chip:** cobalt-filled box, `accent-soft` background tint.
- **Mono labels:** field labels, hints, file captions all render in Geist Mono at 12px / 0.12em tracking.
- **File drop:** dashed `rule-strong` border, cobalt fill on drag-over. Uploaded items in `accent-soft` with cobalt border.

### Navigation
- **Style:** fixed top-bar, full-width, no pill shape. Transparent until the user scrolls 24px, then bone-surface with a hairline rule at the bottom.
- **Links:** mono section number + Geist label (`01 Demo`, `02 Builds`). Faint section number turns cobalt on hover.
- **Mobile:** full-bleed overlay menu with display-3 link labels, mono section numbers, primary CTA pinned to bottom.

### Signature: Eyebrow + Spine
Every section opens with a mono eyebrow: `§ 0X` numeral + hairline rule + uppercase mono label. This is the engineer-drawing convention that ties the system together. The 12-column page-frame grid is left-set; H2s, leads, and content stay in `col-span-8`, with the right `col-span-4` reserved for metadata, diagrams, or breathing room.

### Signature: Diagrams
SVG schematics replace photography. Two stroke weights: 1px hairline (default), 1.5px (accent). Cobalt fill at 6–8% opacity inside accent rectangles. Mono labels at 9–11px with `letterSpacing: 1.2`. Diagrams carry meaning, not decoration: site-wiring (hero desktop, 4 nodes vertical), compact wiring strip (hero mobile, 4 nodes horizontal), agent data-flow (`WhatWeBuildsSection`, 3-node per pattern), placeholder schematic (`/clients` empty state, screenshot fallback).

### Signature: Metadata Row
A horizontal `<dl>` with mono `<dt>` (ink-faint) and `<dd>` (ink). Used for contact strips, file metadata on client rows, footer office details, hero bottom strip. Replaces the "icon + label + caption" pattern.

### Signature: Scroll Progress
A 1px cobalt bar fixed at the very top of the viewport (`z-index: 70`, above NavBar). `scaleX` bound to scroll position via `useSpring` (stiffness 180, damping 28). Reads as a technical measurement strip, not decoration. Hidden under `prefers-reduced-motion`.

### Signature: Comparison Table
The three packages render in a real `<table>` on desktop (not cards). The On-Call column has an `accent-soft` background wash to mark the recommended choice. Cells use `●` for "included," `—` for "not included" (typographic markers, mono numerals for string values). Mobile collapses to a stacked variant with the same data shape.

## 6. Do's and Don'ts

### Do:
- **Do** use cobalt sparingly: one accented span per headline, one primary CTA per fold, one column wash per table.
- **Do** lead every section with a `§ 0X` mono eyebrow followed by a hairline and uppercase label.
- **Do** render every number that carries meaning in Geist Mono with `tabular-nums` via the `.num` utility.
- **Do** use hairline rules (`oklch(90% 0.005 250)` / `oklch(30% 0.012 250)` on dark) as the primary divider.
- **Do** reach for a real `<table>` or a numbered row list before reaching for cards.
- **Do** keep body line length to 60ch and lead paragraphs to 62ch.
- **Do** use the `.type-display-*` / `.type-lead` / `.type-body` / `.type-meta` utility classes for size; never hand-roll per-breakpoint font-size ladders.
- **Do** vary section vertical rhythm across the page: `.rhythm-tight`, `.rhythm-default`, `.rhythm-breath`. WhyTharros gets breath (manifesto); Pricing gets tight (terse close).
- **Do** scope reveals to a single staggered page-load via `AnimatedSection`; use slide-up only (no opacity dependency, so content is visible even if JS is slow).
- **Do** respect `prefers-reduced-motion` at both the global CSS layer and via `useReducedMotion` in HeroSection / ScrollProgress.

### Don't:
- **Don't** use `#fff` or `#000`. Every neutral is tinted toward cobalt's hue family.
- **Don't** add a second saturated color. Cobalt is the only pigment.
- **Don't** use `box-shadow` for elevation. Use hairlines and surface tone.
- **Don't** use glassmorphism, `backdrop-blur`, or decorative blur effects.
- **Don't** add `animate-ping`, decorative glow blobs, hover progress bars, or pulse-ring loaders.
- **Don't** use side-stripe borders (`border-left` greater than 1px as a colored accent).
- **Don't** use gradient text (`background-clip: text` on a gradient).
- **Don't** use the hero-metric template (big number, small label, supporting stats, gradient accent).
- **Don't** build identical card grids: H2 + subhead + 3 cards of icon-title-body.
- **Don't** render corner-marker spans (`tl`/`tr`/`bl`/`br` decorative absolutely-positioned brackets). Banned.
- **Don't** use em dashes (—) in body copy. Use periods, colons, semicolons, commas, or parentheses. Em-dash glyphs are allowed only as typographic markers in tables and diagrams, not in prose.
- **Don't** introduce a third font family. Geist + Geist Mono only.
- **Don't** name the SaaS palette by reflex: slate-950 + sky-500 is the training-data answer this system explicitly rejects.
- **Don't** repeat the `subject. <grey>second-line.</grey>` headline template in more than one section per page. Reserved for ModelTiers.
- **Don't** ship reading text smaller than 12px. Mono tags / file numbers / diagram captions are 11px minimum; body is 17px minimum.
