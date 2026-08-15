# Claude Working Notes — THARROS

Read this before generating code. It is the fastest route to a change that fits.

---

## What this repo is

The ecommerce site for **THARROS**, a small independent streetwear label. Next.js 16
(App Router, Turbopack), React 19, TypeScript strict, Tailwind 4.

The brand name is always written **THARROS** in copy — never "Tharros Clothing" or
"Tharros Apparel". The line is *"Small runs. Original ideas."*

**Positioning (read this before writing any copy).** THARROS is deliberately small: an
independent label that designs, patterns and samples in-house and releases in numbered
**drops** of a few pieces, made in short runs. It is not a department store and must
never be written as one. The premium presentation is the point — small production,
serious execution — so do not "simplify" the design to match the scale. Do not write
copy implying large inventory, teams, global production, press, collaborations or
history that does not exist.

**History:** until August 2026 this repo held a completely different site — a marketing
site for an Ottawa AI agency (packages, pricing tiers, a Relevance AI chat demo, a
Supabase `/brief` wizard, a "Redline" red/black/white design system, the slogan "Keep it
Local, Keep it Canadian"). All of that was deleted. If you find anything resembling it,
it is a regression, not a feature to preserve.

---

## What is real and what is not

The site is honest about its own state, deliberately. Do not paper over these:

| Area | State |
|---|---|
| Catalog, cart, sizes, inventory, wishlist, search, filtering, sorting | **Real and working** |
| Checkout up to payment | **Real** — contact, address, delivery, live totals |
| Payment | **Not connected.** The payment step says so and the Pay button is disabled. |
| Accounts / sign-in | **Not connected.** `/account` is a shell with an explicit notice. |
| Newsletter signup | **Not connected.** The form validates, then says nothing was sent. |
| Product photography | **Does not exist.** Every image slot renders an empty frame. |
| Product data, prices, run sizes | **Placeholder**, marked as such in the data files. |
| Legal pages | **Working drafts**, marked as pending review. |

Rules that follow from this, and that must not be quietly broken:

- **Never fake functionality.** No mock payment success, no fake order confirmation, no
  simulated sign-in.
- **Never fabricate** reviews, testimonials, press, collaborations, customer counts,
  sustainability or manufacturing claims, founding history, or model measurements.
- **Never fake scarcity.** Availability is derived from inventory in
  `resolveAvailability()`, and the run numbers a product page prints come from
  `runStatus()`: `runSize` is how many were actually made, `remaining` is real variant
  inventory. No countdowns, no "x people viewing", no invented low-stock warnings.
- **Only claim a restock policy the data states.** "Will not be remade" renders solely
  when `restock: "none"`.

---

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero → New Drop → Statement → Featured → Campaign → Collection → Lookbook → Social |
| `/shop` | `app/shop/page.tsx` | Filter + sort + `?q=` search, all via URL params. The only dynamic route. |
| `/shop/[slug]` | `app/shop/[slug]/page.tsx` | Gallery, size selector, accordions, related. SSG per product. |
| `/drop` | `app/drop/page.tsx` | Current drop, its real run numbers, and the next drop in development. `/new` 308s here. |
| `/lookbook` | `app/lookbook/page.tsx` | Editorial spreads, four layout modes |
| `/about` | `app/about/page.tsx` | Philosophy / culture / clothing / future |
| `/journal`, `/journal/[slug]` | `app/journal/**` | Structured blocks, no MDX |
| `/wishlist` | `app/wishlist/page.tsx` | Real, client-side |
| `/checkout` | `app/checkout/page.tsx` | Four steps, stops at payment |
| `/account` | `app/account/page.tsx` | Shell |
| `/size-guide`, `/shipping`, `/returns`, `/faq`, `/contact` | | Information |
| `/legal/privacy`, `/legal/terms`, `/legal/refund-policy` | | Drafts |
| 404 | `app/not-found.tsx` | Branded, full-screen |
| Errors | `app/error.tsx`, `app/global-error.tsx` | Branded boundaries — never Next's default page |
| Loading | `app/shop/loading.tsx` | Skeleton matching the real grid, so nothing shifts |

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
  lookbook.ts     spreads
  journal.ts      entries
  sizing.ts       size tables — measurements are null until real ones are taken
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

Monochrome — black, near-black, steel, concrete, ash, bone, paper. **No colour is to be
introduced.** The clothing supplies the colour.

`--concrete` (`text-ink-faint`) is the faintest text tone allowed and is tuned to pass AA
at 11px on paper. Do not lighten it — it carries the entire mono metadata layer.

- Type: `Archivo` display, `Inter` body, `JetBrains Mono` for the technical layer
  (prices, sizes, product codes, captions, section indices).
- The type ladder is `@utility` classes in `globals.css` — `type-colossal` through
  `type-meta`. They support responsive variants (`md:type-display-2`). **Never hand-roll
  per-breakpoint font sizes.**
- Structure: `.page-frame`, `.rhythm-tight | -default | -breath`, aspect utilities
  (`ratio-portrait` etc).
- Buttons: `.btn` + `.btn-solid | -inverse | -outline | -outline-on-dark`. Square, 0
  radius, hover = inversion.
- Dark sections carry `.on-dark`.
- No shadows, no gradients (except image scrims), no glass, no rounded cards.

**`components/media/ImageSlot.tsx` is the only way images render.** Without a `src` it
draws a ratio-correct empty frame carrying the asset code and an accessible label.
Dropping in real photography is a one-line data change and moves no layout.

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
