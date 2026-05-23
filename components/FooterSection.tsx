"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AnimatedSection from "./AnimatedSection";

export default function FooterSection() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isBriefPage = pathname === "/brief";

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (isBriefPage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)] safe-bottom">
      <div className="page-frame rhythm-default">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span className="num text-xs text-[color:var(--ink-on-dark-muted)]">§ END</span>
            <span className="h-px w-8 bg-[color:var(--rule-on-dark-strong)]" />
            <span className="type-meta-strong text-[color:var(--ink-on-dark-muted)]">Ready when you are</span>
          </div>

          <div className="grid grid-cols-12 gap-x-6 gap-y-12 mb-16">
            <div className="col-span-12 lg:col-span-8">
              <h2 className="type-display-2 text-[color:var(--ink-on-dark)] max-w-[16ch]">
                Modernize your <span className="text-[color:var(--accent-on-dark)]">front door.</span>
              </h2>
              <p className="type-lead text-[color:var(--ink-on-dark-muted)] mt-6 max-w-[52ch]">
                Book a free discovery call. We&apos;ll listen to your operation, scope the build,
                and walk you through pay-per-call vs the On-Call retainer. No obligation.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link href="/brief" onClick={handleScrollToTop} className="btn-primary">
                  Book a discovery call
                </Link>
                <a href="mailto:tharrosdev@gmail.com" className="btn-ghost btn-ghost-on-dark">
                  tharrosdev@gmail.com
                </a>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-[color:var(--rule-on-dark)]">
              <span className="type-meta text-[color:var(--ink-on-dark-muted)]">Office</span>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <dt className="type-meta text-[color:var(--ink-on-dark-muted)]">City</dt>
                  <dd className="text-[color:var(--ink-on-dark)] mt-1">Ottawa, Ontario, Canada</dd>
                </div>
                <div>
                  <dt className="type-meta text-[color:var(--ink-on-dark-muted)]">Service area</dt>
                  <dd className="text-[color:var(--ink-on-dark)] mt-1 leading-relaxed">
                    Kanata, Nepean, Barrhaven, Orleans, Stittsville, Gatineau
                  </dd>
                </div>
                <div>
                  <dt className="type-meta text-[color:var(--ink-on-dark-muted)]">Hours</dt>
                  <dd className="text-[color:var(--ink-on-dark)] num mt-1">Mon–Fri · 09:00–17:00</dd>
                </div>
              </dl>
            </div>
          </div>
        </AnimatedSection>

        <div className="border-t border-[color:var(--rule-on-dark)] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">
            © {year} THARROS · OTTAWA · ALL RIGHTS RESERVED
          </span>
          <span className="num text-[11px] text-[color:var(--ink-on-dark-muted)]">
            KEEP IT LOCAL, KEEP IT CANADIAN
          </span>
        </div>
      </div>
    </footer>
  );
}
