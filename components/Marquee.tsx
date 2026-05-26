"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Variant = "dark" | "red" | "light";

interface Props {
  items: string[];
  variant?: Variant;
  reverse?: boolean;
  durationSec?: number;
  className?: string;
  /** Lean the strip into the scroll direction with velocity-driven skew. */
  velocity?: boolean;
}

const surface: Record<Variant, string> = {
  dark: "bg-[color:var(--ink)] text-[color:var(--ink-on-dark)]",
  red: "bg-[color:var(--red-deep)] text-[color:oklch(99%_0.002_25)]",
  light: "bg-[color:var(--surface)] text-[color:var(--ink)] border-y border-[color:var(--rule)]",
};

const diamond: Record<Variant, string> = {
  dark: "text-[color:var(--red-bright)]",
  red: "text-[color:oklch(99%_0.002_25)]",
  light: "text-[color:var(--red)]",
};

export default function Marquee({
  items,
  variant = "dark",
  reverse = false,
  durationSec = 32,
  className = "",
  velocity = false,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!velocity) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tracks = gsap.utils.toArray<HTMLElement>(".marquee__track", root.current);
        const skewTo = gsap.quickTo(tracks, "skewX", { duration: 0.5, ease: "power3" });
        const clamp = gsap.utils.clamp(-9, 9);

        const st = ScrollTrigger.create({
          onUpdate: (self) => skewTo(clamp(self.getVelocity() / -260)),
        });
        return () => st.kill();
      });
    },
    { scope: root },
  );

  const Track = (
    <ul aria-hidden="true" className="marquee__track py-3.5 list-none">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-[var(--marquee-gap,2.5rem)]">
          <span className="num text-[12px] md:text-[13px] tracking-[0.18em] uppercase font-semibold whitespace-nowrap">
            {item}
          </span>
          <span className={`text-[10px] ${diamond[variant]}`} aria-hidden="true">
            &#9670;
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={root}
      className={`marquee ${surface[variant]} ${className}`}
      data-reverse={reverse ? "true" : "false"}
      style={{ ["--marquee-dur" as string]: `${durationSec}s` }}
      role="presentation"
    >
      {Track}
      {Track}
    </div>
  );
}
