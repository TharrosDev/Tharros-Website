---
name: Tharros Website
description: Redline — a vibrant white/black/red marketing surface for an Ottawa AI + web shop. Bold, kinetic, eye-catching.
colors:
  surface: "oklch(99% 0.002 25)"
  surface-elevated: "oklch(99.6% 0.0015 25)"
  surface-alt: "oklch(96.3% 0.005 25)"
  surface-hover: "oklch(97.2% 0.006 25)"
  surface-dark: "oklch(15% 0.012 25)"
  surface-dark-elevated: "oklch(20% 0.014 25)"
  ink: "oklch(17% 0.012 25)"
  ink-muted: "oklch(43% 0.016 25)"
  ink-faint: "oklch(50% 0.018 25)"
  ink-on-dark: "oklch(97% 0.002 25)"
  ink-on-dark-muted: "oklch(75% 0.008 25)"
  ink-on-dark-faint: "oklch(63% 0.012 25)"
  rule: "oklch(89% 0.004 25)"
  rule-strong: "oklch(80% 0.008 25)"
  rule-on-dark: "oklch(27% 0.012 25)"
  rule-on-dark-strong: "oklch(36% 0.014 25)"
  red: "oklch(56% 0.235 25)"
  red-deep: "oklch(48% 0.225 25)"
  red-deeper: "oklch(41% 0.21 25)"
  red-bright: "oklch(66% 0.225 25)"
  red-soft: "oklch(96% 0.035 25)"
  red-soft-strong: "oklch(92% 0.06 25)"
  accent: "oklch(48% 0.225 25)"
  accent-on-dark: "oklch(66% 0.225 25)"
typography:
  display-1:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.75rem, 2.4rem + 6.8vw, 8.5rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.045em"
  display-2:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 2.05rem + 3.5vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  display-3:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.45rem + 1.5vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.62vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Geist Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  none: "0"
spacing:
  tight: "clamp(2.5rem, 4vw, 4rem)"
  default: "clamp(4rem, 8vw, 8rem)"
  breath: "clamp(6rem, 12vw, 14rem)"
components:
  btn-primary:
    backgroundColor: "{colors.red-deep}"
    textColor: "oklch(99% 0.002 25)"
    rounded: "0"
    padding: "0.9375rem 1.625rem"
    height: "50px"
  btn-primary-hover:
    backgroundColor: "{colors.red-deeper}"
  btn-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-on-dark}"
    rounded: "0"
    height: "50px"
  btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    border: "2px solid {colors.ink}"
    rounded: "0"
    height: "50px"
---

# Design System: Tharros Website

## 1. Overview

**Creative North Star: "Redline"**

A vibrant, high-energy marketing surface in white, black, and one committed red. The system is built to feel *alive and eye-catching*, the deliberate opposite of the quiet, restrained "Field Engineer" system it replaces (May 2026 rebuild). Where the old system whispered with a single capped cobalt accent and hairline rules, Redline is loud where it counts: oversized type, decisive square-cut buttons, bold 2px black rules, full-black drama sections, red-drenched call-to-action strips, and kinetic motion (marquees, scroll-linked fills, sliding red blocks, count-up numerals).

It still rejects the slate-on-sky AI-SaaS reflex, the glassmorphism / decorative-blur trap, and the identical-icon-card-grid cliché. The grounded Ottawa-tradesperson voice survives in the mono metadata layer (Geist Mono numerals, `§ 0X` section markers, tabular figures): the difference is the volume.

**Key characteristics:**
- White (warm near-white) is the dominant canvas; full-black (`surface-dark`) sections provide contrast and drama; red is the one pigment that carries energy.
- Single family (Geist) for display and body at weight **700**; Geist Mono for numerals, eyebrows, and metadata.
- **Square corners** (0 radius) on buttons, inputs, tiles, and tags. Decisive, not soft.
- Bold structural rules: 2px black (`rule-h-bold`) and 3px red (`rule-h-red`) dividers, not just hairlines.
- **Bold motifs replace schematic diagrams**: oversized numerals, sliding red blocks, infinite marquees, kinetic count-up numerals, scroll-linked rails.
- Motion is energetic but disciplined: every effect is compositor-safe (transform / opacity / SVG) and has a static `prefers-reduced-motion` end-state.

## 2. Colors

A two-surface palette (warm near-white and warm near-black) with one saturated red in two tiers. All neutrals are tinted toward the red hue family (hue 25, chroma 0.002–0.018). Pure `#fff` and `#000` are forbidden.

### Red (the pigment)
Red carries every accent, CTA, active state, marker, and progress indicator. It runs hotter than the old cobalt: this is a *committed* accent, not a restrained one. It owns the hero punchline, every primary button, the NextStep strips (full red-drenched), the flagship pricing column, section eyebrow ticks, and the scroll-progress bar.

- **Red** `oklch(56% 0.235 25)`: vibrant red for large headline spans (`.accent-text`), decorative blocks (`.red-block`), markers, ticks, marquee diamonds. Use on large text only (≥24px) on white; passes large-text AA.
- **Red Deep** `oklch(48% 0.225 25)` (= `--accent`): button fill and any red surface carrying white reading text (white-on-red ≥4.5:1). Small red accent text on white (LIVE, Visit, factor letters).
- **Red Deeper** `oklch(41% 0.21 25)`: primary-button hover / pressed.
- **Red Bright** `oklch(66% 0.225 25)` (= `--accent-on-dark`): lifted red for accent text and spans on black surfaces (~5:1).
- **Red Soft** `oklch(96% 0.035 25)` / **Red Soft Strong** `oklch(92% 0.06 25)`: washes for the flagship pricing column, selected form controls, text selection.

### Neutral (white side)
- **Surface** `oklch(99% 0.002 25)`: dominant page background, warm near-white.
- **Surface Elevated** `oklch(99.6% 0.0015 25)`: insets (wizard card body).
- **Surface Alt** `oklch(96.3% 0.005 25)`: warm-grey alternate sections (Problem, Pricing factors).
- **Ink** `oklch(17% 0.012 25)`: primary text, ~15:1.
- **Ink Muted** `oklch(43% 0.016 25)`: body / lead, ~6:1 (AA body).
- **Ink Faint** `oklch(50% 0.018 25)`: tertiary mono labels, ~4.6:1 (AA small).
- **Rule** `oklch(89% 0.004 25)` / **Rule Strong** `oklch(80% 0.008 25)`: light dividers.

### Neutral (black side)
- **Surface Dark** `oklch(15% 0.012 25)`: warm near-black. Drama sections: WhatWeBuilds agent rows, footer. (Also the live-agent console's machine header bar.)
- **Ink On-Dark** `oklch(97% 0.002 25)` (~15:1), **Ink On-Dark Muted** `oklch(75% 0.008 25)` (~8:1), **Ink On-Dark Faint** `oklch(63% 0.012 25)` (~4.6:1).
- **Rule On-Dark** `oklch(27% 0.012 25)` / **Rule On-Dark Strong** `oklch(36% 0.014 25)`.

### Named rules
- **The One Pigment Rule.** Red is the only saturated color. No second hue. Restraint of *hue*, not of *quantity*: red appears boldly and often, but it is always the same red.
- **The Two-Tier Red Rule.** Vibrant `--red` for large text and decoration; `--red-deep` (= `--accent`) wherever white text rides red or small red text sits on white. This keeps every red/white pairing AA-compliant.
- **The No Pure Black or White Rule.** Every neutral is tinted toward hue 25. `#fff` / `#000` are forbidden.
- **The Contrast Floor Rule.** Reading text never drops below 4.5:1 (large headline spans may use vibrant `--red` at ≥3:1, large-text AA).

## 3. Typography

**Display + body:** Geist. **Mono:** Geist Mono. No third family.

Hierarchy comes from **scale + weight 700** display contrast against 400 body, plus the mono metadata layer. Display sizes are larger and tighter than the old system to read as bold, not polite.

- **Display-1** (700, `clamp(3.75rem → 8.5rem)`, lh 0.86, tracking -0.045em): hero, clients H1.
- **Display-2** (700, `clamp(2.75rem → 4.75rem)`, lh 0.95, tracking -0.035em): section H2s.
- **Display-3** (700, `clamp(1.75rem → 2.75rem)`, lh 1.02): H3s, package/agent names.
- **Lead** (400, `clamp(1.25rem → 1.625rem)`, lh 1.4, max 60ch).
- **Body** (400, `clamp(1.0625rem → 1.1875rem)`, lh 1.6, max ~46–60ch).
- **Meta** (Geist Mono, 500, 12px, tracking 0.14em, uppercase): eyebrows, `<dt>`, tags, markers.
- **Big-Num** (`.big-num`): oversized mono numeral motif (4.5–7rem), weight 700, lh 0.8. Variants: `--red` (solid), `--outline` / `--outline-red` (text-stroke), used for Problem rows, agent cards, Why pillars.

### Named rules
- **The Mono Numeral Rule.** Every meaningful number (`01`, `§ 03`, prices, countdown, dates, hours) renders in Geist Mono with `tabular-nums` via `.num`.
- **The Single Family Rule.** Geist + Geist Mono only. No display serifs, no Inter.
- **The Minimum Size Rule.** No reading text below 12px; body ≥17px.

## 4. Elevation

No shadows. Depth comes from tonal layering (white → surface-alt → black), bold rules (2px black, 3px red), and red fills/blocks. Hover states shift background, border-color, or apply the red `:focus-visible` ring. `box-shadow` is forbidden in new components.

## 5. Components

### Buttons (square, 0 radius, weight 600, min-height 50px / 54px mobile)
- **`.btn-primary`** — red-deep fill, white text. Hover: red-deeper + `translateY(-2px)` + arrow nudge. The default CTA.
- **`.btn-ink`** — solid black fill, white text. For placing on red surfaces (NextStep) or as an alternate solid on white.
- **`.btn-ghost`** — transparent, 2px ink border, ink text. Hover: fills ink. Variants `.btn-ghost-on-dark` (on black) and `.btn-ghost-on-red` (on red strips).
- **Focus:** 2px red outline (red-bright on dark). Never removed.

### Signature: Section eyebrow
Every section opens with `<SectionEyebrow>`: a 3px red tick + red mono `§ 0X` numeral + uppercase mono label. Bolder and redder than the old hairline-tick eyebrow.

### Signature: Marquee (`components/Marquee.tsx`)
Infinite horizontal scroller, the kinetic backbone of the site. Variants `dark` (black bar, white text, red diamonds), `red` (red-deep bar, white text), `light`. Pauses on hover; static first-copy under reduced motion. Used as the hero's bottom band and available site-wide.

### Signature: Oversized numerals + sliding red blocks
Replaces the old SVG schematics. Problem rows pair a huge outlined-red numeral with a red bar (`.red-block`) that wipes in (`scaleX` 0→1, origin-left) on scroll. Agent cards (WhatWeBuilds) and Why pillars use big-num red numerals. Flow sequences render as bold horizontal label chains joined by 2px red rules, last stage in red.

### Signature: Live agent console (ChatDemo)
The home `§02` live-agent demo sits on a **white** surface (`components/ChatDemoSection.tsx` + `MobileChatConsole.tsx`, Relevance SDK). The console is a `border-2` ink frame with a solid-black machine header bar (red live dot + mono `LIVE AGENT · OTTAWA` + a red/segment prompt counter). Transcript on white: agent messages plain ink text under a red `AGENT` label; user messages right-aligned in a square solid-black bubble with white text. Suggested questions are square bordered chips that fill `red-soft` on hover; the input bar has a red `>` prompt and a red Send button; the prompt-limit banner is a `red-soft` strip. Below the console, a 3-up trust row (`Real Answers / Your Voice / Wired In`) on a 2px black rule.

### Signature: Kinetic process rail (HowItWorks)
A 2px rail with a red fill bound to `useScroll` (`scaleY`), and step nodes (2px black squares with mono numerals) that flip to a solid-red filled node with white numeral as they enter the viewport.

### Signature: Count-up countdown (LaunchCountdown)
Live launch-discount timer: black digit tiles with white mono numerals, red `:` separators, red `◆ LAUNCH OFFER` marker, struck-through standard prices beside red launch prices.

### Signature: Comparison table (ModelTiers)
Real `<table>` on desktop. The flagship **The Integrate** column carries a `red-soft` wash, a 2px red top border, and a red `◆ RECOMMENDED` tag. `●` included markers pop in column-by-column (red); `—` for not-included. 2px black table top rule. Mobile collapses to a stacked variant with the same data + flagship wash.

### Signature: Metadata row
Horizontal `<dl class="meta-row">` with mono `<dt>` (ink-faint) and `<dd>` (ink, weight 600). Contact strips, hero bottom strip, clients summary. Sits under a 2px black rule on the hero.

### Cards
Avoided for marketing copy (prefer numbered rows, tables, bold motifs). The one sanctioned card surface is `ClientsSection` (`ClientCard`): square `border` that shifts to red on hover, no shadow, no radius, no nested cards. `PlaceholderCard` is the dashed pending variant with red `LoadingDots`.

## 6. Do's and Don'ts

### Do
- **Do** use red boldly: red CTAs, one red headline span per heading, red eyebrow ticks, red-drenched NextStep strips, the flagship pricing wash. Red is committed, not rationed.
- **Do** keep red/white pairings AA: vibrant `--red` for large text, `--red-deep` for small text and white-on-red surfaces.
- **Do** use square corners (0 radius) on buttons, inputs, tiles, tags.
- **Do** reach for bold 2px black or 3px red rules as structural dividers, not just hairlines.
- **Do** replace any "diagram" instinct with a bold motif: oversized numeral, marquee, sliding red block, kinetic rail, or count-up numeral.
- **Do** render meaningful numbers in Geist Mono `tabular-nums` via `.num`.
- **Do** lead every section with `<SectionEyebrow>` (red tick + red `§ 0X` + label).
- **Do** vary rhythm: `.rhythm-tight | .rhythm-default | .rhythm-breath`.
- **Do** respect `prefers-reduced-motion` (marquees stop, fills snap to end-state, reveals disable).

### Don't
- **Don't** use `#fff` or `#000`. Tint every neutral toward hue 25.
- **Don't** add a second saturated hue. Red is the only pigment.
- **Don't** use `box-shadow`, glassmorphism, or decorative blur.
- **Don't** use side-stripe borders (`border-left/right` > 1px as a colored accent) on cards/list items/alerts. (The full-height rail inside an OG poster is a deliberate exception.)
- **Don't** use gradient text (`background-clip: text`).
- **Don't** build identical icon-card grids (H2 + subhead + 3 icon-title-body cards).
- **Don't** use the hero-metric template (big number, small label, supporting stats).
- **Don't** revive the SVG schematic diagrams (`components/diagrams/`) or the `signal-stack` flow; they read as the old calm system. Use bold motifs.
- **Don't** use em dashes (—) in body copy. Em-dash glyphs are allowed only as typographic markers in tables/diagrams.
- **Don't** introduce a third font family. Geist + Geist Mono only.
- **Don't** drop display weight below 700 or soften the square corners; that pulls the system back toward "calm."
