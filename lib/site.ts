export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tharros.com";

export const BRAND = "THARROS";
export const BRAND_LINE = "Built for those who don't blend in.";
export const CONTACT_EMAIL = "hello@tharros.com";

export const SOCIAL = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "TikTok", href: "https://tiktok.com" },
  { name: "YouTube", href: "https://youtube.com" },
];

export const NAV_PRIMARY = [
  { name: "Shop", href: "/shop" },
  { name: "New Drop", href: "/new" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "About", href: "/about" },
];

export const NAV_MOBILE = [...NAV_PRIMARY, { name: "Journal", href: "/journal" }];

export const FOOTER_SHOP = [
  { name: "New Arrivals", href: "/new" },
  { name: "T-Shirts", href: "/shop?category=t-shirts" },
  { name: "Hoodies", href: "/shop?category=hoodies" },
  { name: "Sweatshirts", href: "/shop?category=sweatshirts" },
  { name: "Pants", href: "/shop?category=pants" },
  { name: "Outerwear", href: "/shop?category=outerwear" },
  { name: "Accessories", href: "/shop?category=accessories" },
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
