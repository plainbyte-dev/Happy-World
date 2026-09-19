import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site-content";
import { getAllPackageSlugs } from "@/lib/packages";

const SITE_URL = "https://www.happyworldtt.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { tripsMenu } = await getSiteContent();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/tour-types", "/contact"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = tripsMenu.map((category) => ({
    url: `${SITE_URL}/tour-types/${category.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const packageSlugs = await getAllPackageSlugs();
  const packageRoutes: MetadataRoute.Sitemap = packageSlugs.map((slug) => ({
    url: `${SITE_URL}/packages/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...packageRoutes];
}
