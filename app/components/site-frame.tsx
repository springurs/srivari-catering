import Image from "next/image";
import Link from "next/link";
import { Icon } from "./catering-icons";
import { SiteNavigation } from "./site-navigation";

function BrandLogo() {
  return (
    <Link className="brand-logo" href="/#home" aria-label="Srivari Catering home">
      <Image src="/images/srivari-logo.png" alt="Srivari — Pure Indian Vegetarian" width={3375} height={3375} />
    </Link>
  );
}

export function SiteFrame({ children, currentPage = "home" }: { children: React.ReactNode; currentPage?: "home" | "contact" }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="page-shell" id="home">
        <aside className="sidebar" aria-label="Site sidebar">
          <header><BrandLogo /></header>
          <SiteNavigation currentPage={currentPage} />
          <div className="sidebar-note">GOOD FOOD<br />BRINGS PEOPLE<br />TOGETHER<span /></div>
        </aside>
        <main id="main" className={`main-content${currentPage === "contact" ? " contact-page" : ""}`}>
          {children}
        </main>
      </div>
      <footer className="site-footer" id="location">
        <div className="footer-main">
          <BrandLogo />
          <a className="footer-address" href="https://www.google.com/maps/search/?api=1&query=3180%20Santa%20Rita%20Rd%2C%20Pleasanton%2C%20CA%2094566" target="_blank" rel="noopener noreferrer"><Icon name="pin" /><address>3180 Santa Rita Rd, Pleasanton, CA 94566</address><span className="sr-only"> (opens directions in a new tab)</span></a>
          <nav aria-label="Footer navigation"><Link href="/#home">Home</Link><Link href="/#about">About Us</Link><Link href="/#occasions">Our Menus</Link><Link href="/#occasions">Occasions</Link><Link href="/contact">Contact Us</Link></nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Srivari Catering</span><span>Good food brings people together.</span></div>
      </footer>
    </>
  );
}
