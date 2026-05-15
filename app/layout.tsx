import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PageTransition from "@/components/PageTransition";
import NavBar from "@/components/NavBar";
import BackToTop from "@/components/BackToTop";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tharros.ca"),
  title: {
    default: "Tharros | Keep it Local, Keep it Canadian | Website Modernization & AI Agent Integration for Ottawa Small Businesses",
    template: "%s | Tharros",
  },
  description:
    "Keep it Local, Keep it Canadian. Website modernization, AI agent integration, and an On-Call retainer for Ottawa trades and small businesses. We build the site, embed the agent, and stay reachable when things change.",
  keywords: [
    "Website Modernization Ottawa",
    "Small Business Website Redesign Ottawa",
    "AI Agent Integration Ottawa",
    "AI Agent Build Ottawa",
    "Embed AI Agent on Website",
    "Ottawa Web Development with AI",
    "AI Customer Service Agent Ottawa",
    "AI Lead Capture Agent Ottawa",
    "AI After-Hours Intake Agent",
    "Ottawa AI Consulting",
    "AI Agent for Small Business",
    "On-Call Web Retainer Ottawa",
    "Website and AI Agent Package",
    "Ottawa Small Business Website",
    "Ottawa Trades Website",
    "HVAC Website Ottawa",
    "Plumbing Website Ottawa",
    "Roofing Website Ottawa",
    "Dental Office Website Ottawa",
    "Law Firm Website Ottawa",
    "Contractor Website Ottawa",
    "Kanata Small Business Website",
    "Nepean Small Business Website",
    "Barrhaven Small Business Website",
    "Orleans Small Business Website",
    "Stittsville Small Business Website",
    "Ottawa Local Business AI",
    "AI Receptionist for Small Business",
    "AI Inquiry Agent Ottawa",
    "AI Intake Automation Ottawa",
    "CRM Integration Ottawa",
    "Per-Call Web Support Ottawa",
    "Monthly Retainer Web Ottawa",
    "Tharros",
    "Keep it Local",
    "Keep it Canadian",
    "Keep it Local Keep it Canadian",
  ],
  authors: [{ name: "Magnus Abdelnour" }],
  creator: "Tharros",
  publisher: "Tharros",
  category: "technology",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Tharros | Keep it Local, Keep it Canadian | Website Modernization & AI Agent Integration for Ottawa",
    description:
      "Keep it Local, Keep it Canadian. Website modernization, AI agent integration, and an On-Call retainer for Ottawa trades and small businesses. We build the site, embed the agent, and stay reachable when things change.",
    url: "https://tharros.ca",
    siteName: "Tharros",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros Ottawa - Website Modernization & AI Agent Integration for Small Businesses | Keep it Local, Keep it Canadian",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros | Keep it Local, Keep it Canadian",
    description: "Keep it Local, Keep it Canadian. Website modernization, AI agent integration, and an On-Call retainer for Ottawa small businesses. One team, end-to-end.",
    images: ["/og-image.jpg"],
    creator: "@TharrosAI",
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tharros",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Tharros",
      "alternateName": "Tharros AI Consulting",
      "slogan": "Keep it Local, Keep it Canadian.",
      "url": "https://tharros.ca",
      "logo": "https://tharros.ca/tharros-logo.svg",
      "sameAs": [
        "https://linkedin.com/company/tharros-ai"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "email": "tharrosdev@gmail.com",
        "areaServed": "CA",
        "availableLanguage": "en"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Tharros",
      "image": "https://tharros.ca/og-image.jpg",
      "@id": "https://tharros.ca",
      "url": "https://tharros.ca",
      "telephone": "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Kanata",
        "addressLocality": "Ottawa",
        "addressRegion": "ON",
        "postalCode": "K2K",
        "addressCountry": "CA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 45.3483,
        "longitude": -75.9103
      },
      "description": "Keep it Local, Keep it Canadian. Website modernization, AI agent integration, and an On-Call retainer for Ottawa trades and small businesses. We build the site, embed the agent, and stay reachable when things change.",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      "priceRange": "$$"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Website Modernization and AI Agent Integration",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tharros"
      },
      "areaServed": {
        "@type": "City",
        "name": "Ottawa"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Website and AI Agent Build Packages",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "The Refresh",
              "description": "Project-based website modernization for Ottawa small businesses. We update the design, copy, and structure so your front door reflects the operation behind it. Fixes and changes after launch are billed per call."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "The Integrate",
              "description": "Website modernization plus a custom AI agent built and embedded directly into the site. Covers customer inquiry, lead capture, or after-hours intake. Fixes and additional agents after launch are billed per call."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "The On-Call",
              "description": "Website modernization plus AI agent integration, followed by a monthly On-Call retainer. We stay on call for fixes, site improvements, and unlimited new agent builds while the retainer runs."
            }
          }
        ]
      }
    }
  ];

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://api-bc654b.stack.relevance.ai" />
        <link rel="dns-prefetch" href="https://api-bc654b.stack.relevance.ai" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NavBar />
        <PageTransition>{children}</PageTransition>
        <BackToTop />
        <Analytics />
      </body>
    </html>
  );
}

