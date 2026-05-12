export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-3 animate-spin" />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Initializing_Interface...
        </p>
      </div>
    </div>
  );
}
