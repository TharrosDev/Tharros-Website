import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/layout/PageIntro";
import Accordion from "@/components/ui/Accordion";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about THARROS drops, run sizes, restocks, sizing, shipping and returns.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question: "Why are there so few pieces?",
    answer:
      "THARROS releases in drops rather than keeping a permanent catalogue. Each drop is a small number of pieces made in short runs — that is the actual production capacity, not a marketing tactic.",
  },
  {
    question: "How many of each piece are made?",
    answer:
      "It varies by piece and it is printed on every product page, along with how many are still available. When a size is gone, it is gone.",
  },
  {
    question: "Will sold-out pieces come back?",
    answer:
      "Sometimes, and never automatically. Some runs are marked as final on the product page and will not be remade. Others may return in a later drop, usually changed rather than reprinted.",
  },
  {
    question: "When is the next drop?",
    answer:
      "There is no published date. A drop goes out when the fit is right; pieces far enough along to show appear on the current drop page while they are still in development.",
  },
  {
    question: "How do THARROS pieces fit?",
    answer:
      "Most pieces are cut boxy or oversized and are true to size as designed. Each product page lists its fit notes, and garment measurements are published in the size guide.",
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
];

export default function FaqPage() {
  const structuredData = {
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
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />

      <PageIntro index="01" label="Information" title="FAQ" />

      <div className="page-frame rhythm-tight">
        <div className="max-w-3xl">
          {FAQS.map((faq) => (
            <Accordion key={faq.question} title={faq.question} level={2}>
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
