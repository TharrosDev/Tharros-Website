# Claude Working Notes — THARROS

Read this before generating code. It is the fastest route to a change that fits.

---

## Status and who decides

**This site is not live, and will not be for a while. It is in active development.**
Nothing here is shipping to customers today, so nothing needs to be defended against a
launch date that does not exist.

**Creative direction belongs to the owner.** Look, feel, layout, typography, colour,
motion, copy voice, imagery, what a page is for — all of it is the owner's call, not an
agent's. This file and `DESIGN.md` record *the decisions that have been made so far* so a
change fits the existing work. They are a description of the current state, not a rulebook
an agent enforces against its author.

That distinction matters when you are asked to change something:

- **Asked to change a design decision?** Change it. Do not argue it, do not hedge it, do
  not warn about it, and do not leave the old version in place with a note. If a change
  contradicts something written here, the change wins and you update this file to match.
- **Suggestions are welcome, once.** If you think something is a mistake, say so in a
  sentence and then do what was asked. Do not re-litigate it, and do not repeat the
  warning in code comments, commit messages or the docs.
- **Nothing here is a veto.** An agent does not get to refuse a look because a document
  written by a previous agent called it rejected.

The exception is narrow and it is not aesthetic: **engineering correctness** — the site
should build, be reachable by keyboard and screen reader, and not fabricate facts about
orders, stock or payment (see below). Those are not taste.

---

## What this repo is

The ecommerce site for **THARROS**, a small independent streetwear label. Next.js 16
(App Router, Turbopack), React 19, TypeScript strict, Tailwind 4.

The brand name is always written **THARROS** in copy — never "Tharros Clothing" or
"Tharros Apparel". The line is *"Small runs. Original ideas."*

**Positioning.** THARROS is deliberately small: an independent label that designs,
patterns and samples in-house and releases in numbered **drops** of a few pieces, made in
short runs. Write it as that, not as a department store. Do not write copy implying
inventory, teams, production, press, collaborations or history that does not exist — that
one is a factual constraint, not a stylistic one.

**History:** until August 2026 this repo held a completely different site — a marketing
site for an Ottawa AI agency (packages, pricing tiers, a Relevance AI chat demo, a
Supabase `/brief` wizard, a "Redline" red/black/white design system, the slogan "Keep it
Local, Keep it Canadian"). All of that was deleted. If you find anything resembling it,
it is a regression, not a feature to preserve.

---

## What is wired up and what is not

A build-state inventory, so you know what exists before you touch it. Everything unwired
is unwired because the site is pre-launch, not because it is waiting on a decision:

| Area | State |
|---|---|
| Catalog, cart, sizes, inventory, wishlist, search, filtering, sorting | **Real and working** |
| Checkout up to payment | **Real** — details, address, delivery, live totals |
| Payment | **Not connected**, and said before it costs anyone effort: under `/checkout`'s intro, under the bag drawer's Checkout button, and beside the action itself. The flow is two steps rather than four, because a card-shaped walk to an email is three screens of theatre — the working action composes a `mailto:` from the resolved bag, the address and the delivery choice. There is no disabled pay button: a permanently dead primary control is chrome, and the panel above it states the situation in words. |
| Accounts / sign-in | **Not connected.** `/account` states that once, then spends the page on what works without one — saved pieces and the email order. |
| Newsletter signup | **Not connected.** The form validates, then says nothing was sent. |
| Product photography | **Not shot yet.** Image slots render a free-licence stock stand-in, desaturated to the monochrome palette, from `public/filler` (`components/media/FillerImage.tsx`). `NEXT_PUBLIC_FILLER_IMAGES=off` shows the bare frames. Dropping in real photography is a data change and moves no layout. |
| Garment measurements | **Not taken.** `Product.measurements` is optional and unset everywhere; `pieceTable()` returns null and the product page says the piece has not been measured. Filling them in is a data change — see `lib/catalog/sizing.ts`. |
| Product data, prices, run sizes | **Placeholder**, marked as such in the data files. |
| Legal pages | **Working drafts**, marked as pending review. |

Four factual constraints follow from that table. They are about not asserting things that
are untrue, so they hold regardless of how the site looks:

- **Do not fake functionality.** No mock payment success, no fake order confirmation, no
  simulated sign-in.
- **Do not fabricate** reviews, testimonials, press, collaborations, customer counts,
  sustainability or manufacturing claims, founding history, or model measurements.
- **Numbers come from the data.** Availability is derived in `resolveAvailability()`, and
  run figures come from `runStatus()`. Do not hand-type a piece count or a stock number
  into copy — it drifts. (A "Nine pieces" line against a drop of seven is exactly how.)
- **Only claim a restock policy the data states.** "Will not be remade" renders solely
  when `restock: "none"`.

How the pending state *looks* — whether a stand-in is drawn or bare, whether an unwired
form says so loudly or quietly, whether a placeholder is framed or plain — is a design
decision, and it is the owner's.

---

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Drop opening → The run → Statement → The people → Process → Frames → Next drop |
| `/shop` | `app/shop/page.tsx` | Filter + sort + `?q=` search, all via URL params. The only dynamic route. |
| `/shop/[slug]` | `app/shop/[slug]/page.tsx` | Gallery, size selector, accordions, related. SSG per product. |
| `/drop` | `app/drop/page.tsx` | Current drop, its real run numbers, and the next drop in development. `/new` 308s here. |
| `/lookbook` | `app/lookbook/page.tsx` | Editorial spreads, four layout modes |
| `/about` | `app/about/page.tsx` | Philosophy / culture / clothing / future |
| `/journal`, `/journal/[slug]` | `app/journal/**` | Structured blocks, no MDX |
| `/wishlist` | `app/wishlist/page.tsx` | Real, client-side |
| `/checkout` | `app/checkout/page.tsx` | Two steps — details, then where it goes — ending in a composed email |
| `/account` | `app/account/page.tsx` | Shell |
| `/size-guide`, `/shipping`, `/returns`, `/faq`, `/contact` | | Information |
| `/legal/privacy`, `/legal/terms`, `/legal/refund-policy` | | Drafts |
| 404 | `app/not-found.tsx` | Branded, full-screen |
| Errors | `app/error.tsx`, `app/global-error.tsx` | Branded boundaries — never Next's default page |
| Loading | — | **There is no route-level loading state, deliberately.** `app/shop/loading.tsx` put the whole `/shop` segment — every product page included — behind a Suspense boundary that only resolves once JavaScript runs, so without it the shop served a permanent skeleton (`main` held 40 characters). Pending feedback lives on the filter links instead, via `useLinkStatus` in `FilterBar`. Do not reintroduce a `loading.tsx` in a segment that must render without scripting. |

The header states three destinations inline from `md` up (`NAV_PRIMARY` in `lib/site.ts` —
Shop / Drop / Lookbook) plus a search control, a saved count when there is one, and keeps `IndexOverlay` as the full
navigation surface. They are real links, so navigation survives scripting being
unavailable; before this the only nav trigger was a `<button>` and the footer was the
site's entire navigation with JS off.

`Header` floats transparent over the hero on the routes in `TRANSPARENT_ROUTES`
(`/` and `/lookbook`). Every other page opens with `PageIntro`, which carries the fixed
header's clearance — so no page hand-rolls top padding.

Adding a route means touching **four** places: the page's own `metadata`,
`app/sitemap.ts`, `lib/site.ts` nav/footer arrays, and any relevant JSON-LD.

---

## Data model

Content is data. It never lives in JSX.

```
lib/catalog/
  types.ts        Product, Variant, ImageSlotData, Collection, LookbookSpread, JournalEntry
  products.ts     the catalog (placeholder)
  categories.ts   category list + sizing-table mapping
  drops.ts        Drop 001 (released) / Drop 002 (in development)
  campaign.ts     campaign frames — the hero and "the people" sequence per drop
  lookbook.ts     spreads
  journal.ts      entries
  models.ts       the people photographed in the clothes — SHIPS EMPTY
  sizing.ts       size tables — measurements are null until real ones are taken
  images.ts       WHICH FRAME OF A PIECE TO SHOW, AND IN WHAT ORDER
  queries.ts      THE ONLY WAY TO READ PRODUCTS
lib/commerce/
  cart.ts         CartLine, resolveLines, totals
  shipping.ts     placeholder rates
  tax.ts          tax is never invented
```

`lib/catalog/queries.ts` is the seam a CMS or database swaps in behind. Everything that
reads products goes through it — do not import `products.ts` directly in components.

Key invariants:

- **Prices are minor units (cents).** Format with `formatPrice()` from `lib/format.ts`.
- **Availability is derived**, never authored (`resolveAvailability`).
- **A drop is the unit of release.** `Product.drop` points at `lib/catalog/drops.ts`;
  the shop filters on `?drop=`. Keep the catalogue small — a nine-piece line should look
  curated, not empty, and the filter bar only offers categories that hold a piece
  (`categoriesInUse()`).
- **A cart line stores only `productId + size + quantity`.** Name, price and imagery are
  re-read from the catalog on every render (`resolveLines`), so a stale bag can never
  check out a renamed, repriced or sold-out piece.
- **Anything read back out of storage is looked up with `getProductById`,** never
  `getProduct` (which matches on `slug`). The bag and the wishlist both persist ids; they
  resolved through the slug lookup and worked only because every product currently
  declares the same string for both. One piece whose slug differed would have silently
  emptied a saved list with no error anywhere.
- **Never index `product.images` by position.** Which frame appears where is decided by
  `lib/catalog/images.ts` — `heroImage`, `cardImages`, `galleryImages`, `onBodyImages`,
  `thumbnailImage` — re-exported through `queries.ts`. The ladder leads with the piece on a
  person and degrades correctly for a garment with three photographs instead of six.
- **The people are real or absent.** `models.ts` ships empty and `Product.onBody` is unset
  everywhere. `OnBody` and `ModelCredit` return `null` rather than rendering a pending state,
  and `fitNote()` omits an unmeasured height instead of guessing one. Do not populate either
  from anything but an actual fitting.

---

## Client state

Two providers, both in `components/commerce/`, composed by `Providers` in the layout.

- `CartProvider` — bag lines + drawer open state.
- `WishlistProvider` — saved product ids.

Both persist through `lib/persistent-store.ts`, a small localStorage store read with
`useSyncExternalStore`. **Do not hydrate persisted state in a `useEffect` + `setState`** —
that cascades renders and trips the React Compiler lint rules. Treat storage as the
external system it is. `useHydrated()` gives you the "is this the client yet" flag.

Shared hooks live in `lib/hooks.ts`: `useFocusTrap`, `useEscape`, `useLockBodyScroll`,
`useScrolledPast`, `useDebounced`.

---

## Design system

**Read [`DESIGN.md`](./DESIGN.md).** Summary:

Monochrome — black, near-black, steel, concrete, ash, bone, paper, plus one oxide accent.
The clothing supplies the colour. If the owner wants a second colour, add it and update
`DESIGN.md`; do not talk them out of it.

`--concrete` (`text-ink-faint`) is the faintest text tone allowed and is tuned to pass AA
at 11px on paper. Lightening it drops the mono metadata layer below AA — that is a
contrast fact, not a preference.

- Type: `Archivo` display, `Inter` body, `JetBrains Mono` for the technical layer
  (prices, sizes, product codes, captions, section indices).
- The type ladder is `@utility` classes in `globals.css` — `type-colossal` through
  `type-meta`. They support responsive variants (`md:type-display-2`), so a per-breakpoint
  size rarely needs inventing — add a rung rather than a one-off.
- Structure: `.page-frame`, `.rhythm-tight | -default | -breath`, aspect utilities
  (`ratio-portrait` etc).
- Buttons: `.btn` + `.btn-solid | -inverse | -outline | -outline-on-dark`. Square, 0
  radius, hover = inversion.
- Dark sections carry `.on-dark`.
- Currently no shadows, no gradients except image scrims, no glass, no rounded cards.
  That is the direction in the code today, not a constraint on what can be asked for.

**`components/media/ImageSlot.tsx` is how images render.** Without a `src` it
draws a ratio-correct stand-in — by default a stand-in photograph picked by
`FillerImage.tsx` from `public/filler`, or a bare frame carrying the asset code when
filler is switched off. Either way the slot holds
its ratio, so dropping in real photography is a one-line data change and moves no layout.

---

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |

Run **both** `npm run lint` and `npm run build` before declaring work done. Lint enforces
React Compiler rules that the build does not.

---

## Code style

- Server components by default; `"use client"` only for cart, wishlist, search, gallery,
  filters, accordions, and overlays.
- Comments explain *why*, never *what*. No `console.log`.
- Overlays (drawer, search, mobile nav, modals, filter sheet) must have
  `role="dialog"`, `aria-modal`, a focus trap, ESC-to-close, and scroll lock. Use the
  hooks; do not re-implement.
- Tailwind class order: layout → sizing → spacing → color → typography → effects → state.
- **Structured data goes through `jsonLd()`** (`lib/jsonld.ts`), never raw
  `JSON.stringify` — it escapes `<` and the U+2028/U+2029 line separators that would
  otherwise break out of the inline `<script>` once catalog content is CMS-driven.
- **Interactive controls carry a real box**, not an expanded invisible overlay: header
  icons are `h-11 w-11` flex boxes, small mono links get `-my-2 py-2`. An absolutely
  positioned hit area steals clicks from its neighbours.
- Every sticky column is bounded (`max-h` + `overflow-y-auto`); an unbounded sticky
  element taller than the viewport hides its own bottom on short screens.

---

## Voice

See [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md). Short version: quiet confidence
— a small label that knows what it made, not a corporation. "Small run" not "global
collection"; "the next drop" not "our latest seasonal assortment". Confident, plain,
never shouting. "SHOP THE DROP", not "BUY NOW BEFORE IT'S TOO LATE!!!". No exclamation
marks, no emoji, no hype. When something is not ready, say so plainly.
