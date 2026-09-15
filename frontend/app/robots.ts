import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://bulk-audio-generator.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/bulk-audio/bulk-audio-login",
          "/bulk-audio/bulk-audio-register",
          "/bulk-audio/forgot-password",
          "/bulk-audio/reset-password",
          "/profile",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}