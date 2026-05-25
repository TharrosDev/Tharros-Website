"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[92svh] md:min-h-[100svh] flex items-stretch pt-24 md:pt-28 pb-12 md:pb-20 bg-[color:var(--surface)] overflow-hidden"
      onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width).toFixed(4));
        e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height).toFixed(4));
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        e.currentTarget.style.setProperty("--mx", "0.5");
        e.currentTarget.style.setProperty("--my", "0.5");
      }}
    >
      <div className="v3-dots" aria-hidden="true" />
      <div className="v3-content page-frame w-full">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 flex flex-col justify-between">
            <div className="v3-back">
              <div className="flex items-center gap-4 v3-eyebrow">
                <span className="num text-xs text-[color:var(--ink-faint)]">§ 00</span>
                <span className="h-px w-8 bg-[color:var(--rule-strong)]" />
                <span className="type-meta-strong">Ottawa · Est. 2025</span>
              </div>
            </div>
            <div className="mt-12 md:mt-16 v3-front">
              <h1 className="type-display-1 max-w-[18ch] v3-h1">
                Modern websites.<br />
                Integrated AI agents.<br />
                <span className="text-[color:var(--accent)]">One team, on call.</span>
              </h1>
              <p className="type-lead mt-8 md:mt-10 max-w-[52ch] v3-lead">
                For Ottawa trades and small businesses. We build the site, embed the agent, and stay reachable when things change.
              </p>
              <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none v3-cta">
                <Link
                  href="/brief"
                  className="btn-primary v3-mag"
                  onMouseMove={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
                    const y = ((e.clientY - r.top) / r.height - 0.5) * 9;
                    e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.transform = "";
                  }}
                >
                  Book a discovery call<Arrow />
                </Link>
                <a href="#demo" className="btn-ghost">Try the agent</a>
              </div>
            </div>
            <div className="v3-mid">
              <dl className="meta-row mt-16 md:mt-24 pt-6 border-t border-[color:var(--rule)] v3-meta">
                <div><dt>Slogan</dt><dd>Keep it Local, Keep it Canadian</dd></div>
                <div><dt>Service area</dt><dd>Ottawa · Kanata · Nepean · Orleans · Gatineau</dd></div>
                <div><dt>Contact</dt><dd>tharrosdev@gmail.com</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
