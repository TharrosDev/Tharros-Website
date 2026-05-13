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
    default: "Tharros | Keep it Local, Keep it Canadian | Custom AI Agents for Ottawa Small Businesses",
    template: "%s | Tharros AI Studio",
  },
  description:
    "Keep it Local, Keep it Canadian. Recovering time. Rescuing revenue. Tharros engineers high-performance AI agents for Ottawa trades and small businesses. Automate lead capture and admin with 24/7 autonomous intelligence.",
  keywords: [
    "AI Agents Ottawa",
    "Autonomous AI Agents",
    "AI Business Automation",
    "Intelligent Agents for Small Business",
    "AI Lead Capture Systems",
    "Agentic Workflow Automation",
    "Ottawa AI Studio",
    "Custom AI Agent Development",
    "LLM Business Integration",
    "GPT-4 Business Agents",
    "Anthropic Claude Business Solutions",
    "AI Customer Service Agents",
    "Automated AI Intake Portal",
    "AI Appointment Setting",
    "Smart AI Receptionists",
    "Industrial AI Solutions",
    "Enterprise AI Agents for SMB",
    "Tharros AI Automation",
    "Ottawa AI Consulting",
    "AI Strategy for Trades",
    "Contractor AI Agents",
    "Legal AI Intake Agents",
    "Medical AI Assistants Ottawa",
    "Real Estate AI Agents",
    "AI SDR for Small Business",
    "Autonomous Office Admin AI",
    "Kanata AI Solutions",
    "Nepean Business Automation",
    "Stittsville AI Consulting",
    "Orleans Lead Capture",
    "Barrhaven AI Agents",
    "Ottawa Tech Automation",
    "HVAC AI Intake",
    "Plumbing AI Customer Service",
    "Roofing Lead Generation AI",
    "Dental Office AI Assistant",
    "Veterinary AI Intake",
    "Auto Repair AI Agent",
    "Knowledge Management AI",
    "Digital Workforce Ottawa",
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
    title: "Tharros | Keep it Local, Keep it Canadian | AI Agents for Ottawa",
    description:
      "Keep it Local, Keep it Canadian. Recovering time. Rescuing revenue. Recover your time and capture every lead with practical AI agents built for local trades and small businesses in Ottawa. No corporate fluff, just performance.",
    url: "https://tharros.ca",
    siteName: "Tharros AI Studio",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros AI Agent Studio Ottawa - High Density Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros | Keep it Local, Keep it Canadian",
    description: "Keep it Local, Keep it Canadian. Recovering time. Rescuing revenue. High-performance AI agents for your local business. 24/7 lead capture and admin automation with Ottawa-specific context.",
    images: ["/og-image.jpg"],
    creator: "@TharrosAI",
  },
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tharros AI",
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
      "alternateName": "Tharros AI Studio",
      "slogan": "Recovering time. Rescuing revenue.",
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
      "description": "Keep it Local, Keep it Canadian. Recovering time. Rescuing revenue. Custom AI agents for Ottawa trades and small businesses. Automating lead capture and office admin.",
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
      "serviceType": "AI Automation and Agent Development",
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
        "name": "AI Agent Solutions",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Autonomous Lead Intake Agent",
              "description": "24/7 lead capture and qualification agent for small businesses."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Customer Inquiry Automation",
              "description": "Instant answers for common business questions via AI."
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

