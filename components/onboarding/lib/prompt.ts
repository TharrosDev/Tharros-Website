// prompt.ts — Build the structured Markdown brief from form state.
// EDIT THIS FILE to change how the prompt reads (section headers, build
// guidance footer, package recommendation logic, etc).

import { findField } from "./schema";
import type { FieldDef, FieldValue, FormState } from "./types";

/* Format one field value into its Markdown inline representation. */
function formatField(field: FieldDef | null, value: FieldValue): string {
  if (!field || value == null) return "_(not provided)_";

  if (field.kind === "chips") {
    const arr = Array.isArray(value) ? value.filter(Boolean) : [];
    return arr.length ? arr.map((v) => `\`${v}\``).join(", ") : "_(not provided)_";
  }

  if (field.kind === "checks") {
    const arr = Array.isArray(value) ? value.filter(Boolean) : [];
    if (!arr.length) return "_(not provided)_";
    return arr.map((v) => {
      const opt = field.options?.find((o) => o.v === v);
      return opt ? opt.label : v;
    }).map((s) => `- ${s}`).join("\n");
  }

  if (field.kind === "radio") {
    const opt = field.options?.find((o) => o.v === value);
    return opt ? opt.label : (typeof value === "string" ? value : "_(not provided)_");
  }

  if (field.kind === "slider") {
    const labels = field.labels || [];
    return labels[value as number] || `${value}`;
  }

  if (field.kind === "colors") {
    const opt = field.options?.find((o) => o.v === value);
    return value ? `\`${value}\`${opt ? " (" + opt.label + ")" : ""}` : "_(not provided)_";
  }

  if (field.kind === "file") {
    if (field.multiple) {
      if (!Array.isArray(value) || value.length === 0) return "_(not provided)_";
      const files = value as Array<{ name: string; size: number; url?: string }>;
      return "\n" + files.map((f) => {
        const meta = `\`${f.name}\` (${(f.size / 1024).toFixed(1)} kB)`;
        return f.url ? `  - ${meta} — ${f.url}` : `  - ${meta} — *upload incomplete*`;
      }).join("\n");
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) return "_(not provided)_";
    const single = value as { name: string; size: number; url?: string };
    return `\`${single.name}\` (${(single.size / 1024).toFixed(1)} kB)${single.url ? ` — ${single.url}` : ""}`;
  }

  return (typeof value === "string" ? value.trim() : `${value}`) || "_(not provided)_";
}

/* ============================================================
   buildPrompt — the entire structured Markdown brief
   ============================================================ */

export function buildPrompt(state: FormState): string {
  const ts = new Date().toISOString();
  const get = (id: string): FieldValue => state[id];
  const str = (id: string): string => {
    const v = state[id];
    return typeof v === "string" ? v : "";
  };
  const arr = (id: string): string[] => {
    const v = state[id];
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string");
  };

  const lines: string[] = [];

  lines.push("# Client Brief — New Tharros Build");
  lines.push("");
  lines.push(`> Generated ${ts.split("T")[0]} from client onboarding.`);
  lines.push("> Use this as a system prompt or first-turn message when generating the site.");
  lines.push("");

  // ----- Business
  lines.push("## 1. Business");
  lines.push(`- **Name:** ${str("businessName") || "_(missing)_"}`);
  lines.push(`- **Owner / contact:** ${str("ownerName") || "_(missing)_"}`);
  lines.push(`- **Based in:** ${str("city") || "_(missing)_"}`);
  lines.push(`- **What they do:** ${str("industry") || "_(missing)_"}`);
  lines.push("");

  // ----- Current site
  lines.push("## 2. Current site");
  lines.push(`- **URL:** ${str("currentUrl") || "_(none — greenfield build)_"}`);
  if (str("siteWorking")) lines.push(`- **Working:** ${str("siteWorking")}`);
  lines.push(`- **Biggest issue:** ${str("siteBroken") || "_(not specified)_"}`);
  lines.push("");

  // ----- Customers
  lines.push("## 3. Audience");
  lines.push(`- **Customer types:** ${formatField(findField("customers"), get("customers"))}`);
  lines.push(`- **Service areas:** ${formatField(findField("serviceArea"), get("serviceArea"))}`);
  lines.push("");

  // ----- Offering
  lines.push("## 4. Offering");
  lines.push(`- **Services:** ${formatField(findField("services"), get("services"))}`);
  lines.push("- **Pages to build:**");
  const pagesField = findField("pages");
  const pages = arr("pages");
  if (!pages.length) {
    lines.push("  - _(not specified — propose a sensible default)_");
  } else {
    pages.forEach((v) => {
      const opt = pagesField?.options?.find((o) => o.v === v);
      lines.push(`  - ${opt ? opt.label : v}`);
    });
  }
  lines.push("");

  // ----- Assistant
  lines.push("## 5. AI agent");
  const scope = arr("assistantScope");
  if (!scope.length || scope.includes("none")) {
    lines.push("- **Status:** Skipped — site only, no embedded agent for v1.");
    lines.push("- **Suggested Tharros package:** The Refresh (or The On-Call if they want a monthly retainer for fixes and edits).");
  } else {
    lines.push("- **Patterns requested:**");
    const scopeField = findField("assistantScope");
    scope.filter((v) => v !== "none").forEach((v) => {
      const opt = scopeField?.options?.find((o) => o.v === v);
      lines.push(`  - ${opt ? opt.label : v}`);
    });
    if (str("hoursOfOperation")) lines.push(`- **Hours of operation:** ${str("hoursOfOperation")}`);
    if (get("afterHours")) lines.push(`- **After-hours behaviour:** ${formatField(findField("afterHours"), get("afterHours"))}`);

    lines.push("- **Suggested Tharros package:** The Integrate (site + agent + monthly retainer).");
  }
  lines.push("");

  // ----- Brand
  lines.push("## 6. Visual direction");
  lines.push(`- **Primary colour:** ${formatField(findField("primaryColor"), get("primaryColor"))}`);
  lines.push(`- **Mood / feel:** ${formatField(findField("moodWords"), get("moodWords"))}`);
  if (arr("avoid").length) {
    lines.push(`- **Avoid:** ${formatField(findField("avoid"), get("avoid"))}`);
  }
  lines.push("");

  // ----- Voice
  lines.push("## 7. Voice & tone");
  lines.push(`- **Position on scale:** ${formatField(findField("voiceTone"), get("voiceTone"))}`);
  if (arr("voiceMust").length) {
    lines.push(`- **Must include / claims:** ${formatField(findField("voiceMust"), get("voiceMust"))}`);
  }
  lines.push("");

  // ----- Timeline & assets
  lines.push("## 8. Timeline & assets");
  lines.push(`- **Target launch:** ${formatField(findField("timeline"), get("timeline"))}`);
  if (arr("haveAssets").length) {
    lines.push("- **Assets supplied or coming in follow-up:**");
    const af = findField("haveAssets");
    arr("haveAssets").filter((v) => v !== "none").forEach((v) => {
      const opt = af?.options?.find((o) => o.v === v);
      lines.push(`  - ${opt ? opt.label : v}`);
    });
  } else {
    lines.push("- **Assets:** none tagged — flag in follow-up call.");
  }
  if (arr("refSites").length) {
    lines.push(`- **Reference sites:** ${formatField(findField("refSites"), get("refSites"))}`);
  }
  const assetFiles = get("assetFiles");
  if (Array.isArray(assetFiles) && assetFiles.length) {
    lines.push("- **Files uploaded:**");
    (assetFiles as Array<{ name: string; size: number; url?: string }>).forEach((f) => {
      const meta = `\`${f.name}\` (${(f.size / 1024).toFixed(1)} kB)`;
      lines.push(f.url ? `  - ${meta} — ${f.url}` : `  - ${meta} — *upload incomplete*`);
    });
  } else {
    lines.push("- **Files:** none uploaded.");
  }
  lines.push("");

  // ----- Contact
  lines.push("## 9. Contact");
  lines.push(`- **Email:** ${str("email") || "_(missing)_"}`);
  if (str("phone")) lines.push(`- **Phone:** ${str("phone")}`);
  if (str("bestTime")) lines.push(`- **Best time to reach:** ${str("bestTime")}`);
  if (str("notes")) {
    lines.push("");
    lines.push("**Additional notes from the client:**");
    lines.push("");
    lines.push(str("notes"));
  }
  lines.push("");

  // ----- Build guidance footer
  lines.push("---");
  lines.push("");
  lines.push("## Build guidance");
  lines.push("");
  lines.push("Generate a Tharros-style website that matches the brief above. Apply the Tharros design language (the Field Engineer system): a bone-warm surface, a single committed cobalt accent used sparingly, Geist and Geist Mono typography, hairline rules instead of cards, no shadows, and decisive copy. Voice should sound like a competent tradesperson who happens to build software: short sentences, plain words, locally grounded.");
  lines.push("");
  lines.push("**Hard requirements:**");
  lines.push("- Section layouts: hero → problem/why → services → process → social proof → contact.");
  lines.push("- Mobile-first responsive. Test at 375px, 768px, 1280px.");
  lines.push("- Accessibility: WCAG AA contrast, proper headings, alt text placeholders.");
  lines.push("- SEO: per-page metadata, JSON-LD `LocalBusiness` schema with service areas above.");
  lines.push("- CTA on every section: \"Book a Discovery Call\" or a phone number.");
  lines.push("");
  lines.push("**If gaps exist above (`_(missing)_` or `_(not provided)_`), make reasonable assumptions in the spirit of the rest of the brief and flag them in a `// TODO:` comment next to the relevant section.**");

  return lines.join("\n");
}

export { formatField };
