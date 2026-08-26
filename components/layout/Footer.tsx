import Link from "next/link";
import { WordmarkFit } from "@/components/ui/Wordmark";
import Reveal from "@/components/ui/Reveal";
import Newsletter from "./Newsletter";
import {
  BRAND_LINE,
  CONTACT_EMAIL,
  FOOTER_INFORMATION,
  FOOTER_LEGAL,
  FOOTER_SHOP,
  activeSocial,
} from "@/lib/site";
import { NEXT_DROP, CURRENT_DROP } from "@/lib/catalog/drops";

const SOCIAL_LINKS = activeSocial();

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
      {/* `py-1` on the anchor, not the `li`, so the growth is inside the
          target: a `type-body-sm` link is a 17px box and WCAG 2.5.8 wants 24. */}
      <ul className="mt-5 space-y-1">
        {links.map((link) => (
          <li key={`${link.name}-${link.href}`}>
            <Link
              href={link.href}
              className="type-body-sm inline-block py-1 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
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
            {/* Named from the data. A drop number typed into the footer is a
                drop number that is wrong the week after it lands. */}
            <p className="type-display-3 uppercase">
              Get {(NEXT_DROP ?? CURRENT_DROP).name} first.
            </p>
            <p className="type-body mt-4 max-w-md text-ink-on-dark-muted">
              Drop announcements, early access and restocks. Nothing else.
            </p>
          </div>
          <Newsletter onDark />
        </div>

        {/* Three columns. Legal belongs on the bottom rule with the copyright,
            which is where every reader already looks for it. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 md:grid-cols-3">
          <Column title="Shop" links={FOOTER_SHOP} />
          <Column title="Information" links={FOOTER_INFORMATION} />
          <div>
            {/* The column is named for what is actually in it. With no profile
                URLs configured a heading reading "Follow" over one email
                address is a label describing something that is not there. */}
            <h2 className="type-meta text-ink-on-dark-faint">
              {SOCIAL_LINKS.length > 0 ? "Follow" : "Contact"}
            </h2>
            <ul className="mt-5 space-y-1">
              {/* Only platforms with a real profile URL — see `activeSocial()`.
                  A link to a platform home page is a dead end wearing a brand
                  name. */}
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="type-body-sm inline-block py-1 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="type-body-sm inline-block py-1 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* THE LAST SHOT. The wordmark closes the site at scale, uncovered
          bottom-edge-down — the same gesture a photograph gets. */}
      <div className="overflow-hidden border-t border-rule-on-dark">
        <div className="page-frame py-10">
          <Reveal mode="frame">
            <WordmarkFit />
          </Reveal>
          {/* `lg`, not `md`: the brand line and the legal marks need about 720px
              of mono between them and the frame does not reach that until
              roughly 1000px, so at 768 the row went sideways and then wrapped
              anyway. */}
          <div className="mt-8 flex flex-col justify-between gap-x-8 gap-y-4 lg:flex-row lg:items-baseline">
            <p className="type-meta text-ink-on-dark-faint">{BRAND_LINE}</p>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              {FOOTER_LEGAL.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // Muted rather than faint: the faint tone has no contrast
                  // headroom left on black, and these are interactive.
                  className="type-meta -my-2 inline-block py-2 text-ink-on-dark-muted transition-colors hover:text-ink-on-dark"
                >
                  {link.name}
                </Link>
              ))}
              <p className="type-meta text-ink-on-dark-faint">© 2026 THARROS</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
