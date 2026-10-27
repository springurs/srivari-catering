import { CateringHome } from "./components/catering-home";
import { SiteFrame } from "./components/site-frame";
import { AboutSection } from "./components/about-section";
import { ALaCarteSection } from "./components/a-la-carte-section";
import { SignatureTraysSection } from "./components/signature-trays-section";
import { OrderingPartners } from "./components/ordering-partners";
import { HomeFaqs } from "./components/catering-faq";
import { PageActivity } from "./components/site-activity";
import { homeTitle, homeDescription, pageMetadata, pageStructuredData } from "./data/site-seo";

export const metadata = pageMetadata(homeTitle, homeDescription, "/");

export default function Home() {
  return (
    <SiteFrame>
      <PageActivity />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData(homeTitle, homeDescription, "/")).replace(/</g, "\\u003c") }} />
      <CateringHome />
      <OrderingPartners />
      <AboutSection />
      <SignatureTraysSection />
      <ALaCarteSection />
      <HomeFaqs />
    </SiteFrame>
  );
}
