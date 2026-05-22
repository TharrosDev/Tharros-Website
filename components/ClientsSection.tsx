"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

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
  // Live screenshot via thum.io (free, no key).
  screenshot: string;
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
    screenshot: "https://image.thum.io/get/width/1600/crop/1000/png/https://meridiansociety.ca",
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
    monogram: "A3",
    tags: ["Modernized Site", "On-Call Support"],
    screenshot: "https://image.thum.io/get/width/1600/crop/1000/png/https://advanta365.com",
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
    screenshot: "https://image.thum.io/get/width/1600/crop/1000/png/https://echo-five-website.vercel.app",
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
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-[11px] text-[color:var(--ink-faint)]">§ CL</span>
            <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
            <span className="type-meta-strong">Clients</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-12 gap-x-6 gap-y-8 border-b border-[color:var(--rule)] pb-12 md:pb-16">
          <AnimatedSection className="col-span-12 lg:col-span-8">
            <h1 className="type-display-1 max-w-[16ch]">
              Real-world <span className="text-[color:var(--accent)]">impact.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="col-span-12 lg:col-span-4 lg:pt-4">
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
    <section className="bg-[color:var(--surface)] pb-20 md:pb-32">
      <div className="page-frame">
        {clients.map((client, i) => (
          <ClientRow key={client.id} client={client} index={i} />
        ))}
        {placeholders.map((p, i) => (
          <PlaceholderRow key={p.id} index={clients.length + i} note={p.note} stage={p.stage} />
        ))}
      </div>
    </section>
  );
}

function ClientRow({ client, index }: { client: Client; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <AnimatedSection delay={index * 0.08}>
      <article className="grid grid-cols-12 gap-x-6 gap-y-8 py-16 md:py-24 border-b border-[color:var(--rule)]">
        {/* Screenshot — large, dominant */}
        <div className={`col-span-12 lg:col-span-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
          <a
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative aspect-[16/10] overflow-hidden bg-[color:var(--surface-elevated)] border border-[color:var(--rule)] hover:border-[color:var(--accent)] transition-colors"
            aria-label={`Visit ${client.name}`}
          >
            <ClientPreview src={client.screenshot} alt={`${client.name}: live site preview`} fallbackUrl={client.url} />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[color:var(--surface-dark)]/85 to-transparent p-5 md:p-7 flex items-end justify-between gap-4">
              <span className="num text-[10px] text-[color:var(--ink-on-dark)]">
                {client.url.replace(/^https?:\/\//, "").toUpperCase()}
              </span>
              <span className="num text-[10px] text-[color:var(--accent-on-dark)] flex items-center gap-2">
                Visit
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M2 8L8 2M4 2h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
                </svg>
              </span>
            </div>
          </a>
        </div>

        {/* Metadata column */}
        <div className={`col-span-12 lg:col-span-4 flex flex-col ${isEven ? "lg:order-2" : "lg:order-1"}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="num text-xs text-[color:var(--ink-muted)]">FILE / {String(index + 1).padStart(3, "0")}</span>
            <span className="h-px w-6 bg-[color:var(--rule-strong)]" />
            <span className="num text-xs text-[color:var(--accent)] flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
              Live
            </span>
          </div>

          <h2 className="type-display-3 mb-2">{client.name}</h2>
          <span className="type-meta mb-5">{client.location}</span>

          <p className="type-body text-[color:var(--ink)] mb-3 max-w-[44ch] font-medium">{client.lede}</p>
          <p className="type-body text-[color:var(--ink-muted)] mb-8 max-w-[44ch]">{client.description}</p>

          <dl className="meta-row border-t border-[color:var(--rule)] pt-5 flex-col md:flex-row">
            <div><dt>Build</dt> <dd>{client.buildType}</dd></div>
            <div><dt>Launched</dt> <dd>{client.date.toUpperCase()}</dd></div>
          </dl>

          <div className="mt-6 pt-5 border-t border-[color:var(--rule)] flex items-center gap-3">
            {client.logo ? (
              <div className="relative w-10 h-10 bg-[color:var(--surface-elevated)] border border-[color:var(--rule)]">
                <Image src={client.logo} alt={client.name} fill className="object-contain p-1.5" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-[color:var(--ink)] text-[color:var(--ink-on-dark)] border border-[color:var(--ink)] flex items-center justify-center">
                <span className="num text-xs">{client.monogram ?? client.name.slice(0, 2)}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {client.tags.map((t) => (
                <span key={t} className="num text-[10px] text-[color:var(--ink-muted)]">{t.toUpperCase()}</span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </AnimatedSection>
  );
}

function ClientPreview({ src, alt, fallbackUrl }: { src: string; alt: string; fallbackUrl: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--surface-elevated)]">
        <svg viewBox="0 0 240 150" className="diagram w-1/2 max-w-[200px] opacity-60" aria-hidden="true">
          <rect x="20" y="20" width="200" height="110" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="20" y1="50" x2="220" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <text x="34" y="78" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.7">
            PREVIEW UNAVAILABLE
          </text>
          <text x="34" y="94" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.55">
            {fallbackUrl.replace(/^https?:\/\//, "").toUpperCase().slice(0, 28)}
          </text>
        </svg>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

function PlaceholderRow({ index, note, stage }: { index: number; note: string; stage: string }) {
  return (
    <AnimatedSection delay={index * 0.08}>
      <article className="grid grid-cols-12 gap-x-6 gap-y-6 py-16 md:py-20 border-b border-[color:var(--rule)]">
        <div className="col-span-12 lg:col-span-8">
          <div className="aspect-[16/10] border border-dashed border-[color:var(--rule-strong)] flex items-center justify-center bg-[color:var(--surface-elevated)] relative overflow-hidden">
            <svg viewBox="0 0 240 150" className="diagram w-1/2 max-w-[200px] opacity-50" aria-hidden="true">
              <rect x="20" y="20" width="200" height="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <line x1="20" y1="50" x2="220" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <line x1="50" y1="20" x2="50" y2="130" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <text x="60" y="75" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.6">CASE FILE</text>
              <text x="60" y="92" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.4" fill="currentColor" opacity="0.6">IN PROGRESS</text>
            </svg>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="num text-xs text-[color:var(--ink-muted)]">FILE / {String(index + 1).padStart(3, "0")}</span>
            <span className="h-px w-6 bg-[color:var(--rule-strong)]" />
            <span className="num text-xs text-[color:var(--ink-muted)]">{stage}</span>
          </div>
          <h2 className="type-display-3 text-[color:var(--ink-muted)] mb-3">New engagement.</h2>
          <p className="type-body text-[color:var(--ink-muted)] max-w-[44ch]">
            {note}. We are currently preparing a new build with an Ottawa partner. Updates land here when the site launches.
          </p>
        </div>
      </article>
    </AnimatedSection>
  );
}
