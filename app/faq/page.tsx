import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import Accordion from "@/components/ui/Accordion";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about THARROS sizing, shipping, returns, drops and stock.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question: "How do THARROS pieces fit?",
    answer:
      "Most pieces are cut boxy or oversized and are true to size as designed. Each product page lists its fit notes, and garment measurements are published in the size guide.",
  },
  {
    question: "When is the next drop?",
    answer:
      "Drops are announced to the mailing list first. Release dates are not published in advance on the site.",
  },
  {
    question: "Do sold-out pieces come back?",
    answer:
      "Not on a schedule. Pieces are made in limited runs, and any restock is announced to the mailing list rather than quietly added to the store.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are packed within two business days. Standard delivery takes 5–8 business days and express 2–3 business days.",
  },
  {
    question: "What is the returns policy?",
    answer:
      "Unworn pieces with tags attached can be returned within 30 days of delivery. Return shipping is paid by the customer unless the piece arrived faulty or incorrect.",
  },
  {
    question: "How do I contact THARROS?",
    answer: `Email ${CONTACT_EMAIL}. Messages are answered within two business days.`,
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageIntro index="01" label="Information" title="FAQ" />

      <div className="page-frame rhythm-tight">
        <div className="max-w-3xl">
          {FAQS.map((faq) => (
            <Accordion key={faq.question} title={faq.question}>
              <p className="type-body text-ink-muted">{faq.answer}</p>
            </Accordion>
          ))}

          <p className="type-body mt-10 text-ink-muted">
            Still stuck?{" "}
            <Link href="/contact" className="link-rule">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
