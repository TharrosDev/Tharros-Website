# THARROS — Content Guide

The voice the copy currently uses, written down so a new line sounds like the ones next to
it. The site is pre-launch and the voice is the owner's — change it and change this file.
The only part of this document that is not a preference is the factual section at the
bottom, and it says so.

## Voice

Confident without shouting. Plain, specific, slightly cold. THARROS states things and
moves on; it does not sell, plead, or explain itself twice.

Write like the label knows exactly what it made and assumes you can tell.

**Is:** bold, minimal, raw, cultured, modern, unapologetic.
**Is not:** cheesy, motivational, corporate, luxurious-by-adjective, hype, "influencer
merch".

---

## The name

**THARROS** — always uppercase in body copy and headings. Never "Tharros Clothing",
"Tharros Apparel", or "the Tharros brand". Sentence-case "Tharros" is acceptable only
inside a longer running sentence where full caps would shout.

The line is: **Small runs. Original ideas.**

Recurring editorial phrases, used sparingly: *Where it starts.*, *Worn in, not styled.*,
*Coming next*, *Drop 001*. Pick one per page — a label that repeats its own slogans sounds
like merchandise.

Retired, and not to come back: *Made small. Made with intent.*, *Built from the ground
up.*, *Designed, tested, refined.* All three are about the label's manufacturing rather
than about its clothes, and they were the spine of a positioning the site no longer has.

**Scale.** Write like a small independent label, because that is what this is. Say
"small run", not "global collection". Say "the next drop", not "our latest seasonal
assortment". Never imply a team, a factory, a warehouse, press coverage or a history
that does not exist. The word "I" does not appear in site copy.

**THE SUBJECT IS THE CLOTHES.** This is the change that matters most, and it is not a
style preference — it is what the site is for.

THARROS used to explain itself through how it was made: patterns, samples, revisions, how
many attempts a fit took, how much could be sewn, the craft being learned in public. An
About page of five chapters, three of them about manufacturing. A home page section
naming the six stages of production. Product copy that opened on how many fits came
before this one. A run size that arrived with a paragraph justifying it.

None of that is the pitch any more. Write about the garment: silhouette, weight, drape,
crop, shoulder, hem, cloth, texture, closure, pockets, graphics, layering, how it is meant
to sit. The reader's question is *what is this like to wear*, and every sentence should be
answering it.

> **Prefer:** Heavyweight jersey. Wide through the shoulder with a shortened body.
> **Over:** Three fits were made before this one; the other two were too long.

> **Prefer:** Drop 002 — coming next.
> **Over:** Being patterned and sampled now. Two pieces are far enough along to show.

> **Prefer:** Get Drop 002 first.
> **Over:** The list hears first when something is finished.

Garment construction is still legitimate product information — taped seams, corozo
buttons, a double-layer hood, ribbing carried through the trims. The target is
process-as-brand-story, not facts about how a piece is built.

**Small runs are a property, not an argument.** "Limited release. 40 units." is the whole
claim. Do not explain production capacity, why there is no warehouse, why scarcity is not
marketing, or when the runs will get bigger. The customer did not ask for an operational
briefing and does not need an apology.

**Never narrate what is unfinished.** No public commentary about pending photography,
unconnected payment, missing measurements, provisional carrier rates, sign-in that is not
live, or legal review. Handle an incomplete thing gracefully — a shorter page, a cleaner
empty state, a control that is absent rather than dead — and record the blocker in the
repository, where the people who can fix it will read it.

---

## Microcopy

Use:

> SHOP THE DROP · VIEW THE DROP · READ THE STORY · ADD TO BAG · SAVE IT ·
> SOLD OUT · IN DEVELOPMENT · 12 MADE · WILL NOT BE REMADE · JOIN

Never:

> "OMG" · "You need this!" · "Best seller!!!" · "Buy now before it's too late" ·
> "Subscribe to our newsletter!" · exclamation marks · emoji · ALL-CAPS enthusiasm

Product copy is descriptive, not adjectival. Say what the cut does, not how amazing it is:
*"Cut wide through the chest and shoulder with a shortened body, it holds its shape
instead of draping."*

---

## Honesty rules

The one part of this guide that is not about taste: these are claims that would be untrue,
not sentences that would be off-voice.

**Do not write:**

- reviews, testimonials, ratings, or customer counts that do not exist
- press mentions, awards, stockists or collaborations that have not happened
- founding history, locations, factories, or sustainability claims that were not supplied
- model measurements or fit notes that were not measured
- scarcity language the inventory does not support — run sizes and remaining counts
  come from the catalogue and are printed verbatim
- restock promises: only `restock: "none"` may say a piece will not be remade
- a waitlist, notification or early access that is not actually wired up
- "X people are viewing this" or any manufactured urgency

**When something is not ready, say so in one plain line and stop.** The site already does
this at the payment step, on `/account`, in the newsletter form, on the size guide, and on
the legal drafts. Match that tone: state the fact, give the alternative, do not apologise
twice.

---

## Structure

- Headings: short, declarative, often two or three words. Periods are allowed and used —
  *"Available now." "This is Tharros." "Nothing found."*
- Section eyebrows are a mono index plus a two-word label: `01 THE NEW DROP`.
- Empty states get a display-size statement, one line of body, and one action.
- Body paragraphs: two to four sentences. If it needs five, it needs cutting.

---

## Typography details

- Apostrophes in JSX text use `&apos;`; inside JS string literals use a real `'`.
- Em dashes: real `—` in JS strings, `&mdash;` only in JSX text.
- Prices always render through `formatPrice()` — never typed by hand into copy.
- Sizes, quantities, dates and codes are mono (`.num` / `type-meta`).
