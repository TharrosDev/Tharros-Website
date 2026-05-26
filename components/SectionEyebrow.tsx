import AnimatedSection from "./AnimatedSection";

type Tone = "light" | "dark";

interface Props {
  numeral: string;
  label: string;
  tone?: Tone;
  className?: string;
}

export default function SectionEyebrow({
  numeral,
  label,
  tone = "light",
  className = "mb-12 md:mb-16",
}: Props) {
  const num = tone === "dark"
    ? "text-[color:var(--red-bright)]"
    : "text-[color:var(--red)]";
  const text = tone === "dark"
    ? "text-[color:var(--ink-on-dark-muted)]"
    : "";

  return (
    <AnimatedSection>
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="h-[3px] w-7 bg-[color:var(--red)]" aria-hidden="true" />
        <span className={`num text-xs font-semibold ${num}`}>{numeral}</span>
        <span className={`type-meta-strong ${text}`}>{label}</span>
      </div>
    </AnimatedSection>
  );
}
