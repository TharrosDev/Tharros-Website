# Content & Voice Guide

How to write copy for the Tharros site so it sounds like Tharros.

> Companion to [`../README.md`](../README.md) and [`../CLAUDE.md`](../CLAUDE.md).

---

## The brand voice in one paragraph

Tharros sounds like a competent tradesperson who happens to build software. Decisive, plain, locally grounded. We tell a small business owner what we'll do, in language they'd use themselves, with a phone number they can call when something breaks. We don't speak in enterprise jargon, AI buzzwords, or growth-hacker slogans. We don't promise transformation. We promise a working site, a working agent, and someone who picks up the phone.

---

## Slogans and fixed phrases

These phrases appear verbatim across the site, the metadata, the JSON-LD, and the live agent. Don't paraphrase them.

| Phrase | Where it appears |
|---|---|
| **Keep it Local, Keep it Canadian.** | Hero chip, footer pill, footer legal strip, Why-section subhead, Pricing-section strip, all OG/Twitter metadata, Organization.slogan, LocalBusiness.slogan |
| **The Refresh / The Integrate / The On-Call** | Always capitalized exactly this way. "Refresh package" is wrong. "the integrate" is wrong. |
| **Book a Discovery Call** | Every primary CTA. Not "Get a Quote", not "Contact Us", not "Talk to Sales". |

---

## Words we use

| Use | Not |
|---|---|
| Build | Deploy, ship, roll out, stand up |
| Integrate / embed | Plug in, install, hook up |
| Agent (AI agent) | Bot, chatbot, assistant |
| Site / website | Web property, web presence, digital storefront |
| Discovery call | Sales call, consultation, intro meeting |
| Per-call / pay-per-call | Ad-hoc, one-off, project basis (when discussing post-launch support) |
| On-Call retainer | Subscription, monthly plan, service contract |
| Questions | Inquiries (in customer-facing copy) |
| One team, end-to-end | Full-service, one-stop |
| Small business | SMB, SME |
| Trades | Trades & services, blue-collar |
| Operation | Business operations, BAU |

---

## Words and phrases we avoid

These are old positioning that the site was deliberately pivoted away from:

- "Training", "Coaching", "Curriculum", "Workshop"
- "Setup Sprint", "Operator Program", "Fractional AI Lead"
- "Digital Workforce", "Industrial Workforce Models"
- "Recovering time. Rescuing revenue."
- "Tailored Builds for Tailored Businesses." (double-tailored)
- "Commercial Model", "Commercial Demo"
- "Operational Excellence", "Live Operational"
- "Neural Logic", "Core Reasoning", "Adaptive Reasoning"
- "High-stakes automation", "High-impact businesses"
- "Inquiries" (in end-user-facing copy — use "questions")
- "Brand Safe", "Brand Identity" (as section headers)

Avoid generic startup language:

- "Move the needle"
- "Game-changer", "disruptor", "revolutionary"
- "AI-powered" (use "AI agent" or just describe what it does)
- "Synergy", "leverage" (as a verb), "ideate"
- "Best-in-class", "world-class", "enterprise-grade"
- "Built for every stage of growth" (generic startup copy)

---

## Sentence shape

- **Short sentences.** Two clauses max. Periods earn their keep.
- **Active voice.** "We build the site." Not "The site is built by us."
- **Specific over generic.** "Kanata trades companies and Centretown law offices" beats "local businesses we work with."
- **Concrete examples.** When introducing a concept, give an example in the next breath. The site does this in `ProblemSection` ("8pm and gets voicemail calls your competitor at 8:01pm") and `WhatWeBuildsSection` (Plumbers, HVAC, Cleaning).
- **No "we believe…" preambles.** State the claim.

---

## Heading shape

Headlines on this site follow a pattern: a setup line, a line break, a payoff line in `text-accent-3`.

```jsx
<h2>
  Ottawa businesses are <br />
  <span className="text-slate-400">bleeding time.</span>
</h2>

<h2>
  Three builds. <br />
  <span className="text-slate-400">Pick yours.</span>
</h2>

<h2>
  Ready to modernize <br />
  <span className="text-accent-3">your front door?</span>
</h2>
```

Rules:
- Two-line headlines, mobile-collapsed via `<br className="hidden md:block">`.
- Payoff phrase in `text-accent-3` for the most important headings, `text-slate-400` or `text-slate-500` for atmospheric ones.
- Period at the end of declarative headings, question mark for the rare interrogative.

---

## Microcopy

| Slot | Pattern |
|---|---|
| Section eyebrow | `font-black uppercase tracking-[0.3em] text-[10px]` — e.g. "After Launch", "Strategic Overview", "Trusted Partnerships" |
| Pill chip | Same treatment, plus border + bg-white/[0.04] on dark, bg-slate-100 on light |
| CTA button | "Book a Discovery Call" — verb + object |
| Secondary CTA | "See a Live Agent", "Direct Email" — short, no period |
| Empty / loading | "Starting Up", "Thinking", "Online" — single word or two |

---

## Copy by section

### Hero
- **Headline:** Three short statements, last clause in accent. The pattern: declarative / declarative / declarative. Currently: "Modern websites. / Integrated AI agents. / One team, on call."
- **Subhead:** What we do + who it's for. ~2 sentences.
- **CTA primary:** "Book a Discovery Call"
- **CTA secondary:** "See a Live Agent" (anchors to demo)
- **Bottom chip:** "Keep it Local, Keep it Canadian"

### Problem
- **Pattern:** Three pains, each with a concrete example that makes the cost real.
- **Tone:** Honest about what small business owners actually deal with. Don't sugar-coat.

### Chat demo
- **Tone:** Decisive, not corporate. The live agent itself follows the voice rules in [`../THARROS_KNOWLEDGE_BASE.md`](../THARROS_KNOWLEDGE_BASE.md).

### Model tiers (Refresh / Integrate / On-Call)
- **Title casing:** "The Refresh", "The Integrate", "The On-Call" — capital T, capital noun.
- **Duration line:** Honest about pricing model. "Project-based" / "Project + Monthly Retainer".
- **Description:** One sentence on what it includes, one sentence on what after-launch looks like.
- **Chips:** Short feature tags in `tracking-[0.2em]` uppercase.

### How it works
- Three steps. Step name in title case, body in plain prose.
- **Discovery → Build & Integrate → Launch & Support.** Don't rename these.

### Why Tharros
- Three pillars: **Ottawa-local**, **One team, end-to-end**, **A number you can call**.
- Each pillar opens with the headline, then a paragraph that justifies it concretely.
- Founder quote at the bottom, in `text-accent-3` for the payoff phrase.

### Pricing
- **Three factors:** Build Scope, Integration Depth, After-Launch Model.
- **Tagline:** "Pricing as tailored as the work."
- **Why no fixed price list:** explain honestly. Compare two different jobs.
- **CTA:** "Book a Discovery Call"

### Footer
- **Headline:** "Ready to modernize your front door?"
- **Subhead:** Mentions discovery call and pay-per-call vs On-Call retainer.
- **CTA primary:** "Book a Discovery Call"
- **CTA secondary:** "Direct_Email" (yes, with underscore — it's an industrial-styled accent)
- **Legal strip:** copyright + "Ottawa, Canada" + slogan + Canada flag.

---

## When in doubt

Read the existing section's copy out loud. Would a plumber, a contractor, or a small-firm lawyer in Ottawa understand and trust it? If not, simplify it.

When you're stuck on a heading, write five candidates. Pick the shortest one that's still specific. Then look at it tomorrow.
