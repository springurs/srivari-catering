import Image from "next/image";
import { OccasionPackages } from "./components/catering-interactions";
import { Icon } from "./components/catering-icons";
import { SiteNavigation } from "./components/site-navigation";

function BrandLogo() {
  return (
    <a className="brand-logo" href="#home" aria-label="Srivari Catering home">
      <Image src="/images/srivari-logo.png" alt="Srivari — Pure Indian Vegetarian" width={3375} height={3375} />
    </a>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="page-shell" id="home">
        <aside className="sidebar" aria-label="Site sidebar">
          <header><BrandLogo /></header>
          <SiteNavigation />
          <div className="sidebar-note">GOOD FOOD<br />BRINGS PEOPLE<br />TOGETHER<span /></div>
        </aside>
        <main id="main" className="main-content">
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
        </main>
      </div>
      <footer className="site-footer" id="location">
        <div className="footer-main">
          <BrandLogo />
          <a className="footer-address" href="https://www.google.com/maps/search/?api=1&query=3180%20Santa%20Rita%20Rd%2C%20Pleasanton%2C%20CA%2094566" target="_blank" rel="noopener noreferrer"><Icon name="pin" /><address>3180 Santa Rita Rd, Pleasanton CA 94566</address><span className="sr-only"> (opens directions in a new tab)</span></a>
          <nav aria-label="Footer navigation"><a href="#home">Home</a><a href="#occasions">Our Menus</a><a href="#occasions">Occasions</a><a href="#location">Contact Us</a></nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Srivari Catering</span><span>Good food brings people together.</span></div>
      </footer>
    </>
  );
}
