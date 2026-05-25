# SEO Implementation Reference

Everything you need to know before changing anything that touches search or social previews.

> Companion to [`../README.md`](../README.md) and [`../CLAUDE.md`](../CLAUDE.md).

---

## What's wired up

| Surface | File | Notes |
|---|---|---|
| Metadata API (root) | `app/layout.tsx` | Title template, description, OG, Twitter, hreflang, keywords, geo, format detection |
| Metadata API (per-page) | `app/product/page.tsx`, `app/pricing/page.tsx`, `app/brief/page.tsx`, `app/clients/page.tsx` | Page-specific metadata + per-page JSON-LD |
| JSON-LD graph | `app/layout.tsx` | 8 cross-referenced entities (Org + LB + Service + WebSite + WebPage + Breadcrumbs + FAQ + SiteNav), see below |
| Robots | `app/robots.ts` | Explicit allowlist for search + AI bots, blocklist for scrapers |
| Sitemap | `app/sitemap.ts` | Per-URL hreflang alternates |
| Web App Manifest | `public/manifest.json` | PWA + iOS home screen |
| Browser config | `public/browserconfig.xml` | Windows Start tiles |
| OG image | `public/og-image.jpg` | 1200×630, JPEG |
| Apple touch icon | `public/apple-touch-icon.png` | 180×180 |
| Favicons | `public/icon.svg`, `public/icon-512.png` | SVG + PNG fallback |

---

## JSON-LD graph

The site uses a **single linked graph** of structured data, not a list of disconnected types. Every entity has an `@id` so other entities can reference it.

### The graph

```
Organization (#organization)
  ├── areaServed ──► [Cities]
  ├── mainEntityOfPage ──► WebPage (#webpage)
  └── contactPoint ──► [ContactPoints]

LocalBusiness + ProfessionalService (#localbusiness)
  ├── parentOrganization ──► Organization (#organization)
  ├── makesOffer ──► [Offer: Refresh, Integrate, On-Call]
  ├── areaServed ──► [Cities]
  └── serviceArea ──► GeoCircle (50km from Ottawa)

Service (#service)
  ├── provider ──► LocalBusiness (#localbusiness)
  ├── mainEntityOfPage ──► WebPage (#webpage)
  ├── termsOfService ──► /brief
  └── hasOfferCatalog.itemListElement[].itemOffered.provider ──► LocalBusiness

WebSite (#website)
  ├── publisher ──► Organization (#organization)
  └── potentialAction ──► SearchAction (sitelinks search)

WebPage (#webpage)  ← root page entity, ties everything together
  ├── isPartOf ──► WebSite (#website)
  ├── about ──► LocalBusiness (#localbusiness)
  ├── breadcrumb ──► BreadcrumbList (#breadcrumbs)
  ├── mainContentOfPage ──► Service (#service)
  ├── primaryImageOfPage ──► ImageObject (og-image.jpg)
  └── speakable ──► SpeakableSpecification (h1 / display-2 / lead selectors)

FAQPage (#faq)
  ├── mainEntityOfPage ──► WebPage (#webpage)
  ├── speakable ──► SpeakableSpecification
  └── mainEntity[] ──► [10 Question/Answer pairs]

SiteNavigationElement
  └── name[] / url[] ──► Top-level nav

BreadcrumbList (#breadcrumbs)
  └── itemListElement[] ──► Home only (page-level breadcrumbs in each page file)
```

### Entity-by-entity

| Entity | `@id` | Purpose |
|---|---|---|
| Organization | `https://tharros.ca/#organization` | The legal/business entity. Has areaServed, contactPoints |
| LocalBusiness | `https://tharros.ca/#localbusiness` | The physical/local-SEO entity. Dual-typed as LocalBusiness + ProfessionalService for richer SERP eligibility |
| Service | `https://tharros.ca/#service` | The services we offer, including the 3-package OfferCatalog. Has serviceOutput + termsOfService |
| WebSite | `https://tharros.ca/#website` | The site itself. SearchAction enables sitelinks search box |
| WebPage | `https://tharros.ca/#webpage` | The homepage as a page entity. Carries speakable selectors for voice search and links everything into one graph |
| FAQPage | `https://tharros.ca/#faq` | 10 questions, eligible for rich-snippet display in SERP. Has speakable selectors |
| SiteNavigationElement | (no id) | Nav structure hint to crawlers |
| BreadcrumbList | `https://tharros.ca/#breadcrumbs` | Home breadcrumb |

### Per-page JSON-LD

Pages that aren't the homepage inject their own additional structured data:

- **`/product`** → WebPage (`about` → `#service`) + BreadcrumbList (Home → Product).
- **`/pricing`** → WebPage (`about` + `mainContentOfPage` → `#service`) + BreadcrumbList (Home → Pricing).
- **`/clients`** → CollectionPage (with one `Article` per case study and `primaryImageOfPage`) + `ItemList` (ordered list of the same studies) + BreadcrumbList (Home → Clients).
- **`/brief`** → ContactPage (`mainEntity` = ContactPoint, `potentialAction` = CommunicateAction for brief submission) + BreadcrumbList (Home → Brief).

All page-level entities reference the root WebSite, WebPage, and LocalBusiness via `@id`, so Google can resolve them into a single entity graph.

---

## Metadata fields explained

### Why these exist in `app/layout.tsx`

```ts
metadataBase: new URL("https://tharros.ca"),
```
Makes all `OG`/`Twitter`/`icon` URLs absolute. Without this, relative paths break when previewed on third-party social cards.

```ts
applicationName: "Tharros",
```
Used by Windows / Chrome OS / Android in pinned-site contexts.

```ts
formatDetection: {
  email: false,
  address: false,
  telephone: false,
},
```
Stops Safari from auto-linking what it thinks are phone numbers or addresses. We control link styling — we don't want Safari adding underlines to numbers that happen to be in text.

```ts
classification: "Web Development & AI Agent Integration",
```
Search engine hint for site category.

```ts
referrer: "origin-when-cross-origin",
```
Send only origin (not full path) when navigating to third-party sites. Privacy-respectful default.

```ts
alternates.languages: { "en-CA": "/", "x-default": "/" }
```
Hreflang. Tells search engines this is the Canadian English version. `x-default` is the fallback for unspecified locales.

```ts
other: {
  "geo.region": "CA-ON",
  "geo.placename": "Ottawa",
  "geo.position": "45.3483;-75.9103",
  ICBM: "45.3483, -75.9103",
  ...
}
```
Older but still-honored geo meta tags. Local SEO signal.

### What's deliberately *not* there

- No `archives`, no `bookmarks`. Not relevant.
- No `manifest` override on per-page metadata. The root manifest covers all pages.

### Search engine site verification

`metadata.verification` is driven by two env vars (see `.env.example`):

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → renders `<meta name="google-site-verification">`. Get this from Google Search Console → Settings → Ownership verification → HTML tag.
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` → renders `<meta name="msvalidate.01">`. Get this from Bing Webmaster Tools → Site → Settings → Ownership verification → Meta tag.

Paste only the `content` value (the token), not the full `<meta>` element. Set the env vars in Vercel Project Settings for each environment that needs verification.

---

## robots.ts behavior

The generated `robots.txt` is intentionally **permissive** — Tharros wants maximum discoverability across web search, AI answer engines, and social link unfurls. There is no blocklist any more.

Groups:

1. **`User-agent: *`** — allow everything except `/admin/`, `/api/`, `/_next/`, `/_vercel/`.
2. **Major web search bots** — Googlebot (+ Images, News), Bingbot, DuckDuckBot, Slurp (Yahoo), YandexBot, Applebot, MojeekBot, SeznamBot, PetalBot, Bravebot, Kagibot, YouBot. Same as the wildcard but listed explicitly so future restrictive changes never accidentally exclude them.
3. **AI search + answer engines** — explicit allow for every bot that surfaces site content inside ChatGPT, Claude, Perplexity, Gemini, Copilot, Apple Intelligence, DuckDuckGo Assist, Mistral, Cohere, etc.: GPTBot, OAI-SearchBot, ChatGPT-User, ChatGPT-User/2.0, ClaudeBot, Claude-Web, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, Applebot-Extended, DuckAssistBot, MistralAI-User, Mistral-User, cohere-ai, Cohere-Training-Data-Crawler, Diffbot, Bytespider, Amazonbot, Meta-External*, FacebookBot, CCBot, TimpiBot, PanguBot, Quillbot.
4. **Social preview / unfurl bots** — needed for OG cards in chat apps: FacebookExternalHit, Twitterbot, LinkedInBot, Slackbot, Slackbot-LinkExpanding, Discordbot, TelegramBot, WhatsApp, Snapchat, Pinterestbot.
5. **Commercial SEO crawlers** (Ahrefs, Semrush, Moz/rogerbot, Majestic/MJ12bot, DotBot, AhrefsSiteAudit) — now **allowed** with the same path restrictions as the wildcard. Previously blocked; flipped 2026-05 because the discoverability upside outweighs the crawl-budget cost on a marketing site this small.

The `Host` directive points to the canonical hostname.

If a client ever needs to opt *out* of AI training (legal / IP reasons), flip the relevant entries from `allow: "/"` to `disallow: "/"`. There is no global kill-switch by design.

---

## sitemap.ts behavior

Five URLs:

| URL | Priority | changeFrequency | images |
|---|---|---|---|
| `/` | 1.0 | weekly | og-image.jpg + tharros-logo.svg |
| `/product` | 0.9 | monthly | og-image.jpg |
| `/pricing` | 0.9 | monthly | og-image.jpg |
| `/clients` | 0.85 | monthly | og-image.jpg + meridian-logo.webp + advanta365-logo.svg + echo-five-logo.svg |
| `/brief` | 0.8 | monthly | og-image.jpg |

Each URL declares its own `en-CA` + `x-default` hreflang alternates and an `images` array (image sitemap entries Google can index alongside the page).

`lastModified` is a **pinned string constant**, not `new Date()`. Crawlers should not see "lastmod = today" on every build when nothing actually changed. Bump the constant manually when a real content change ships.

When you add a new page, add it here too — it doesn't auto-discover.

---

## Web App Manifest

`public/manifest.json` makes the site installable as a PWA and gives iOS/Android/Windows pinning a clean appearance.

Fields worth knowing:

- `id: "/"` — explicit app ID (recommended by the spec).
- `scope: "/"` — what URLs are considered "in-app".
- `categories: ["business", "productivity", "utilities"]` — App store / launcher categorization.
- `shortcuts` — Two app shortcuts (Discovery, Clients) shown on long-press of the home-screen icon.
- Maskable icon — Android-style adaptive icon support via the `purpose: "maskable"` variant.

---

## OG / Twitter card

`og-image.jpg` is the share preview. It's 1200×630 JPEG. If you replace it:

- Keep the same dimensions or update them in metadata.
- The `alt` text in metadata should describe what's *visible*, not be SEO keyword-stuffed.
- Test the preview with [opengraph.xyz](https://www.opengraph.xyz) before shipping.

Twitter card type is `summary_large_image`. `@TharrosAI` is set as both `creator` and `site`.

---

## When you change site copy

1. If pricing model changes → update FAQPage entries in `app/layout.tsx`.
2. If service area changes → update `SERVICE_AREAS` constant in `app/layout.tsx` (cascades to areaServed and serviceArea).
3. If package names change → update the Service `hasOfferCatalog` and LocalBusiness `makesOffer` arrays in `app/layout.tsx`, plus the per-page JSON-LD where relevant.
5. If a page is added → add it to `app/sitemap.ts`.
6. If contact email changes → update `CONTACT_EMAIL` constant in `app/layout.tsx`.

Keep `THARROS_KNOWLEDGE_BASE.md` in sync — it's the canonical source of truth that the live demo agent reads.

---

## Testing structured data

Before shipping any change to JSON-LD:

1. Run `npm run build` and inspect the output of `view-source:https://localhost:3000` (or the deployed preview) to confirm the JSON-LD is valid JSON.
2. Paste into Google's [Rich Results Test](https://search.google.com/test/rich-results) to verify each entity is recognized.
3. Check the [Schema Markup Validator](https://validator.schema.org/) for spec compliance.

If you break the graph (broken `@id` references, missing required fields on a type), you'll see validation errors — fix before merging.

---

## Common pitfalls

- **Don't manually JSON.stringify with `<` or `>`** — Next's `dangerouslySetInnerHTML` doesn't escape JSON-LD by default, and an unescaped `<` will close the `<script>` tag. The current code is safe; just don't introduce HTML content into JSON-LD strings.
- **Don't break `metadataBase`** — many fields silently resolve relative URLs against it.
- **Don't add `keywords` to per-page metadata if you can avoid it** — Google has ignored `<meta name="keywords">` since 2009. It's only included here because Bing and some smaller engines still read it.
- **Don't change `html lang="en-CA"`** without also updating hreflang and `inLanguage` in JSON-LD.
- **Don't add `nofollow` blanket-style** — the current robots config has nuanced per-bot policies. Test changes by visiting `/robots.txt` after building.
