"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "./catering-icons";

export function SiteNavigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<"about" | "gallery">("about");
  function openPanel(value: "about" | "gallery") {
    setPanel(value);
    dialog.current?.showModal();
  }
  return <>
    <nav className="side-nav" aria-label="Main navigation">
      <a className="nav-home" href="#home"><Icon name="home"/><span>Home</span></a>
      <button type="button" onClick={() => openPanel("about")}><Icon name="people"/><span>About Us</span></button>
      <a href="#occasions"><Icon name="menu"/><span>Our Menus</span></a>
      <a href="#occasions"><Icon name="calendar"/><span>Occasions</span></a>
      <button type="button" onClick={() => openPanel("gallery")}><Icon name="gallery"/><span>Gallery</span></button>
      <a href="#location"><Icon name="mail"/><span>Contact Us</span></a>
    </nav>
    <dialog ref={dialog} className="info-dialog" aria-labelledby="info-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-heading"><p className="eyebrow">SRIVARI CATERING</p><button type="button" className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>×</button></div>
      <h2 id="info-title">{panel === "about" ? "Food made for togetherness." : "A little event inspiration."}</h2>
      {panel === "about" ? <><p>Inspired by South Indian vegetarian cooking, Srivari Catering brings comforting flavours to weddings, birthdays, workplace events, housewarmings, and festive gatherings.</p><p>Find us at 3180 Santa Rita Rd, Pleasanton, CA 94566. Explore our sample packages to start planning your occasion.</p><a href="#occasions" className="button" onClick={() => dialog.current?.close()}>Explore occasions <Icon name="arrow"/></a></> : <><div className="gallery-preview"><Image src="/images/elegant-buffet.png" alt="An elegant vegetarian buffet with flowers and warm event lighting" width={1536} height={1024}/><Image src="/images/south-indian-feast.png" alt="A traditional South Indian vegetarian banana-leaf feast" width={1536} height={1024}/></div><p className="gallery-note">Illustrative imagery to inspire your occasion.</p></>}
    </dialog>
  </>;
}
