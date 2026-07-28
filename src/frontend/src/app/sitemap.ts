import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bashar.ai";
  const locales = ["en", "ar"];
  const staticRoutes = ["", "/projects", "/experience", "/blog", "/resume", "/assistant", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes for each locale
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic project routes
  try {
    const projects = await db.project.findMany({
      select: { slug: true, publishedAt: true },
    });

    for (const project of projects) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/projects/${project.slug}`,
          lastModified: project.publishedAt,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch (e) {
    console.error("Sitemap project fetch error:", e);
  }

  return entries;
}
