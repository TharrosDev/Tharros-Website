import ClientsSection from "@/components/ClientsSection";
import FooterSection from "@/components/FooterSection";
import { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/clients`;

export const metadata: Metadata = {
  title: "Clients | Build & Integration Success Stories",
  description:
    "Keep it Local, Keep it Canadian. Ottawa businesses with modernized websites and integrated AI agents built by Tharros. Real-world results for trades, professional services, and small operator-led teams.",
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
    title: "Clients | Tharros Build & Integration Success Stories",
    description:
      "Real-world results from Tharros website modernization and AI agent integration builds with Ottawa small businesses.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros clients — Ottawa small businesses with modernized sites and integrated AI agents.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clients | Tharros",
    description:
      "Ottawa small businesses running modernized websites with integrated AI agents, built by Tharros.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ClientsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${PAGE_URL}#collectionpage`,
      url: PAGE_URL,
      name: "Clients | Tharros",
      description:
        "Ottawa businesses with modernized websites and integrated AI agents built by Tharros.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#localbusiness` },
      hasPart: [
        {
          "@type": "Article",
          headline: "The Meridian Society — Knowledge Q&A Agent",
          description:
            "Tharros built and integrated a Knowledge Q&A Agent into the Meridian Society site for 24/7 member insights and forum automation. Live and running, with Tharros on call for tuning and new agents.",
          author: { "@id": `${SITE_URL}/#organization` },
          publisher: { "@id": `${SITE_URL}/#organization` },
          datePublished: "2026-05-01",
          image: `${SITE_URL}/meridian-logo.png`,
          mainEntityOfPage: PAGE_URL,
          about: {
            "@type": "Organization",
            name: "The Meridian Society",
            url: "https://meridiansociety.ca",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Clients",
          item: PAGE_URL,
        },
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
