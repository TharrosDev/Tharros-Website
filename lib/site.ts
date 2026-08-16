export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tharros.com";

export const BRAND = "THARROS";
export const BRAND_LINE = "Small runs. Original ideas.";
export const CONTACT_EMAIL = "hello@tharros.com";

/** Placeholder until the accounts exist. These point at the platforms, not at
 *  THARROS profiles, so they are deliberately excluded from the structured-data
 *  `sameAs` by `socialProfiles()` — claiming them would assert ownership of a
 *  profile the label does not have. Replace the hrefs with real profile URLs
 *  and they start being published with no further change. */
export const SOCIAL = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "TikTok", href: "https://tiktok.com" },
  { name: "YouTube", href: "https://youtube.com" },
];

/** Only entries that name an actual profile — a bare platform URL has no path. */
export function socialProfiles(): string[] {
  return SOCIAL.filter((social) => {
    try {
      return new URL(social.href).pathname.replace(/\/+$/, "") !== "";
    } catch {
      return false;
    }
  }).map((social) => social.href);
}

export const NAV_PRIMARY = [
  { name: "Shop", href: "/shop" },
  { name: "Current Drop", href: "/drop" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "About", href: "/about" },
];

export const NAV_MOBILE = [...NAV_PRIMARY, { name: "Journal", href: "/journal" }];

/** Restrained on purpose: a nine-piece line does not need a category directory
 *  in the footer. The shop page's filter bar covers categories. */
export const FOOTER_SHOP = [
  { name: "Current Drop", href: "/drop" },
  { name: "All Pieces", href: "/shop" },
  { name: "Saved", href: "/wishlist" },
];

export const FOOTER_INFORMATION = [
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
  { name: "Size Guide", href: "/size-guide" },
  { name: "Shipping", href: "/shipping" },
  { name: "Returns", href: "/returns" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export const FOOTER_LEGAL = [
  { name: "Privacy Policy", href: "/legal/privacy" },
  { name: "Terms", href: "/legal/terms" },
  { name: "Refund Policy", href: "/legal/refund-policy" },
];
