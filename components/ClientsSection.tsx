"use client";

import { motion } from "motion/react";
import Image from "next/image";
import AnimatedSection from "./AnimatedSection";

const clients = [
  {
    id: "meridian",
    name: "The Meridian Society",
    location: "Ottawa, ON",
    type: "Knowledge Q&A Agent",
    description: "Built and integrated a Knowledge Q&A Agent into the Meridian Society site for 24/7 member insights and forum automation. Live and running, with Tharros on call for tuning and new agents.",
    link: "https://meridiansociety.ca",
    date: "MAY 2026",
    image: "/meridian-logo.png",
    gridPos: "lg:col-span-1",
    tags: ["Modernized Site", "Integrated Agent", "On-Call Support"]
  },
  {
    id: "advanta365",
    name: "ADVANTA365",
    location: "Ottawa, ON",
    type: "Full Site Build",
    description: "Built and shipped the ADVANTA365 marketing site for their enterprise Microsoft 365 adoption, governance, and rollout practice. Tharros stays on call for ongoing fixes and updates.",
    link: "https://advanta365.com",
    date: "MAY 2026",
    gridPos: "lg:col-span-1",
    tags: ["Modernized Site", "On-Call Support"]
  },
  {
    id: "echo-five",
    name: "Echo Five Consulting",
    location: "Ottawa, ON",
    type: "Full Site Build",
    description: "Built and shipped the Echo Five Consulting site for their public-sector Microsoft 365 change-management practice. Tharros stays on call for ongoing fixes and updates.",
    link: "https://echo-five-website.vercel.app",
    date: "MAY 2026",
    gridPos: "lg:col-span-1",
    tags: ["Modernized Site", "On-Call Support"]
  }
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
    <section className="pt-28 md:pt-12 pb-8 md:pb-12 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-bg content-visibility-auto">
      {/* Subtle Background Grid */}
      <div className="industrial-grid absolute inset-0 opacity-[0.05] pointer-events-none gpu-accelerated" />
      
      {/* Background Depth Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-3/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none gpu-accelerated" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/30 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none gpu-accelerated" />

      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-12 border-b border-white/5 pb-8 md:pb-12">
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="text-[9px] md:text-[10px] font-bold text-accent-3 tracking-[0.3em] uppercase">Trusted Partnerships</span>
                <div className="h-px w-8 md:w-12 bg-white/10" />
                <span className="text-[9px] md:text-[10px] font-bold text-muted tracking-widest uppercase">Ottawa, Canada</span>
              </div>
              <h1 className="text-[3rem] leading-[0.95] sm:text-7xl md:text-8xl lg:text-[10rem] font-bold text-white mb-0 tracking-[-0.06em] sm:leading-[0.9] md:leading-[0.8]">
                Real-World <br/>
                <span className="text-slate-500/70">Impact.</span>
              </h1>
            </div>
            
            <div className="max-w-xl lg:text-right lg:pb-4 flex flex-col lg:items-end gap-10 lg:gap-12">
              {/* Abstract Visual Anchor: Operational Network */}
              <div className="w-full h-32 md:h-48 relative mt-8 lg:mt-12 mb-2 lg:mb-4 opacity-70 group select-none pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                  {/* Background Grid Points */}
                  {[...Array(4)].map((_, i) => (
                    <circle key={`p-${i}`} cx={350 - (i * 80)} cy={75 + (Math.sin(i) * 30)} r="1.5" fill="currentColor" className="text-white/30" />
                  ))}
                  
                  {/* Connecting Lines */}
                  <path d="M100 80 L180 50 L260 90 L340 60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-accent-3/50" />
                  
                  {/* Main Focal Circles */}
                  <circle cx="340" cy="60" r="40" stroke="currentColor" strokeWidth="1" className="text-accent-3/30" />
                  <circle cx="340" cy="60" r="25" stroke="currentColor" strokeWidth="0.5" className="text-accent-3/20" />
                  <motion.circle 
                    cx="340" cy="60" r="4" 
                    fill="currentColor" className="text-accent-3" 
                    animate={{ r: [4, 6, 4], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Secondary Points */}
                  <circle cx="180" cy="50" r="15" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                  <circle cx="180" cy="50" r="2.5" fill="currentColor" className="text-white/60" />
                  
                  <circle cx="260" cy="90" r="12" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                  <circle cx="260" cy="90" r="2.5" fill="currentColor" className="text-white/60" />
                  
                  {/* Subtle 'Signal' waves */}
                  <motion.circle 
                    cx="340" cy="60" r="60" 
                    stroke="currentColor" strokeWidth="1" 
                    className="text-accent-3/10"
                    animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
                  />
                </svg>
              </div>

              <div className="flex flex-col lg:items-end">
                <span className="text-[9px] md:text-[10px] font-bold text-accent-3 uppercase tracking-[0.4em] mb-4 md:mb-6">Strategic Overview</span>
                <p className="text-subdued text-lg md:text-2xl lg:text-3xl leading-relaxed font-medium tracking-tight">
                  Keep it Local, Keep it Canadian. Tharros builds and integrates AI agents into Ottawa small business sites, then stays on call to keep them running.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ClientsGallery() {
  return (
    <section className="py-12 md:py-20 xl:py-28 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <span className="text-[10px] md:text-[11px] font-black text-slate-900 tracking-[0.4em] uppercase">Case Files</span>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] md:text-[11px] font-bold text-slate-500 tracking-[0.3em] uppercase tabular-nums">{String(clients.length).padStart(2, "0")} Records</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 auto-rows-[minmax(320px,auto)]">
          {clients.map((client, idx) => (
            <ClientCard key={client.id} client={client} index={idx} fileNumber={String(idx + 1).padStart(3, "0")} isPriority={idx === 0} />
          ))}
          <PlaceholderCard index={clients.length} fileNumber={String(clients.length + 1).padStart(3, "0")} gridPos="lg:col-span-1" />
        </div>
      </div>
    </section>
  );
}

function ClientCard({ client, index, fileNumber, isPriority }: { client: any, index: number, fileNumber: string, isPriority?: boolean }) {
  return (
    <AnimatedSection variant="scale-in" delay={index * 0.1} className={`${client.gridPos} h-full`}>
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="group relative h-full bg-slate-950 border border-slate-800 hover:border-accent-3/50 rounded-xl overflow-hidden transition-colors duration-500 flex flex-col shadow-[0_30px_80px_-30px_rgba(2,6,23,0.6)] gpu-accelerated"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent-3 via-accent-3/40 to-transparent" />
        <div className="absolute inset-0 industrial-grid opacity-[0.04] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-accent-3/[0.06] blur-[100px] rounded-full pointer-events-none gpu-accelerated" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Classification strip */}
          <div className="flex items-center justify-between gap-3 px-5 sm:px-7 md:px-9 py-3.5 border-b border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <span className="text-[9px] md:text-[10px] font-black text-accent-3 uppercase tracking-[0.3em] tabular-nums">FILE / {fileNumber}</span>
              <span className="h-3 w-px bg-slate-700" />
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">{client.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <motion.span
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-accent-3"
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-3" />
              </span>
              <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.25em]">Live</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-grow flex flex-col gap-6 px-5 sm:px-7 md:px-9 py-7 md:py-10">
            {/* Identity */}
            <div className="flex flex-col gap-5 pb-5 border-b border-slate-800/80">
              <div className="flex items-center gap-4">
                {client.image && (
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 relative rounded-lg overflow-hidden bg-white border border-slate-800 group-hover:border-accent-3/40 transition-colors">
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      priority={isPriority}
                      className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Client</span>
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">{client.location}</span>
                </div>
              </div>

              <h3 className="font-bold text-white tracking-tighter leading-[0.95] text-3xl sm:text-4xl md:text-4xl group-hover:text-accent-3 transition-colors duration-300 break-words">
                {client.name}
              </h3>

              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Build Type</span>
                <span className="text-sm md:text-base font-semibold text-white tracking-tight">{client.type}</span>
              </div>
            </div>

            {/* Right narrative column */}
            <div className="flex-1 flex flex-col gap-5">
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Engagement Notes</span>
              <p className="text-slate-200 leading-relaxed text-base md:text-lg font-light max-w-2xl">
                {client.description}
              </p>

              {/* Status pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {client.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer rail */}
          <div className="border-t border-slate-800 bg-slate-900/40 px-5 sm:px-7 md:px-9 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-3">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span>Live &amp; On-Call</span>
            </div>

            <a
              href={client.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 hover:bg-accent-3 hover:text-white active:bg-accent-3 active:text-white transition-colors text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] min-h-[40px]"
            >
              View Project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}


function PlaceholderCard({ index, fileNumber, gridPos }: { index: number, fileNumber: string, gridPos: string }) {
  return (
    <AnimatedSection variant="scale-in" delay={index * 0.1} className={`${gridPos} h-full`}>
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="group relative h-full bg-slate-950 border border-dashed border-slate-800 hover:border-accent-3/40 rounded-xl overflow-hidden flex flex-col transition-colors duration-500 gpu-accelerated shadow-[0_30px_80px_-30px_rgba(2,6,23,0.4)]"
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-slate-700 via-slate-800 to-transparent" />
        <div className="absolute inset-0 industrial-grid opacity-[0.04] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.08)_0%,transparent_60%)]" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Classification strip */}
          <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-3.5 border-b border-dashed border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] tabular-nums">FILE / {fileNumber}</span>
              <span className="h-3 w-px bg-slate-700" />
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">Drafting</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex h-1.5 w-1.5 rounded-full bg-accent-3/60"
              />
              <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Pending</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-grow flex flex-col justify-center px-5 sm:px-7 py-8 md:py-10 text-center items-center gap-5">
            <div className="relative w-14 h-14 rounded-lg border border-slate-800 flex items-center justify-center bg-slate-900/40 overflow-hidden">
              <motion.div
                animate={{ y: [-56, 56] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-px bg-accent-3/70 shadow-[0_0_8px_2px_rgba(14,165,233,0.5)]"
              />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 group-hover:text-accent-3 transition-colors relative z-10">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
              </svg>
            </div>

            <div className="flex flex-col gap-2 max-w-[260px]">
              <span className="text-[9px] md:text-[10px] font-black text-accent-3 uppercase tracking-[0.3em]">New Engagement</span>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
                New Client in Progress
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                We are currently preparing a new success story with an Ottawa commercial partner.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[220px] mt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                <span>Progress</span>
                <span className="tabular-nums">In Build</span>
              </div>
              <div className="relative h-[3px] w-full bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-accent-3 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Footer rail */}
          <div className="border-t border-dashed border-slate-800 bg-slate-900/40 px-5 sm:px-7 py-4 flex items-center justify-between gap-2">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Awaiting Launch</span>
            <div className="flex gap-1.5">
              {[1,2,3].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                  className="w-1 h-1 rounded-full bg-accent-3/70"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}
