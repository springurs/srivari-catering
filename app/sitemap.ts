import type { MetadataRoute } from "next";
import { siteUrl } from "./data/site-seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, images: [`${siteUrl}/images/about-thali.jpg`, `${siteUrl}/images/elegant-buffet.png`] },
    { url: `${siteUrl}/contact` },
  ];
}
