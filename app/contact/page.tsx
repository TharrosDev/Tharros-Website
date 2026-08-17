import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import InfoFooter from "@/components/layout/InfoFooter";
import { CONTACT_EMAIL, informationIndex, SITE_URL, SOCIAL } from "@/lib/site";
import { breadcrumbList, jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with THARROS — orders, returns, press and wholesale.",
  alternates: { canonical: "/contact" },
};

const LINES = [
  {
    index: "01",
    title: "Orders and returns",
    body: "Order number in the subject line gets the fastest answer.",
  },
  {
    index: "02",
    title: "Press and stockists",
    body: "Lookbook and line sheets available on request.",
  },
  {
    index: "03",
    title: "Everything else",
    body: "Questions about fit, fabric, drops or anything on the site.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#page`,
      url: `${SITE_URL}/contact`,
      name: "Contact THARROS",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#organization` },
    },
    breadcrumbList(SITE_URL, [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro
        index={informationIndex("/contact")}
        label="Information"
        title="Contact"
        lead="One inbox, answered within two business days."
        crumbs={[{ name: "Home", href: "/" }]}
      />

      <div className="page-frame rhythm-tight">
        {/* `break-all` broke the address mid-word rather than at the @. An email
            is one token to a reader; the wrap point that makes sense is the one
            the address already has. */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="type-display-3 lg:type-display-2 link-rule-reveal inline-block [overflow-wrap:anywhere]"
        >
          {CONTACT_EMAIL}
        </a>

        <p className="type-meta mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-faint">
          <span>Replies within two business days</span>
          <span aria-hidden="true">/</span>
          <span>Monday to Friday</span>
          <span aria-hidden="true">/</span>
          <span>There is no phone line</span>
        </p>

        <ul className="mt-16 grid gap-x-8 gap-y-10 border-t border-ink pt-10 md:grid-cols-3">
          {LINES.map((line) => (
            <li key={line.index}>
              <p className="type-meta text-ink-faint">
                <span className="num">{line.index}</span>
                <span className="ml-3">{line.title}</span>
              </p>
              <p className="type-body mt-3 text-ink-muted">{line.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-8">
          {SOCIAL.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="link-rule link-rule-reveal"
            >
              {social.name}
            </a>
          ))}
          <Link href="/faq" className="link-rule link-rule-reveal">
            Read the FAQ
          </Link>
        </div>
      </div>

      <InfoFooter current="/contact" />
    </>
  );
}
