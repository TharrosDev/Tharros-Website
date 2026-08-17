import Link from "next/link";
import Reveal from "./Reveal";

type Props = {
  /** The display-size statement. A sentence, with its full stop. */
  title: string;
  /** One line. If it only restates the title, it is not worth rendering. */
  body?: React.ReactNode;
  action?: { href: string; label: string; onClick?: () => void };
  /** A second, quieter way out. */
  secondary?: { href: string; label: string; onClick?: () => void };
  className?: string;
};

/**
 * The one empty state. Five surfaces — shop, bag, wishlist, checkout, search —
 * each carried their own copy of "display statement, one line, one button",
 * drifting apart on spacing, on whether there was a rule above it, and on
 * whether the second line said anything the first had not.
 *
 * It opens on the ledger rule like every other block on the site, so an empty
 * result reads as a section of the page rather than as a hole in it.
 */
export default function EmptyState({
  title,
  body,
  action,
  secondary,
  className = "",
}: Props) {
  return (
    <Reveal className={`rule-draw pt-10 ${className}`}>
      <p className="type-display-3 uppercase max-w-[18ch]">{title}</p>
      {body ? <p className="type-body mt-4 max-w-prose text-ink-muted">{body}</p> : null}
      {action || secondary ? (
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          {action ? (
            <Link href={action.href} onClick={action.onClick} className="btn btn-solid">
              {action.label}
            </Link>
          ) : null}
          {secondary ? (
            <Link
              href={secondary.href}
              onClick={secondary.onClick}
              className="link-rule link-rule-reveal"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </Reveal>
  );
}
