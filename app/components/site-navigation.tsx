import Link from "next/link";
import { Icon } from "./catering-icons";

export type SitePage = "home" | "contact" | "faq";

export function SiteNavigation({ currentPage = "home" }: { currentPage?: SitePage }) {
  const occasionsHref = currentPage === "home" ? "#occasions" : "/#occasions";
  const aboutHref = currentPage === "home" ? "#about" : "/#about";
  return (
    <nav className="side-nav" aria-label="Main navigation">
      <Link className={currentPage === "home" ? "nav-active" : undefined} aria-current={currentPage === "home" ? "page" : undefined} href="/#home"><Icon name="home" /><span>Home</span></Link>
      <Link href={aboutHref}><Icon name="people" /><span>About Us</span></Link>
      <Link href={occasionsHref}><Icon name="calendar" /><span>Catering Packages</span></Link>
      <Link href={currentPage === "home" ? "#signature-trays" : "/#signature-trays"}><Icon name="lotus" /><span>Signature Trays</span></Link>
      <Link href={currentPage === "home" ? "#a-la-carte" : "/#a-la-carte"}><Icon name="menu" /><span>À La Carte Trays</span></Link>
      <a href="https://www.srivaripleasanton.com/#menu"><Icon name="menu" /><span>Our Menus</span></a>
      <Link className={currentPage === "faq" ? "nav-active" : undefined} aria-current={currentPage === "faq" ? "page" : undefined} href="/faq"><Icon name="question" /><span>Catering FAQs</span></Link>
      <Link className={currentPage === "contact" ? "nav-active" : undefined} aria-current={currentPage === "contact" ? "page" : undefined} href="/contact"><Icon name="mail" /><span>Contact Us</span></Link>
    </nav>
  );
}
