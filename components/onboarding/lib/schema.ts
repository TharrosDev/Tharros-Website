// schema.ts — Question schema, default state, validation.
// EDIT THIS FILE to add / remove / reorder questions.
// Every layer downstream (prompt builder, review screen, admin) reads from here.

import type { FieldDef, FieldValue, FormState, StepDef } from "./types";

/* ============================================================
   STEPS
   ============================================================ */

export const OB_STEPS: StepDef[] = [
  {
    id: "basics",
    name: "Basics",
    title: "The basics.",
    subtitle: "Just the headline facts — who you are and what you do.",
    fields: [
      { id: "businessName", kind: "text", label: "Business name",
        placeholder: "What it’s called on the door, sign, or invoice" },
      { id: "ownerName", kind: "text", label: "Your name",
        placeholder: "First & last" },
      { id: "city", kind: "text", label: "Where you’re based",
        placeholder: "Kanata, Nepean, Barrhaven, Orleans…",
        hint: "Town, neighbourhood, or the region you serve from." },
      { id: "industry", kind: "text", label: "What you do, in one line",
        placeholder: "e.g. Residential plumbing · Boutique skincare studio · Family law practice",
        hint: "If a neighbour asked, how would you explain it in a sentence?" },
    ],
  },

  {
    id: "current-site",
    name: "Current site",
    title: "Your current website.",
    subtitle: "What’s there now — and what isn’t pulling its weight.",
    fields: [
      { id: "currentUrl", kind: "url", label: "Current website",
        placeholder: "https://example.ca", optional: true,
        hint: "Leave blank if you don’t have one yet." },
      { id: "siteWorking", kind: "text", label: "What’s working about it",
        placeholder: "Photos look good, but barely anyone contacts us through it.",
        optional: true,
        hint: "Skip if you’re starting fresh." },
      { id: "siteBroken", kind: "text", label: "The #1 thing that isn’t working",
        placeholder: "Looks dated. Hard to find on Google. Phone number is buried.",
        hint: "Be blunt — what frustrates you most when you look at it." },
    ],
  },

  {
    id: "customers",
    name: "Customers",
    title: "Who you serve.",
    subtitle: "The people who hire you or buy from you, and where they are.",
    fields: [
      { id: "customers", kind: "chips", label: "Who your customers are",
        placeholder: "Type and press enter…",
        suggest: [
          "Homeowners", "Renters", "Small business owners",
          "Other trades & contractors", "Property managers",
          "Retail shoppers", "Online buyers", "Walk-in customers",
          "Wholesale clients", "Corporate / B2B",
          "Event planners", "Local residents", "Out-of-town visitors",
        ],
        hint: "Add as many as fit. These shape the homepage messaging." },
      { id: "serviceArea", kind: "chips", label: "Where they are",
        placeholder: "Add neighbourhoods, towns, or regions…",
        suggest: [
          "Kanata", "Nepean", "Barrhaven", "Orleans", "Stittsville",
          "Manotick", "Gatineau", "Ottawa Centre", "Greater Ottawa",
          "Eastern Ontario", "Canada-wide", "Online only",
        ],
        hint: "Where you take work from. “Online only” is a valid answer." },
    ],
  },

  {
    id: "services",
    name: "Offering & pages",
    title: "What you offer & what the site needs.",
    subtitle: "Your products or services, plus the pages it should cover.",
    fields: [
      { id: "services", kind: "chips", label: "What you sell or do",
        placeholder: "Type and press enter…",
        suggest: [
          "Repairs & service", "Installations", "Maintenance plans",
          "Consultations", "Inspections", "Custom orders",
          "Retail sales", "Wholesale", "Subscriptions / memberships",
          "Workshops & events", "Bookings & appointments",
          "Emergency / on-call",
        ],
        hint: "The four or five categories you most want customers asking about." },
      { id: "pages", kind: "checks", label: "Pages you’ll want",
        options: [
          { v: "home", label: "Home", hint: "Your front door — hero, what you do, proof." },
          { v: "services", label: "Services / Products", hint: "What you offer, in detail, with photos." },
          { v: "about", label: "About", hint: "Who you are, your story, your team." },
          { v: "contact", label: "Contact", hint: "Phone, form, hours, map / address." },
          { v: "service-areas", label: "Locations / Service areas", hint: "One page per area you serve, for local SEO." },
          { v: "testimonials", label: "Reviews", hint: "Quotes, ratings, before / afters." },
          { v: "faq", label: "FAQ", hint: "The questions you get asked weekly." },
          { v: "gallery", label: "Gallery / Portfolio", hint: "Photos of finished work, products, or past events." },
          { v: "pricing", label: "Pricing", hint: "Rates, packages, product pricing." },
          { v: "blog", label: "Blog / News", hint: "Updates, tips, seasonal posts." },
          { v: "booking", label: "Online booking", hint: "Self-serve scheduling for appointments." },
          { v: "shop", label: "Online shop", hint: "Sell products directly through the site." },
        ],
      },
    ],
  },

  {
    id: "assistant",
    name: "Site assistant",
    title: "Your site’s digital receptionist.",
    subtitle: "An always-on helper that answers common questions and routes messages when you’re busy. Skip the whole step if you don’t want one.",
    fields: [
      { id: "assistantScope", kind: "checks", label: "What it should help with",
        options: [
          { v: "inquiry", label: "Answer common questions",
            hint: "Hours, locations, pricing ballpark, what you do." },
          { v: "lead", label: "Capture leads & route messages",
            hint: "Gathers name, contact, what they need; sends straight to you." },
          { v: "booking", label: "Help visitors book or buy",
            hint: "Walks people through scheduling, ordering, or quoting." },
          { v: "after-hours", label: "Handle after-hours inquiries",
            hint: "Catches questions when you’re off the clock." },
          { v: "none", label: "Skip — site only, no assistant",
            hint: "We’ll focus the build on a clean, fast website." },
        ],
      },
      { id: "hoursOfOperation", kind: "text", label: "Hours of operation",
        placeholder: "e.g. Mon–Fri 9am–5pm; closed weekends",
        hint: "So the assistant knows when to say “we’re open” vs “we’ll reply soon”.",
        optional: true },
      { id: "afterHours", kind: "radio", label: "After-hours behaviour",
        options: [
          { v: "message", label: "Take a message" },
          { v: "urgent", label: "Flag urgent ones to me" },
          { v: "callback", label: "Promise a next-morning callback" },
          { v: "none", label: "Don’t handle after-hours" },
        ],
        optional: true,
      },
    ],
  },

  {
    id: "brand",
    name: "Look & feel",
    title: "Look and feel.",
    subtitle: "The colours, mood, and direction the site should lean.",
    fields: [
      { id: "primaryColor", kind: "colors", label: "Primary brand colour",
        options: [
          { v: "#0ea5e9", label: "Sky" },
          { v: "#1e293b", label: "Slate" },
          { v: "#dc2626", label: "Bold red" },
          { v: "#16a34a", label: "Forest" },
          { v: "#f59e0b", label: "Amber" },
          { v: "#ea580c", label: "Burnt orange" },
          { v: "#0d9488", label: "Teal" },
          { v: "#7c3aed", label: "Violet" },
          { v: "#be185d", label: "Magenta" },
          { v: "#000000", label: "Black" },
        ],
        hint: "Pick what’s closest to your logo, or use the picker for a custom hex.",
      },
      { id: "moodWords", kind: "chips", label: "Three words for the feel",
        placeholder: "Type and press enter…",
        suggest: [
          "Trustworthy", "Modern", "Local", "Approachable",
          "Premium", "Bold", "Minimal", "Warm",
          "Traditional", "Refined", "Playful", "Confident",
          "Friendly", "Established", "Eco / natural",
        ],
        hint: "How the site should feel when someone first lands on it." },
      { id: "avoid", kind: "chips", label: "Anything to avoid",
        placeholder: "Add words, colours, or styles to steer clear of…",
        suggest: [
          "Cartoonish", "Generic stock photos", "Clip-art",
          "Heavy gradients", "Pop-ups", "Auto-play video",
          "Comic Sans", "Neon", "Cluttered", "Overly corporate",
        ],
        optional: true,
        hint: "Strong dislikes — colours, styles, clichés. Skip if you’re flexible.",
      },
    ],
  },

  {
    id: "voice",
    name: "Voice & timing",
    title: "Voice and timeline.",
    subtitle: "How the words should sound, and when you need it live.",
    fields: [
      { id: "voiceTone", kind: "slider", label: "How the copy should read",
        min: 0, max: 4, step: 1, defaultValue: 2,
        labels: ["Buttoned-up", "Professional", "Balanced", "Conversational", "Casual"],
        hint: "Slide toward where you want the voice to sit." },
      { id: "voiceMust", kind: "chips", label: "Things worth featuring",
        placeholder: "Type and press enter…",
        suggest: [
          "Locally owned", "Family-owned", "Women-owned", "Veteran-owned",
          "Licensed & insured", "Certified / accredited",
          "Award-winning", "20+ years experience",
          "Eco-friendly", "Made in Canada",
          "Satisfaction guaranteed", "Free quotes / consultations",
          "Same-day service", "By appointment only",
        ],
        optional: true,
        hint: "Credentials, claims, or short phrases the site should highlight." },
      { id: "timeline", kind: "radio", label: "When you need it live",
        options: [
          { v: "asap", label: "ASAP — within 4 weeks" },
          { v: "soon", label: "1–2 months" },
          { v: "quarter", label: "2–3 months" },
          { v: "flex", label: "Flexible" },
        ],
      },
    ],
  },

  {
    id: "assets",
    name: "Assets & links",
    title: "What you can hand over.",
    subtitle: "Logo, photos, and a few sites you like — to anchor the look.",
    fields: [
      { id: "logo", kind: "file", label: "Logo file",
        hint: "SVG, PNG, or PDF. Skip if you don’t have one yet — we’ll flag it.",
        optional: true, accept: ".svg,.png,.jpg,.jpeg,.pdf" },
      { id: "haveAssets", kind: "checks", label: "What else you can provide",
        options: [
          { v: "photos", label: "Photos of your work or products", hint: "Finished jobs, products, your space." },
          { v: "headshots", label: "Team photos / headshots", hint: "You, your team, your space." },
          { v: "reviews", label: "Reviews / testimonials", hint: "Google / Facebook quotes we can lift." },
          { v: "copy", label: "Existing copy", hint: "Brochures, old website text, product descriptions." },
          { v: "brand-doc", label: "Brand guide / style doc", hint: "If you’ve had one made before." },
          { v: "none", label: "None of the above — start from scratch" },
        ],
        optional: true,
      },
      { id: "refSites", kind: "chips", label: "Sites you like the look of",
        placeholder: "Paste URLs (one at a time, press enter)",
        optional: true,
        hint: "Up to three. Doesn’t need to be in your industry." },
    ],
  },

  {
    id: "contact",
    name: "Contact",
    title: "Best way to reach you.",
    subtitle: "Last one. We’ll confirm receipt within one business day.",
    fields: [
      { id: "email", kind: "text", label: "Email",
        placeholder: "you@business.ca", inputType: "email" },
      { id: "phone", kind: "text", label: "Phone", optional: true,
        placeholder: "(613) 555-0188",
        hint: "Optional but handy if we have a quick clarifying question." },
      { id: "bestTime", kind: "text", label: "Best time to reach you", optional: true,
        placeholder: "After 4pm weekdays" },
    ],
  },
];

/* ============================================================
   DEFAULTS & VALIDATION
   ============================================================ */

export function defaultState(): FormState {
  const out: FormState = {};
  OB_STEPS.forEach((step) => {
    step.fields.forEach((f) => {
      if (f.kind === "chips" || f.kind === "checks") out[f.id] = [];
      else if (f.kind === "slider") out[f.id] = f.defaultValue ?? Math.floor(((f.min ?? 0) + (f.max ?? 0)) / 2);
      else if (f.kind === "file") out[f.id] = null;
      else out[f.id] = "";
    });
  });
  return out;
}

export function fieldComplete(field: FieldDef, value: FieldValue): boolean {
  if (field.optional) return true;
  if (field.kind === "chips" || field.kind === "checks") return Array.isArray(value) && value.length > 0;
  if (field.kind === "slider") return value != null;
  if (field.kind === "file") return value != null;
  return typeof value === "string" && value.trim().length > 0;
}

export function stepComplete(step: StepDef, state: FormState): boolean {
  return step.fields.every((f) => fieldComplete(f, state[f.id]));
}

export function findField(id: string): FieldDef | null {
  for (const step of OB_STEPS) {
    for (const f of step.fields) {
      if (f.id === id) return f;
    }
  }
  return null;
}
