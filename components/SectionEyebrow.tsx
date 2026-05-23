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
    ? "text-[color:var(--ink-on-dark-muted)]"
    : "text-[color:var(--ink-faint)]";
  const rule = tone === "dark"
    ? "bg-[color:var(--rule-on-dark-strong)]"
    : "bg-[color:var(--rule-strong)]";
  const text = tone === "dark"
    ? "text-[color:var(--ink-on-dark-muted)]"
    : "";

  return (
    <AnimatedSection>
      <div className={`flex items-center gap-4 ${className}`}>
        <span className={`num text-xs ${num}`}>{numeral}</span>
        <span className={`h-px w-8 ${rule}`} />
        <span className={`type-meta-strong ${text}`}>{label}</span>
      </div>
    </AnimatedSection>
  );
}
