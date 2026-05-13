"use client";

export default function SectionSkeleton() {
  return (
    <div className="w-full min-h-[400px] md:min-h-[600px] flex items-center justify-center bg-slate-950/20 relative overflow-hidden industrial-grid opacity-50">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col items-center gap-8">
        <div className="w-32 h-4 bg-slate-800/50 rounded-full animate-pulse" />
        <div className="w-2/3 h-12 md:h-16 bg-slate-800/30 rounded-2xl animate-pulse" />
        <div className="w-1/2 h-4 bg-slate-800/20 rounded-full animate-pulse" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 rounded-[2rem] bg-slate-900/30 border border-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
