import type { Metadata } from "next";

const configuredUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://srivaricatering.com");
if (configuredUrl.protocol !== "https:" || configuredUrl.username || configuredUrl.password || configuredUrl.pathname !== "/" || configuredUrl.search || configuredUrl.hash) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be the public HTTPS origin of the catering website.");
}

export const siteUrl = configuredUrl.origin;
export const siteName = "Srivari Catering";
export const homeTitle = "Vegetarian Catering in Pleasanton, CA | Srivari Catering";
export const homeDescription = "Indian vegetarian catering in Pleasanton for weddings, corporate events and festivals. Explore Andhra thalis, North Indian menus and live dosa catering.";
export const contactTitle = "Catering Enquiries in Pleasanton | Srivari Catering";
export const contactDescription = "Request a vegetarian catering quote for weddings, office meals or live dosa events. Contact Srivari at 3180 Santa Rita Rd, Pleasanton, CA 94566.";

export function pageMetadata(title: string, description: string, path: "/" | "/contact"): Metadata {
  const url = new URL(path, siteUrl).toString();
  const image = {
    url: `${siteUrl}/images/about-thali.jpg`,
    width: 1436,
    height: 1600,
    alt: "Srivari Indian vegetarian thali with rice, curries, chapati and accompaniments",
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName, type: "website", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function pageStructuredData(title: string, description: string, path: "/" | "/contact") {
  const url = new URL(path, siteUrl).toString();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${siteUrl}/#business`,
        name: "Srivari",
        alternateName: siteName,
        description: homeDescription,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon.png`,
        image: `${siteUrl}/images/about-thali.jpg`,
        telephone: "+19252013640",
        email: "srivaripleasanton@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "3180 Santa Rita Rd",
          addressLocality: "Pleasanton",
          addressRegion: "CA",
          postalCode: "94566",
          addressCountry: "US",
        },
        servesCuisine: ["Indian Vegetarian", "South Indian", "Andhra", "Tamil", "North Indian"],
        hasMenu: "https://www.srivaripleasanton.com/#menu",
        hasMap: "https://www.google.com/maps/search/?api=1&query=3180%20Santa%20Rita%20Rd%2C%20Pleasanton%2C%20CA%2094566",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "catering enquiries",
          telephone: "+14088930438",
          email: "srivaripleasanton@gmail.com",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: `${siteUrl}/`,
        publisher: { "@id": `${siteUrl}/#business` },
        inLanguage: "en-US",
      },
      {
        "@type": path === "/contact" ? "ContactPage" : "WebPage",
        "@id": `${url}#webpage`,
        name: title,
        description,
        url,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#business` },
        inLanguage: "en-US",
      },
    ],
  };
}
