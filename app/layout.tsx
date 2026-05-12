import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tharros.ca"),
  title: {
    default: "Tharros — AI Agents for Ottawa Small Businesses",
    template: "%s | Tharros",
  },
  description:
    "Tharros builds tailored AI agents that handle customer inquiries, capture leads, and automate office admin. Keep it Canadian with our Ottawa-based studio for practical, high-performance AI solutions.",
  keywords: [
    "Keep it Canadian",
    "AI Agents Ottawa",
    "Small Business Automation",
    "Lead Capture AI",
    "Customer Support AI",
    "Ottawa Tech Studio",
    "Practical AI Solutions",
    "Automated Customer Service",
    "HVAC AI Agent",
    "Lawyer Lead Automation",
    "Contractor AI Chat",
    "Dental Clinic AI",
    "Property Management Automation",
    "After-hours lead capture",
  ],
  authors: [{ name: "Magnus Abdelnour" }],
  creator: "Tharros",
  publisher: "Tharros",
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
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
    title: "Tharros — AI Agents for Ottawa Small Businesses",
    description:
      "Practical AI agents for local trades, services, and professional offices. No code. No corporate fluff. Just something that works.",
    url: "https://tharros.ca",
    siteName: "Tharros",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tharros AI Agent Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tharros — AI Agents for Ottawa Small Businesses",
    description: "Practical AI agents that work for your small business. 24/7 automation with local Ottawa context.",
    images: ["/og-image.jpg"],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tharros",
    "image": "https://tharros.ca/og-image.jpg",
    "@id": "https://tharros.ca",
    "url": "https://tharros.ca",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ottawa",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "description": "Tailored AI agents for Ottawa small businesses. We automate lead capture, customer service, and admin tasks.",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

