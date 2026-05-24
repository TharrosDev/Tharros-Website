import Link from "next/link";

type NextLink = { label: string; href: string; primary?: boolean };

interface Props {
  numeral: string;
  eyebrow: string;
  heading: string;
  links: NextLink[];
}

export default function NextStep({ numeral, eyebrow, heading, links }: Props) {
  return (
    <section className="bg-[color:var(--surface-dark)] text-[color:var(--ink-on-dark)]">
      <div className="page-frame border-t border-[color:var(--rule-on-dark)] py-12 md:py-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="num text-xs text-[color:var(--ink-on-dark-muted)]">{numeral}</span>
              <span className="h-px w-8 bg-[color:var(--rule-on-dark-strong)]" />
              <span className="type-meta-strong text-[color:var(--ink-on-dark-muted)]">{eyebrow}</span>
            </div>
            <h2 className="type-display-3 text-[color:var(--ink-on-dark)] max-w-[20ch]">{heading}</h2>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-center gap-3 sm:gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.primary ? "btn-primary" : "btn-ghost-on-dark"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
