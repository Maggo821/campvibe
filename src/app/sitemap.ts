import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
    },
    {
      url: "https://example.com/map",
      lastModified: new Date(),
    },
    {
      url: "https://example.com/discover",
      lastModified: new Date(),
    },
    {
      url: "https://example.com/my-places",
      lastModified: new Date(),
    },
  ];
}
