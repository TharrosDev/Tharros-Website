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
    <section className="bg-[color:var(--red-deep)] text-[color:oklch(99%_0.002_25)]">
      <div className="page-frame py-14 md:py-20">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[3px] w-7 bg-[color:oklch(99%_0.002_25)]" aria-hidden="true" />
              <span className="num text-xs font-semibold text-[color:oklch(99%_0.002_25)]">{numeral}</span>
              <span className="type-meta-strong text-[color:oklch(99%_0.002_25/0.85)]">{eyebrow}</span>
            </div>
            <h2 className="type-display-2 text-[color:oklch(99%_0.002_25)] max-w-[18ch]">{heading}</h2>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col sm:flex-row lg:justify-end items-stretch sm:items-center gap-3 sm:gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.primary ? "btn-ink" : "btn-ghost-on-red"}
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
