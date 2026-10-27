"use client";

import Link from "next/link";
import { useState } from "react";
import { formatTrayPrice } from "../data/a-la-carte-menu";
import { signatureRegions, signatureTrays, type SignatureRegion } from "../data/signature-trays";
import { Icon } from "./catering-icons";

const sizes = [{ key: "quarter", label: "Quarter" }, { key: "half", label: "Half" }, { key: "threeQuarter", label: "¾ tray" }, { key: "full", label: "Full" }] as const;

export function SignatureTraysSection() {
  const [region, setRegion] = useState<SignatureRegion | "All">("All");
  const dishes = signatureTrays.filter((dish) => region === "All" || dish.region === region);

  return (
    <section className="signature-section" id="signature-trays" aria-labelledby="signature-title">
      <div className="signature-intro">
        <div>
          <p className="eyebrow"><Icon name="lotus" /> THE SRIVARI SIGNATURE COLLECTION</p>
          <h2 id="signature-title">Srivari Signature Trays<br /><em>Three traditions. Fresh ideas.</em></h2>
          <p>Telugu warmth. Tamil comfort. North Indian richness. Discover a new collection of vegetarian tray concepts built around unexpected pairings and the regional flavours we love.</p>
        </div>
        <div className="signature-intro-note"><span>NEW MENU CONCEPTS</span><h3>Regional recipes, reimagined.</h3><p>Explore the ideas with our team. Recipes, preparation, and availability are confirmed on enquiry.</p><Link href="/contact">Discuss your signature menu <Icon name="arrow" /></Link></div>
      </div>

      <div className="signature-toolbar">
        <div className="signature-filters" role="group" aria-label="Filter signature trays by cuisine">
          {(["All", ...signatureRegions] as const).map((option) => <button type="button" key={option} aria-pressed={region === option} aria-controls="signature-tray-grid" onClick={() => setRegion(option)}>{option === "All" ? "All styles" : option}</button>)}
        </div>
        <p role="status">{dishes.length} signature {dishes.length === 1 ? "tray" : "trays"}</p>
      </div>

      <div className="signature-grid" id="signature-tray-grid">
        {dishes.map((dish) => (
          <article className="signature-card" key={dish.id}>
            <div className="signature-card-top"><span>{dish.region} inspired</span><span>{dish.course}</span></div>
            <h3>{dish.name}</h3>
            <p className="signature-description">{dish.description}</p>
            <ul className="signature-ingredients" aria-label={`Key ingredients for ${dish.name}`}>{dish.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
            <div className="signature-character"><span>THE SRIVARI TWIST</span><p>{dish.signature}</p></div>
            <div className="signature-pricing"><p>Indicative price per tray</p><dl>{sizes.map((size) => <div key={size.key}><dt>{size.label}</dt><dd>{formatTrayPrice(dish.prices[size.key])}</dd></div>)}</dl></div>
            <details className="signature-serving"><summary>How it’s served <span aria-hidden="true">+</span></summary><p>{dish.service}</p><p><strong>Pairs well with:</strong> {dish.pairWith}.</p></details>
          </article>
        ))}
      </div>

      <div className="signature-bottom-note"><Icon name="menu" /><p>Each dish is a separate tray selection. Prices are indicative; confirm the recipe, tray portions, dietary requirements, and final quote with our team.</p><a href="tel:+14088930438">Call (408) 893-0438</a></div>
    </section>
  );
}
