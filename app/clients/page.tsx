import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/clients`;

export const metadata: Metadata = {
  title: "Clients — Real-World Impact",
  description:
    "Live Tharros builds. The Meridian Society runs a Knowledge Q&A Agent built and integrated by Tharros for 24/7 member insights. Keep it Local, Keep it Canadian.",
  keywords: [
    "Tharros Clients",
    "Tharros Case Studies",
    "Ottawa AI Agent Case Studies",
    "Ottawa Website Build Examples",
    "AI Agent Integration Success Stories",
    "Ottawa Small Business AI Examples",
    "Meridian Society AI Agent",
    "Ottawa Web Development Portfolio",
    "Tharros Portfolio",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Clients — Real-World Impact | Tharros",
    description:
      "Live Tharros builds. The Meridian Society runs a Knowledge Q&A Agent built and integrated by Tharros for 24/7 member insights and forum automation.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros clients — Real-World Impact.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clients — Real-World Impact | Tharros",
    description:
      "Live Tharros builds, starting with The Meridian Society's 24/7 Knowledge Q&A Agent. Keep it Local, Keep it Canadian.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CASE_STUDIES = [
  {
    name: "The Meridian Society",
    url: "https://meridiansociety.ca",
    headline: "The Meridian Society — Knowledge Q&A Agent",
    description:
      "Tharros built and integrated a Knowledge Q&A Agent into the Meridian Society site for 24/7 member insights and forum automation. Live and running, with Tharros on call for tuning and new agents.",
    image: `${SITE_URL}/meridian-logo.webp`,
    datePublished: "2026-05-01",
  },
  {
    name: "ADVANTA365",
    url: "https://advanta365.com",
    headline: "ADVANTA365 — Marketing Site Build",
    description:
      "Tharros built and shipped the marketing site for an enterprise Microsoft 365 adoption and governance practice, with ongoing on-call support.",
    image: `${SITE_URL}/og-image.jpg`,
    datePublished: "2026-05-01",
  },
  {
    name: "Echo Five Consulting",
    url: "https://echo-five-website.vercel.app",
    headline: "Echo Five Consulting — Positioning Site Build",
    description:
      "Tharros built and shipped the consulting site for a public-sector change-management practice in Ottawa, with ongoing on-call support.",
    image: `${SITE_URL}/echo-five-logo.svg`,
    datePublished: "2026-05-01",
  },
] as const;

export default function ClientsPage() {
  const articles = CASE_STUDIES.map((c) => ({
    "@type": "Article",
    headline: c.headline,
    description: c.description,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished: c.datePublished,
    inLanguage: "en-CA",
    image: c.image,
    mainEntityOfPage: PAGE_URL,
    about: {
      "@type": "Organization",
      name: c.name,
      url: c.url,
    },
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#collectionpage`,
      url: PAGE_URL,
      name: "Clients — Real-World Impact | Tharros",
      description:
        "Live Tharros builds for Ottawa businesses. Modernized websites with integrated AI agents — real-world results, with the team on call after launch.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#localbusiness` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumbs` },
      numberOfItems: CASE_STUDIES.length,
      hasPart: articles,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${PAGE_URL}#itemlist`,
      name: "Tharros client builds",
      numberOfItems: CASE_STUDIES.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: CASE_STUDIES.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: c.url,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Clients", item: PAGE_URL },
      ],
    },
  ];

  return (
    <>
      <Script
        id="clients-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <ClientsSection />
        <FooterSection />
      </main>
    </>
  );
}
