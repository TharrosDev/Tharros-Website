# Product

## Register

brand

## Users

Owners and operators of Ottawa-area small businesses: trades (plumbers, HVAC, electricians, landscapers, cleaning), professional services (lawyers, accountants, consultants), and local service operations (property managers, auto repair, clinics). They work in Kanata, Nepean, Barrhaven, Orleans, Stittsville, Manotick, and Gatineau.

Their context: busy, often on the job or after hours, not technical, and skeptical of agencies that overpromise. They feel their current website is dated and embarrassing, or they are losing inquiries they never see. The job they are trying to get done is simple to state and hard to trust: get a modern site and (optionally) an AI agent that captures the leads they are missing, from one team they can actually reach when something changes. They are deciding whether to call, not reading documentation.

## Product Purpose

tharros.ca is the marketing surface for Tharros, an Ottawa team that modernizes small-business websites, builds and embeds custom AI agents (customer inquiry, lead capture, after-hours intake), and stays on call for fixes, improvements, and new agents. One team owns the site, the agent, and the integrations between them, under a single point of contact.

The site exists to convert a skeptical local owner into a free discovery call. It walks visitors through the three packages (The Refresh, The Integrate, The On-Call), demos a live agent, and routes them to the Discovery Briefing wizard at `/brief`. Success is a qualified inquiry from a real Ottawa business, earned through evident competence rather than persuasion theatre. Slogan: Keep it Local, Keep it Canadian.

## Brand Personality

Three words: grounded, technical, reachable.

The voice is the "Field Engineer": a structural engineer's letterhead crossed with a tradesperson's invoice. Plain-spoken and declarative, never breathless. It demonstrates cutting-edge technical practice through the craft of the surface itself (the schematic diagrams, the mono metadata, the restraint) rather than by claiming it in words. It speaks the language of small business, not agency jargon.

Emotional goal: the visitor should feel reassured and in safe hands. The dominant note is calm confidence, the sense that these people are competent, local, and answerable when things change. We earn trust by showing the work and naming real things (real Ottawa neighbourhoods, a real founder, a real phone you can call), not by hyping outcomes.

## Anti-references

Visual anti-references are specified in DESIGN.md (the slate-on-sky AI-SaaS reflex, glassmorphism, hero-metric templates, identical icon-card grids, the editorial-magazine second-order trap). PRODUCT.md owns the positioning anti-references. Tharros must never read as:

- **A faceless overseas agency.** Cheap, offshore, unaccountable, impossible to reach. Tharros is local, named, and answerable. Reachability and Ottawa-local context are the counter.
- **A bloated big agency.** Expensive, slow, account managers and vendor handoffs and finger-pointing. Tharros is one team, end-to-end, direct. No handoffs.
- **AI hype or vaporware.** Buzzword-stacked startups overpromising on AI. Tharros is grounded and practical: specific agent patterns tied to real small-business jobs, no magic claims. Show, never sell.

## Design Principles

1. **Show competence, don't claim it.** Technical credibility is demonstrated through the craft of the surface and the specificity of the work, not asserted with adjectives. The diagram proves more than the headline.
2. **Plain-spoken over polished.** Declarative, tradesperson-direct copy that names real things. If a sentence sounds like agency marketing, cut it. Calm confidence, never hype.
3. **One throat to choke.** Reinforce that a single team owns the site, the agent, and the integrations, and that a real person answers. Reachability is part of the product, not a footnote.
4. **Local is the moat.** Lean into Ottawa context (named neighbourhoods, local trades and law offices, Canadian framing). The advantage is knowing this city's small businesses, and the site should feel like it.
5. **Earn the call.** Every section moves a skeptical owner one step closer to a free discovery call. Reduce friction and doubt; the goal is a qualified inquiry, not a vanity impression.

## Accessibility & Inclusion

Target WCAG 2.1 AAA where feasible, AA as the non-negotiable floor. This aligns with the contrast floors already specified in DESIGN.md (body and lead text at or above 4.5:1, tertiary marks at or above 4.5:1 for small mono) and pushes toward 7:1 on primary reading text where the palette allows.

- Honour `prefers-reduced-motion` at both the global CSS layer and in motion-driven components (hero reveal, scroll-progress strip).
- Cobalt is the only saturated colour and is never the sole carrier of meaning; pair it with text, position, or typographic markers so the system holds for colour-blind users and at a distance.
- Keyboard focus is always visible (the site-wide cobalt `:focus-visible` ring is never removed).
- Audience skews non-technical and often mobile or on-the-job; minimum reading sizes and generous tap targets matter more here than on a developer tool.
