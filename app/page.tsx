import { CateringHome } from "./components/catering-home";
import { SiteFrame } from "./components/site-frame";
import { AboutSection } from "./components/about-section";

export default function Home() {
  return (
    <SiteFrame>
      <CateringHome />
      <AboutSection />
    </SiteFrame>
  );
}
