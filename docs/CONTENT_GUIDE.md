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

The line is: **Built for those who don't blend in.**

Recurring editorial phrases, used sparingly: *Noise / Silence*, *Collection 01*,
*The world doesn't need another brand. Make your own.*

---

## Microcopy

Use:

> SHOP THE COLLECTION · SHOP THE DROP · VIEW COLLECTION · DISCOVER THE STORY ·
> ADD TO BAG · NEW · LOW STOCK · SOLD OUT · COMING SOON · JOIN

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
- scarcity language the inventory does not support
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
