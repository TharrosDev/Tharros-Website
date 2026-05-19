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
    description:
      "Built the Meridian Society's member-facing knowledge agent — a 24/7 Q&A layer that reads the live forum and resource library so members get answers without waiting on a moderator. Tharros stays on call to tune answers and ship new agents as the community grows.",
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
    description:
      "Shipped the ADVANTA365 marketing site for their enterprise Microsoft 365 practice — packaging SharePoint, Teams, and OneDrive rollout work as a single governance product, with a clean route from positioning to a discovery call.",
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
    description:
      "Built the Echo Five site around their public-sector change-management voice — \"Change that lands. Tools that get used.\" A tight funnel that takes government teams from problem statement to booked call, with copy and structure tuned for the buying cycle they actually run.",
    link: "https://echo-five-website.vercel.app",
    date: "MAY 2026",
    size: "md",
    monogram: "E5",
    tags: ["Modernized Site", "On-Call Support"],
  },
];

const sizeConfig: Record<Size, { gridPos: string; title: string; logoBox: string; pad: string; descSize: string }> = {
  lg: {
    gridPos: "md:col-span-2 lg:col-span-4",
    title: "text-3xl sm:text-4xl md:text-5xl",
    logoBox: "w-16 h-16 md:w-20 md:h-20",
    pad: "p-7 md:p-9",
    descSize: "text-base md:text-lg",
  },
  md: {
    gridPos: "md:col-span-1 lg:col-span-3",
    title: "text-2xl sm:text-3xl",
    logoBox: "w-14 h-14",
    pad: "p-6 md:p-8",
    descSize: "text-sm md:text-base",
  },
  sm: {
    gridPos: "md:col-span-1 lg:col-span-2",
    title: "text-2xl",
    logoBox: "w-12 h-12",
    pad: "p-6",
    descSize: "text-sm",
  },
};

export default function ClientsSection() {
  return <ClientsGallery />;
}

function ClientsGallery() {
  return (
    <section className="pt-28 md:pt-32 xl:pt-40 pb-12 md:pb-20 xl:pb-28 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white">
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
    <div className={`${className} shrink-0 relative rounded-xl overflow-hidden bg-slate-800/60 flex items-center justify-center`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.2)_0%,transparent_70%)]" />
      <span className="relative font-semibold text-white tracking-tight text-base md:text-lg">{text}</span>
    </div>
  );
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
              <h2 className={`${cfg.title} font-bold text-white tracking-tight leading-[1.05] break-words`}>
                {client.name}
              </h2>
              <p className="text-sm text-slate-400 font-medium">
                {client.location} <span className="text-slate-600">·</span> {client.type}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className={`text-slate-300 leading-relaxed ${cfg.descSize} font-light`}>
            {client.description}
          </p>

          {/* Metrics (featured only) */}
          {client.metrics && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-200 font-medium">
              {client.metrics.map((m, i) => (
                <span key={m} className="flex items-center gap-2">
                  {i > 0 && <span className="text-slate-600">·</span>}
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
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] font-medium text-slate-300"
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
        className="group relative h-full bg-slate-900/40 border border-dashed border-white/10 hover:border-accent-3/30 rounded-2xl overflow-hidden flex flex-col transition-colors duration-300 p-7 md:p-9"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full items-center justify-center text-center gap-5">
          <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center bg-slate-900/60">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-slate-400 group-hover:text-accent-3 transition-colors">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <div className="flex flex-col gap-2 max-w-[300px]">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
              Your business, here.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
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
