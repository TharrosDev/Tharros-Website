# THARROS — Design System

Monochrome. Square. Editorial. Type does the shouting.

This is the canonical spec. Tokens live in `app/globals.css`; nothing here is decorative
theory that the code does not implement.

---

## 1. Philosophy

THARROS is a fashion label, not a software product. The site is built to read as a
campaign you can buy from, not a catalogue with a brand banner on top.

Four rules resolve every conflict:

1. Between more features and a premium aesthetic — **choose the aesthetic**.
2. Between louder and more sophisticated — **choose sophistication**.
3. Between more UI and more breathing room — **choose breathing room**.
4. Between generic ecommerce and editorial fashion — **choose editorial**.

Explicitly rejected: gradients as decoration, glassmorphism, rounded cards, drop shadows,
pill buttons, emoji, icon-card grids, "startup landing page" layouts, and any second
colour.

---

## 2. Colour

One neutral ramp. The clothing supplies the colour; the interface does not.

| Token | Value | Use |
|---|---|---|
| `--black` | `oklch(8% 0 0)` | Dark sections, footer, 404 |
| `--near-black` | `oklch(13% 0 0)` | Primary ink, button fill, heavy rules |
| `--steel` | `oklch(52% 0 0)` | Body text on paper (AA) |
| `--concrete` | `oklch(55% 0 0)` | Faint metadata — AA at 11px on paper |
| `--ash` | `oklch(82% 0 0)` | Empty-slot frame lines |
| `--bone` | `oklch(90.5% 0.002 90)` | Empty image slots |
| `--paper` | `oklch(98% 0.003 90)` | Page background, ink on dark |

Semantic aliases (`--surface`, `--ink`, `--ink-muted`, `--rule`, `--rule-on-dark`, …) are
what components actually reference. Recolour through the aliases, never the ramp.

Every text tone in the system passes WCAG AA against the surface it is used on, verified
by painting the computed colour to a canvas and reading the pixel back — Chromium
serialises `oklch()` as `lab()`, so string parsing silently produces nonsense.

---

## 3. Typography

Three families, no more.

| Role | Family | Where |
|---|---|---|
| Display | **Archivo** 700/800 | Headings, hero, wordmark, buttons' scale partner |
| Body / UI | **Inter** | Paragraphs, product names, form fields |
| Technical | **JetBrains Mono** | Prices, sizes, SKUs, section indices, captions, eyebrows, badges |

The mono layer is the brand's technical voice — it is what stops a monochrome fashion site
from reading as a blank template. Every number renders in mono with tabular figures via
`.num`.

### The ladder

Defined as `@utility` classes in `globals.css`, so responsive variants work
(`type-display-3 md:type-display-2`):

| Class | Size (fluid) | Use |
|---|---|---|
| `type-colossal` | 5rem → 22rem | 404 numeral; the footer wordmark uses SVG instead |
| `type-display-1` | 3.5rem → 12rem | Page titles, hero |
| `type-display-2` | 2.75rem → 6rem | Section statements |
| `type-display-3` | 1.875rem → 3.25rem | Product titles, empty states |
| `type-display-4` | 1.375rem → 2rem | Sub-headings, editorial cards |
| `type-lead` | 1.125rem → 1.5rem | Intro paragraphs |
| `type-body` / `type-body-sm` | fluid / 14px | Copy |
| `type-meta` | 11px | The mono layer |

Display sizes are uppercase with tight negative tracking; the mono layer is uppercase with
wide positive tracking. That contrast is the type system.

**Never hand-roll per-breakpoint font sizes.**

---

## 4. Structure

- `.page-frame` — max-width 1600px, fluid gutters (`clamp(1.25rem, 4vw, 4rem)`).
- Rhythm: `.rhythm-tight | .rhythm-default | .rhythm-breath`, fluid via `clamp()`.
- Header height is `--header-h` (4.5rem). The header is fixed; `PageIntro` carries the
  clearance so pages never add their own top padding.
- Image ratios: `ratio-portrait` (3:4, product), `ratio-editorial` (4:5),
  `ratio-campaign` (16:9), `ratio-wide` (21:9), `ratio-square` (1:1).

### Visual rhythm

The home page deliberately avoids a repeating image → heading → cards loop. Scale,
alignment, density and surface alternate: full-bleed hero, three-up grid, black type-only
statement, asymmetric offset pair, full-bleed campaign, sticky two-column story,
horizontal rail, quiet social strip. When adding a section, ask what it varies.

---

## 5. Components

| Component | Rules |
|---|---|
| `.btn` | Square (0 radius), min-height 3.25rem, mono uppercase label, hover inverts |
| `.btn-solid` | Black fill / paper text — the primary action |
| `.btn-inverse` | Paper fill / black text — on dark surfaces |
| `.btn-outline`, `.btn-outline-on-dark` | Secondary |
| `.link-rule`, `.link-rule-reveal` | Text link whose 1px rule wipes in or out |
| `.field`, `.field-boxed` | Underline by default; boxed in checkout |
| `.badge`, `.badge-solid`, `.badge-quiet` | Inventory and release state |
| `.eyebrow` | Mono index + label opening every section |
| `.on-dark` | Flips a section to the black surface |

Product cards: image swaps to the second shot on hover, image zooms 3.5%, quick-add size
row slides up (desktop only — on touch the product page does that job), heart sits top
right, name and price sit below the frame in a single row.

---

## 6. Motion

Slow, flat, intentional. Nothing bounces or overshoots.

- Durations: `--dur-fast` 180ms (hover), `--dur-base` 320ms, `--dur-slow` 620ms (zoom),
  `--dur-reveal` 900ms (scroll entrance).
- Easing: `--ease-out-quart`, `--ease-out-expo`.
- `Reveal` adds a class on intersection rather than removing one, so server-rendered
  content is visible if JS never runs.
- Everything is disabled under `prefers-reduced-motion`.

---

## 7. Imagery

`ImageSlot` is the only image primitive. With no `src` it renders a ratio-correct bone
frame with a dashed inset rule and the asset code in mono — legible as *pending*, not as
*broken*. Labels hide themselves via container queries when the slot is too small.

When photography arrives, add `src` to the slot's data entry. Nothing else changes.

Art direction for the eventual shoot: urban architecture, concrete, night streets,
industrial environments, fabric detail, monochrome, dramatic natural light. One coherent
universe. No smiling stock photography.

---

## 8. Accessibility

Non-negotiable, and cheaper to keep than to retrofit:

- Semantic landmarks, one `<h1>` per page, no skipped heading levels (product grids and
  accordion groups carry a visually hidden `<h2>` so card titles are not orphan `h3`s),
  skip link as the first tab stop.
- Interactive targets clear 24×24 CSS px; primary chrome controls are 44×44.
- Every overlay: `role="dialog"`, `aria-modal`, focus trap, ESC, scroll lock, focus
  restored to the opener.
- Visible focus ring defined once globally (`:focus-visible`), inverted on dark.
- Unavailable sizes are `disabled` with a screen-reader reason, not merely faded.
- Every image slot carries a real `alt` describing the intended photograph.
