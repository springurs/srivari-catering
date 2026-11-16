"use client";

import Link from "next/link";
import { useState } from "react";
import { aLaCarteCategories, aLaCarteItemCount, formatTrayPrice } from "../data/a-la-carte-menu";
import { traySizes, traySizeFractions } from "../data/checkout-menu";
import { Icon } from "./catering-icons";
import { ALaCarteCartControls } from "./a-la-carte-cart-controls";

export function ALaCarteSection() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase();
  const categories = aLaCarteCategories.map((category) => ({ ...category,
    items: category.items.filter((item) => `${category.name} ${item.name}`.toLocaleLowerCase().includes(search)),
  })).filter((category) => category.items.length > 0);
  const matches = categories.reduce((total, category) => total + category.items.length, 0);

  return (
    <section className="a-la-carte-section" id="a-la-carte" aria-labelledby="a-la-carte-title">
      <div className="a-la-carte-intro">
        <div>
          <p className="eyebrow">YOUR FAVOURITES, YOUR WAY</p>
          <h2 id="a-la-carte-title">À La Carte Catering</h2>
          <p>Choose individual dishes in quarter, half, ¾, or full trays. Complete your gathering with snacks, breads, sweets, and beverages ordered by count or volume.</p>
        </div>
        <a className="a-la-carte-call" href="tel:+14088930438"><Icon name="menu" /><span>Let’s plan your menu<strong>(408) 893-0438</strong></span></a>
      </div>

      <div className="a-la-carte-toolbar">
        <label className="a-la-carte-search">
          <span className="sr-only">Search à la carte dishes</span>
          <Icon name="search" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a dish, e.g. paneer or gobi" aria-controls="a-la-carte-categories" />
        </label>
        {query && <button className="text-link" type="button" onClick={() => setQuery("")}>Clear search</button>}
        <p className="a-la-carte-count" role="status">{search ? `${matches} ${matches === 1 ? "item" : "items"} found` : `${aLaCarteItemCount} items · ${aLaCarteCategories.length} categories`}</p>
      </div>

      <div className="a-la-carte-categories" id="a-la-carte-categories">
        {categories.map((category) => (
          <details className="a-la-carte-category" key={`${category.id}-${search}`} open={search ? true : undefined}>
            <summary>
              <h3>{category.name}</h3>
              <span className="a-la-carte-category-count">{category.items.length} {category.items.length === 1 ? "item" : "items"}</span>
              <span className="a-la-carte-expand" aria-hidden="true">+</span>
            </summary>
            {category.onRequest && <p className="a-la-carte-availability">Please enquire about availability and tray pricing for these additional dishes.</p>}
            {category.note && <p className="a-la-carte-availability">{category.note}{category.sourceUrl && <> <a href={category.sourceUrl}>View restaurant menu <span aria-hidden="true">↗</span></a></>}</p>}
            <ul className="a-la-carte-items">
              {category.items.map((item) => (
                <li className={`a-la-carte-item${!item.orderUnit ? " has-tray-prices" : ""}`} key={item.id}>
                  <div className="a-la-carte-dish"><h4>{item.name}</h4>{item.note && <p>{item.note}</p>}</div>
                  {!item.orderUnit && <dl className="a-la-carte-prices" aria-label={`Tray prices for ${item.name}`}>{traySizes.map(size => <div key={size.key}><dt>{traySizeFractions[size.key]} tray</dt><dd>{formatTrayPrice(item.prices[size.key])}</dd></div>)}</dl>}
                  <ALaCarteCartControls item={item} />
                </li>
              ))}
            </ul>
          </details>
        ))}
        {matches === 0 && <div className="a-la-carte-empty"><h3>No matching dishes</h3><p>Try a different dish or ingredient, or clear your search to browse the full tray menu.</p><button className="text-link" type="button" onClick={() => setQuery("")}>Show all dishes</button></div>}
      </div>

      <div className="a-la-carte-note">
        <div><h3>A little help choosing?</h3><p>Tell us your guest count, dishes, and preferred tray sizes or quantities. Tray prices are indicative. Pack and per-piece prices apply as shown; unpriced count and volume orders are quoted on enquiry. Final prices, availability, and portions are confirmed when ordering. Jain and no-onion, no-garlic preparation can be requested for suitable dishes.</p></div>
        <Link className="button" href="/contact">Enquire about your menu <Icon name="arrow" /></Link>
      </div>
    </section>
  );
}
