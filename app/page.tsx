import Image from "next/image";
import { OccasionPackages } from "./components/catering-interactions";
import { Icon } from "./components/catering-icons";
import { SiteFrame } from "./components/site-frame";
import { AboutSection } from "./components/about-section";

export default function Home() {
  return (
    <SiteFrame>
      <section className="hero" aria-labelledby="hero-title">
        <Image className="hero-image" src="/images/elegant-buffet.png" alt="An elegant vegetarian catering buffet with plated appetisers, flowers, and golden event lighting" fill sizes="(max-width: 760px) 100vw, calc(100vw - 180px)" priority />
        <div className="hero-copy">
          <p className="eyebrow">EXCEPTIONAL FOOD FOR<br />LIFE’S SPECIAL MOMENTS</p>
          <span className="gold-rule" aria-hidden="true" />
          <h1 id="hero-title">Catering<br />Made Memorable</h1>
          <p>Delicious food. Beautiful presentation. Unforgettable experiences.<br className="desktop-break" /> From intimate gatherings to grand celebrations, bring people together over your favourite flavours.</p>
          <a className="button" href="#occasions">EXPLORE OUR MENUS <Icon name="arrow" /></a>
        </div>
      </section>
      <OccasionPackages />
      <AboutSection />
    </SiteFrame>
  );
}
