"use client";
import { useState } from "react";
import { addTray, useCart } from "../lib/checkout-cart";
import { traySizes, type TraySize } from "../data/checkout-menu";
import Link from "next/link";
import { cartLines, formatMoney } from "../data/checkout-menu";
import { Icon } from "./catering-icons";
import { useLocalSandboxFlag } from "../lib/local-checkout-mode";
import { withSandboxFlag } from "../data/local-checkout-mode";

export function TrayOrderButton({ trayId, name }: { trayId: string; name: string }) {
  const [size, setSize] = useState<TraySize>("quarter");
  const [notice, setNotice] = useState("");
  return <div className="tray-order-controls">
    <div className="tray-order-row">
      <label><span>Tray size</span><span className="tray-size-select"><select value={size} onChange={e => { setSize(e.target.value as TraySize); setNotice(""); }} aria-label={`Tray size for ${name}`}>{traySizes.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></label>
      <button type="button" className="button tray-add-button" onClick={() => { addTray(trayId, size); setNotice("Added to cart"); }} aria-label={`Add ${name} to cart`}><span aria-hidden="true">+</span> Add to cart</button>
    </div>
    <span className="tray-order-notice" role="status" aria-atomic="true">{notice}</span>
  </div>;
}
export function FloatingCart() {
  const cart = useCart();
  const sandbox = useLocalSandboxFlag();
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  if (!count) return null;
  const total = cartLines(cart).reduce((sum, item) => sum + item.unitCents * item.quantity, 0);
  return <div className="cart-dock">
    <Link href={withSandboxFlag("/checkout", sandbox)} className="floating-cart" aria-label={`View cart, ${count} ${count === 1 ? "item" : "items"}, ${formatMoney(total)}`}>
      <span className="floating-cart-icon"><Icon name="cart" /><span className="floating-cart-count">{count}</span></span>
      <span className="floating-cart-copy"><strong>Your cart</strong><span>{count} {count === 1 ? "item" : "items"} · {formatMoney(total)}</span></span>
      <span className="floating-cart-action">View cart <Icon name="arrow" /></span>
    </Link>
  </div>;
}
