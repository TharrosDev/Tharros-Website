import { MetadataRoute } from "next";

const SITE_URL = "https://tharros.ca";

export default function robots(): MetadataRoute.Robots {
  // Routes that should never be crawled: admin UI, API surface, Next internals.
  const disallow = ["/admin/", "/api/", "/_next/", "/_vercel/"];

  return {
    rules: [
      // Default catch-all: everyone gets to crawl the public site.
      { userAgent: "*", allow: "/", disallow },

      // Major web search crawlers (explicit allowlist so future restrictive
      // changes never accidentally exclude them).
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/", disallow },
      { userAgent: "Bingbot", allow: "/", disallow },
      { userAgent: "DuckDuckBot", allow: "/", disallow },
      { userAgent: "Slurp", allow: "/", disallow },
      { userAgent: "YandexBot", allow: "/", disallow },
      { userAgent: "Applebot", allow: "/", disallow },
      { userAgent: "MojeekBot", allow: "/", disallow },
      { userAgent: "SeznamBot", allow: "/", disallow },
      { userAgent: "PetalBot", allow: "/", disallow },
      { userAgent: "Bravebot", allow: "/", disallow },
      { userAgent: "Kagibot", allow: "/", disallow },
      { userAgent: "YouBot", allow: "/", disallow },

      // AI search + answer engines (the bots that surface site content inside
      // ChatGPT, Claude, Perplexity, Gemini, Copilot, Apple Intelligence, etc.)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ChatGPT-User/2.0", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "MistralAI-User", allow: "/" },
      { userAgent: "Mistral-User", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Cohere-Training-Data-Crawler", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "TimpiBot", allow: "/" },
      { userAgent: "PanguBot", allow: "/" },
      { userAgent: "Quillbot", allow: "/" },

      // Social preview / link unfurl bots — needed for OG cards in chat apps.
      { userAgent: "FacebookExternalHit", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
      { userAgent: "LinkedInBot", allow: "/" },
      { userAgent: "Slackbot", allow: "/" },
      { userAgent: "Slackbot-LinkExpanding", allow: "/" },
      { userAgent: "Discordbot", allow: "/" },
      { userAgent: "TelegramBot", allow: "/" },
      { userAgent: "WhatsApp", allow: "/" },
      { userAgent: "Snapchat", allow: "/" },
      { userAgent: "Pinterestbot", allow: "/" },

      // Commercial SEO crawlers (Ahrefs, Semrush, Moz, Majestic, etc.) used
      // to be blocked here. Allowing them now because Tharros wants maximum
      // discoverability and the crawl cost is negligible.
      { userAgent: "AhrefsBot", allow: "/", disallow },
      { userAgent: "SemrushBot", allow: "/", disallow },
      { userAgent: "DotBot", allow: "/", disallow },
      { userAgent: "MJ12bot", allow: "/", disallow },
      { userAgent: "rogerbot", allow: "/", disallow },
      { userAgent: "AhrefsSiteAudit", allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
