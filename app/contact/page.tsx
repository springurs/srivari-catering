import type { Metadata } from "next";
import { ContactSection } from "../components/contact-section";
import { SiteFrame } from "../components/site-frame";

export const metadata: Metadata = {
  title: "Contact Us | Srivari Catering",
  description: "Visit Srivari at 3180 Santa Rita Rd, Pleasanton, CA 94566. Find us on the map and send an enquiry with our simple contact form.",
};

export default function ContactPage() {
  return (
    <SiteFrame currentPage="contact">
      <ContactSection />
    </SiteFrame>
  );
}
