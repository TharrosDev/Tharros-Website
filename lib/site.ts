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
 * visit could not discover that an archive or an about page existed without
 * opening a dialog and then remembering what was in it, and with
 * scripting unavailable the dialog's trigger is a `<button>` that does nothing,
 * so the footer was the site's entire navigation.
 *
 * These are a subset of `NAV_INDEX`, not a second list: the overlay stays the
 * full surface and still carries About, Saved, Account and Search. Three is the
 * count that fits beside the wordmark at `md` without wrapping.
 *
 * SHOP, DROP, ARCHIVE — and that is now the whole site. What you can buy, what
 * is out, what has been made.
 *
 * `Shop` is kept rather than promoted to "Collection" or "Objects" for the same
 * reason the overlay's trigger says `Menu` and not `Index`: it is the one word
 * in the set that belongs to the customer rather than to the designer.
 *
 * The site used to also carry a lookbook, a journal and a studio page. They
 * were removed because they were four different presentations of the same
 * drop — campaign photography, writing about the making, and a process
 * sequence, each with its own route and its own navigation slot. What survived
 * of them lives on the pages that were already going to be visited: the
 * campaign on the home page and the drop, the process as a home page section.
 */
export const NAV_PRIMARY = [
  { name: "Shop", href: "/shop" },
  { name: "Drop", href: "/drop" },
  { name: "Archive", href: "/archive" },
];

/** The full navigation surface — the index overlay. */
export const NAV_INDEX = [
  { name: "Shop", href: "/shop" },
  { name: "Current Drop", href: "/drop" },
  { name: "Archive", href: "/archive" },
  { name: "About", href: "/about" },
];

/** Restrained on purpose: a nine-piece line does not need a category directory
 *  in the footer. The shop page's filter bar covers categories. */
export const FOOTER_SHOP = [
  { name: "Current Drop", href: "/drop" },
  { name: "All Pieces", href: "/shop" },
  { name: "Archive", href: "/archive" },
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
