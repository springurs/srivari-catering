import type { MetadataRoute } from "next";
import { indexedPaths, siteUrl } from "./data/site-seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexedPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    ...(path === "/" ? { images: [`${siteUrl}/images/about-thali.jpg`, `${siteUrl}/images/diwali-hero.webp`] } : {}),
  }));
}
