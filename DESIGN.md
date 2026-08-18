# THARROS — Design System

Light. Square. Editorial. Type does the shouting.

**What this document is.** A record of the design decisions currently in the code, so a
change can be made consistently instead of guessing. Tokens live in `app/globals.css`.

**What it is not.** A rulebook, a standard, or a veto. The site is pre-launch and its
direction is the owner's — every choice below is here because it was chosen, and any of
it can be replaced on request without justification. If you are asked for something this
document calls settled, build the new thing and update this document. **An agent does not
get to refuse a look because a file says so.**

Where a line below is genuinely not aesthetic — contrast ratios, focus, heading order —
it says so. Everything else is taste, and the taste is not yours.

---

## 1. Philosophy

THARROS is a fashion label, not a software product. The site is built to read as a
campaign you can buy from, not a catalogue with a brand banner on top.

Four preferences that have resolved most conflicts so far:

1. Between more features and a premium aesthetic — the aesthetic has won.
2. Between louder and more sophisticated — sophistication has won.
3. Between more UI and more breathing room — breathing room has won.
4. Between generic ecommerce and editorial fashion — editorial has won.

Currently unused, and unused on purpose rather than by accident: gradients as decoration,
glassmorphism, rounded cards, drop shadows, pill buttons, emoji, icon-card grids,
"startup landing page" layouts, and a second colour. That is the current direction, not a
prohibition — if the owner wants any of them, they are in.

---

## 2. Colour

**Light ground, one accent, and the clothing supplies the rest.**

| Token | Value | Use |
|---|---|---|
| `--paper` | `oklch(98.5% 0.003 85)` | The page |
| `--bone` | `oklch(94.5% 0.004 85)` | The pale band, and empty image slots |
| `--ash` | `oklch(86% 0.004 85)` | Empty-slot frame lines |
| `--concrete` | `oklch(51.5% 0.005 70)` | Faint metadata — 5.39:1 paper, 4.79:1 pale |
| `--steel` | `oklch(48% 0.005 70)` | Body text — 6.27:1 paper, 5.57:1 pale |
| `--near-black` | `oklch(24% 0.006 60)` | Primary ink, button fill, heavy rules |
| `--black` | `oklch(20% 0.006 60)` | The footer, and nothing else |

Two things about this ramp are decisions rather than values.

**It is only just warm.** The ramp was fully achromatic while the site was monochrome,
which was right then; beside any warm surface the same greys go blue. It then went the
whole way to unbleached ivory (chroma .008, hue 85) and that was wrong in the other
direction — ivory reads *aged*, and a page the colour of an old book is the wrong century
for a label whose argument is that it is new and getting better. The chroma is a trace now:
enough that a photograph does not sit on the page like a cut-out, not enough to read as a
colour or a mood.

**`--bone` is a surface, not a fill.** It moved from 90% to 94.5% and became the site's
second ground — the pale band that replaced almost every black one. At 90% it was a panel;
at 94.5% it is a change of paper. It also cleared a real defect: `--ink-faint` reads 4.79:1
on it, where the old bone gave 3.66:1 and forced `PendingNotice` to avoid bone entirely.

**One black band survives, and it is the footer.** The page used to alternate paper with
full-viewport near-black: a black statement, a black next-drop, a black footer. Three of
those in one scroll is not rhythm, it is a site that keeps switching the lights off. The
contrast comes from type scale now, which is what the display ladder was built for.

Semantic aliases (`--surface`, `--ink`, `--ink-muted`, `--rule`, `--rule-on-dark`, …) are
what components actually reference. Recolour through the aliases, never the ramp.

### Grain

`body::before`, one fixed inline-SVG turbulence plate at `--grain-opacity` (0.022),
`pointer-events: none`, `--z-grain: 1`. Under a kilobyte, no request, and `fixed` so it does
not repaint on scroll. Tuned over a photograph rather than over a flat swatch, because grain
on top of a picture is where this goes wrong. If it is *visible* as an effect it is too
strong.

### Surfaces rebind the aliases

`.on-dark` and `.on-light` do not merely set a background — they **rebind the aliases** for
everything inside them. Because `@theme inline` keeps the theme values as live `var()`
references, `text-ink-muted`, `border-rule` and `text-signal` resolve through the surface
they are sitting on and become correct automatically.

| Class | Use |
|---|---|
| `.on-pale` | A section on the bone surface — the site's second ground |
| `.on-dark` | A section on the black surface. The footer, the 404 and the error boundaries |
| `.on-light` | An element carrying its own pale surface *inside* a dark one — the empty image frame |

This is the point of the alias layer, and it is not optional politeness: before the aliases
were rebound, a product card reused on a dark section rendered its price at 3.78:1 and the
header's drop stamp sat at 2.96:1 over the hero. **Write components against the aliases and
they work on either surface. Reach past them to the ramp and they will be wrong on one.**

### The accent

One chromatic value, and it is a state marker rather than a colour scheme.

| Token | Value | Contrast |
|---|---|---|
| `--oxide` | `oklch(48% 0.14 30)` | 6.71:1 on paper, 5.97:1 on the pale band |
| `--oxide-on-dark` | `oklch(64% 0.15 30)` | 5.04:1 on the footer |

A matter family — olive, umber and stone, for saying what a garment is made of as against
what condition it is in — was added here and taken out again. It existed to colour material
swatches and a fabric specification block, and those came out: restating one row of a spec
table as a section with coloured chips is the performance of care rather than care. With no
consumer left, three unused colour tokens are three colours waiting to be used
decoratively.

Referenced through `--signal` / `--signal-on-dark` (`text-signal`, `text-signal-on-dark`),
never through `--oxide` directly.

Oxide red reads as a printed production stamp rather than a fashion colour. As used today it
has three jobs — the current drop, a closed run, something in development — and stays out of
buttons, out of decoration, and down to one accented element per screen of content. That
restraint is what keeps it meaning something; widen it if you want it to mean something
else.

The persistent drop stamp in the header is deliberately outside that count. It is chrome, not
content: it marks the current drop everywhere, so a product page showing a closed run in oxide
will legitimately carry two marks — one saying which drop you are in, one saying this piece is
finished. They never mean the same thing, so they never compete.

**There is no second red.** `--danger` existed at `oklch(52% 0.16 27)` — four degrees of
hue and two points of chroma from `--oxide` — and it has been removed. Oxide is
load-bearing across three meanings, and a visitor who has learned that this red marks
state should not then meet the same red marking their own mistake, on a form, at the most
anxious point in the flow. Errors are marked the way everything else in this system is
marked: `.field[aria-invalid="true"]` doubles its own rule with an inset ring, and
`.field-error` sets the message in full-strength `--ink` on the mono face. The ring rather
than a border-width change because border-width does not interpolate and a 1px growth
reflows every field beside it.

On the home page's opening screen the single accented element is the **run ledger**, not
the drop numeral. See §5.

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
| `type-meta` / `type-meta-lg` | 11px / 13px | The mono layer |

Display sizes are uppercase with tight negative tracking; the mono layer is uppercase with
wide positive tracking. That contrast is the type system.

### The mono ladder

The technical layer promoted to display scale — drop numerals, run counts, the figures a
specimen record is actually about.

| Class | Size (fluid) | Use |
|---|---|---|
| `type-mono-1` | 3.25rem → 7rem | Drop numerals; the largest figure on a screen |
| `type-mono-2` | 1.5rem → 3rem | Run counts, remaining counts |
| `type-mono-3` | 1rem → 1.25rem | Specimen rows, promoted metadata |

Tracking relaxes toward zero as the size grows — mono letterforms are already wide, so the
`+0.14em` of `type-meta` would fall apart at display size. All three are tabular by default,
so a number that changes never shifts the layout around it.

The low end of `type-mono-1` is deliberately steep: on a phone the drop numeral should be the
largest thing on the screen, not a shrunken desktop figure.

The ladder exists so a size does not have to be invented per breakpoint. Reach for a
rung first; add a rung if none fits.

---

## 4. Structure

- `.page-frame` — max-width 1600px, fluid gutters (`clamp(1.5rem, 5.5vw, 7rem)`). The
  margin is composition, not leftover space: at a 4rem ceiling a 1440px screen put the
  work 64px from the edge, which reads as a document rather than as a wall.
- Rhythm: `.rhythm-tight | .rhythm-default | .rhythm-breath`, fluid via `clamp()`. Three
  intervals and no fourth, pitched far enough apart that a pause reads as a pause —
  `tight` groups two things that belong together, `default` separates sections, `breath`
  is the held beat either side of a black band.
- `.section-lead` (`--lead-gap`) is the one interval between a section's opener and the
  work it opens. Six sections previously carried their own `mt-10 / mt-12 / mt-14 /
  mt-16`, which is four values for one relationship. Reach for it rather than a margin.
- `.grid-hang` drops a three-up grid's middle column half a step from `lg`. Rigid rows of
  a garment grid read as a catalogue page; one offset column turns the same grid into a
  hang the eye travels rather than scans. Editorial grids only — `/shop` stays square,
  because there scanning is the job.
- Header height is `--header-h` (4.5rem). The header is fixed; `PageIntro` carries the
  clearance so pages never add their own top padding.
- Image ratios: `ratio-portrait` (3:4, product), `ratio-editorial` (4:5),
  `ratio-campaign` (16:9), `ratio-wide` (21:9), `ratio-square` (1:1).

### Visual rhythm

The home page deliberately avoids a repeating image → heading → cards loop. Scale,
alignment, density and surface alternate: full-bleed hero, three-up specimen grid, black
type-only statement, the campaign sequence's alternating frames, a sticky two-column
story, a horizontal rail, black again. When adding a section, ask what it varies.

**Captions hang to the foot of their frame.** A campaign frame's caption column is
bottom-aligned (`md:self-end`), not top-aligned. Level with the top of a tall picture it
ran out after two lines and left a column of empty page under it, with its own rule
floating a third of the way up the frame. Hung at the foot, the caption's rule and the
picture's lower edge land together and the space collects above them, where it reads as
air. The same instinct governs the frame gutters: a piece needs more room from the piece
beside it than its own record needs from its frame.

**Rhythm is used as a device.** Every section below the hero used to be
`rhythm-default`, which meant the page had one spacing value for its whole length and
nothing could be a pause. The statement and the closing drop take `rhythm-breath`; the
lookbook rail takes `rhythm-tight` so it sits against the process above it.

**Numbering runs as one series per page.** The home page runs 01–06. A section's
index is its place in the page, never a drop's number — printing `002` in that column put
a second series in the same visual position and read as a step backwards. The drop's own
name carries its number.

### The section opener

`SectionHeading` opens every section and `PageIntro` every page, so a change to the
opener happens once. Twelve surfaces used to hand-roll `<p className="eyebrow"> + border-t border-ink`,
and every one of them lost the ledger rule: a static ink border is a different weight and
a different idea from a hairline that draws itself.

`.rule-draw` only animates on the element that `Reveal` drives — the selector is
`.reveal.rule-draw::before`. On a child it is a correct but static rule, which is the bug
it will keep reintroducing. Put them on the same element.

### The information set

`/size-guide`, `/shipping`, `/returns`, `/faq`, `/contact` and the three legal drafts are
one sequence, numbered as one in `lib/site.ts` (`INFORMATION`), and every one of them ends
on `InfoFooter` — the rest of the set as a ledger. They are the site's support layer and
they behave like a set rather than like eight unrelated pages.

### Browsing is by release

`/shop` is cut by drop first and by category second, and the category rail only renders
once there are at least four categories in use and enough pieces for a cut to cut anything
(`FilterBar`). Both guards are derived, so the bar grows back on its own as the catalogue
does. A single-release label offering a choice of one release is furniture describing
itself, so the rail hides itself there too, and the release the view is showing is named
in the page's own opener instead.

Four sort orders over seven pieces was three decisions nobody had to make — two of them
the same list reversed, one of them meaningless inside a single drop. The URL still honours
all four keys; the bar offers run order and price.

### The numbering is derived

A page's mono index counts the sections that actually rendered. Three sections of the
product page are conditional on data that does not exist yet, and with hard-coded indexes
the page printed 01 followed by 04 — which turns a position in a sequence into decoration.
See `sectionIndex()` in `app/shop/[slug]/page.tsx`.

### The specimen record

`ProductCard`'s `specimen` line — code, made, left — is what makes a grid read as a
label's record rather than a row of products. It is currently on every grid of pieces: the
home run, the shop, the drop, related products. Availability and run figures are always
derived; nothing here is authored.

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
| `.run-ledger` | The release as a proportion — see below |

### The run ledger

The home page's opening screen states the release as the proportion it describes rather
than as a statistics row. A 2px track is the whole run; the oxide segment is the part of
it that is gone; `40 MADE` and `24 LEFT` sit in mono at either end. `--run-taken` is a
unitless ratio the component computes from `runSize` and `runStatus().remaining`, so the
bar cannot disagree with the product pages and cannot manufacture urgency — it can only
draw what the inventory already says. It is `aria-hidden`: the two figures beside it are
the content, and a screen reader gets all of it.

It draws itself on `--ease-ledger` and shares `Reveal`'s stagger through `--reveal-delay`,
exactly as `.rule-draw` does — a pseudo-element cannot see the inline `transition-delay`
that `Reveal` sets on the element itself.

What it replaced was Pieces / Made / Remaining in a three-cell `dl` with hairline tops:
structurally the same object as "10k users / 99.9% uptime / 24/7 support", wearing the
most distinctive content on the site.

Product cards: image swaps to the second shot on hover, image zooms 3.5%, quick-add size
row slides up (desktop only — on touch the product page does that job), heart sits top
right, name and price sit below the frame in a single row.

---

## 6. Motion

Slow, flat, intentional. Nothing bounces or overshoots.

- Durations: `--dur-fast` 180ms (hover), `--dur-base` 320ms, `--dur-slow` 620ms (zoom),
  `--dur-reveal` 900ms (scroll entrance). There was a `--dur-page` 480ms for route
  changes; nothing referenced it and there is no route-change indicator, so a token that
  described a transition the site does not have has been removed rather than kept as a
  promise.
- Easing: `--ease-out-quart`, `--ease-out-expo`, `--ease-ledger` (the rule draw).
- **The ledger rule** (`.rule-draw`) is the site's entrance gesture: a hairline that draws
  itself left to right across the top of a section, so the rule and whatever sits on it — a
  mono index, a count — arrive together. Combined with `Reveal`, which supplies the
  `reveal-in` class. A section fades; a rule is ruled.
- `Reveal` adds a class on intersection rather than removing one, and its hidden state is
  scoped to `[data-js]` — an attribute the root layout sets before first paint. If scripting
  is blocked or the bundle fails, content is never hidden to begin with. Both halves are
  required: the class-adding alone would still strand `opacity: 0` in the SSR HTML.
- **The travelling numeral** (`ParallaxNumeral`) is the second gesture: a frame's mono
  index drifts about 40px against the picture it labels as the frame crosses the viewport.
  Typographic, monochrome, and the only motion allowed on top of imagery. On a coarse
  pointer it travels half as far rather than not at all — switching it off there left the
  site with no motion whatsoever on the device most people meet it on.
- **The staggered ledger** is the third: `Reveal`'s `delay` cascades a grid or a rail so it
  arrives as a sequence of rules rather than as one slab. Capped at about five steps —
  past that the delay stops reading as sequence and starts reading as lag. The delay is
  published as `--reveal-delay` as well as an inline `transition-delay`, because a
  pseudo-element cannot see the inline one and the rule would otherwise arrive early.
- **Cross-fade, never swap.** The header's floating → solid change is two grounds that are
  both always present, one fading out as the other fades in. Swapping the whole class
  string means the gradient simply ceases to exist at the threshold, which is what it used
  to do: the colour transitioned and the picture behind the header did not.
- Everything is disabled under `prefers-reduced-motion`.

### No animation library

There is no animation dependency, and adding one needs to clear a bar this project has
already tested. `motion` was added for the travelling numeral and removed again: scoped as
tightly as it goes — `LazyMotion` with `domAnimation` and `m` rather than `motion` — it
still measured **38kB gzipped**, loaded on `/`, `/drop` and `/lookbook`, for a 40px drift.

The argument for it was that scroll-linked position is the one thing CSS cannot do
portably while `scroll-timeline` has a Safari gap, and that hand-rolling it means a scroll
listener driving `setState` — a render cascade the React Compiler rejects. The first half
is true; the second was not. `ParallaxNumeral` writes the transform **straight to the
node**, so React never re-renders and there is no state to cascade. An `IntersectionObserver`
keeps the scroll handler idle while the element is off screen, and a single
`requestAnimationFrame` coalesces the work.

The pattern, for any future scroll-linked effect:

- A `"use client"` leaf, `useRef` + `useEffect`, no state.
- Bail before attaching anything under `prefers-reduced-motion`, so no transform is ever
  *written* rather than written and zeroed. A coarse pointer halves the travel rather than
  bailing: switching motion off there left the site with none at all on the device most
  people meet it on.
- Clean up the listener, the observer, the pending frame **and the inline transform**.
- Nothing in the served HTML: the effect runs after hydration, so SSR output is untouched.

Presence animation likewise stays in CSS. `FrameHotspots`' label was a state toggle inside
`AnimatePresence`; hover and focus are things CSS already knows, so `group-hover` /
`group-focus-visible` do it with no state, no bundle, and no client component at all.

**Currently kept in CSS rather than a library** — converting `Reveal` to any library's
`whileInView` (it would lose the `[data-js]` guarantee that nothing is hidden in the SSR HTML when scripting fails, and
the shared observer is cheaper than one per element); the overlays, which keep their
`[data-open]` CSS transitions; `.rule-draw`, `.hover-zoom`, `.link-rule`, `.btn`,
`.bag-count`; and route transitions, which would force a client boundary at the layout root.

---

## 7. Imagery

`ImageSlot` is the only image primitive. With no `src` it renders a ratio-correct bone
frame with a dashed inset rule and the asset code in mono — legible as *pending*, not as
*broken*. Labels hide themselves via container queries when the slot is too small.

`ratioSm` gives a slot a second shape below `md`, so a 21:9 campaign frame is a tall frame
on a phone rather than a 167px band — one element, one download. The ratio classes are
`@utility` declarations for exactly this reason: as plain classes in `@layer utilities`
they take no responsive variants, and `md:ratio-campaign` silently does nothing.

Which frame of a piece appears where is decided in `lib/catalog/images.ts`, not by
position in the array. The ladder runs worn → in the world → detail → back → flat, so the
site leads with the garment on a person and degrades correctly for a piece with three
photographs instead of six. Small thumbnails (bag, search, order summary) invert it: at
64px a full-body frame is a smudge.

### The stand-in artwork

Until photography exists, a slot without `src` shows a stand-in photograph from
`public/filler` — a flat lay, a figure in a place, a street, or a fabric study, chosen
from the slot's `kind` and `crop` and held steady by its asset code, so a frame is
identical on every render and machine. They are free-licence stock (Openverse, CC0 and
public domain), pulled by `scripts/fetch-filler.mjs` and credited in
`scripts/filler-credits.json`.

They are in colour, and ungraded. Two earlier passes were not, and both were wrong in the
same way. They were drawn illustrations first — a drawing lets a layout be checked but not
judged, because a page of diagrams does not tell you whether the composition holds a
photograph. Then they were photographs desaturated to a monochrome palette, which reads as
an art direction the label has chosen rather than as scaffolding, and which could not be
reversed: a greyscale JPEG has no hue left to restore, so replacing them meant fetching a
new set. Stand-ins should look like what they are.

`NEXT_PUBLIC_FILLER_IMAGES=off` returns the bare frames. It is a switch for looking at a
layout without the stand-ins in it, nothing more — the site is pre-launch, the stand-ins are
scaffolding, and how much a layout leans on them while the photography does not exist is
not a problem to solve. Build what looks right; the frames hold their ratio either way, so
real photography drops in without moving anything.

The shoot itself — subjects, locations, styling, mood — is the owner's to direct, and is
not specified here. The one thing the stand-ins should not do is pre-empt that decision,
which is what grading them to a house palette did.

### Type over pictures

`--ink-on-dark-faint` only just clears AA on pure black, so it has **no headroom over a
photograph**. Metadata set over imagery uses `--ink-on-dark-muted` and carries its
hierarchy through the mono face and scale instead. Scrims are anchored to the block they
protect, not to a fraction of the viewport — viewport-fraction bands drift as the screen
height changes and leave text on bare picture. Verify by pixel readback, never by parsing
`getComputedStyle().color`: Chromium returns these as `lab()`.

**Anchored bands, and nothing on top of them.** The home hero carried `bg-black/45` across
the whole frame *in addition* to its two anchored bands and the header's own gradient —
four dimming layers, on a site whose thesis is that the clothing supplies the colour. The
only part of the picture ever seen undimmed was the middle third, which is the part with
nothing in it. The flat wash is gone. The bands stay, and they are the only ones.

---

## 8. Accessibility

The one section here that is not a matter of taste: these are about the site being
usable at all, not about how it looks, and they are cheaper to keep than to retrofit.

- Semantic landmarks, one `<h1>` per page, no skipped heading levels (product grids and
  accordion groups carry a visually hidden `<h2>` so card titles are not orphan `h3`s),
  skip link as the first tab stop.
- Interactive targets clear 24×24 CSS px; primary chrome controls are 44×44.
- Every overlay: `role="dialog"`, `aria-modal`, focus trap, ESC, scroll lock, focus
  restored to the opener.
- Visible focus ring defined once globally (`:focus-visible`), inverted on dark.
- Unavailable sizes are `disabled` with a screen-reader reason, not merely faded.
- Every image slot carries a real `alt` describing the intended photograph.
