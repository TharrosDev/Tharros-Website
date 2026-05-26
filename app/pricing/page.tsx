import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/SectionSkeleton";
import { Metadata } from "next";
import Script from "next/script";

import LaunchCountdown from "@/components/LaunchCountdown";

const ModelTiersSection = dynamic(() => import("@/components/ModelTiersSection"), { loading: () => <SectionSkeleton /> });
const PricingSection = dynamic(() => import("@/components/PricingSection"), { loading: () => <SectionSkeleton /> });

const SITE_URL = "https://tharros.ca";
const PAGE_URL = `${SITE_URL}/pricing`;

// Launch promotion window — discounted build fees on The Refresh and The On-Call.
const LAUNCH_END_ISO = "2026-08-31T23:59:59-04:00";
const launchActive = Date.now() < new Date(LAUNCH_END_ISO).getTime();

export const metadata: Metadata = {
  title: "Pricing — The Refresh, The On-Call, The Integrate",
  description:
    "Three builds with starting prices. The Refresh (site only, from $1,000), The On-Call (site + monthly retainer, from $1,500), and The Integrate (site + AI agent + retainer, from $3,000). Final scope after a free discovery call. Launch pricing on now. Keep it Local, Keep it Canadian.",
  keywords: [
    "Ottawa Web Development Pricing",
    "AI Agent Integration Cost Ottawa",
    "On-Call Web Retainer Ottawa",
    "Website Maintenance Retainer Ottawa",
    "Per-Call Web Support Ottawa",
    "Website and AI Agent Package",
    "Ottawa Website Launch Offer",
    "The Refresh",
    "The On-Call",
    "The Integrate",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Pricing — The Refresh, The On-Call, The Integrate | Tharros",
    description:
      "Three builds with starting prices. The Refresh (site), The On-Call (site + retainer), and The Integrate (site + AI agent + retainer). Launch pricing on now.",
    url: PAGE_URL,
    siteName: "Tharros",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros pricing — The Refresh, The On-Call, The Integrate.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — The Refresh, The On-Call, The Integrate | Tharros",
    description:
      "Three builds with starting prices, scoped to the work. Per-call support or a flat monthly retainer. Launch pricing on now. Keep it Local, Keep it Canadian.",
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
      name: "Pricing — The Refresh, The On-Call, The Integrate | Tharros",
      description:
        "How Tharros prices website and AI agent builds: three packages with starting prices, scoped to the work. The Refresh (site, from $1,000), The On-Call (site + monthly retainer, from $1,500), The Integrate (site + AI agent + retainer, from $3,000). Launch pricing on The Refresh and The On-Call through August 31, 2026.",
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
        <h1 className="sr-only">Tharros pricing: The Refresh, The On-Call, and The Integrate</h1>
        {launchActive && <LaunchCountdown endIso={LAUNCH_END_ISO} />}
        <ModelTiersSection isFirstOnPage={!launchActive} />
        <PricingSection />
      </main>
    </>
  );
}
