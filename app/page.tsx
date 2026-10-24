import { CateringHome } from "./components/catering-home";
import { SiteFrame } from "./components/site-frame";
import { AboutSection } from "./components/about-section";
import { PageActivity } from "./components/site-activity";
import { homeTitle, homeDescription, pageMetadata, pageStructuredData } from "./data/site-seo";

export const metadata = pageMetadata(homeTitle, homeDescription, "/");

export default function Home() {
  return (
    <SiteFrame>
      <PageActivity />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData(homeTitle, homeDescription, "/")).replace(/</g, "\\u003c") }} />
      <CateringHome />
      <AboutSection />
    </SiteFrame>
  );
}
