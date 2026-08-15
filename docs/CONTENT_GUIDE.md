# THARROS — Content Guide

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

Recurring editorial phrases, used sparingly: *Made small. Made with intent.*, *Built
from the ground up.*, *Designed, tested, refined.*, *Drop 001*. Pick one per page — a
label that repeats its own slogans sounds like merchandise.

**Scale.** Write like a small independent label, because that is what this is. Say
"small run", not "global collection". Say "the next drop", not "our latest seasonal
assortment". Never imply a team, a factory, a warehouse, press coverage or a history
that does not exist. The founder's learning is part of the story, but THARROS is the
subject — this is not a personal blog, and the word "I" does not appear in site copy.

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

These are content rules, not just engineering ones. Breaking them is a defect.

**Never write:**

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
