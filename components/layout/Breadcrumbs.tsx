import Link from "next/link";

export type Crumb = { name: string; href: string };

type Props = {
  trail: Crumb[];
  /** The current page. Rendered as text, not a link. */
  current?: string;
  className?: string;
};

/**
 * The visible breadcrumb. Three surfaces had their own copy — PageIntro's,
 * the product page's and the journal entry's — and only one of them emitted
 * an ordered list.
 *
 * The separator is a real element rather than a `::after`, so it can be hidden
 * from assistive technology while staying visible; the link boxes carry
 * `-my-2 py-2` because a mono link at 11px is otherwise a 15px tap target.
 */
export default function Breadcrumbs({ trail, current, className = "" }: Props) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="type-meta flex flex-wrap items-center gap-2 text-ink-faint">
        {trail.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <Link
              href={crumb.href}
              className="-my-2 inline-block py-2 transition-opacity hover:opacity-60"
            >
              {crumb.name}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        {current ? <li className="text-ink">{current}</li> : null}
      </ol>
    </nav>
  );
}
