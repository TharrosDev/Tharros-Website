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
        {/* Bounded, because on `/shop` the current crumb is the visitor's own
            search term. An unbroken 400-character query took the document to
            3296px wide at every viewport — the page scrolled sideways on a
            phone, and the trail is the one element here whose content nobody
            on this side gets to choose the length of.

            It opens up from `md`, because 22ch is the bound a 320px screen
            needs and it was being applied to a 1440px one as well: `/shop`
            rendered its own page title as "EVERYTHING MADE S…" with more than
            half the viewport empty beside it. `truncate` is what actually
            prevents the overflow; the max-width only has to stay inside the
            room the screen has. */}
        {current ? (
          <li title={current} className="max-w-[22ch] truncate text-ink md:max-w-[46ch]">
            {current}
          </li>
        ) : null}
      </ol>
    </nav>
  );
}
