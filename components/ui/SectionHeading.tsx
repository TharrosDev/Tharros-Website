import Link from "next/link";

type Props = {
  index: string;
  label: string;
  title?: string;
  action?: { href: string; label: string };
  className?: string;
};

/** The opener every section shares: mono index, mono label, a rule, a title. */
export default function SectionHeading({
  index,
  label,
  title,
  action,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-6 border-t border-current/15 pt-4">
        <p className="eyebrow">
          <span className="num">{index}</span>
          <span>{label}</span>
        </p>
        {action ? (
          <Link href={action.href} className="link-rule link-rule-reveal shrink-0">
            {action.label}
          </Link>
        ) : null}
      </div>
      {title ? <h2 className="type-display-2 mt-8 max-w-[16ch]">{title}</h2> : null}
    </div>
  );
}
