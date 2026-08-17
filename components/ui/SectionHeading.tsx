import Link from "next/link";
import Reveal from "./Reveal";

type Props = {
  index: string;
  label: string;
  title?: string;
  action?: { href: string; label: string };
  /** A second mono line on the rule, opposite the index. */
  aside?: string;
  /** Title step. The section statement is display-2; a sub-section is smaller. */
  titleClass?: string;
  /** Sub-sections inside a page that already owns an h2. */
  level?: 2 | 3;
  /** So a labelled `<section>` can point `aria-labelledby` at this heading. */
  titleId?: string;
  /** Stagger, in ms, shared with the rule draw. */
  delay?: number;
  className?: string;
};

/**
 * The opener every section shares: mono index, mono label, a rule, a title.
 * The rule draws itself as the heading arrives — the site's entrance gesture —
 * so the index and the line it sits on land together.
 *
 * This is the only way a section opens. Twelve surfaces previously hand-rolled
 * `<p className="eyebrow"> + border-t border-ink`, and every one of them lost
 * the ledger rule: a static ink border is a different weight and a different
 * idea from a hairline that draws itself.
 *
 * `action` and `aside` are alternatives, not siblings — the right-hand slot
 * holds a link out or a line of technical copy, never both.
 */
export default function SectionHeading({
  index,
  label,
  title,
  action,
  aside,
  titleClass = "type-display-2",
  level = 2,
  titleId,
  delay = 0,
  className = "",
}: Props) {
  const Heading = level === 3 ? "h3" : "h2";

  return (
    <div className={className}>
      <Reveal
        className="rule-draw flex items-baseline justify-between gap-6 pt-4"
        delay={delay}
      >
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
        ) : aside ? (
          <p className="type-meta hidden shrink-0 text-ink-faint md:block">
            {aside}
          </p>
        ) : null}
      </Reveal>
      {/* More space above the title than below it: the rule and its index
          belong to the section, and a heading that sits as close to its own
          label as to the work underneath it groups with the wrong thing. */}
      {title ? (
        <Heading id={titleId} className={`${titleClass} mt-10 max-w-[16ch] md:mt-12`}>
          {title}
        </Heading>
      ) : null}
    </div>
  );
}
