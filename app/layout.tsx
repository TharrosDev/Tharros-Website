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
    default: "Tharros | Keep it Local, Keep it Canadian | AI Agent Consulting & Coaching for Ottawa Small Businesses",
    template: "%s | Tharros AI Consulting",
  },
  description:
    "Keep it Local, Keep it Canadian. AI agent consulting and coaching for Ottawa trades and small business owners. We teach you to set up AI agents you actually own, no agency lock-in.",
  keywords: [
    "AI Agent Consulting Ottawa",
    "AI Coaching for Small Business",
    "AI Agent Training",
    "AI Consultant Ottawa",
    "Learn to Build AI Agents",
    "No-Code AI Coaching",
    "AI Workshops for Small Business",
    "AI Strategy Coaching",
    "Ottawa AI Consulting",
    "AI Implementation Coaching",
    "AI Agent Setup Help",
    "AI Mentoring Small Business",
    "Fractional AI Lead",
    "AI Advisory Retainer",
    "AI Skills Training Ottawa",
    "Custom AI Agent Coaching",
    "LLM Coaching for Business Owners",
    "GPT Coaching for Trades",
    "Anthropic Claude Coaching",
    "AI Customer Service Coaching",
    "AI Intake Setup Training",
    "AI Appointment Setting Coaching",
    "Smart AI Receptionist Setup",
    "AI Consulting for SMB",
    "Tharros AI Consulting",
    "AI Strategy for Trades",
    "Contractor AI Coaching",
    "Legal AI Coaching",
    "Medical AI Consulting Ottawa",
    "Real Estate AI Coaching",
    "AI SDR Coaching",
    "AI Office Admin Training",
    "Kanata AI Consulting",
    "Nepean AI Coaching",
    "Stittsville AI Consulting",
    "Orleans AI Coaching",
    "Barrhaven AI Consulting",
    "Ottawa Tech Coaching",
    "HVAC AI Coaching",
    "Plumbing AI Setup",
    "Roofing AI Coaching",
    "Dental Office AI Coaching",
    "Veterinary AI Setup",
    "Auto Repair AI Coaching",
    "Knowledge Management Coaching",
    "AI Skill Transfer Ottawa",
    "Keep it Local",
    "Keep it Canadian",
    "Tharros Slogan",
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
    title: "Tharros | Keep it Local, Keep it Canadian | AI Agent Coaching for Ottawa",
    description:
      "Keep it Local, Keep it Canadian. AI agent consulting and coaching for Ottawa trades and small businesses. We sit beside you and teach you to set up agents you actually own. No agency lock-in.",
    url: "https://tharros.ca",
    siteName: "Tharros AI Consulting",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros AI Consulting Ottawa - Coaching for Small Business Owners",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros | Keep it Local, Keep it Canadian",
    description: "Keep it Local, Keep it Canadian. AI agent consulting and coaching for Ottawa small businesses. We teach you to set up the agents, not sell them to you.",
    images: ["/og-image.jpg"],
    creator: "@TharrosAI",
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tharros AI Consulting",
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
      "slogan": "We teach you to own it.",
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
      "description": "Keep it Local, Keep it Canadian. AI agent consulting and coaching for Ottawa trades and small businesses. We teach owners and operators to set up AI agents for lead capture and office admin.",
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
      "serviceType": "AI Agent Consulting and Coaching",
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
        "name": "AI Coaching Engagements",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Coaching Sprint",
              "description": "A two-week, hands-on coaching engagement that walks an owner through standing up their first AI agent."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Operator Program",
              "description": "A multi-week coaching program for small business teams to set up CRM-connected AI agents and document an internal playbook."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Fractional AI Lead",
              "description": "A monthly advisory retainer for ongoing AI agent rollouts, tuning, and roadmap reviews."
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

