"use client";
import { useState } from "react";
import { addTray, useCart } from "../lib/checkout-cart";
import { getCartOptions, type TraySize } from "../data/checkout-menu";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cartLines, formatMoney } from "../data/checkout-menu";
import { Icon } from "./catering-icons";
import { useLocalSandboxFlag } from "../lib/local-checkout-mode";
import { withSandboxFlag } from "../data/local-checkout-mode";

export function TrayOrderButton({ trayId, name }: { trayId: string; name: string }) {
  const [size, setSize] = useState<TraySize | "">("");
  const [added, setAdded] = useState(0);
  const options = getCartOptions(trayId);
  const selected = options.find(option => option.key === size);
  const labels = { quarter: "1/4 tray", half: "1/2 tray", threeQuarter: "3/4 tray", full: "1 full tray" };
  return <div className="tray-order-controls">
    <div className="tray-order-row">
      <label><span className="sr-only">Tray size</span><span className="tray-size-select"><select value={size} onChange={e => { setSize(e.target.value as TraySize | ""); setAdded(0); }} aria-label={`Tray size for ${name}`}><option value="">Select Tray Size</option>{options.map(option => <option key={option.key} value={option.key}>{labels[option.key as TraySize]}</option>)}</select><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></label>
      {selected && <span className="tray-selected-price" aria-label={`Price per selected tray: ${formatMoney(selected.unitCents)}`}>{formatMoney(selected.unitCents)}</span>}
      <button type="button" className="button tray-add-button" disabled={!selected} onClick={() => { if (!size || !selected) return; addTray(trayId, size); setAdded(value => value + 1); }} aria-label={size ? `Add ${labels[size]} of ${name} to cart` : `Choose a tray size for ${name} before adding to cart`} title={size ? `Add ${labels[size]} to cart` : "Select a size first"}><Icon name={added ? "check" : "cart"} /><span className="cart-action-caption" aria-hidden="true">Add to cart</span></button>
    </div>
    <span className="tray-order-notice" role="status" aria-atomic="true">{added ? `${added} added to cart` : ""}</span>
  </div>;
}
export function FloatingCart() {
  const cart = useCart();
  const sandbox = useLocalSandboxFlag();
  const params = useSearchParams();
  const checkoutPath = params.get("promo") === "THANKS10" ? "/checkout?promo=THANKS10" : "/checkout";
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  if (!count) return null;
  const total = cartLines(cart).reduce((sum, item) => sum + item.unitCents * item.quantity, 0);
  return <div className="cart-dock">
    <Link href={withSandboxFlag(checkoutPath, sandbox)} className="floating-cart" aria-label={`View cart, ${count} ${count === 1 ? "item" : "items"}, ${formatMoney(total)}`}>
      <span className="floating-cart-icon"><Icon name="cart" /><span className="floating-cart-count">{count}</span></span>
      <span className="floating-cart-copy"><strong>Your cart</strong><span>{count} {count === 1 ? "item" : "items"} · {formatMoney(total)}</span></span>
      <span className="floating-cart-action">View cart <Icon name="arrow" /></span>
    </Link>
  </div>;
}
