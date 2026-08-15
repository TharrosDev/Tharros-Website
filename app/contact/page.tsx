import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import { CONTACT_EMAIL, SOCIAL } from "@/lib/site";

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

export default function ContactPage() {
  return (
    <>
      <PageIntro
        index="01"
        label="Information"
        title="Contact"
        lead="One inbox, answered within two business days."
      />

      <div className="page-frame rhythm-tight">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="type-display-3 lg:type-display-2 link-rule-reveal inline-block break-all"
        >
          {CONTACT_EMAIL}
        </a>

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
    </>
  );
}
