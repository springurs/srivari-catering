import { ContactSection } from "../components/contact-section";
import { SiteFrame } from "../components/site-frame";
import { contactTitle, contactDescription, pageMetadata, pageStructuredData } from "../data/site-seo";

export const metadata = pageMetadata(contactTitle, contactDescription, "/contact");

export default function ContactPage() {
  return (
    <SiteFrame currentPage="contact">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData(contactTitle, contactDescription, "/contact")).replace(/</g, "\\u003c") }} />
      <ContactSection />
    </SiteFrame>
  );
}
