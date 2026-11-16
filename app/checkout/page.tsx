import { Suspense } from "react";
import { SiteFrame } from "../components/site-frame";
import { Checkout } from "./checkout";
import "./checkout.css";

export const metadata = { title: "Checkout | Srivari Catering", robots: { index: false, follow: false } };
export default function CheckoutPage() {
  return <SiteFrame><section className="checkout-section"><Suspense fallback={<p role="status">Loading your order…</p>}><Checkout /></Suspense></section></SiteFrame>;
}
