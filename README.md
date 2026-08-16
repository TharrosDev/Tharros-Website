# THARROS

The ecommerce site for THARROS — a contemporary streetwear label.

Built for those who don't blend in.

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind 4 ·
`motion` for transitions · Vercel Analytics. No CSS framework config file — the design
system lives in `app/globals.css` via `@theme inline` and `@utility`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build + type check
npm run lint     # eslint, including React Compiler rules
```

Run both `lint` and `build` before shipping.

Copy `.env.example` to `.env.local`. Nothing in it is required for local development —
`NEXT_PUBLIC_SITE_URL` only affects canonical URLs, the sitemap and JSON-LD.

## What works today

Real: the catalog, filtering, sorting, search, product pages, size and inventory logic,
the bag (persisted per browser), saved items, and checkout through contact, shipping
address and delivery — with live subtotal, shipping and total.

Not connected, and the site says so on the page rather than pretending: **payments**,
**customer accounts**, and **newsletter signup**.

Placeholder, and marked as such in the source: **all product data** (`lib/catalog/`),
**shipping rates** (`lib/commerce/shipping.ts`), **size measurements**
(`lib/catalog/sizing.ts`), and **legal pages**.

There is no photography yet. Every image renders as a ratio-correct drawn stand-in — a
flat-lay, a figure, an environment or a fabric study, each marked FILLER and carrying its
asset code — so pages can be judged before the shoot. Run with
`NEXT_PUBLIC_FILLER_IMAGES=off` to see the bare frames instead.

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
  layout/            header, mobile nav, footer, page intro, newsletter
  product/           card, grid, gallery, buy panel, size guide, badges
  home/              home page sections
  media/ ui/         ImageSlot, wordmark, buttons-adjacent primitives
lib/
  catalog/           product data + the query seam
  commerce/          cart maths, shipping, tax
  hooks.ts           focus trap, escape, scroll lock, hydration
  persistent-store.ts localStorage as an external store
docs/                content guide
```

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — working notes and invariants
- [`DESIGN.md`](./DESIGN.md) — the design system
- [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md) — voice and copy rules

© 2026 THARROS
