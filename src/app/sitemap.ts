import type { MetadataRoute } from "next";
import { mktuClasses } from "@/data/mktu-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mktu.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 45 страниц классов МКТУ
  const classPages: MetadataRoute.Sitemap = mktuClasses.map((cls) => ({
    url: `${BASE_URL}/class/${cls.id}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticPages, ...classPages];
}
