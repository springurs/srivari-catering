import Link from "next/link";
import { FaqList } from "../components/catering-faq";
import { Icon } from "../components/catering-icons";
import { SiteFrame } from "../components/site-frame";
import { faqCategories } from "../data/catering-faq";
import { faqTitle, faqDescription, pageMetadata, pageStructuredData } from "../data/site-seo";

export const metadata = pageMetadata(faqTitle, faqDescription, "/faq");

export default function FaqPage() {
  return (
    <SiteFrame currentPage="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData(faqTitle, faqDescription, "/faq")).replace(/</g, "\\u003c") }} />
      <div className="faq-page">
        <nav className="page-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Catering FAQs</span></nav>
        <header className="faq-page-intro">
          <p className="eyebrow">SRIVARI CATERING · PLEASANTON</p>
          <h1>Catering FAQs</h1>
          <p>From your first menu idea to your event-day arrangements, find answers about vegetarian packages, individual trays, dietary requests, live dosa, Diwali, and ordering Srivari on ezCater.</p>
          <Link className="button" href="/contact">Ask our catering team <Icon name="arrow" /></Link>
        </header>
        <nav className="faq-topics" aria-label="FAQ topics">
          {faqCategories.map((category) => <a key={category.id} href={`#${category.id}`}>{category.title} <Icon name="arrow" /></a>)}
        </nav>
        <div className="faq-categories">
          {faqCategories.map((category, index) => (
            <section className="faq-category" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
              <h2 id={`${category.id}-title`}>{category.title}</h2>
              <FaqList items={category.items} openFirst={index === 0} />
            </section>
          ))}
        </div>
        <aside className="faq-contact" aria-labelledby="faq-contact-title">
          <div><h2 id="faq-contact-title">Let’s plan your gathering.</h2><p>Share your date, guest count, location, and favourite dishes. We’ll help you confirm the menu and arrangements.</p></div>
          <a className="button" href="tel:+14088930438">Call (408) 893-0438 <Icon name="arrow" /></a>
        </aside>
      </div>
    </SiteFrame>
  );
}
