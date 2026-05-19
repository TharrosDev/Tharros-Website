"use client";

import { motion } from "motion/react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

type Size = "lg" | "md" | "sm";

type Client = {
  id: string;
  name: string;
  location: string;
  type: string;
  lede: string;
  description: string;
  link: string;
  date: string;
  size: Size;
  tags: string[];
  image?: string;
  monogram?: string;
  metrics?: string[];
};

const clients: Client[] = [
  {
    id: "meridian",
    name: "The Meridian Society",
    location: "Ottawa, ON",
    type: "Knowledge Q&A Agent",
    lede: "An Ottawa member society with a busy community forum.",
    description:
      "Tharros built a knowledge agent that reads the forum live so members get instant answers.",
    link: "https://meridiansociety.ca",
    date: "MAY 2026",
    image: "/meridian-logo.webp",
    size: "lg",
    tags: ["Modernized Site", "Integrated Agent", "On-Call Support"],
    metrics: ["24/7 coverage", "Live forum sync", "Tuned weekly"],
  },
  {
    id: "advanta365",
    name: "ADVANTA365",
    location: "Ottawa, ON",
    type: "Marketing Site Build",
    lede: "An enterprise Microsoft 365 adoption and governance practice.",
    description:
      "Tharros built and shipped their marketing site, and stays on call for updates.",
    link: "https://advanta365.com",
    date: "MAY 2026",
    size: "sm",
    monogram: "A3",
    tags: ["Modernized Site", "On-Call Support"],
  },
  {
    id: "echo-five",
    name: "Echo Five Consulting",
    location: "Ottawa, ON",
    type: "Positioning Site Build",
    lede: "A public-sector change-management consultancy in Ottawa.",
    description:
      "Tharros built their positioning site and the funnel from problem statement to booked call.",
    link: "https://echo-five-website.vercel.app",
    date: "MAY 2026",
    size: "md",
    monogram: "E5",
    tags: ["Modernized Site", "On-Call Support"],
  },
];

const sizeConfig: Record<Size, { gridPos: string; title: string; lede: string; logoBox: string; pad: string; descSize: string }> = {
  lg: {
    gridPos: "md:col-span-2 lg:col-span-4",
    title: "text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]",
    lede: "text-xl md:text-2xl",
    logoBox: "w-16 h-16 md:w-20 md:h-20",
    pad: "p-7 md:p-9",
    descSize: "text-sm md:text-base",
  },
  md: {
    gridPos: "md:col-span-1 lg:col-span-3",
    title: "text-2xl sm:text-3xl",
    lede: "text-base md:text-lg",
    logoBox: "w-14 h-14",
    pad: "p-6 md:p-8",
    descSize: "text-sm",
  },
  sm: {
    gridPos: "md:col-span-1 lg:col-span-2",
    title: "text-2xl",
    lede: "text-sm md:text-base",
    logoBox: "w-12 h-12",
    pad: "p-6",
    descSize: "text-xs md:text-sm",
  },
};

export default function ClientsSection() {
  return <ClientsGallery />;
}

function ClientsGallery() {
  return (
    <section className="pt-28 md:pt-32 xl:pt-40 pb-12 md:pb-20 xl:pb-28 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 md:gap-6 auto-rows-[minmax(300px,auto)]">
          {clients.map((client, idx) => (
            <ClientCard
              key={client.id}
              client={client}
              index={idx}
              isPriority={idx === 0}
            />
          ))}
          <PlaceholderCard index={clients.length} gridPos="md:col-span-2 lg:col-span-3" />
        </div>
      </div>
    </section>
  );
}

function Monogram({ text, className }: { text: string; className: string }) {
  return (
    <div className={`${className} shrink-0 relative rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.25)_0%,transparent_70%)]" />
      <span className="relative font-bold text-white tracking-tight text-base md:text-lg">{text}</span>
    </div>
  );
}

function CardSignature({ id }: { id: string }) {
  const wrap = "pointer-events-none absolute top-0 right-0 w-[200px] h-[110px] md:w-[260px] md:h-[130px] text-accent-3";

  if (id === "meridian") {
    // Sonar rings — knowledge agent listening across the forum
    return (
      <svg className={wrap} viewBox="0 0 260 130" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="meridian-fade" cx="80%" cy="20%" r="70%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <mask id="meridian-mask">
            <rect width="260" height="130" fill="url(#meridian-fade)" />
          </mask>
        </defs>
        <g stroke="currentColor" strokeWidth="1" fill="none" mask="url(#meridian-mask)">
          <circle cx="208" cy="26" r="16" />
          <circle cx="208" cy="26" r="32" />
          <circle cx="208" cy="26" r="50" />
          <circle cx="208" cy="26" r="70" />
          <circle cx="208" cy="26" r="92" />
        </g>
        <circle cx="208" cy="26" r="2.5" fill="currentColor" opacity="0.65" />
      </svg>
    );
  }

  if (id === "advanta365") {
    // Governance grid — structured dot matrix
    const cols = 13;
    const rows = 6;
    const dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = 30 + c * 17;
        const cy = 14 + r * 16;
        const dist = Math.hypot(c - cols + 2, r);
        const op = Math.max(0, 0.4 - dist * 0.05);
        dots.push(<circle key={`${r}-${c}`} cx={cx} cy={cy} r="1.1" fill="currentColor" opacity={op} />);
      }
    }
    return (
      <svg className={wrap} viewBox="0 0 260 130" fill="none" aria-hidden="true">
        {dots}
      </svg>
    );
  }

  if (id === "echo-five") {
    // Waveform — signal / echo
    return (
      <svg className={wrap} viewBox="0 0 260 130" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="echo-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <g stroke="url(#echo-fade)" strokeWidth="1" fill="none">
          <path d="M0 38 Q 32 18, 65 38 T 130 38 T 195 38 T 260 38" />
          <path d="M0 56 Q 32 40, 65 56 T 130 56 T 195 56 T 260 56" opacity="0.7" />
          <path d="M0 74 Q 32 60, 65 74 T 130 74 T 195 74 T 260 74" opacity="0.4" />
        </g>
      </svg>
    );
  }

  return null;
}

function ClientCard({ client, index, isPriority }: { client: Client; index: number; isPriority?: boolean }) {
  const cfg = sizeConfig[client.size];

  return (
    <AnimatedSection variant="scale-in" delay={index * 0.08} className={`${cfg.gridPos} h-full`}>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        className={`group relative h-full bg-slate-900 hover:bg-slate-900/90 border border-white/[0.06] hover:border-accent-3/30 rounded-2xl overflow-hidden transition-colors duration-300 flex flex-col shadow-[0_20px_60px_-25px_rgba(2,6,23,0.5)] gpu-accelerated ${cfg.pad}`}
      >
        <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-accent-3/[0.05] blur-[100px] rounded-full pointer-events-none" />
        <CardSignature id={client.id} />

        <div className="relative z-10 flex flex-col h-full gap-5 md:gap-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            {client.image ? (
              <div className={`${cfg.logoBox} shrink-0 relative rounded-xl overflow-hidden bg-white`}>
                <Image
                  src={client.image}
                  alt={client.name}
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  priority={isPriority}
                  className="object-contain p-2"
                />
              </div>
            ) : client.monogram ? (
              <Monogram text={client.monogram} className={cfg.logoBox} />
            ) : null}
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className={`${cfg.title} font-bold text-white tracking-[-0.02em] leading-[1.02] break-words`}>
                {client.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-normal tracking-wide">
                {client.location} <span className="text-slate-600">·</span> {client.type}
              </p>
            </div>
          </div>

          {/* Lede + body */}
          <div className="flex flex-col gap-2.5">
            <p className={`text-white font-medium leading-snug tracking-tight ${cfg.lede}`}>
              {client.lede}
            </p>
            <p className={`text-slate-300 leading-relaxed ${cfg.descSize} font-normal`}>
              {client.description}
            </p>
          </div>

          {/* Metrics (featured only) */}
          {client.metrics && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-100 font-medium">
              {client.metrics.map((m) => (
                <span key={m} className="flex items-center gap-2">
                  <span className="text-accent-3 text-xs">●</span>
                  {m}
                </span>
              ))}
            </div>
          )}

          {/* Tags + visit */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-2">
            <div className="flex flex-wrap gap-1.5">
              {client.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-white/[0.08] border border-white/5 text-[11px] font-semibold text-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={client.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-accent-3 transition-colors"
            >
              Visit site
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

function PlaceholderCard({ index, gridPos }: { index: number; gridPos: string }) {
  return (
    <AnimatedSection variant="scale-in" delay={index * 0.08} className={`${gridPos} h-full`}>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        className="group relative h-full bg-slate-900 border border-dashed border-white/15 hover:border-accent-3/40 rounded-2xl overflow-hidden flex flex-col transition-colors duration-300 p-7 md:p-9"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full items-center justify-center text-center gap-5">
          <div className="w-14 h-14 rounded-xl border border-white/15 flex items-center justify-center bg-slate-800">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-slate-300 group-hover:text-accent-3 transition-colors">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <div className="flex flex-col gap-2 max-w-[300px]">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
              Your business, here.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tharros is taking on new Ottawa clients. If you want your site featured next, get in touch.
            </p>
          </div>

          <div className="w-full max-w-[220px] mt-1">
            <div className="relative h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-accent-3 to-transparent"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
