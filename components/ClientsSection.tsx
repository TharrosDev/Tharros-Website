"use client";

import Image from "next/image";
import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";

type Client = {
  id: string;
  name: string;
  location: string;
  buildType: string;
  lede: string;
  description: string;
  url: string;
  date: string;
  logo?: string;
  monogram?: string;
  tags: string[];
};

const clients: Client[] = [
  {
    id: "meridian",
    name: "The Meridian Society",
    location: "Ottawa, ON",
    buildType: "Knowledge Q&A Agent",
    lede: "An Ottawa member society with a busy community forum.",
    description:
      "Tharros built and integrated a Q&A agent that answers member questions from the live forum. Live and on call for tuning and new agents.",
    url: "https://meridiansociety.ca",
    date: "May 2026",
    logo: "/meridian-logo.webp",
    tags: ["Modernized Site", "Integrated Agent", "On-Call Support"],
  },
  {
    id: "advanta365",
    name: "ADVANTA365",
    location: "Ottawa, ON",
    buildType: "Marketing Site Build",
    lede: "An enterprise Microsoft 365 adoption and governance practice.",
    description:
      "Tharros built and shipped their marketing site, with ongoing on-call support.",
    url: "https://advanta365.com",
    date: "May 2026",
    logo: "/advanta365-logo.svg",
    tags: ["Modernized Site", "On-Call Support"],
  },
  {
    id: "echo-five",
    name: "Echo Five Consulting",
    location: "Ottawa, ON",
    buildType: "Positioning Site Build",
    lede: "A public-sector change-management consultancy in Ottawa.",
    description:
      "Tharros built and shipped their consulting site, with ongoing on-call support.",
    url: "https://echo-five-website.vercel.app",
    date: "May 2026",
    logo: "/echo-five-logo.svg",
    tags: ["Modernized Site", "On-Call Support"],
  },
];

const placeholders = [
  { id: "p-01", note: "Engagement in build", stage: "Drafting" },
];

export default function ClientsSection() {
  return (
    <>
      <ClientsHero />
      <ClientsGallery />
    </>
  );
}

function ClientsHero() {
  return (
    <section className="bg-[color:var(--surface)] pt-28 md:pt-32 pb-12 md:pb-16">
      <div className="page-frame">
        <SectionEyebrow numeral="§ CL" label="Clients" />

        <div className="grid grid-cols-12 gap-x-6 gap-y-8 border-b border-[color:var(--rule)] pb-12 md:pb-16">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h1 className="type-display-1 max-w-[16ch]">
              Real-world <span className="text-[color:var(--accent)]">impact.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:self-end lg:pb-2">
            <p className="type-lead">
              Live Tharros builds for Ottawa businesses. Modern site, embedded agent, and a number
              they can call when things change.
            </p>
            <dl className="meta-row mt-8 pt-6 border-t border-[color:var(--rule)]">
              <div><dt>Records</dt> <dd className="num">{String(clients.length).padStart(2, "0")}</dd></div>
              <div><dt>In build</dt> <dd className="num">{String(placeholders.length).padStart(2, "0")}</dd></div>
              <div><dt>Region</dt> <dd>Ottawa, ON</dd></div>
            </dl>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

function ClientsGallery() {
  return (
    <section className="bg-[color:var(--surface)] pt-12 md:pt-16 pb-20 md:pb-32">
      <div className="page-frame">
        {/* sm: 2 cols, xl: 3 cols — add lg:grid-cols-3 when 6+ live clients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client, i) => (
            <ClientCard key={client.id} client={client} index={i} />
          ))}
          {placeholders.map((p, i) => (
            <PlaceholderCard key={p.id} index={clients.length + i} note={p.note} stage={p.stage} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientCard({ client, index }: { client: Client; index: number }) {
  return (
    <AnimatedSection delay={index * 0.06} className="h-full">
      <article className="h-full flex flex-col border border-[color:var(--rule)] hover:border-[color:var(--accent)] transition-colors duration-200 p-6 md:p-7">

        {/* ── Top bar: index + live status ── */}
        <div className="flex items-center justify-between mb-7">
          <span className="num text-[11px] text-[color:var(--ink-muted)]">
            FILE / {String(index + 1).padStart(3, "0")}
          </span>
          <span className="num text-[11px] text-[color:var(--accent)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
            LIVE
          </span>
        </div>

        {/* ── Logo / monogram ── */}
        <div className="mb-5">
          {client.logo ? (
            <div className="relative w-9 h-9 border border-[color:var(--rule)]">
              <Image src={client.logo} alt={client.name} fill className="object-contain p-1.5" />
            </div>
          ) : (
            <div className="w-9 h-9 bg-[color:var(--ink)] flex items-center justify-center">
              <span className="num text-[11px] text-[color:var(--ink-on-dark)]">
                {client.monogram ?? client.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* ── Name + location ── */}
        <h2 className="type-display-3 mb-1">{client.name}</h2>
        <p className="num text-[11px] text-[color:var(--ink-muted)] mb-5 tracking-widest uppercase">
          {client.location}
        </p>

        {/* ── Lede — flex-1 keeps footer flush to bottom across all cards in a row ── */}
        <p className="type-body text-[color:var(--ink-muted)] flex-1 mb-6">
          {client.lede}
        </p>

        {/* ── Tags ── */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
          {client.tags.map((t) => (
            <span key={t} className="num text-[10px] text-[color:var(--ink-muted)] uppercase tracking-widest">
              {t}
            </span>
          ))}
        </div>

        {/* ── Footer: build meta + visit link ── */}
        <div className="border-t border-[color:var(--rule)] pt-4 flex items-end justify-between gap-4">
          <div>
            <p className="num text-[11px] text-[color:var(--ink-muted)] uppercase leading-snug">
              {client.buildType}
            </p>
            <p className="num text-[10px] text-[color:var(--ink-muted)] mt-0.5">
              {client.date.toUpperCase()}
            </p>
          </div>
          <a
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="num text-[11px] text-[color:var(--accent)] flex items-center gap-1.5 shrink-0 hover:underline"
            aria-label={`Visit ${client.name}`}
          >
            Visit
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 8L8 2M4 2h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
            </svg>
          </a>
        </div>

      </article>
    </AnimatedSection>
  );
}

function PlaceholderCard({ index, note, stage }: { index: number; note: string; stage: string }) {
  return (
    <AnimatedSection delay={index * 0.06} className="h-full">
      <article className="h-full flex flex-col border border-dashed border-[color:var(--rule-strong)] p-6 md:p-7">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-7">
          <span className="num text-[11px] text-[color:var(--ink-muted)]">
            FILE / {String(index + 1).padStart(3, "0")}
          </span>
          <span className="num text-[11px] text-[color:var(--ink-muted)]">
            {stage.toUpperCase()}
          </span>
        </div>

        {/* ── Schematic mark in logo slot ── */}
        <div className="mb-5 w-9 h-9">
          <svg viewBox="0 0 36 36" className="diagram w-full h-full opacity-30" aria-hidden="true">
            <rect x="1.5" y="1.5" width="33" height="33" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2.5" fill="none" />
            <line x1="10" y1="10" x2="26" y2="26" stroke="currentColor" strokeWidth="0.8" />
            <line x1="26" y1="10" x2="10" y2="26" stroke="currentColor" strokeWidth="0.8" />
          </svg>
        </div>

        {/* ── Title + location ── */}
        <h2 className="type-display-3 text-[color:var(--ink-muted)] mb-1">New engagement.</h2>
        <p className="num text-[11px] text-[color:var(--ink-muted)] mb-5 tracking-widest uppercase opacity-60">
          Ottawa, ON
        </p>

        {/* ── Note ── */}
        <p className="type-body text-[color:var(--ink-muted)] opacity-60 flex-1 mb-6">
          {note}. A new build with an Ottawa partner is underway — details land here at launch.
        </p>

        {/* ── Footer placeholder ── */}
        <div className="border-t border-dashed border-[color:var(--rule-strong)] pt-4">
          <p className="num text-[10px] text-[color:var(--ink-muted)] opacity-50 uppercase tracking-widest">
            In progress
          </p>
        </div>

      </article>
    </AnimatedSection>
  );
}
