"use client";

import Link from "next/link";
import { Icon } from "./catering-icons";
import { useLocalSandboxFlag } from "../lib/local-checkout-mode";
import { withSandboxFlag } from "../data/local-checkout-mode";

export type SitePage = "home" | "contact" | "faq" | "checkout";

export function SiteNavigation({ currentPage = "home" }: { currentPage?: SitePage }) {
  const sandbox = useLocalSandboxFlag();
  return <NavigationLinks currentPage={currentPage} sandbox={sandbox} />;
}

export function SiteNavigationFallback({ currentPage = "home" }: { currentPage?: SitePage }) {
  return <NavigationLinks currentPage={currentPage} sandbox={false} />;
}

function NavigationLinks({ currentPage, sandbox }: { currentPage: SitePage; sandbox: boolean }) {
  const href = (path: string) => withSandboxFlag(path, sandbox);
  return (
    <nav className="side-nav" aria-label="Main navigation">
      <Link className={currentPage === "home" ? "nav-active" : undefined} aria-current={currentPage === "home" ? "page" : undefined} href={href("/#home")}><Icon name="home" /><span>Home</span></Link>
      <Link href={href("/#about")}><Icon name="people" /><span>About Us</span></Link>
      <Link href={href("/#occasions")}><Icon name="calendar" /><span>Catering Packages</span></Link>
      <Link href={href("/#signature-trays")}><Icon name="lotus" /><span>Signature Trays</span></Link>
      <Link href={href("/#a-la-carte")}><Icon name="menu" /><span>À La Carte Trays</span></Link>
      <a href="https://www.srivaripleasanton.com/#menu"><Icon name="menu" /><span>Our Menus</span></a>
      <Link className={currentPage === "faq" ? "nav-active" : undefined} aria-current={currentPage === "faq" ? "page" : undefined} href={href("/faq")}><Icon name="question" /><span>Catering FAQs</span></Link>
      <Link className={currentPage === "contact" ? "nav-active" : undefined} aria-current={currentPage === "contact" ? "page" : undefined} href={href("/contact")}><Icon name="mail" /><span>Contact Us</span></Link>
    </nav>
  );
}
