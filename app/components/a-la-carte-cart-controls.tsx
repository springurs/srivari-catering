"use client";

import Link from "next/link";
import { useState } from "react";
import { formatTrayPrice, type ALaCarteItem } from "../data/a-la-carte-menu";
import { aLaCarteCartId, getCartOptions, traySizeFractions, type OrderSize } from "../data/checkout-menu";
import { addTray } from "../lib/checkout-cart";
import { Icon } from "./catering-icons";

export function ALaCarteCartControls({ item }: { item: ALaCarteItem }) {
  const trayId = aLaCarteCartId(item.id);
  const options = getCartOptions(trayId);
  const [size, setSize] = useState<OrderSize | "">("");
  const [added, setAdded] = useState(0);
  if (!options.length) return <div className="a-la-carte-cart-controls is-enquiry"><span>Price on enquiry</span><Link href="/contact" className="a-la-carte-enquire" aria-label={`Enquire about ${item.name}`}><Icon name="mail" />Enquire</Link></div>;
  const label = item.orderUnit ? "Order option" : "Tray size";
  const selectedSize = options.length === 1 ? options[0].key : options.find(option => option.key === size)?.key;
  return <div className="a-la-carte-cart-controls">
    <div className="a-la-carte-cart-row">
      {options.length === 1 ? <div className="a-la-carte-fixed-option" aria-label={`${options[0].label} for ${item.name}`}><span>{options[0].label}</span><strong>{formatTrayPrice(options[0].unitCents / 100)}</strong></div> : <label><span className="sr-only">{label}</span><span className="a-la-carte-order-select"><select aria-label={`${label} for ${item.name}`} value={size} onChange={event => { setSize(event.target.value as OrderSize | ""); setAdded(0); }}><option value="">Select Tray Size</option>{options.map(option => <option key={option.key} value={option.key}>{option.key === "pack" || option.key === "piece" ? option.label : traySizeFractions[option.key]}</option>)}</select><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></label>}
      <button type="button" className="a-la-carte-add" disabled={!selectedSize} aria-label={`Add ${item.name} to cart`} title={selectedSize ? `Add ${item.name} to cart` : "Select a size first"} onClick={() => { if (!selectedSize) return; addTray(trayId, selectedSize); setAdded(value => value + 1); }}><Icon name={added ? "check" : "cart"} /><span className="cart-action-caption" aria-hidden="true">Add to cart</span></button>
    </div>
    <span className="a-la-carte-cart-notice" role="status" aria-atomic="true">{added ? `${added} added to cart` : ""}</span>
  </div>;
}
