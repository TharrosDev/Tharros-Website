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
    <footer id="contact" className="section-padding px-6 md:px-12 relative overflow-hidden bg-bg">
      <div className="max-w-4xl xl:max-w-5xl mx-auto text-center relative">
        <AnimatedSection variant="scale-in">
          <p className="section-label mb-6">
            Ready to stop missing leads?
          </p>
          <h2 className="text-3xl md:text-5xl xl:text-6xl font-bold text-text mb-6 leading-tight">
            Let&apos;s build something{" "}
            <span className="accent-text">that works for you</span>
          </h2>
          <p className="text-subdued text-base md:text-lg xl:text-xl mb-10 max-w-xl xl:max-w-2xl mx-auto leading-relaxed">
            Set up a free initial consultation. We&apos;ll listen to your business,
            identify the best use case, and give you a clear sense of what&apos;s
            possible, no obligation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 md:mb-20">
            <a
              href="/intake"
              onClick={handleScrollToTop}
              aria-label="Start your AI intake journey and consultation"
              className="primary-button px-10 py-5 text-xl"
            >
              Start your journey
            </a>
            <a 
              href="mailto:Magnus.Abdelnour@gmail.com" 
              aria-label="Email Magnus Abdelnour for business inquiries"
              className="text-text font-bold text-base uppercase tracking-widest hover:text-accent-3 transition-colors px-4 py-2"
            >
              Email Us
            </a>
          </div>

          <div className="subtle-divider mb-6" />
          <div className="text-subdued text-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">&copy; {year} Tharros. Ottawa, Ontario. <img src="/canada-flag.svg" alt="Canadian Flag" className="w-4 h-2.5 rounded-[1px]" /> Keep it Canadian.</span>
            <span className="text-muted text-xs">AI agents for small businesses that need to move fast.</span>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
