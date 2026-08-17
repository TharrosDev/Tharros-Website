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

/**
 * The three destinations the header states out loud, from `md` up.
 *
 * The index overlay used to be the only navigation surface at any width, which
 * meant the visible chrome on every route was a wordmark, a three-character
 * stamp, the word "Index" and a bag — nothing naming a place to go. A first
 * visit could not discover that a lookbook, a journal or an about page existed
 * without opening a dialog and then remembering what was in it, and with
 * scripting unavailable the dialog's trigger is a `<button>` that does nothing,
 * so the footer was the site's entire navigation.
 *
 * These are a subset of `NAV_INDEX`, not a second list: the overlay stays the
 * full surface and still carries About, Journal, Saved, Account and Search.
 * Three is the count that fits beside the wordmark at `md` without wrapping.
 */
export const NAV_PRIMARY = [
  { name: "Shop", href: "/shop" },
  { name: "Drop", href: "/drop" },
  { name: "Lookbook", href: "/lookbook" },
];

/** The full navigation surface — the index overlay. */
export const NAV_INDEX = [
  { name: "Shop", href: "/shop" },
  { name: "Current Drop", href: "/drop" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
];

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

/**
 * The information set, in one order.
 *
 * Eight routes each opened on the index "01", which makes the mono numeral
 * decorative — it is supposed to place a section in a sequence. They are one
 * sequence, so they are numbered as one, and each page can point at the rest of
 * it. A customer answering a shipping question used to have to go back to the
 * footer to reach the returns page that answers the next one.
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
