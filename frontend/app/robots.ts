// app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://bulk-audio-generator.vercel.app";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/bulk-audio/bulk-audio-login",
    "/bulk-audio/bulk-audio-register",
    "/bulk-audio/forgot-password",
    "/bulk-audio/reset-password",
    "/profile",
    "/api/",
  ];

  // ✅ Pages that must be publicly crawlable
  const allow = [
    "/",
    "/generator",              // ✅ Explicitly allow your generator
    "/bulk-audio/documentation",
    "/bulk-audio/where",
  ];

  return {
    rules: [
      // Standard search engines
      {
        userAgent: "*",
        allow,
        disallow,
      },
      // AI Search crawlers — explicitly allow for AI search visibility
      { userAgent: "GPTBot", allow, disallow },
      { userAgent: "ChatGPT-User", allow, disallow },
      { userAgent: "OAI-SearchBot", allow, disallow },
      { userAgent: "Google-Extended", allow, disallow },
      { userAgent: "PerplexityBot", allow, disallow },
      { userAgent: "ClaudeBot", allow, disallow },
      { userAgent: "Claude-Web", allow, disallow },
      { userAgent: "anthropic-ai", allow, disallow },
      { userAgent: "Applebot-Extended", allow, disallow },
      { userAgent: "Bytespider", allow, disallow },
      { userAgent: "CCBot", allow, disallow },
      { userAgent: "cohere-ai", allow, disallow },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}