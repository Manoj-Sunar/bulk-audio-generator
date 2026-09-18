// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bulk Audio Generator",
    short_name: "Bulk Audio",
    description: "Generate 100+ AI voice clips in seconds for AI videos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    orientation: "portrait",
    icons: [
      // ✅ तपाईंको actual files अनुसार
      { src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}