"use client";

import { usePathname } from "next/navigation";
import AnimatedSection from "./AnimatedSection";
import Magnetic from "./Magnetic";

export default function FooterSection() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isIntakePage = pathname === "/intake";

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (isIntakePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <footer id="contact" className="pt-16 md:pt-24 pb-10 md:pb-14 px-6 md:px-12 relative overflow-hidden bg-slate-950 industrial-grid">
        {/* Background Sophistication */}
        <div className="scanline" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-4xl xl:max-w-6xl 3xl:max-w-[100rem] 4xl:max-w-[120rem] mx-auto text-center relative z-10">
          <AnimatedSection variant="scale-in">
            <div className="flex flex-col items-center">

              <div className="mb-6 md:mb-8 inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] text-white font-black uppercase tracking-[0.4em] text-[9px] md:text-[11px]">
                <span>Keep it Local, Keep it Canadian</span>
                <img src="/canada-flag.svg" alt="Canada" className="w-4 md:w-5 h-auto rounded-sm" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-7xl xl:text-8xl 3xl:text-9xl 4xl:text-[11rem] font-bold text-white mb-6 md:mb-8 3xl:mb-16 leading-[1.1] md:leading-[0.9] tracking-tighter">
                Ready to set up <br className="hidden md:block" />
                <span className="text-accent-3">your own agent?</span>
              </h2>
              <p className="text-slate-300 text-base md:text-2xl xl:text-3xl 3xl:text-4xl 4xl:text-5xl mb-10 md:mb-10 3xl:mb-20 max-w-2xl xl:max-w-4xl 3xl:max-w-[80rem] mx-auto leading-relaxed font-medium opacity-80 px-4 sm:px-0">
                Book a free briefing. We&apos;ll listen to your operation, pick the highest-leverage agent to set up first, and walk you through what training looks like, no obligation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 3xl:gap-24 w-full px-6 sm:px-0">
                <Magnetic strength={0.1}>
                  <a
                    href="/intake"
                    onClick={handleScrollToTop}
                    aria-label="Book your free AI training and setup briefing"
                    className="primary-button text-sm md:text-xl xl:text-2xl 3xl:text-4xl w-full sm:w-auto relative overflow-hidden group shadow-[0_20px_50px_-10px_rgba(14,165,233,0.3)] 3xl:px-20 3xl:py-10"
                  >
                    <span className="relative z-10">Book a Training Call</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </a>
                </Magnetic>
                <a 
                  href="mailto:tharrosdev@gmail.com" 
                  aria-label="Email Magnus Abdelnour for business inquiries"
                  className="group flex items-center gap-4 text-white font-black text-xs md:text-sm 3xl:text-xl uppercase tracking-[0.4em] hover:text-accent-3 transition-all px-6 py-4"
                >

                  Direct_Email
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </footer>

      {/* Legal & Branding Strip */}
      <section className="bg-white py-4 md:py-6 3xl:py-12 px-6 border-t border-slate-100 relative overflow-hidden industrial-grid">
        <div className="scanline opacity-[0.02]" />
        <div className="max-w-7xl 3xl:max-w-ultra mx-auto flex flex-col items-center justify-center relative z-10">
          <div className="text-slate-400 text-[10px] md:text-xs 3xl:text-xl font-black flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 3xl:gap-8 uppercase tracking-[0.3em]">
            <span className="inline-flex items-center gap-3">
              &copy; {year} Tharros | Ottawa, Canada 
            </span>
            <span className="hidden md:block text-slate-600/30">|</span>
            <span className="flex items-center gap-2 text-slate-500">
              <span>Keep it Local, Keep it Canadian</span>
              <img src="/canada-flag.svg" alt="Canada" className="w-4 h-auto 3xl:w-8 rounded-[1px] opacity-80" />
            </span>
          </div>
        </div>
      </section>
    </>

  );
}
