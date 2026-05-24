import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/SectionSkeleton";
import { Metadata } from "next";
import Script from "next/script";

const ModelTiersSection = dynamic(() => import("@/components/ModelTiersSection"), { loading: () => <SectionSkeleton /> });
const PricingSection = dynamic(() => import("@/components/PricingSection"), { loading: () => <SectionSkeleton /> });

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/pricing`;

export const metadata: Metadata = {
  title: "Pricing — The Refresh, The Integrate, The On-Call",
  description:
    "Three builds and how they are priced. The Refresh (site only), The Integrate (site + agent), and The On-Call (site + agent + monthly retainer). Pricing is scoped to the work after a free discovery call. Keep it Local, Keep it Canadian.",
  keywords: [
    "Ottawa Web Development Pricing",
    "AI Agent Integration Cost Ottawa",
    "On-Call Web Retainer Ottawa",
    "Website Maintenance Retainer Ottawa",
    "Per-Call Web Support Ottawa",
    "Website and AI Agent Package",
    "The Refresh",
    "The Integrate",
    "The On-Call",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Pricing — The Refresh, The Integrate, The On-Call | Tharros",
    description:
      "Three builds, scoped to the work. The Refresh, The Integrate, and The On-Call — with per-call support or a flat monthly retainer.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros pricing — The Refresh, The Integrate, The On-Call.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — The Refresh, The Integrate, The On-Call | Tharros",
    description:
      "Three builds, scoped to the work, with per-call support or a flat monthly retainer. Keep it Local, Keep it Canadian.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PricingPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Pricing — The Refresh, The Integrate, The On-Call | Tharros",
      description:
        "How Tharros prices website and AI agent builds: three packages scoped to the work, with per-call support or a flat monthly On-Call retainer.",
      inLanguage: "en-CA",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#service` },
      mainContentOfPage: { "@id": `${SITE_URL}/#service` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumbs` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pricing", item: PAGE_URL },
      ],
    },
  ];

  return (
    <>
      <Script
        id="pricing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <ModelTiersSection />
        <PricingSection />
      </main>
    </>
  );
}
