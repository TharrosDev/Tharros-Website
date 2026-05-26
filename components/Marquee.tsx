"use client";

type Variant = "dark" | "red" | "light";

interface Props {
  items: string[];
  variant?: Variant;
  reverse?: boolean;
  durationSec?: number;
  className?: string;
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
}: Props) {
  const Track = (
    <ul
      aria-hidden="true"
      className="marquee__track py-3.5 list-none"
    >
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
