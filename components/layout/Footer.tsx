import Link from "next/link";
import { WordmarkFit } from "@/components/ui/Wordmark";
import Newsletter from "./Newsletter";
import {
  BRAND_LINE,
  CONTACT_EMAIL,
  FOOTER_INFORMATION,
  FOOTER_LEGAL,
  FOOTER_SHOP,
  SOCIAL,
} from "@/lib/site";

function Column({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="type-meta text-ink-on-dark-faint">{title}</h2>
      <ul className="mt-5 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.name}-${link.href}`}>
            <Link
              href={link.href}
              className="type-body-sm text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="on-dark">
      <div className="page-frame">
        <div className="grid gap-12 border-b border-rule-on-dark py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-24">
          <div>
            <p className="type-display-3 uppercase">Get the next drop.</p>
            <p className="type-body mt-4 max-w-md text-ink-on-dark-muted">
              Runs are small and they go quickly. The list hears first when something
              is finished.
            </p>
          </div>
          <Newsletter onDark />
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-4">
          <Column title="Shop" links={FOOTER_SHOP} />
          <Column title="Information" links={FOOTER_INFORMATION} />
          <div>
            <h2 className="type-meta text-ink-on-dark-faint">Follow</h2>
            <ul className="mt-5 space-y-2.5">
              {SOCIAL.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="type-body-sm text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="type-body-sm text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
          <Column title="Legal" links={FOOTER_LEGAL} />
        </div>
      </div>

      {/* The wordmark closes the site at scale — the last thing you read. */}
      <div className="overflow-hidden border-t border-rule-on-dark">
        <div className="page-frame py-10">
          <WordmarkFit />
          <div className="mt-8 flex flex-col justify-between gap-3 md:flex-row">
            <p className="type-meta text-ink-on-dark-faint">{BRAND_LINE}</p>
            <p className="type-meta text-ink-on-dark-faint">© 2026 THARROS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
