"use client";

import { useMemo, useSyncExternalStore } from "react";
import { validateCart, type CartItem, type OrderSize } from "../data/checkout-menu";
const storageKey = "srivari-checkout-cart";
const eventName = "srivari-cart-changed";
let fallback = "[]";
let memoryOnly = false;
function snapshot() {
  if (memoryOnly) return fallback;
  try { return localStorage.getItem(storageKey) ?? "[]"; } catch { return fallback; }
}
function parse(value: string): CartItem[] {
  try { return validateCart(JSON.parse(value)) ?? []; } catch { return []; }
}
export function readCart() { return parse(snapshot()); }
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn); window.addEventListener(eventName, fn);
  return () => { window.removeEventListener("storage", fn); window.removeEventListener(eventName, fn); };
}
export function setCart(items: CartItem[]) {
  fallback = JSON.stringify(items);
  try { localStorage.setItem(storageKey, fallback); } catch { memoryOnly = true; }
  window.dispatchEvent(new Event(eventName));
}
export function addTray(trayId: string, size: OrderSize) {
  const cart = parse(snapshot());
  const existing = cart.find(i => i.trayId === trayId && i.size === size);
  if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
  else cart.push({ trayId, size, quantity: 1 });
  setCart(cart);
}
export function useCart() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => parse(value), [value]);
}
