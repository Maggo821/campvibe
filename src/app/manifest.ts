import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CampVibe",
    short_name: "CampVibe",
    description: "A vanlife-first place companion for discovering and organizing overnight stays.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7ed",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
