import { ContactSection } from "../components/contact-section";
import Link from "next/link";
import { SiteFrame } from "../components/site-frame";
import { PageActivity } from "../components/site-activity";
import { contactTitle, contactDescription, pageMetadata, pageStructuredData } from "../data/site-seo";

export const metadata = pageMetadata(contactTitle, contactDescription, "/contact");

export default function ContactPage() {
  return (
    <SiteFrame currentPage="contact">
      <PageActivity />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData(contactTitle, contactDescription, "/contact")).replace(/</g, "\\u003c") }} />
      <nav className="page-breadcrumbs contact-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact Us</span></nav>
      <ContactSection />
    </SiteFrame>
  );
}
