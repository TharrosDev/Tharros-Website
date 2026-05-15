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
    gridPos: "lg:col-span-2 lg:row-span-2"
  },
  {
    id: "in-progress",
    isPlaceholder: true,
    gridPos: "lg:col-span-1 lg:row-span-2"
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
    <section className="py-10 md:py-16 xl:py-20 px-5 sm:px-6 md:px-12 xl:px-20 relative overflow-hidden bg-white industrial-grid">
      {/* Background decoration - Standard site-wide separators */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 auto-rows-[minmax(280px,auto)]">
          {clients.map((client, idx) => (
            client.isPlaceholder ? (
              <PlaceholderCard key={client.id} index={idx} gridPos={client.gridPos} />
            ) : (
              <ClientCard key={client.id} client={client} index={idx} isPriority={idx === 0} />
            )
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientCard({ client, index, isPriority }: { client: any, index: number, isPriority?: boolean }) {
  const isLarge = client.gridPos.includes("lg:col-span-2");
  
  return (
    <AnimatedSection variant="scale-in" delay={index * 0.1} className={`${client.gridPos} h-full`}>
      <motion.div 
        whileHover={{ y: -8, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="group relative h-full bg-bg border border-white/10 hover:border-accent-3/40 rounded-2xl sm:rounded-[2.5rem] overflow-hidden transition-all duration-500 flex flex-col shadow-2xl shadow-black/40 gpu-accelerated"
      >
        <div className="p-5 sm:p-7 md:p-10 flex flex-col h-full relative z-10">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-white/5 pb-4">
            <span className="text-[10px] font-bold text-accent-3 uppercase tracking-[0.2em]">{client.date}</span>
            <span className="text-[10px] text-slate-300 font-bold tracking-tight uppercase">{client.location}</span>
          </div>

          {/* Core Content */}
          <div className="flex-grow">
            <div className={`flex ${isLarge ? 'flex-col sm:flex-row sm:items-center' : 'flex-col'} gap-5 sm:gap-6 mb-5 sm:mb-6`}>
              {client.image && (
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative rounded-2xl overflow-hidden bg-bg border border-white/10 group-hover:border-accent-3/20 transition-colors">
                  <Image
                    src={client.image}
                    alt={client.name}
                    fill
                    priority={isPriority}
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">
                  {client.type}
                </span>
                <h3 className={`font-bold text-white tracking-tighter group-hover:text-accent-3 transition-colors duration-300 leading-tight ${isLarge ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : 'text-2xl sm:text-3xl'}`}>
                  {client.name}
                </h3>
              </div>
            </div>

            <p className={`text-slate-200 leading-relaxed mb-5 sm:mb-6 ${isLarge ? 'text-base sm:text-xl md:text-2xl max-w-2xl font-light' : 'text-base line-clamp-4'}`}>
              {client.description}
            </p>
          </div>

          {/* Simplified Footer */}
          <div className="pt-4 mt-auto relative flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Live & On-Call</span>

            <a
              href={client.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-bg active:bg-white active:text-bg transition-all text-white min-h-[40px] inline-flex items-center"
            >
               View Project
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

function PlaceholderCard({ index, gridPos }: { index: number, gridPos: string }) {
  return (
    <AnimatedSection variant="scale-in" delay={index * 0.1} className={`${gridPos} h-full`}>
      <motion.div 
        whileHover={{ y: -8, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="group relative h-full bg-bg border border-white/5 border-dashed rounded-2xl sm:rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-6 md:p-10 text-center transition-all duration-500 gpu-accelerated shadow-2xl shadow-black/20"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)]" />
        
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 relative">
           <motion.div 
             animate={{ scale: [1, 2.8], opacity: [0.3, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
             className="absolute inset-0 rounded-full border-2 border-accent-3/20" 
           />
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40 group-hover:text-accent-3 transition-colors relative z-10">
             <path d="M12 5v14M5 12h14" />
           </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white/80 mb-2 tracking-tight">New Client in Progress</h3>
        <p className="text-slate-200 text-sm max-w-[220px] leading-relaxed">
          We are currently preparing a new success story with an Ottawa commercial partner.
        </p>

        {/* Pulsing Dots */}
        <div className="mt-6 flex gap-1.5 justify-center">
           {[1,2,3].map(i => (
             <motion.div 
               key={i}
               animate={{ opacity: [0.2, 1, 0.2] }}
               transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
               className="w-1 h-1 rounded-full bg-accent-3/60"
             />
           ))}
        </div>
      </motion.div>
    </AnimatedSection>
  );
}


