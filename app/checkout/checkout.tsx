"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cartLines, formatMoney, getCartOptions, type OrderSize } from "../data/checkout-menu";
import { readCart, setCart, useCart } from "../lib/checkout-cart";
import { ContactForm } from "../components/contact-form";
import { validateCheckoutContact } from "../data/checkout-contact";
import { Icon } from "../components/catering-icons";
import { useLocalSandboxFlag } from "../lib/local-checkout-mode";
import { withSandboxFlag } from "../data/local-checkout-mode";
type CheckoutConfig = { mode: "sandbox" | "live"; mock: boolean };

export function Checkout() {
  const params = useSearchParams();
  const sandbox = useLocalSandboxFlag();
  return <ConfiguredCheckout key={sandbox ? "sandbox" : "default"} sessionId={params.get("session_id")} canceled={params.has("canceled")} sandbox={sandbox} />;
}
function ConfiguredCheckout({ sessionId, canceled, sandbox }: { sessionId: string | null; canceled: boolean; sandbox: boolean }) {
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (!sessionId) document.title = "Your cart | Srivari Catering"; }, [sessionId]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(withSandboxFlag("/api/checkout/config", sandbox), { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Checkout is temporarily unavailable. Please contact Srivari.");
      const data = await response.json();
      if (!["sandbox", "live"].includes(data.mode)) throw new Error("Checkout configuration is unavailable.");
      setConfig(data);
    }).catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Checkout is unavailable."); });
    return () => controller.abort();
  }, [sandbox]);
  if (error) return <p role="alert">{error} <Link href="/contact">Contact Srivari</Link></p>;
  if (!config) return <p>Loading checkout…</p>;
  return <>
    {config.mode === "sandbox" && <p className="checkout-test-note">Sandbox test checkout — no real charges or food orders.</p>}
    {sessionId ? <PaymentStatus key={sessionId} sessionId={sessionId} mode={config.mode} sandbox={sandbox} /> : <><p className="eyebrow">SRIVARI CATERING</p><h1>Your cart</h1><p className="checkout-intro">Review your selections and order details, then continue to secure payment.</p><OrderForm canceled={canceled} mode={config.mode} mock={config.mock} sandbox={sandbox} /></>}
  </>;
}
function PaymentStatus({ sessionId, mode, sandbox }: { sessionId: string; mode: CheckoutConfig["mode"]; sandbox: boolean }) {
  const [state, setState] = useState("pending");
  const [error, setError] = useState("");
  const [details, setDetails] = useState<{ confirmationNumber: string; date: string; time: string } | null>(null);
  const [refresh, setRefresh] = useState(0);
  const confirmed = ["paid", "mock_paid"].includes(state);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    async function check() {
      try {
        setError("");
        const response = await fetch(withSandboxFlag("/api/checkout/status", sandbox), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }), signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not check payment status.");
        setState(data.status);
        if (["paid", "mock_paid"].includes(data.status) && typeof data.confirmationNumber === "string") setDetails({ confirmationNumber: data.confirmationNumber, date: data.pickup?.date ?? "", time: data.pickup?.time ?? "" });
        if (["paid", "mock_paid"].includes(data.status) && JSON.stringify(readCart()) === JSON.stringify(data.cart)) setCart([]);
        if (data.status === "pending" && ++attempts < 20) timer = setTimeout(check, 3500);
      } catch (err) { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Could not check payment status."); }
    }
    void check();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [sessionId, sandbox, refresh]);
  useEffect(() => {
    document.title = `${confirmed ? "Thank you for your order" : "Order payment status"} | Srivari Catering`;
  }, [confirmed]);
  const title = confirmed ? "Thank you for your order!" : error ? "We couldn’t confirm your payment" : state === "failed" ? "Your payment needs attention" : state === "expired" ? "Your checkout has expired" : "We’re confirming your payment";
  const description = state === "mock_paid" ? "Your demo checkout is complete. No payment was taken and no real food order was placed." : confirmed ? mode === "live" ? "Your payment is confirmed. Thank you for choosing Srivari Catering." : "Your sandbox payment is confirmed. This test does not place a real food order." : error ? "Please check your payment status again or contact our team for help." : state === "failed" ? "Your payment wasn’t completed. Your items are saved so you can return to your order and try again." : state === "expired" ? "This payment link is no longer active. Return to your saved order to start a new checkout." : "We’re waiting for confirmation from Stripe. Some payment methods take a little longer; your order will be confirmed here once payment is received.";
  return <div className={`order-confirmation${confirmed ? " is-confirmed" : ""}`}>
    <header className="confirmation-heading">
      <div className="confirmation-icon"><Icon name={confirmed ? "check" : error || state === "failed" ? "close" : "clock"} /></div>
      <p className="eyebrow">{confirmed ? "ORDER CONFIRMED" : "YOUR SRIVARI ORDER"}</p>
      <h1>{title}</h1>
      <p role="status" className="confirmation-description">{description}</p>
    </header>
    {confirmed && details && <div className="confirmation-receipt">
      <div className="confirmation-number"><span>Order confirmation number</span><code>{details.confirmationNumber}</code><p>Keep this number handy if you contact us about your order.</p></div>
      <div className="confirmation-pickup">
        <div><Icon name="calendar" /><div><h2>Requested pickup</h2><p>{details.date ? new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${details.date}T00:00:00Z`)) : "Our team will confirm your pickup date"}</p>{details.time && <p>{new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "UTC" }).format(new Date(`2000-01-01T${details.time}:00Z`))} Pacific time</p>}<span>Subject to our team’s confirmation.</span></div></div>
        <div><Icon name="pin" /><div><h2>Pickup location</h2><p>Srivari Pleasanton</p><p>3180 Santa Rita Rd<br />Pleasanton, CA 94566</p></div></div>
      </div>
    </div>}
    <div className="confirmation-message">
      {confirmed && <p>Our team will contact you if we have any questions about your order.</p>}
      <p>If you have any questions, please reach out to us at <a href="mailto:srivaripleasanton@gmail.com">srivaripleasanton@gmail.com</a>.</p>
      {error && <p className="contact-form-error" role="alert">{error}</p>}
    </div>
    <div className="confirmation-actions">
      {!confirmed && (state === "pending" || error) && <button type="button" className="button confirmation-primary" onClick={() => setRefresh(value => value + 1)}>Check payment status</button>}
      {!confirmed && ["failed", "expired"].includes(state) && <Link href={withSandboxFlag("/checkout", sandbox)} className="button confirmation-primary">Return to your order <Icon name="arrow" /></Link>}
      <Link href={withSandboxFlag("/#occasions", sandbox)} className={`button ${confirmed ? "confirmation-primary" : "confirmation-secondary"}`}>Browse packages <Icon name="arrow" /></Link>
    </div>
    {confirmed && <p className="confirmation-signoff">Good food brings people together.<span>With thanks, the Srivari team</span></p>}
  </div>;
}
function OrderForm({ canceled, mode, mock, sandbox }: { canceled: boolean; mode: CheckoutConfig["mode"]; mock: boolean; sandbox: boolean }) {
  const cart = useCart();
  const lines = cartLines(cart);
  const subtotal = lines.reduce((n, item) => n + item.unitCents * item.quantity, 0);
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [contactDetails, setContactDetails] = useState({ name: "", email: "", phone: "" });
  const [quote, setQuote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [itemDraft, setItemDraft] = useState<{ size: OrderSize; quantity: string }>({ size: "quarter", quantity: "1" });
  const [itemError, setItemError] = useState("");
  const contact = validateCheckoutContact(contactDetails);
  const payload = JSON.stringify({ cart, date, time, fulfillment, mode, contact });
  const pending = useRef(false);
  const attempt = useRef({ payload: "", id: "" });
  function invalidate() { setQuote(""); setError(""); }
  if (!cart.length) return <div className="checkout-panel"><p>Your order is empty. Choose a tray size and add your favourite dishes.</p><Link href={withSandboxFlag("/#signature-trays", sandbox)} className="button">Browse Signature Trays</Link></div>;
  return <>
    {mock && <p className="checkout-test-note" role="status">Local mock checkout is enabled. Continuing will simulate a successful payment immediately; Stripe credentials are not needed.</p>}
    {canceled && <p role="status">You left Stripe Checkout. Your order is saved; payment has not been confirmed.</p>}
    <ol className="checkout-steps" aria-label="Order progress"><li>1. Your cart</li><li aria-current="step">2. Order details</li><li>3. Payment</li></ol>
    <div className="checkout-layout">
    <div className="checkout-panel checkout-details-panel">
      <ul className="checkout-items">{lines.map((item, index) => {
        const key = `${item.trayId}:${item.size}`;
        const editing = editingItem === key;
        const editorId = `edit-${item.trayId}-${item.size}`;
        return <li key={key}>
          <div className="checkout-item-info"><h2>{item.name}</h2><p>{item.quantity} × {formatMoney(item.unitCents)} each</p></div>
          <strong className="checkout-item-total">{formatMoney(item.unitCents * item.quantity)}</strong>
          <div className="checkout-item-actions">
            <button className="checkout-item-edit" type="button" disabled={busy} aria-label={`Edit ${item.name}`} title={`Edit ${item.name}`} aria-expanded={editing} aria-controls={editorId} onClick={() => { setEditingItem(editing ? null : key); setItemDraft({ size: item.size, quantity: String(item.quantity) }); setItemError(""); }}><Icon name="edit" /></button>
            <button className="text-link" type="button" disabled={busy} aria-label={`Remove ${item.name}`} onClick={() => { setCart(cart.filter((_, i) => i !== index)); if (editing) setEditingItem(null); invalidate(); }}>Remove</button>
          </div>
          {editing && <form id={editorId} className="checkout-item-editor" aria-label={`Edit ${item.name}`} onSubmit={event => {
            event.preventDefault();
            const quantity = Number(itemDraft.quantity);
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) { setItemError("Choose a quantity from 1 to 99."); return; }
            const otherIndex = cart.findIndex((row, i) => i !== index && row.trayId === item.trayId && row.size === itemDraft.size);
            if (otherIndex !== -1 && cart[otherIndex].quantity + quantity > 99) { setItemError("This tray size is already in your cart. The combined quantity cannot exceed 99."); return; }
            setCart(cart.flatMap((row, i) => i === index ? otherIndex === -1 ? [{ ...row, size: itemDraft.size, quantity }] : [] : i === otherIndex ? [{ ...row, quantity: row.quantity + quantity }] : [row]));
            setEditingItem(null); setItemError(""); invalidate();
          }}>
            <label>{item.size === "pack" || item.size === "piece" ? "Order option" : "Tray size"}<select aria-label={item.size === "pack" || item.size === "piece" ? "Order option" : "Tray size"} value={itemDraft.size} disabled={busy} onChange={e => { setItemDraft({ ...itemDraft, size: e.target.value as OrderSize }); setItemError(""); }}>{getCartOptions(item.trayId).map(size => <option key={size.key} value={size.key}>{size.label} · {formatMoney(size.unitCents)}</option>)}</select></label>
            <label>Quantity<input type="number" required min={1} max={99} step={1} value={itemDraft.quantity} disabled={busy} onChange={e => { setItemDraft({ ...itemDraft, quantity: e.target.value }); setItemError(""); }} /></label>
            <div className="checkout-item-editor-actions">
              <button type="submit" className="button checkout-item-save" disabled={busy}>Save changes</button>
              <button type="button" className="checkout-item-close" disabled={busy} aria-label="Close" title="Close without saving" onClick={() => { setEditingItem(null); setItemError(""); }}><Icon name="close" /><span>Close</span></button>
            </div>
            {itemError && <p className="contact-form-error" role="alert">{itemError}</p>}
          </form>}
        </li>;
      })}</ul>
      <form id="checkout-order-form" onSubmit={async event => {
        event.preventDefault();
        if (pending.current) return;
        if (editingItem) { setError("Save or close your item changes before continuing."); return; }
        setError("");
        if (!contact) {
          setError("Enter your full name and a valid email address or phone number. Check any contact details you have provided.");
          const field = contactDetails.name.trim().length < 2 ? "customerName" : contactDetails.email.trim() ? "customerEmail" : "customerPhone";
          (event.currentTarget.elements.namedItem(field) as HTMLInputElement | null)?.focus();
          return;
        }
        if (fulfillment === "delivery") {
          setQuote(["Delivery quote request — Srivari Catering", `Name: ${contact.name}`, ...(contact.email ? [`Email: ${contact.email}`] : []), ...(contact.phone ? [`Phone: ${contact.phone}`] : []), ...lines.map(item => `${item.quantity} × ${item.name} (${formatMoney(item.unitCents)} each)`), `Menu subtotal: ${formatMoney(subtotal)}`, `Requested delivery: ${date} at ${time} Pacific time`, `Delivery address: ${address.trim()}`, "Please confirm availability, location-based delivery fee, tax and final total before payment."].join("\n"));
          return;
        }
        if (attempt.current.payload !== payload) {
          try {
            const saved = JSON.parse(sessionStorage.getItem("srivari-checkout-attempt") ?? "null");
            if (saved?.payload === payload && /^[\da-f-]{36}$/.test(saved.id)) attempt.current = saved;
            else attempt.current = { payload, id: crypto.randomUUID() };
            sessionStorage.setItem("srivari-checkout-attempt", JSON.stringify(attempt.current));
          } catch { attempt.current = { payload, id: crypto.randomUUID() }; }
        }
        pending.current = true; setBusy(true);
        try {
          const response = await fetch(withSandboxFlag("/api/checkout/session", sandbox), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cart, date, time, fulfillment, contact, orderId: attempt.current.id }) });
          const data = await response.json();
          if (!response.ok || !data.url) {
            if (data.closed) { attempt.current = { payload: "", id: "" }; try { sessionStorage.removeItem("srivari-checkout-attempt"); } catch { /* Memory retry remains available. */ } }
            throw new Error(data.error || "Unable to open checkout.");
          }
          const url = new URL(data.url);
          const mockDestination = data.mock === true && ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname) && url.origin === window.location.origin && url.pathname === "/checkout" && /^mock_[\da-f-]{36}$/i.test(url.searchParams.get("session_id") ?? "");
          if (!mockDestination && (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com")) throw new Error("Invalid checkout destination.");
          window.location.assign(url.href);
        } catch (err) { setError(err instanceof Error ? err.message : "Unable to open checkout."); pending.current = false; setBusy(false); }
      }}>
        <fieldset disabled={busy} className="checkout-fields">
          <legend>Your contact details</legend>
          <p className="checkout-help" id="checkout-contact-help">Enter your full name and an email address or phone number so we can confirm your order.</p>
          <div className="checkout-contact-fields" role="group" aria-label="Contact details" aria-describedby="checkout-contact-help">
            <label className="checkout-name-field">Full name <span className="checkout-field-hint">Required</span><input name="customerName" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your full name" value={contactDetails.name} onChange={e => { setContactDetails({ ...contactDetails, name: e.target.value }); invalidate(); }} /></label>
            <label>Email address<input name="customerEmail" type="email" autoComplete="email" required={!contactDetails.phone.trim()} maxLength={254} placeholder="you@example.com" value={contactDetails.email} onChange={e => { setContactDetails({ ...contactDetails, email: e.target.value }); invalidate(); }} /></label>
            <label>Phone number<input name="customerPhone" type="tel" autoComplete="tel" required={!contactDetails.email.trim()} maxLength={40} placeholder="(408) 555-0123" value={contactDetails.phone} onChange={e => { setContactDetails({ ...contactDetails, phone: e.target.value }); invalidate(); }} /></label>
            <p className="checkout-field-hint">Provide at least one: email or phone.</p>
          </div>
          <h2 className="checkout-fulfillment-title">Pickup or delivery</h2>
          <div className="checkout-fulfillment-options">
          <label className="checkout-radio"><input type="radio" name="fulfillment" checked={fulfillment === "pickup"} onChange={() => { setFulfillment("pickup"); invalidate(); }} />Pickup — Free</label>
          <label className="checkout-radio"><input type="radio" name="fulfillment" checked={fulfillment === "delivery"} onChange={() => { setFulfillment("delivery"); invalidate(); }} />Delivery — Quote by location</label>
          </div>
          <div className="checkout-schedule" role="group" aria-label={`Requested ${fulfillment} date and time`} aria-describedby="checkout-schedule-help">
            <label>{fulfillment === "pickup" ? "Pickup" : "Delivery"} date<input type="date" name="requestedDate" required value={date} onChange={e => { setDate(e.target.value); invalidate(); }} /></label>
            <label>{fulfillment === "pickup" ? "Pickup" : "Delivery"} time<input type="time" name="requestedTime" required value={time} onChange={e => { setTime(e.target.value); invalidate(); }} /></label>
          </div>
          <p className="checkout-field-hint" id="checkout-schedule-help">All times are Pacific. Our team will confirm availability.</p>
          {fulfillment === "delivery" ? <label>Delivery address<textarea required rows={3} maxLength={500} minLength={10} autoComplete="street-address" placeholder="Street address, city, state and ZIP" value={address} onChange={e => { setAddress(e.target.value); invalidate(); }} /></label> : <p>Pickup: 3180 Santa Rita Rd, Pleasanton, CA 94566.</p>}
        </fieldset>
      </form>
    </div>
    <aside className="checkout-payment-panel" aria-labelledby="checkout-summary-title">
      <p className="eyebrow">{fulfillment === "pickup" ? "SECURE CHECKOUT" : "DELIVERY QUOTE"}</p>
      <h2 id="checkout-summary-title">Your order summary</h2>
      <ul className="checkout-summary-items" aria-label="Order summary items">{lines.map(item => <li key={`${item.trayId}:${item.size}`}><div><strong>{item.name}</strong><span>{item.quantity} × {formatMoney(item.unitCents)}</span></div><span>{formatMoney(item.unitCents * item.quantity)}</span></li>)}</ul>
      <div className="checkout-summary-contact"><h3>Contact details</h3><p>{contactDetails.name.trim() || "Add your full name"}</p>{contactDetails.email.trim() && <p>{contactDetails.email.trim()}</p>}{contactDetails.phone.trim() && <p>{contactDetails.phone.trim()}</p>}{!contactDetails.email.trim() && !contactDetails.phone.trim() && <p className="checkout-summary-placeholder">Add an email or phone number</p>}</div>
      <dl className="checkout-summary-details">
        <div><dt>Fulfillment</dt><dd>{fulfillment === "pickup" ? "Free pickup" : "Delivery · quote by location"}</dd></div>
        <div><dt>Date</dt><dd>{date ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)) : "Choose a date"}</dd></div>
        <div><dt>Time</dt><dd>{time ? `${new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "UTC" }).format(new Date(`2000-01-01T${time}:00Z`))} PT` : "Choose a time"}</dd></div>
        <div><dt>{fulfillment === "pickup" ? "Pickup location" : "Delivery address"}</dt><dd>{fulfillment === "pickup" ? "3180 Santa Rita Rd, Pleasanton, CA 94566" : address.trim() || "Add delivery address"}</dd></div>
      </dl>
      <dl className="checkout-totals"><div><dt>Tray subtotal</dt><dd>{formatMoney(subtotal)}</dd></div><div><dt>{fulfillment === "pickup" ? "Pickup fee" : "Delivery fee"}</dt><dd>{fulfillment === "pickup" ? "Free" : "Location-based quote"}</dd></div><div><dt>Tax</dt><dd>{fulfillment === "pickup" ? mock ? "Not charged in local mock" : mode === "live" ? "Shown at checkout" : "Shown in Stripe; omitted if sandbox tax is not set" : "Confirmed with final quote"}</dd></div></dl>
      <p className="checkout-help">{fulfillment === "delivery" ? "Our team confirms availability, delivery fee and the final total before arranging payment. No payment is collected here." : mock ? "Complete a simulated payment to preview the success screen. No Stripe call, charge or food order is made." : mode === "live" ? "Continue to Stripe to review the final total and pay securely." : "Continue to Stripe to review the final test total. This sandbox does not place real food orders."}</p>
      <button className="button checkout-payment-button" type="submit" form="checkout-order-form" disabled={busy || Boolean(editingItem)}>{fulfillment === "delivery" ? "Request delivery quote" : busy ? "Opening checkout…" : mock ? "Complete mock checkout" : "Make my payment"}<Icon name="arrow" /></button>
      {editingItem && <p className="checkout-payment-caption" role="status">Save or close your item changes to continue.</p>}
      {fulfillment === "pickup" && !mock && <p className="checkout-payment-caption">Secure payment with Stripe</p>}
      {error && <p className="contact-form-error" role="alert">{error} <Link href="/contact">Contact Srivari</Link></p>}
    </aside>
    </div>
    {quote && <ContactForm key={quote} initialDescription={quote} initialContact={contact ?? undefined} />}
    <p><Link href={withSandboxFlag("/#signature-trays", sandbox)}>Add more trays</Link></p>
  </>;
}
