"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { OccasionPackages, type MenuSearchRequest } from "./catering-interactions";
import { Icon } from "./catering-icons";

export function CateringHome() {
  const [searchRequest, setSearchRequest] = useState<MenuSearchRequest | null>(null);

  function searchMenus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("menu_query") ?? "").trim();
    if (!query) {
      setSearchRequest(null);
      return;
    }
    setSearchRequest((current) => ({ query, id: (current?.id ?? 0) + 1 }));
  }

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Image className="hero-image" src="/images/elegant-buffet.png" alt="An elegant vegetarian catering buffet with plated appetisers, flowers, and golden event lighting" fill sizes="(max-width: 760px) 100vw, calc(100vw - 180px)" priority />
        <div className="hero-copy">
          <p className="eyebrow">EXCEPTIONAL FOOD FOR<br />LIFE’S SPECIAL MOMENTS</p>
          <span className="gold-rule" aria-hidden="true" />
          <h1 id="hero-title">Catering<br />Made Memorable</h1>
          <p>Delicious food. Beautiful presentation. Unforgettable experiences.<br className="desktop-break" /> From intimate gatherings to grand celebrations, bring people together over your favourite flavours.</p>
          <form className="hero-menu-search" role="search" aria-label="Menu search" onSubmit={searchMenus}>
            <input type="search" name="menu_query" placeholder="Explore your menu" aria-label="Search catering menus" aria-controls="menu-search-results" onChange={(event) => {
              if (!event.currentTarget.value.trim()) setSearchRequest(null);
            }} />
            <button type="submit" aria-label="Search menus"><Icon name="search" /></button>
          </form>
        </div>
      </section>
      <OccasionPackages searchRequest={searchRequest} />
    </>
  );
}
