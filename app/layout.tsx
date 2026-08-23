import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import MotionRuntime from "@/components/motion/MotionRuntime";
import RouteCurtain from "@/components/motion/RouteCurtain";
import EntrySequence from "@/components/motion/EntrySequence";
import CartDrawer from "@/components/commerce/CartDrawer";
import {
  BRAND,
  BRAND_LINE,
  CONTACT_EMAIL,
  INK_HEX,
  SITE_URL,
  socialProfiles,
} from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";

/** Loaded as a variable font rather than pinned to 700/800, so weight is an
 *  available axis for hierarchy instead of a two-step choice. */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
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
  themeColor: INK_HEX,
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
  // The manifest existed in `public/` and nothing ever asked for it, so the
  // install prompt, the home-screen name and the splash colours were all
  // sitting unused — and the CSP already carried a `manifest-src` for it.
  manifest: "/manifest.json",
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
      // The generated app icon. Without a logo the node is not eligible for a
      // knowledge panel at all, and this is a real image endpoint rather than
      // a promise of an asset that does not exist yet.
      logo: `${SITE_URL}/icon`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        availableLanguage: "English",
      },
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
  // `suppressHydrationWarning`: the head script below sets `data-js` on this
  // element before React hydrates, so the client tree carries an attribute the
  // server HTML cannot have. The suppression covers only this element's own
  // attributes — children still report mismatches normally.
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as scripted before first paint, so the entrance
            styles in globals.css only ever hide content that JS can bring
            back. Without this the .reveal opacity would strand sections
            invisible whenever the bundle is blocked or fails.

            The timer is the other half of that guarantee. `data-js` covers
            scripting being absent; it does nothing about scripting being
            present at first paint and then failing — the attribute is set, the
            bundle 404s, and every entrance stays at opacity 0 with nothing
            left to restore it. `MotionRuntime` clears this on boot, so the
            only way it fires is if the runtime never arrived. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'document.documentElement.dataset.js="1";' +
              "window.__tharrosMotion=setTimeout(function(){" +
              'document.documentElement.dataset.motion="off"' +
              "},3500);" +
              // The opening sequence is armed HERE rather than in React, so a
              // repeat visit never flashes a curtain that a later effect then
              // removes. Three conditions, all of which have to hold: the home
              // page, the first view of this session, and no stated preference
              // for less motion.
              "try{if(location.pathname===\"/\"&&!sessionStorage.getItem(\"tharros:entered\")" +
              "&&!matchMedia(\"(prefers-reduced-motion: reduce)\").matches){" +
              'document.documentElement.dataset.entry="1";' +
              'sessionStorage.setItem("tharros:entered","1")' +
              "}}catch(e){}",
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(graph) }}
        />
        <Providers>
          <MotionRuntime />
          <RouteCurtain />
          <EntrySequence />
          <Header />
          {/* `tabIndex={-1}` so the skip link actually moves focus rather than
              only scrolling. A plain `#main` anchor sets Chrome's sequential
              navigation point and nothing else: `document.activeElement` stays
              on `<body>`, and in Safari the next Tab returns to the top of the
              page — which makes the site's first tab stop a control that
              appears to do nothing. */}
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
