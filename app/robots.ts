import { MetadataRoute } from "next";

const SITE_URL = "https://tharros.ca";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/_next/", "/_vercel/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Bingbot", allow: "/", disallow },
      { userAgent: "DuckDuckBot", allow: "/", disallow },
      { userAgent: "Slurp", allow: "/", disallow },
      { userAgent: "YandexBot", allow: "/", disallow },
      { userAgent: "Applebot", allow: "/", disallow },

      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      { userAgent: "FacebookExternalHit", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },

      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
