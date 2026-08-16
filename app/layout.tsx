import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import CartDrawer from "@/components/commerce/CartDrawer";
import { BRAND, BRAND_LINE, SITE_URL, socialProfiles } from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BRAND,
  title: {
    default: `${BRAND} — Contemporary Streetwear`,
    template: `%s | ${BRAND}`,
  },
  description:
    "THARROS is an independent streetwear label making small runs of original pieces. Designed, patterned and sampled in-house. Shop Drop 001.",
  keywords: [
    "THARROS",
    "independent streetwear",
    "small batch clothing",
    "limited run streetwear",
    "heavyweight hoodie",
    "oversized tee",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: SITE_URL,
    title: `${BRAND} — Contemporary Streetwear`,
    description: BRAND_LINE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — Contemporary Streetwear`,
    description: BRAND_LINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

/**
 * One @id-linked graph for the whole site. Page-level JSON-LD (Product,
 * BreadcrumbList) references these ids rather than restating the brand.
 */
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      url: SITE_URL,
      slogan: BRAND_LINE,
      ...(socialProfiles().length > 0 ? { sameAs: socialProfiles() } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        {/* Marks the document as scripted before first paint, so the entrance
            styles in globals.css only ever hide content that JS can bring
            back. Without this the .reveal opacity would strand sections
            invisible whenever the bundle is blocked or fails. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="1"`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(graph) }}
        />
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
