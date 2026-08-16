import Link from "next/link";
import Reveal from "./Reveal";

type Props = {
  index: string;
  label: string;
  title?: string;
  action?: { href: string; label: string };
  className?: string;
};

/**
 * The opener every section shares: mono index, mono label, a rule, a title.
 * The rule draws itself as the heading arrives — the site's entrance gesture —
 * so the index and the line it sits on land together.
 */
export default function SectionHeading({
  index,
  label,
  title,
  action,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <Reveal className="rule-draw flex items-baseline justify-between gap-6 pt-4">
        <p className="eyebrow">
          <span className="num">{index}</span>
          <span>{label}</span>
        </p>
        {action ? (
          <Link
            href={action.href}
            className="link-rule link-rule-reveal shrink-0"
          >
            {action.label}
          </Link>
        ) : null}
      </Reveal>
      {title ? (
        <h2 className="type-display-2 mt-8 max-w-[16ch]">{title}</h2>
      ) : null}
    </div>
  );
}
