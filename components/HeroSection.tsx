"use client";

import Link from "next/link";
import Marquee from "./Marquee";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[94svh] md:min-h-[100svh] flex flex-col bg-[color:var(--surface)] overflow-hidden"
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

      <div className="v3-content page-frame w-full flex-1 flex flex-col justify-center pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="v3-back">
          <div className="flex items-center gap-3 v3-eyebrow">
            <span className="h-[3px] w-7 bg-[color:var(--red)]" aria-hidden="true" />
            <span className="num text-xs text-[color:var(--red)] font-semibold">§ 00</span>
            <span className="type-meta-strong">Ottawa · Est. 2025</span>
          </div>
        </div>

        <div className="mt-8 md:mt-10 v3-front">
          <h1 className="type-display-1 max-w-[15ch] v3-h1">
            Modern websites.<br />
            Integrated AI agents.<br />
            <span className="accent-text">One team, on call.</span>
          </h1>
          <p className="type-lead mt-7 md:mt-9 max-w-[48ch] v3-lead">
            For Ottawa trades and small businesses. We build the site, embed the agent, and stay
            reachable when things change.
          </p>
          <div className="mt-9 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none v3-cta">
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
          <dl className="meta-row mt-12 md:mt-16 pt-6 border-t-2 border-[color:var(--ink)] v3-meta">
            <div><dt>Slogan</dt><dd>Keep it Local, Keep it Canadian</dd></div>
            <div><dt>Service area</dt><dd>Ottawa · Kanata · Nepean · Orleans · Gatineau</dd></div>
            <div><dt>Contact</dt><dd>tharrosdev@gmail.com</dd></div>
          </dl>
        </div>
      </div>

      <Marquee
        items={[
          "WEBSITE MODERNIZATION",
          "INTEGRATED AI AGENTS",
          "ON-CALL SUPPORT",
          "KEEP IT LOCAL, KEEP IT CANADIAN",
          "BUILT IN OTTAWA",
        ]}
        variant="dark"
        durationSec={34}
        className="relative z-[1]"
      />
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
