"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import AnimatedSection from "./AnimatedSection";
import SectionEyebrow from "./SectionEyebrow";
import SplitReveal from "./SplitReveal";

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
  { id: "p-01", stage: "Drafting" },
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
          <SplitReveal as="h1" className="type-display-1 max-w-[16ch] col-span-12 lg:col-span-8">
            Real-world <span className="accent-text">impact.</span>
          </SplitReveal>
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

type Slide =
  | { kind: "client"; client: Client; index: number; key: string }
  | { kind: "placeholder"; stage: string; index: number; key: string };

function ClientsGallery() {
  const prefersReducedMotion = useReducedMotion();

  const base: Slide[] = [
    ...clients.map((c, i) => ({ kind: "client" as const, client: c, index: i, key: c.id })),
    ...placeholders.map((p, i) => ({
      kind: "placeholder" as const,
      stage: p.stage,
      index: clients.length + i,
      key: p.id,
    })),
  ];

  // Duplicate for seamless infinite loop — same trick as WorkReel
  const items: Slide[] = [
    ...base.map((s) => ({ ...s, key: `a-${s.key}` })),
    ...base.map((s) => ({ ...s, key: `b-${s.key}` })),
  ];

  return (
    <section className="bg-[color:var(--surface)] pt-12 md:pt-16 pb-20 md:pb-32 overflow-hidden">
      <div
        className="clients-track flex gap-6"
        style={{
          width: "max-content",
          animation: "clients-scroll 55s linear infinite",
          animationPlayState: prefersReducedMotion ? "paused" : "running",
        }}
      >
        {items.map((slide) =>
          slide.kind === "client" ? (
            <div key={slide.key} className="w-[340px] shrink-0">
              <ClientCard client={slide.client} index={slide.index} />
            </div>
          ) : (
            <div key={slide.key} className="w-[340px] shrink-0">
              <PlaceholderCard index={slide.index} stage={slide.stage} />
            </div>
          )
        )}
      </div>
    </section>
  );
}

function ClientCard({ client, index }: { client: Client; index: number }) {
  return (
    <a
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${client.name}`}
      className="group/card h-full flex flex-col border border-[color:var(--rule)] hover:border-[color:var(--accent)] transition-[border-color,transform] duration-200 ease-out hover:-translate-y-1 p-6 md:p-7 cursor-pointer"
    >

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
      <div className="mb-6">
        {client.logo ? (
          <div className="relative w-16 h-16 border border-[color:var(--rule)]">
            <Image src={client.logo} alt={client.name} fill sizes="64px" className="object-contain p-2" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-[color:var(--ink)] flex items-center justify-center">
            <span className="num text-[14px] text-[color:var(--ink-on-dark)]">
              {client.monogram ?? client.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* ── Name + location ── */}
      <h2 className="type-display-3 mb-1 break-words hyphens-auto">{client.name}</h2>
      <p className="num text-[11px] text-[color:var(--ink-muted)] mb-5 tracking-widest uppercase break-words">
        {client.location}
      </p>

      {/* ── Tags — mt-auto pushes footer flush ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6 mt-auto">
        {client.tags.map((t) => (
          <span key={t} className="num text-[10px] text-[color:var(--ink-muted)] uppercase tracking-widest">
            {t}
          </span>
        ))}
      </div>

      {/* ── Footer: build meta + visit link ── */}
      <div className="border-t border-[color:var(--rule)] pt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="num text-[11px] text-[color:var(--ink-muted)] uppercase leading-snug break-words">
            {client.buildType}
          </p>
          <p className="num text-[10px] text-[color:var(--ink-muted)] mt-0.5">
            {client.date.toUpperCase()}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="num text-[11px] text-[color:var(--accent)] flex items-center gap-1.5 shrink-0"
        >
          Visit
          <svg
            width="9"
            height="9"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 ease-out group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
          >
            <path d="M2 8L8 2M4 2h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
          </svg>
        </span>
      </div>

    </a>
  );
}

function PlaceholderCard({ index, stage }: { index: number; stage: string }) {
  const reduce = useReducedMotion();
  return (
    <article className="h-full flex flex-col bg-[color:var(--surface-dark)] p-6 md:p-7">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-5">
        <span className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">
          FILE / {String(index + 1).padStart(3, "0")}
        </span>
        <span className="num text-[11px] text-[color:var(--accent-on-dark)] flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent-on-dark)]"
            animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          {stage.toUpperCase()}
        </span>
      </div>

      {/* ── Red structural rule ── */}
      <div className="h-[3px] bg-[color:var(--red-bright)] mb-6" />

      {/* ── Heading + sub-line ── */}
      <h2 className="type-display-3 text-[color:var(--ink-on-dark)] mb-2">
        In the pipeline.
      </h2>
      <p className="num text-[11px] text-[color:var(--ink-on-dark-muted)] uppercase tracking-widest">
        New projects in build
      </p>

      <div className="flex-1" />

      {/* ── Footer ── */}
      <div className="border-t border-[color:var(--rule-on-dark)] pt-4 flex items-center justify-between">
        <p className="num text-[10px] text-[color:var(--ink-on-dark-faint)] uppercase tracking-widest">
          Ottawa, ON
        </p>
        <p className="num text-[10px] text-[color:var(--ink-on-dark-faint)] uppercase tracking-widest">
          2026
        </p>
      </div>

    </article>
  );
}
