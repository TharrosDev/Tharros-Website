# Claude Working Notes — THARROS

The ecommerce site for THARROS, a small independent streetwear label. Next.js 16 (App
Router, Turbopack), React 19, TypeScript strict, Tailwind 4. Read this before generating
code — it is the fastest route to a change that fits, and most of it is here because
something was got wrong once.

**In one paragraph:** content is data and never lives in JSX; everything that reads
products goes through `lib/catalog/queries.ts`; numbers are derived, never typed into
copy; the storefront cannot take payment and every purchase control derives from one flag;
the site must build, work by keyboard, work without JavaScript, and never claim something
that is not true about stock, orders or payment. Everything else is the owner's taste, and
the owner's taste wins.

## Start here

| If you are about to… | Read |
|---|---|
| Change a look, a layout, type, colour or motion | [`DESIGN.md`](./DESIGN.md), then **Design system** |
| Write or edit customer-facing copy | [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md), then **Voice** |
| Add or change a product, drop, image or size | **Data model**, then **Recipes** |
| Add a route, a section or a component | **Architecture**, then **Recipes** |
| Touch the bag, checkout, prices or availability | **The commerce state** — this one has hard rules |
| Add animation | **Code style → Motion**. Nothing pins. Ever. |
| Find out whether something is actually wired up | **What is wired up and what is not** |
| Run, test or ship anything | **Commands**, **Testing**, **Git and CI** |

Sibling documents, and what each one owns:

| File | Owns |
|---|---|
| `CLAUDE.md` | How the code works, what is real, what the rules are |
| `DESIGN.md` | The visual system — tokens, type ladder, rhythm, components, motion |
| `docs/CONTENT_GUIDE.md` | The voice, and the words that are retired |
| `docs/PHOTOGRAPHY_PROMPT.md` | The shot list and the brief every frame is made against |
| `README.md` | The human-facing overview |

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

The brand name is always written **THARROS** in copy — never "Tharros Clothing" or
"Tharros Apparel". The line is *"Small runs. Original ideas."*

**Positioning.** THARROS is a small independent streetwear label defined by its clothes:
heavyweight cloth, wide silhouettes, restrained graphics, campaign photography, and
numbered **drops** of a few pieces in short runs. Write it as that, not as a department
store. Do not write copy implying inventory, teams, production, press, collaborations or
history that does not exist — that one is a factual constraint, not a stylistic one.

**THE PROCESS NARRATIVE IS GONE, AND IT IS NOT TO COME BACK.** This is the largest change
the site has had, so it is recorded here rather than left to be rediscovered.

THARROS used to explain itself through how it was made. `/about` ran five chapters, three
of them about manufacturing — a one-room operation, patterns and samples worn until their
faults showed, sewing and grading being learned rather than outsourced, runs kept small
because that was how much could be made well, bigger runs promised as the making improved.
The home page carried a "The studio" band naming Idea / Pattern / Sample / Fit / Revision /
Production under a photograph of a work table, and a ledger headed "Everything made so
far". Product copy opened on how many fits came before this one. Drop 002 published its
sample numbers. Every product card ended on `MADE 40 / LEFT 24`.

All of it is removed. What replaced it is not another set of brand paragraphs — it is the
garments, the campaign photography at the scale it was shot for, and a shorter page. The
rule for new work: **the clothes are the subject; how they are made is not the pitch.**
Garment construction is still legitimate product information (taped seams, a double-layer
hood, ribbing through the trims). The target is process-as-brand-story.

Small runs stay — the line "Small runs. Original ideas." is unchanged — but as a property
of a release rather than an argument that needs defending. "Limited release. 40 units." is
the whole claim. No paragraph about production capacity, warehouses, or why scarcity is
not marketing.

`docs/CONTENT_GUIDE.md` carries the voice rules and the prefer/over pairs.

**Internal operational truth is not affected.** How the clothes are actually made, what is
photographed, what is measured and what is wired up are facts this repository still keeps —
in this file, in the data files, and in `docs/`. What changed is what the customer reads.

**History:** until August 2026 this repo held a completely different site — a marketing
site for an Ottawa AI agency (packages, pricing tiers, a Relevance AI chat demo, a
Supabase `/brief` wizard, a "Redline" red/black/white design system, the slogan "Keep it
Local, Keep it Canadian"). All of that was deleted. If you find anything resembling it,
it is a regression, not a feature to preserve.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # nothing in it is required to run the site
npm run dev                    # http://localhost:3000
```

Node 22 — that is what CI runs and what the lockfile was resolved against.

## Environment

Every variable is optional; the site runs with none of them set. `.env.example` is the
scaffold and carries the same notes.

| Variable | Effect when unset |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Falls back to `https://tharros.com` in `lib/site.ts`. Drives `metadataBase`, the sitemap, robots and every JSON-LD `@id`. |
| `NEXT_PUBLIC_FILLER_IMAGES` | Stand-ins are drawn. Set it to `off` to get the bare labelled frames — **that is the test that a layout reads as pending rather than as filler-dependent.** Run it before calling any image work done. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `..._BING_...` | The meta tag is omitted. Paste only the `content` value, never the whole element. |
| `PAYMENT_PROVIDER_SECRET_KEY` | Commented out, and there is no provider to key. **Never give a secret a `NEXT_PUBLIC_` prefix.** |

---

## What is wired up and what is not

A build-state inventory, so you know what exists before you touch it. Everything unwired
is unwired because the site is pre-launch, not because it is waiting on a decision:

| Area | State |
|---|---|
| Catalog, cart, sizes, inventory, wishlist, search, filtering, sorting | **Real and working** |
| Checkout up to payment | **Built and stood down** — `CheckoutFlow` still holds the working two-step flow (details, address, delivery, live totals). `/checkout` redirects to `/shop` while the store is shut. |
| Payment | **Not connected**, and the whole storefront now derives from that one fact. See **The commerce state** below. |
| Accounts / sign-in | **Not connected.** `/account` is unlinked and `noindex`, and says one sentence. Nothing in the header, the index overlay or the footer points at it. |
| Newsletter signup | **Not connected.** `NEWSLETTER_CONNECTED` is false, so the footer offers a real `mailto:` instead of a form whose only outcome was a failure message. The form is still in `Newsletter.tsx` behind the flag and needs a POST target. |
| Motion | **Real.** GSAP 3.15 (ScrollTrigger and SplitText — Flip was registered for a year and never called, so it is no longer loaded), dynamically imported so it never enters the shared chunk. Scene system in `components/motion/`, tokens in `lib/motion/config.ts`. See `DESIGN.md` §6 — especially the no-pinning rule and the no-hidden-HTML rule. |
| Route transitions | **Real** — an ink plane that lifts off each new route (`RouteCurtain`). Cross-route *image continuity* is **not** built: it needs React's `ViewTransition`, which is not in stable React 19.2.4, and it cannot coexist with the curtain anyway. `DESIGN.md` §6 records why. |
| Opening sequence | **Real**, on `/` only, once per session, CSS-driven so it clears without JavaScript. Armed in the head script, not in React. |
| Site photography | **Thirteen frames shot, ten in use**, in `public/photography` — the home hero (`CMP-001-HERO`), three campaign frames, the Drop 001 cover, the four index-overlay frames and one for `/about`. Declared in `campaign.ts`, `drops.ts` and `images.ts` (`NAV_FRAMES`, `PAGE_FRAMES`). **Three are withdrawn and rendered nowhere:** `abt-01.jpg` and `prc-01.jpg` (pattern paper, a part-sewn sample, a work table) and `drop-002-cover.jpg` (cut canvas, a chalk line, pins) — all three are pictures of clothes being made, and the surfaces that carried them are gone. The files stay on disk; `docs/PHOTOGRAPHY_PROMPT.md` records why. |
| Product photography | **Not shot yet.** All 54 product slots are pending, so every card, gallery and thumbnail is a stand-in. Session 2 of `docs/PHOTOGRAPHY_PROMPT.md` is the queue. A slot with no `src` renders a free-licence colour stand-in from `public/filler` (`components/media/FillerImage.tsx`), fetched by `scripts/fetch-filler.mjs` and credited in `scripts/filler-credits.json`. `NEXT_PUBLIC_FILLER_IMAGES=off` shows the bare frames. Dropping in real photography is a data change and moves no layout — `lib/catalog/photography.test.ts` fails if a `src` ever points into `public/filler`, or if the list of pending pieces stops matching the catalogue. |
| Garment measurements | **Not taken.** `Product.measurements` is optional and unset everywhere and `pieceTable()` returns null. **No empty table ships:** `/size-guide` renders the how-to-measure half only, the PDP accordion says "Measurements coming soon", and `SizeGuideModal` drops its table when every cell would be an em dash. The structure in `lib/catalog/sizing.ts` is unchanged, so filling in real figures is a data change that brings all three tables back. |
| Product data, prices, run sizes | **Placeholder**, marked as such in the data files. |
| Legal pages | **Working drafts** under `/legal`, marked as such on the page and `noindex`, and absent from the sitemap. That admission belongs on the legal document and nowhere else — `/returns` used to carry it too, under a heading a customer opened for the returns policy. **They need human legal review before commerce launch.** |
| Shipping rates | **Not confirmed.** `SHIPPING_RATES_CONFIRMED` in `lib/commerce/shipping.ts` is false, so `/shipping` names the delivery options without quoting their costs. A placeholder rate printed as a price with a disclaimer under it is still a price. |

Four factual constraints follow from that table. They are about not asserting things that
are untrue, so they hold regardless of how the site looks:

- **Do not fake functionality.** No mock payment success, no fake order confirmation, no
  simulated sign-in.
- **Do not narrate the unfinished parts to customers.** No public commentary about pending
  photography, unconnected payment, missing measurements, provisional carrier contracts,
  sign-in that is not live, or legal review. Handle an incomplete thing gracefully — a
  shorter page, a cleaner empty state, a control that is absent rather than dead — and
  record the blocker here, where the people who can fix it will read it. Internal notes
  must never reach alt text, metadata, captions or accessible names: every image slot's
  `alt` used to have "— stand-in photograph, THARROS photography pending" appended to it.
- **Do not fabricate** reviews, testimonials, press, collaborations, customer counts,
  sustainability or manufacturing claims, founding history, or model measurements.
- **Numbers come from the data.** Availability is derived in `resolveAvailability()`, and
  run figures come from `runStatus()`. Do not hand-type a piece count or a stock number
  into copy — it drifts. (A "Nine pieces" line against a drop of seven is exactly how.)
- **Only claim a restock policy the data states.** "Will not be remade" renders solely
  when `restock: "none"`.

### The commerce state

**One flag, `STORE_OPEN` in `lib/commerce/state.ts`, and everything derives from it.**

The site used to hold two positions at once: a drop that was "out now", an add-to-bag on
every card, a Checkout button in the drawer — and then a panel at the top of `/checkout`
explaining that no card could be taken and the order would be composed into an email. A
storefront that behaves as if it is live until the last screen is not honest about being
pre-launch; the correction arrives after eight fields.

While the flag is false:

- `isPurchasable()` returns false for every piece, so every add-to-bag control, quick-add
  strip and size selector on the site stands down at once. **This is the only place that
  needs to change** — do not add a second check in a component.
- `CartDrawer` is not mounted and the header carries no bag control.
- `/checkout` redirects to `/shop`. `CheckoutFlow` is untouched.
- Copy follows: "Shop the drop" is "See the pieces", "Out now" is the release date, and
  the product page says "The shop is not open yet" once, quietly, where the buy control
  would be.
- `e2e/commerce.spec.ts` is `test.skip`ped on the same flag, and `routes.spec.ts` asserts
  the opposite — that nothing offers a purchase. Both run off the import, so neither can
  drift.

Flip it to `true` **only when a payment provider is actually connected**, and the whole
purchase path comes back.

How the pending state *looks* — whether a stand-in is drawn or bare, whether an unwired
form says so loudly or quietly, whether a placeholder is framed or plain — is a design
decision, and it is the owner's.

---

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero → 01 the pieces → 02 the campaign → 03 Drop 002. Four movements, down from six: the statement about scale, the studio band and the archive ledger are gone with the process narrative. The hero is `88/92svh`, not full — the grid peeks under it. 02 is a held figure beside its own column and then one landscape frame at `86svh` with nothing on it but a caption. See the page's own docblock. |
| `/shop` | `app/shop/page.tsx` | Filter + sort + `?q=` search, all via URL params. The only dynamic route. |
| `/shop/[slug]` | `app/shop/[slug]/page.tsx` | Gallery, size selector, accordions, related. SSG per product. |
| `/drop` | `app/drop/page.tsx` | Current drop as a collection: one mono release row, the pieces, the campaign, then a Drop 002 preview. `/new` 308s here. |
| `/releases` | `app/releases/page.tsx` | Every **released** piece, in year bands. **This was `/archive`, and the rename is the point:** the page claimed to hold "everything made so far" while six of its rows were on sale, and "Archived" was simultaneously the stock label for a closed run. One word cannot be both. `Sold out` is now the only name for a closed run, everywhere. `/archive` and `/archive/:ref` 308 here. |
| `/releases/[ref]` | `app/releases/[ref]/page.tsx` | One garment as a record rather than as stock: the product page's gallery-plus-column layout with the buying taken out. SSG per piece. |
| `/about` | `app/about/page.tsx` | A label statement in four sections — the clothes, the name, drops, what it is for. Rewritten from scratch; see the docblock for what it replaced. |
| `/wishlist` | `app/wishlist/page.tsx` | Real, client-side |
| `/checkout` | `app/checkout/page.tsx` | Redirects to `/shop` while `STORE_OPEN` is false. The flow itself is intact in `CheckoutFlow`. |
| `/account` | `app/account/page.tsx` | Unlinked, `noindex`, one sentence. |
| `/size-guide`, `/shipping`, `/returns`, `/faq`, `/contact` | | Information |
| `/legal/privacy`, `/legal/terms`, `/legal/refund-policy` | | Drafts |
| 404 | `app/not-found.tsx` | Branded, full-screen |
| Errors | `app/error.tsx`, `app/global-error.tsx` | Branded boundaries — never Next's default page |
| Loading | — | **There is no route-level loading state, deliberately.** `app/shop/loading.tsx` put the whole `/shop` segment — every product page included — behind a Suspense boundary that only resolves once JavaScript runs, so without it the shop served a permanent skeleton (`main` held 40 characters). Pending feedback lives on the filter links instead, via `useLinkStatus` in `FilterBar`. Do not reintroduce a `loading.tsx` in a segment that must render without scripting. |

The header states three destinations inline from `md` up (`NAV_PRIMARY` in `lib/site.ts` —
Shop / Drop / Releases) plus a search control, a saved count when there is one, and keeps
`IndexOverlay` as the full navigation surface. **There is no bag control and no Account
entry** while the store is shut — an icon is a promise that there is somewhere to put
something. They are real links, so navigation survives scripting being
unavailable; before this the only nav trigger was a `<button>` and the footer was the
site's entire navigation with JS off.

`Header` floats over the hero on the routes in `TRANSPARENT_ROUTES` (`/` only). It is light
ink on every route — the paper wash under it fades up into a solid plate on scroll. Every other page opens with `PageIntro`, which carries the fixed
header's clearance — so no page hand-rolls top padding.

Adding a route means touching **four** places: the page's own `metadata`,
`app/sitemap.ts`, `lib/site.ts` nav/footer arrays, and any relevant JSON-LD.

---

## Architecture

```
app/                     routes; every page is a server component unless it says otherwise
components/
  home/                  the four home page movements, in page order
                         DropOpening · TheRun · HomeCampaign · NextDrop
  product/               the garment: card, grid, gallery, buy panel, badges,
                         measurements, size guide, save button, campaign rail
  commerce/              bag, wishlist, search, checkout — providers and surfaces.
                         Everything stateful on the site is in here.
  campaign/              campaign frames, sequences, hotspots, worn lists, credits
  releases/              the release index ledger
  layout/                header, footer, nav overlay, page intro, breadcrumbs,
                         newsletter, the information-page furniture
  media/                 ImageSlot and FillerImage — HOW EVERY IMAGE RENDERS
  motion/                Scene, Parallax, SplitLines, RouteCurtain, Magnetic,
                         MotionRuntime, EntrySequence — see Code style → Motion
  ui/                    Accordion, Modal, Reveal, SectionHeading, EmptyState,
                         PendingNotice, Wordmark, icons
lib/
  catalog/               product data and the query seam — see Data model
  commerce/              cart maths, shipping, tax, regions, returns, STORE STATE
  motion/                GSAP registry, tokens, media queries, useScene
  format.ts              formatPrice, formatDate — CENTS IN, STRING OUT
  jsonld.ts              the only way structured data reaches the page
  site.ts                brand constants, navigation and footer arrays
  hooks.ts               focus trap, escape, scroll lock, scrolled-past, debounce
  persistent-store.ts    localStorage as an external store
  reveal-observer.ts     the one shared IntersectionObserver
docs/                    content guide, photography brief
e2e/                     Playwright — see Testing
scripts/                 fetch-filler.mjs, slice-grid.mjs (dev tooling, not shipped)
```

Three files are load-bearing enough to name on their own:

- **`lib/catalog/queries.ts`** — the seam a CMS swaps in behind. Nothing reads
  `products.ts` directly.
- **`lib/commerce/state.ts`** — one flag, and the whole storefront derives from it.
- **`components/media/ImageSlot.tsx`** — every image on the site goes through it, and it
  is what makes dropping in real photography a data change that moves no layout.

---

## Data model

Content is data. It never lives in JSX.

```
lib/catalog/
  types.ts        Product, Variant, ImageSlotData, Drop, Campaign, CampaignFrame
  products.ts     the catalog (placeholder)
  categories.ts   category list + sizing-table mapping
  drops.ts        Drop 001 (released) / Drop 002 (upcoming, no date)
  campaign.ts     campaign frames — the hero and "the people" sequence per drop
  archive.ts      GARMENT NUMBERS AND THE RELEASE INDEX — derived, never authored.
                  Keeps its filename; the surface it feeds is `/releases`.
  models.ts       the people photographed in the clothes — SHIPS EMPTY
  sizing.ts       size tables — measurements are null until real ones are taken
  images.ts       WHICH FRAME OF A PIECE TO SHOW, AND IN WHAT ORDER — plus
                  NAV_FRAMES and PAGE_FRAMES, the photography that belongs to a
                  route rather than to a garment
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
  everywhere. `ModelCredit` returns `null` rather than rendering a pending state, and
  `fitNote()` omits an unmeasured height instead of guessing one. Do not populate either
  from anything but an actual fitting.
- **The image ladder has spare rungs.** `onBodyImages`, `inSituImages` and `detailImages`
  are exported and currently uncalled — the surfaces that used them were removed with the
  process narrative. They are kept because they are the documented ladder, not dead
  weight: a piece with six photographs still resolves correctly through them the day a
  section wants one. Do not delete them to make a lint count go down, and do not add a
  seventh without a caller.

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

Light — paper, bone, ash, concrete, steel, near-black, one near-black footer, plus one
oxide accent. The clothing supplies the colour. If the owner wants a second colour, add it and update
`DESIGN.md`; do not talk them out of it.

`--concrete` (`text-ink-faint`) is the faintest text tone allowed and is tuned to pass AA
at 11px on paper. Lightening it drops the mono metadata layer below AA — that is a
contrast fact, not a preference.

- Type: `Archivo` display, `Inter` body, `JetBrains Mono` for the technical layer
  (prices, sizes, product codes, captions, section indices).
- The type ladder is `@utility` classes in `globals.css` — `type-colossal` through
  `type-meta`. They support responsive variants (`md:type-display-2`), so a per-breakpoint
  size rarely needs inventing — add a rung rather than a one-off.
- **The body rungs carry their own measure.** `type-lead`, `type-body` and `type-body-sm`
  set a `max-width` from `--measure-lead` / `--measure-body`. Do not restate it at a call
  site with `max-w-prose` or `max-w-2xl` — both are utilities too, so which one wins is
  Tailwind's sort order rather than the markup. The values look small because `ch` is the
  zero glyph and Inter's digits run wide: 55ch measures ~75 characters on this face.
- Structure: `.page-frame`, `.rhythm-tight | -default | -breath`, `.pb-safe`, aspect
  utilities (`ratio-portrait` etc).
- **Two sections on the same surface share one interval.** Each rhythm class pays its
  padding at both ends, so an abutting pair pays the sum — fine where the surface changes
  and a hole where it does not. `globals.css` drops the lower section's opening interval
  on a same-surface join. Nothing to do at a call site; just do not add a compensating
  margin on top of it.
- **The opening screen is not full height and must not become full height again.** It is
  `88svh` / `92svh` from `md`, so the paper of *the run* and the top of its drawn rule sit
  under the picture. That change of surface is the only scroll affordance on the page —
  there is no "scroll" microcopy and no chevron, and a hero at `100svh` takes the cue away
  and leaves a splash screen. `DropOpening` also clips on two axes for two different
  reasons: `overflow-x-clip` on the root (the pushed-in picture must not widen the page)
  and `overflow-hidden` on the inner plate (the wordmark is cut by the bottom edge). The
  detail frame escapes downward through the gap between them.
- **Text over a photograph is `text-ink-on-dark/90`, never `-muted`.** Muted is tuned
  against near-black and fails AA over a pale picture — the release record measured 1.65:1.
  `DESIGN.md` §7 has the figures. Check a change here by pixel readback, not by eye.
- **Anything anchored to the foot of the viewport takes `.pb-safe`** — the panel, not the
  block inside it. Five surfaces needed it and only `BuyPanel` had it.
- Buttons: `.btn` + `.btn-solid | -inverse | -outline | -outline-on-dark`. Square, 0
  radius, hover = inversion.
- Dark sections carry `.on-dark`.
- Currently no shadows, no glass, no rounded cards. Gradients are scrims and
  masks only. That is the direction in the code today, not a constraint on what
  can be asked for.
- **Motion is a primary instrument now, not a garnish.** The site opens on a
  full-screen frame with a camera push, scrubs its scenes against the
  scroll, and cuts between routes with a curtain. **Nothing pins.** The pointer is the system cursor —
  a custom one was built and then removed, and it is not to come back.
  `DESIGN.md` §6
  is the whole system; the parts that are not taste are the no-pinning rule,
  the LCP exclusions, the magnetics deny-list, and the rule that nothing may be
  hidden in the served HTML that only JavaScript can bring back.

**`components/media/ImageSlot.tsx` is how images render.** With a `src` it is a
`next/image` at the slot's ratio — thirteen frames take that branch today. Without one it
draws a ratio-correct stand-in: by default a stand-in photograph picked by
`FillerImage.tsx` from `public/filler`, or a bare frame carrying the asset code when
filler is switched off. Either way the slot holds
its ratio, so dropping in real photography is a one-line data change and moves no layout.

---

## Commands

| Task | Command | Notes |
|---|---|---|
| Install | `npm install` | Node 22 |
| Dev | `npm run dev` | Port 3000 |
| Build | `npm run build` | Turbopack; also runs `tsc` |
| Lint | `npm run lint` | **Enforces React Compiler rules the build does not** |
| Type check | `npm run typecheck` | `tsc --noEmit` |
| Unit tests | `npm test` | Plain Node, no framework |
| End to end | `npm run e2e` | Builds and serves the site itself |
| E2E, watching | `npm run e2e:ui` | Playwright's UI mode |
| Bare image frames | `NEXT_PUBLIC_FILLER_IMAGES=off npm run dev` | The pending-state check |

**Before declaring any work done, run `npm run lint` and `npm run build`.** Lint catches
the React Compiler violations the build compiles straight past, and it fails in seconds
rather than after a full compile. For anything touching routes, copy, commerce or motion,
run `npm run e2e` too — it is the only thing that catches a page that builds fine and
renders blank.

## Testing

Three layers, and they cover different failure modes.

**`npm test`** — assert-based checks in `lib/`, run through Node directly. No framework,
no dependency; Node strips the types. They cover the three things that fail silently:

- postal patterns — `lib/commerce/regions.ts`
- cents-to-currency rounding — `lib/format.ts`
- the line between a photograph and a stand-in — `lib/catalog/photography.test.ts`,
  which fails if any declared `src` points into `public/filler`, **or if the list of
  unphotographed pieces stops matching the catalogue**. That second assertion is
  deliberate: it makes "which pieces are still unshot" something the repository knows
  rather than something somebody remembers. When a shoot lands, update
  `PENDING_PHOTOGRAPHY`.

`tsconfig` carries `allowImportingTsExtensions` so the `.ts`-suffixed imports those files
need do not fail `tsc`. **A test file may only import modules that import types only** —
`archive.ts` and `queries.ts` cannot be reached from one, because a bare `from "./products"`
two modules down resolves to nothing under Node.

**`npm run e2e`** — Playwright, in `e2e/`, three projects: `chromium`, `webkit` and
`mobile` (Pixel 5, which is what switches the site onto its touch branch). The suite
builds and serves the site itself on port 3100, so it never collides with `npm run dev`.

| Spec | Covers |
|---|---|
| `routes.spec.ts` | Every route: 200, an `h1`, no console errors, no failed requests, **no horizontal overflow at either width**, every scroll entrance actually fires, nothing pins, the release index agrees with its own rows, and the storefront offers no purchase it cannot take |
| `navigation.spec.ts` | The index overlay opens, navigates, closes on arrival, and releases the scroll lock |
| `commerce.spec.ts` | The whole purchase path — **`test.skip`ped on `STORE_OPEN`**, so it is 40 skipped tests today and a full suite the day payment is connected |

Run one file or one test:

```bash
npx playwright test e2e/routes.spec.ts
npx playwright test e2e/routes.spec.ts:226
npx playwright test --project=mobile
npx playwright install --with-deps chromium webkit   # first run only
```

Two of these exist because the suite once passed over a broken site, and the comments in
`routes.spec.ts` say so: the scroll-entrance test was written after `.reveal-frame`
clipped the very element its own IntersectionObserver was watching, so every product card
stayed invisible while the console stayed clean and every other assertion passed. **When
you fix a class of bug, leave the assertion behind.**

**Manual checks no test makes.** Run with scripting disabled and with
`NEXT_PUBLIC_FILLER_IMAGES=off`, and with `prefers-reduced-motion` on. The site is built
to work in all three states and nothing in CI proves it.

---

## Recipes

The tasks that come up, and the places they touch. Every one of these has been got wrong
by touching one file and not the other three.

### Add or change a product

`lib/catalog/products.ts` only. Prices are **cents**. `runSize` is the real number made,
never a marketing figure, and `variants[].inventory` is real stock — availability and
every "x left" on the site derive from them. A new piece automatically gets a permanent
garment number, a sitemap entry and a static route; it gets a release-index row once it is
actually released, which is what keeps `/releases` an index of releases rather than of
intentions.

### Add a photograph

Put the file in `public/photography` and add its `src` to the slot that already declares
it — in `products.ts`, `campaign.ts`, `drops.ts` or `images.ts`. **That is the whole
change; no layout moves.** Then update `PENDING_PHOTOGRAPHY` in `photography.test.ts`, or
`npm test` fails. Alt text describes the photograph and nothing else — never the state of
the shoot, never a note to the team.

### Add a route

Four places, and missing one is the usual bug:

1. the page's own `metadata` (title, description, canonical, OG)
2. `app/sitemap.ts`
3. `lib/site.ts` — `NAV_PRIMARY`, `NAV_INDEX`, `FOOTER_*`, `INFORMATION` as appropriate
4. any relevant JSON-LD, through `jsonLd()`

Add it to `ROUTES` in `e2e/fixtures.ts` too, unless it is deliberately unreachable — and
if it is, say why there, as `/account` and `/checkout` do.

### Add a section to a page

Open it with `SectionHeading`; open a page with `PageIntro`. Neither hand-rolls its
eyebrow, its rule or its top padding. **A section's mono index is its position on that
page, counted as the page renders** — never a drop's number, and never hard-coded where a
section is conditional (see `sectionIndex()` in `app/shop/[slug]/page.tsx`).

### Change a price, a rate, a count or a date

Never in copy. Prices come from the catalogue, availability from `resolveAvailability()`,
run figures from `runStatus()`, shipping from `lib/commerce/shipping.ts`, counts from the
same filter the grid runs. **A number typed into a sentence is a number that will be
wrong** — a "Nine pieces" line against a drop of seven is exactly how, and a shop hero
reading "7 pieces in the run" above a grid headed "9 pieces" is how it happened again.

### Connect payment

Set `STORE_OPEN = true` in `lib/commerce/state.ts` and implement the server route the
payment step calls. That single flag restores `isPurchasable()`, every add-to-bag control,
the drawer, the header bag, `/checkout` and the skipped e2e suite. Do not add a second
check anywhere.

### Say that something is not ready

Say it once, quietly, where the missing thing would have been — and never as a roadmap.
Prefer removing the dead control to explaining it: the newsletter is a `mailto:` rather
than a form that admits it sent nothing, `/account` is unlinked rather than a list of
what sign-in would add, and `/size-guide` serves its how-to-measure half rather than a
table of em dashes. Record the blocker here, where the people who can fix it will read it.

---

## Code style

### The basics

- Server components by default; `"use client"` only for cart, wishlist, search, gallery,
  filters, accordions, and overlays.
- Comments explain *why*, never *what*. No `console.log`.
- Tailwind class order: layout → sizing → spacing → color → typography → effects → state.
- No `any` unless there is genuinely no alternative, and say why in a comment when there
  is not.
- **Hyphenated JSX attributes (`data-whatever`) typecheck on ANY component** whether or
  not it forwards them, so they are silently dropped on custom components with no error
  anywhere. Declare a real prop instead.

### Accessibility

These are not taste, and they are the one category that overrides the owner's direction.

- Overlays (drawer, search, mobile nav, modals, filter sheet) must have
  `role="dialog"`, `aria-modal`, a focus trap, ESC-to-close, and scroll lock. Use the
  hooks in `lib/hooks.ts`; do not re-implement.
- **Use the platform before reaching for ARIA.** The size selector is a `fieldset` of real
  radios because a radio group already has arrow-key navigation, roving focus and the
  right announcement; the sort control is a `<details>` because a disclosure already has
  keyboard behaviour and an open state the browser owns. Both still work with no
  JavaScript. Do not use ARIA to compensate for the wrong element.
- **Interactive controls carry a real box**, not an expanded invisible overlay: header
  icons are `h-11 w-11` flex boxes, small mono links get `-my-2 py-2`. An absolutely
  positioned hit area steals clicks from its neighbours. 24px is the floor
  (WCAG 2.5.8) — the footer was under it on every route once.
- A disabled option is struck through and faint, **not merely faded**; the one thing the
  spec says must not be "merely a colour change" was once the most faded thing on the site.
- Alt text describes the image. Never the state of the shoot, never an internal note —
  every slot on the site once carried "— stand-in photograph, THARROS photography pending"
  in its accessible name.
- Heading order is real. A section that emits no `h2` does not get a visually hidden one
  bolted on to fill the gap.

### SEO and metadata

- **Structured data goes through `jsonLd()`** (`lib/jsonld.ts`), never raw
  `JSON.stringify` — it escapes `<` and the U+2028/U+2029 line separators that would
  otherwise break out of the inline `<script>` once catalog content is CMS-driven.
- **Never emit schema that contradicts the store.** `AVAILABILITY_SCHEMA` is derived from
  the same `resolveAvailability()` the page renders from, and a `Product` image key is
  published only when the piece actually has a photograph — publishing a stand-in's URL
  would be telling Google that a piece of free-licence stock is the garment.
- Unfinished legal drafts carry `robots: { index: false }` and stay out of `sitemap.ts`.

### Layout

- Every sticky column is bounded; an unbounded sticky element taller than the viewport
  hides its own bottom on short screens. **`max-h` + `overflow-y-auto` is the bound for a
  column of TEXT.** A picture takes its height from its width and its ratio, so the same
  pair gives it a scrollbar down the side of the photograph instead. Cap the frame's own
  height and let `object-cover` take the difference. There is no sticky column on `/` any
  more — the home page's studio band had one, and it held for about 120px of scroll at
  1440x900 because
  the picture and the list beside it were within 120px of the same height. **A sticky
  frame only reads as sticky if what travels past it is meaningfully taller.** Measure
  both before reaching for it.
- **Anything anchored to the foot of the viewport takes `.pb-safe`** — on the panel, not
  on the block inside it.

### Motion

The whole system is `DESIGN.md` §6. These are the parts that are engineering rather than
taste, and every one of them shipped a real bug first.

- **Never pin a scene. Not on any route, not at any width.** The site must not
  stop or slow the page anywhere — that is the owner's direction, not a
  performance note. `Scene` no longer accepts a `pin` prop and `e2e` asserts no
  `.pin-spacer` survives a full scroll of `/` or `/drop`. If a composition
  seems to want a hold, it wants a scrub instead.
- **`useScene` is a LAYOUT effect and must stay one.** GSAP moves nodes React owns —
  `pin` wraps the element in a spacer, `SplitText` rewrites a heading's children. React
  removes host nodes in the mutation phase and runs `useEffect` cleanups after it, so
  reverting from a passive effect happens after the removal has already thrown
  `NotFoundError: removeChild`. Anything else that hands the DOM to a library needs the
  same treatment.
- **Any scroll-linked effect goes through `components/motion/`** — `Scene`,
  `Parallax` or `Reveal`'s modes. Do not hand-roll a scroll listener, and never
  set React state from one: the React Compiler lint rejects the cascade, and
  the existing primitives write transforms straight to the node.
- **Never `gsap.from()` content.** GSAP is dynamically imported and arrives a
  frame or two after paint, so a `from` that hides something shows it, removes
  it, then brings it back. A pre-state a scene animates away from belongs in
  `globals.css` behind `[data-js]` (see `.scene-oversize`).
- **A scene is authored as a section that already reads,** and the motion goes
  on top of it. That is what keeps the reduced-motion and no-JS paths whole.
- **Nothing may be hidden in the served HTML that only JavaScript can bring back.** A
  pre-state a scene animates away from goes in `globals.css` behind `[data-js]`. There is
  a dead-man switch for the case `[data-js]` never covered — scripting present at first
  paint and then failing — armed in the head script and cleared by `MotionRuntime`. Test
  it by blocking `/_next/static/chunks/*` and loading `/`.
- **A `Reveal` mode must never clip the element `Reveal` observes.** The
  entrance waits on an IntersectionObserver, and an element clipped to no area
  reports `isIntersecting: false` forever — it hides itself, which stops it
  being seen, which stops it being shown. `.reveal-frame` and `.reveal-wipe`
  clip `> *` for exactly this reason. Verified: the same node jumps from
  `ratio: 0` to `ratio: 0.725` the instant its own clip-path is removed.

---

## Git and CI

**Work lands on `main` directly.** The owner has asked for finished work to be committed
and pushed without being asked first, so: finish it, verify it, commit it with a real
message, push. Do not open a branch or a PR unless asked. Do not stop to request
permission. **Do report plainly if verification failed rather than pushing broken work,**
and stop and ask before anything destructive — a force push, a history rewrite, deleting
a branch.

Commit messages are a sentence about what changed and why, in the site's own register:
lowercase-ish, plain, no ceremony, no emoji. `The drop page leads with the drop` is the
house style. End with the co-author trailer.

`.github/workflows/ci.yml` runs on every PR and every push to `main`, in two jobs:

- **check** — `npm ci` → `lint` → `build` → `test`. Lint first, deliberately: it enforces
  the React Compiler rules the build does not, and it fails in seconds.
- **e2e** — `npm ci` → `playwright install --with-deps chromium webkit` → `npm run e2e`,
  uploading the report as an artifact only on failure.

CI runs the same four commands you can run locally, so there is no excuse for finding out
from CI.

---

## Voice

See [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md). Short version: quiet confidence
— a small label that knows what it made, not a corporation. "Small run" not "global
collection"; "the next drop" not "our latest seasonal assortment". Confident, plain,
never shouting. "SHOP THE DROP", not "BUY NOW BEFORE IT'S TOO LATE!!!". No exclamation
marks, no emoji, no hype. When something is not ready, say so plainly.
