export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tharros.com";

export const BRAND = "THARROS";
export const BRAND_LINE = "Small runs. Original ideas.";
export const CONTACT_EMAIL = "hello@tharros.com";

/**
 * The brand ink and ground as sRGB hex.
 *
 * `globals.css` holds the real tokens in oklch, and everything that can read a
 * stylesheet should use those. These exist for the three places that cannot:
 * `next/og` renders through Satori with no stylesheet (`icon`, `apple-icon`,
 * `opengraph-image`), `global-error.tsx` catches failures in the root layout so
 * it must not depend on the CSS having loaded, and `viewport.themeColor` and
 * the web manifest are plain values in the document head.
 *
 * They were five separate literals, and they had already drifted: every one of
 * them said `#0a0a0a`/`#fafafa`, a cold black on a cold white, while the site's
 * own `--near-black` and `--paper` are the warm `#211f1c` and `#fbfaf8` below.
 * The favicon, the share card and the installed-app splash were a different
 * black from the page they belong to.
 *
 * Keep these in step with `--near-black` and `--paper` in `globals.css`.
 */
export const INK_HEX = "#211f1c";
export const PAPER_HEX = "#fbfaf8";


/**
 * THE SOCIAL DESTINATIONS, AND THEY ARE ONLY DESTINATIONS ONCE THEY NAME ONE.
 *
 * An `href` of `https://instagram.com` is not a THARROS profile, it is
 * Instagram — a footer link that sends somebody to a platform home page and
 * strands them there. `activeSocial()` drops any entry whose URL carries no
 * path, so the footer renders nothing for a platform the label is not on and
 * the structured-data `sameAs` never claims a profile that does not exist.
 *
 * Fill in a real profile URL here and the link appears, in the footer and in
 * the schema, with no component edit.
 */
export const SOCIAL = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "TikTok", href: "https://tiktok.com" },
  { name: "YouTube", href: "https://youtube.com" },
];

/** Only the entries that name an actual profile — a bare platform URL has no path. */
export function activeSocial(): { name: string; href: string }[] {
  return SOCIAL.filter((social) => {
    try {
      return new URL(social.href).pathname.replace(/\/+$/, "") !== "";
    } catch {
      return false;
    }
  });
}

/** The same set, as URLs, for schema.org `sameAs`. */
export function socialProfiles(): string[] {
  return activeSocial().map((social) => social.href);
}

/**
 * SHOP, DROP, RELEASES — the three destinations the header states out loud,
 * from `md` up. Real links, so navigation survives scripting being
 * unavailable; the index overlay behind `Menu` carries everything else.
 *
 * `Shop` is kept rather than promoted to "Collection" or "Objects" for the
 * same reason the overlay's trigger says `Menu` and not `Index`: it is the one
 * word in the set that belongs to the customer rather than to the designer.
 *
 * ACCOUNT IS NOT IN EITHER LIST. Sign-in is not connected, and a navigation
 * entry is a promise that something is there.
 */
export const NAV_PRIMARY = [
  { name: "Shop", href: "/shop" },
  { name: "Drop", href: "/drop" },
  { name: "Releases", href: "/releases" },
];

/** The full navigation surface — the index overlay. */
export const NAV_INDEX = [
  { name: "Shop", href: "/shop" },
  { name: "Current Drop", href: "/drop" },
  { name: "Releases", href: "/releases" },
  { name: "About", href: "/about" },
];

/** Restrained on purpose: a three-piece line does not need a category directory
 *  in the footer. The shop page's filter bar covers categories. */
export const FOOTER_SHOP = [
  { name: "Current Drop", href: "/drop" },
  { name: "All Pieces", href: "/shop" },
  { name: "Releases", href: "/releases" },
  { name: "Saved", href: "/wishlist" },
];

export const FOOTER_INFORMATION = [
  { name: "About", href: "/about" },
  { name: "Size Guide", href: "/size-guide" },
  { name: "Shipping", href: "/shipping" },
  { name: "Returns", href: "/returns" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

/**
 * The information set, in one order, so each page can point at the rest of it —
 * a customer answering a shipping question should not have to go back to the
 * footer to reach the returns page that answers the next one. The index is the
 * position in that sequence, which is the only thing that makes the numeral
 * mean anything.
 */
export const INFORMATION = [
  { index: "01", name: "Size guide", href: "/size-guide" },
  { index: "02", name: "Shipping", href: "/shipping" },
  { index: "03", name: "Returns", href: "/returns" },
  { index: "04", name: "FAQ", href: "/faq" },
  { index: "05", name: "Contact", href: "/contact" },
  { index: "06", name: "Privacy", href: "/legal/privacy" },
  { index: "07", name: "Terms", href: "/legal/terms" },
  { index: "08", name: "Refund policy", href: "/legal/refund-policy" },
];

export function informationIndex(href: string): string {
  return INFORMATION.find((entry) => entry.href === href)?.index ?? "01";
}

export const FOOTER_LEGAL = [
  { name: "Privacy Policy", href: "/legal/privacy" },
  { name: "Terms", href: "/legal/terms" },
  { name: "Refund Policy", href: "/legal/refund-policy" },
];
