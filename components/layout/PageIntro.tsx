import Link from "next/link";

type Crumb = { name: string; href: string };

type Props = {
  index: string;
  label: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
  /** Tightens the block on dense pages like checkout. */
  compact?: boolean;
};

/**
 * The opening block on every page that does not lead with a hero image. It
 * also carries the clearance for the fixed header, so no page has to remember
 * to add top padding.
 */
export default function PageIntro({
  index,
  label,
  title,
  lead,
  crumbs,
  children,
  compact = false,
}: Props) {
  return (
    <div
      className="page-frame"
      style={{
        paddingTop: `calc(var(--header-h) + ${compact ? "2rem" : "3.5rem"})`,
        paddingBottom: compact ? "2rem" : "3.5rem",
      }}
    >
      {crumbs && crumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="type-meta flex flex-wrap items-center gap-2 text-ink-faint">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <Link href={crumb.href} className="transition-opacity hover:opacity-60">
                  {crumb.name}
                </Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex items-baseline gap-4 border-t border-ink pt-4">
        <p className="eyebrow">
          <span className="num">{index}</span>
          <span>{label}</span>
        </p>
      </div>

      <h1 className={`${compact ? "type-display-3" : "type-display-1"} mt-8`}>{title}</h1>

      {lead ? <p className="type-lead mt-6 max-w-2xl">{lead}</p> : null}

      {children}
    </div>
  );
}
