# THARROS

The ecommerce site for THARROS — an independent streetwear label.

Small runs. Original ideas.

**Status: in development. Not live, and not launching soon.** Everything here is subject to
change at the owner's discretion — look, structure, copy and scope included. `CLAUDE.md`,
`DESIGN.md` and `docs/CONTENT_GUIDE.md` describe the decisions made so far so new work can
match them; none of the three is a standard to be enforced against the person whose site
it is.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind 4 ·
GSAP 3.15 · Vercel Analytics. Entrances and hovers are CSS; the scroll scenes, the split
headings, the parallax and the route curtain are GSAP, dynamically imported so none of it
enters the shared chunk. No CSS framework config file — the design system lives in
`app/globals.css` via `@theme inline` and `@utility`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build      # production build + type check
npm run lint       # eslint, including React Compiler rules
npm run typecheck  # tsc --noEmit on its own, without a full build
npm test           # the assert-based checks in lib/, run by node directly
npm run e2e        # playwright: chromium, webkit and a Pixel 5
```

Run both `lint` and `build` before shipping. `test` is three files and no framework —
Node strips the types itself, so there is nothing to install. `e2e` builds the site and
serves it on 3100; CI runs it as a required job.

Copy `.env.example` to `.env.local`. Nothing in it is required for local development —
`NEXT_PUBLIC_SITE_URL` only affects canonical URLs, the sitemap and JSON-LD.

## What works today

Real: the catalog, filtering, sorting, search, product pages, size and inventory logic,
the bag (persisted per browser), saved items, and checkout through details and delivery —
two steps, with live subtotal, shipping and total, ending in a composed order email.

Not connected, and the site says so on the page rather than pretending: **payments**,
**customer accounts**, and **newsletter signup**.

Placeholder, and marked as such in the source: **all product data** (`lib/catalog/`),
**shipping rates** (`lib/commerce/shipping.ts`), **size measurements**
(`lib/catalog/sizing.ts`), and **legal pages**.

Thirteen real photographs exist in `public/photography` and **ten are in use**: the home
hero, three campaign frames, the Drop 001 cover, the four navigation frames and one for
`/about`. The other three are withdrawn — two work-table studies and a cut-canvas detail,
all pictures of clothes being made rather than of clothes, on surfaces the site no longer
has (`docs/PHOTOGRAPHY_PROMPT.md` records why). **No garment has been photographed** — all
18 product slots are still pending, which is every product card, every gallery and every
thumbnail on the site.

A slot with no `src` renders a free-licence stand-in from `public/filler` — five pools of
four, picked by the slot's own kind and crop and held steady by its asset code, so pages can be built and
judged before the shoot. They are Openverse CC0 and public domain, fetched by
`scripts/fetch-filler.mjs` and credited in `scripts/filler-credits.json` — not THARROS
product, and nothing there should ship. `lib/catalog/photography.test.ts` enforces the
line: no declared `src` may point into `public/filler`, and the pieces still pending are
named rather than counted. Run with `NEXT_PUBLIC_FILLER_IMAGES=off` to get the bare
labelled frames instead, which is the test that a layout reads as pending rather than
filler-dependent. Either way the slot holds its ratio, so real photography drops in
without moving a layout.

## Adding real content

**Photography.** Add `src` to the relevant `ImageSlotData` entry in `lib/catalog/`. The
frame becomes a `next/image` at the same ratio; no layout changes.

**Products.** Edit `lib/catalog/products.ts`. Prices are in cents. Availability is derived
from variant inventory — never set it by hand. New products appear in the shop, sitemap
and static routes automatically.

**Size measurements.** Fill in the `null`s in `lib/catalog/sizing.ts`. The table renders
an em dash until then.

**Payments.** Implement the payment step in `components/commerce/CheckoutFlow.tsx` and add
the provider key to `.env`. Everything the provider needs — line items, totals, address,
delivery method — is already in hand at that step.

**A CMS or database.** Reimplement `lib/catalog/queries.ts` against your source. It is the
only module the rest of the site reads products through.

## Layout

```
app/                 routes, metadata, sitemap, robots, generated icons + OG image
components/
  commerce/          cart + wishlist providers, drawer, search, checkout
  layout/            header, index overlay, footer, page intro, newsletter
  product/           card, grid, gallery, buy panel, size guide, badges
  shop/              filter bar, shop feature
  home/              home page sections
  campaign/          campaign frames and sequences
  releases/          the release index ledger
  media/             ImageSlot, FillerImage
  motion/ ui/        parallax numeral, accordion, modal, reveal, primitives
lib/
  catalog/           product data + the query seam
  commerce/          cart maths, shipping, tax
  hooks.ts           focus trap, escape, scroll lock, hydration
  persistent-store.ts localStorage as an external store
docs/                content guide, photography brief
```

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — working notes and invariants
- [`DESIGN.md`](./DESIGN.md) — the design system
- [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md) — voice and copy rules
- [`docs/PHOTOGRAPHY_PROMPT.md`](./docs/PHOTOGRAPHY_PROMPT.md) — the shot briefs, session by session

© 2026 THARROS
