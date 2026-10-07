"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { OccasionPackages, type MenuSearchRequest } from "./catering-interactions";
import { Icon } from "./catering-icons";
import { isSearchReply, keywordPackages, type SearchReply } from "../data/menu-search";

export function CateringHome() {
  const [searchRequest, setSearchRequest] = useState<MenuSearchRequest | null>(null);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  useEffect(() => () => activeRequest.current?.abort(), []);

  function clearSearch() {
    activeRequest.current?.abort();
    sequence.current += 1;
    setPending(false);
    setSearchRequest(null);
  }

  async function runSearch(value: string) {
    const question = value.trim();
    clearSearch();
    if (!question) return;
    const id = sequence.current;
    const controller = new AbortController();
    activeRequest.current = controller;
    setPending(true);
    setSearchRequest({ query: question, id, pending: true });
    const timeout = setTimeout(() => controller.abort(), 40000);
    try {
      const response = await fetch("/api/catering-search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: question }), signal: controller.signal });
      if (response.status === 429) {
        if (id === sequence.current) setSearchRequest({ query: question, id, error: "Too many searches. Please try again in a minute, or browse the packages below." });
        return;
      }
      if (!response.ok) throw new Error("Search unavailable");
      const result: unknown = await response.json();
      if (!isSearchReply(result)) throw new Error("Invalid search response");
      if (id === sequence.current) setSearchRequest({ query: question, id, result });
    } catch {
      if (id !== sequence.current) return;
      const result: SearchReply = { mode: "keyword",
        packageNames: keywordPackages(question), restaurantItems: [], restaurantStatus: "unavailable", checkedAt: null };
      setSearchRequest({ query: question, id, result });
    } finally {
      clearTimeout(timeout);
      if (id === sequence.current) { setPending(false); activeRequest.current = null; }
    }
  }

  function searchMenus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(query);
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
            <input type="search" name="menu_query" value={query} maxLength={1000} placeholder="Explore your menu" aria-label="Search catering and restaurant menus" aria-controls="menu-search-results" aria-describedby="menu-search-hint" onChange={(event) => {
              setQuery(event.currentTarget.value);
              // Changing the question invalidates recommendations and cancels stale answers.
              clearSearch();
            }} />
            <button type="submit" disabled={pending} aria-label={pending ? "Searching menus" : "Search menus"}><Icon name="search" /></button>
          </form>
          <p id="menu-search-hint" className="hero-search-hint">Search by dish, cuisine, or occasion.</p>
          <div className="search-examples" aria-label="Try a menu search">
            {["Office lunch", "Live dosa", "Restaurant thalis"].map((example) => <button type="button" key={example} onClick={() => { setQuery(example); void runSearch(example); }}>{example}</button>)}
          </div>
        </div>
      </section>
      <OccasionPackages searchRequest={searchRequest} />
    </>
  );
}
