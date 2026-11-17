import Stripe from "stripe";
import { cartLines, validateCart } from "../app/data/checkout-menu";
import type { ReportDatabase } from "./daily-reports";
import { readLimited } from "./restaurant-menu";
import { validateCheckoutContact } from "../app/data/checkout-contact";
import { isLoopbackHost } from "../app/data/local-checkout-mode";
import { promotionError, discountedUnitCents } from "../app/data/checkout-promotion";

export type CheckoutEnv = {
  REPORT_DB?: ReportDatabase;
  STRIPE_RESTRICTED_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_SANDBOX_RESTRICTED_KEY?: string;
  STRIPE_SANDBOX_WEBHOOK_SECRET?: string;
  SANDBOX_PICKUP_TAX_RATE_ID?: string;
  CHECKOUT_ORIGIN?: string;
  PICKUP_TAX_RATE_ID?: string;
  SANDBOX_ALLOW_NO_TAX?: string;
  CHECKOUT_MOCK?: string;
  STRIPE_MODE?: "sandbox" | "live";
  STRIPE_ACCOUNT_ID?: string;
  SEARCH_RATE_LIMITER?: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
};
type Order = { id: string; payload_json: string; lines_json: string; tax_rate: string; stripe_mode: "sandbox" | "live"; expires_at: number; session_id: string | null; status: string };
const isLive = (env: CheckoutEnv) => env.STRIPE_MODE === "live";
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const uuid = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
export function localSandboxRequested(request: Request, env: CheckoutEnv) {
  const url = new URL(request.url);
  return isLoopbackHost(url.hostname) && url.origin === env.CHECKOUT_ORIGIN && url.searchParams.get("flag") === "sandbox";
}
export function checkoutEnvForRequest(request: Request, env: CheckoutEnv): CheckoutEnv {
  if (!localSandboxRequested(request, env)) return env;
  return {
    ...env,
    STRIPE_MODE: "sandbox",
    STRIPE_RESTRICTED_KEY: env.STRIPE_SANDBOX_RESTRICTED_KEY,
    STRIPE_WEBHOOK_SECRET: env.STRIPE_SANDBOX_WEBHOOK_SECRET,
    PICKUP_TAX_RATE_ID: env.SANDBOX_PICKUP_TAX_RATE_ID,
    SANDBOX_ALLOW_NO_TAX: "true",
    CHECKOUT_MOCK: "false",
  };
}
export function mockCheckoutEnabled(request: Request, env: CheckoutEnv) {
  const url = new URL(request.url);
  return !isLive(env) && env.CHECKOUT_MOCK === "true" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && env.CHECKOUT_ORIGIN === url.origin;
}
export function stripeClient(env: CheckoutEnv) {
  const prefix = isLive(env) ? /^(rk|sk)_live_/ : /^(rk|sk)_test_/;
  if (!prefix.test(env.STRIPE_RESTRICTED_KEY ?? "")) throw new Error(isLive(env) ? "Use a live API key." : "Use a sandbox API key.");
  return new Stripe(env.STRIPE_RESTRICTED_KEY!, { httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2 });
}
export function validOrder(input: unknown) {
  if (!input || typeof input !== "object") return null;
  const body = input as Record<string, unknown>;
  const cart = validateCart(body.cart);
  const contact = validateCheckoutContact(body.contact);
  if (!cart || !contact || !uuid(body.orderId) || body.fulfillment !== "pickup" || typeof body.date !== "string" || typeof body.time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time)
    || !/^\d{4}-\d{2}-\d{2}$/.test(body.date) || !Number.isFinite(Date.parse(body.date))
    || new Date(body.date).toISOString().slice(0, 10) !== body.date
    || body.date < new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date())) return null;
  if (body.promotionCode !== undefined && (typeof body.promotionCode !== "string" || body.promotionCode.length > 32)) return null;
  const promotionCode = typeof body.promotionCode === "string" ? body.promotionCode.trim().toUpperCase() : "";
  return { orderId: body.orderId, cart, date: body.date, time: body.time, fulfillment: "pickup" as const, contact, promotionCode };
}
async function findOrder(env: CheckoutEnv, id: string) {
  const { results } = await env.REPORT_DB!.prepare("SELECT * FROM checkout_orders WHERE id = ?1").bind(id).all<Order>();
  return results[0];
}

export async function handleCheckout(request: Request, env: CheckoutEnv, stripe?: Stripe) {
  const localSandbox = localSandboxRequested(request, env);
  env = checkoutEnvForRequest(request, env);
  if (new URL(request.url).pathname === "/api/stripe/webhook") return handleStripeWebhook(request, env, stripe);
  const mock = mockCheckoutEnabled(request, env);
  const live = isLive(env);
  const mode = live ? "live" : "sandbox";
  if (new URL(request.url).pathname === "/api/checkout/config" && request.method === "GET") return json({ mock, mode, taxConfigured: Boolean(env.PICKUP_TAX_RATE_ID) });
  if (request.method !== "POST") return json({ error: "Use POST." }, 405);
  if (!env.CHECKOUT_ORIGIN || request.headers.get("origin") !== env.CHECKOUT_ORIGIN || new URL(request.url).origin !== env.CHECKOUT_ORIGIN) return json({ error: "Use checkout on this website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ error: "Use JSON." }, 415);
  if (!env.REPORT_DB || !env.SEARCH_RATE_LIMITER || (live && !env.STRIPE_ACCOUNT_ID) || (!mock && (!env.STRIPE_RESTRICTED_KEY || !env.STRIPE_WEBHOOK_SECRET))) return json({ error: localSandbox ? "Local sandbox Stripe credentials are not configured yet." : "Online payments are being configured. Please contact Srivari to arrange your order." }, 503);
  try {
    if (!(await env.SEARCH_RATE_LIMITER.limit({ key: `checkout:${request.headers.get("CF-Connecting-IP") ?? "local"}` })).success) return json({ error: "Please try again in a minute." }, 429);
    let body;
    try { body = JSON.parse(await readLimited(request, 16384)); } catch { return json({ error: "Invalid checkout request." }, 400); }
    if (!body || typeof body !== "object") return json({ error: "Invalid checkout request." }, 400);
    const path = new URL(request.url).pathname;
    if (path === "/api/checkout/status") {
      const mockReference = typeof body.sessionId === "string" && body.sessionId.startsWith("mock_") && uuid(body.sessionId.slice(5));
      const sessionPattern = live ? /^cs_live_[a-zA-Z0-9_]{10,200}$/ : /^cs_test_[a-zA-Z0-9_]{10,200}$/;
      if (typeof body.sessionId !== "string" || (!sessionPattern.test(body.sessionId) && !(mock && mockReference))) return json({ error: "Invalid checkout reference." }, 400);
      const { results } = await env.REPORT_DB.prepare("SELECT id, status, payload_json FROM checkout_orders WHERE session_id = ?1 AND stripe_mode = ?2").bind(body.sessionId, mode).all<{ id: string; status: string; payload_json: string }>();
      const order = results[0];
      if (!order || !["paid", "mock_paid"].includes(order.status)) return json({ status: order?.status ?? "pending" });
      const saved = JSON.parse(order.payload_json);
      return json({ status: order.status, cart: saved.cart, confirmationNumber: `SRV-${order.id.toUpperCase()}`, pickup: { date: saved.date, time: saved.time } });
    }
    if (path !== "/api/checkout/session") return json({ error: "Not found." }, 404);
    const input = validOrder(body);
    if (!input) return json({ error: "Enter your full name and a valid email or phone number, and choose valid trays and a pickup date and time. Delivery needs a location-based quote before payment." }, 400);
    const currentLines = cartLines(input.cart);
    const offerError = promotionError(input.promotionCode, currentLines.reduce((sum, line) => sum + line.unitCents * line.quantity, 0));
    if (offerError) return json({ error: offerError }, 400);
    const taxRate = mock ? "" : env.PICKUP_TAX_RATE_ID ?? "";
    if (!mock && ((!taxRate && (live || env.SANDBOX_ALLOW_NO_TAX !== "true")) || (taxRate && !/^txr_[a-zA-Z0-9]+$/.test(taxRate)))) return json({ error: "Checkout is waiting for tax configuration." }, 503);
    if (!mock) stripe ??= stripeClient(env);
    const payload = JSON.stringify({ cart: input.cart, date: input.date, time: input.time, fulfillment: input.fulfillment, contact: input.contact, ...(input.promotionCode ? { promotionCode: input.promotionCode } : {}) });
    const lines = JSON.stringify(currentLines);
    // Pin prices, tax rate and expiry before Stripe; retries use exactly the same parameters.
    await env.REPORT_DB.prepare("INSERT OR IGNORE INTO checkout_orders (id, payload_json, lines_json, tax_rate, expires_at, stripe_mode) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
      .bind(input.orderId, payload, lines, taxRate, Math.floor(Date.now() / 1000) + 23 * 3600, mode).run();
    const order = await findOrder(env, input.orderId);
    if (order.payload_json !== payload) return json({ error: "Your order changed. Start a new checkout." }, 409);
    if (order.stripe_mode !== mode) return json({ error: "Payment mode changed. Start a new checkout.", closed: true }, 409);
    if (mock) {
      const sessionId = `mock_${order.id}`;
      if (!["pending", "mock_paid"].includes(order.status) || (order.session_id && order.session_id !== sessionId)) return json({ error: "Start a new order for mock checkout.", closed: true }, 409);
      await env.REPORT_DB.prepare("UPDATE checkout_orders SET status = 'mock_paid', session_id = ?1, updated_at = ?2 WHERE id = ?3 AND status IN ('pending', 'mock_paid')")
        .bind(sessionId, Date.now(), order.id).run();
      return json({ mock: true, url: `${env.CHECKOUT_ORIGIN}/checkout?session_id=${sessionId}` });
    }
    if (order.status !== "pending") return json({ error: order.status === "paid" ? "This order has already been paid." : "This checkout has closed. Start a new order.", closed: true }, 409);
    if (!order.session_id && order.expires_at < Date.now() / 1000 + 1800) return json({ error: "Checkout expired. Start a new order.", closed: true }, 410);
    let session: Stripe.Checkout.Session;
    if (order.session_id) session = await stripe!.checkout.sessions.retrieve(order.session_id);
    else {
      if (live) {
        const account = await stripe!.accounts.retrieve(null);
        if (account.id !== env.STRIPE_ACCOUNT_ID || !account.charges_enabled) return json({ error: "The live payment account is not ready." }, 503);
        const rate = await stripe!.taxRates.retrieve(order.tax_rate);
        if (!rate.active || !rate.livemode) return json({ error: "The live tax rate is not ready." }, 503);
      }
      session = await stripe!.checkout.sessions.create({
        mode: "payment", integration_identifier: "srivari_checkout_xbqkrtmn", client_reference_id: order.id,
        ...(input.contact.email ? { customer_email: input.contact.email } : {}),
        metadata: { order_id: order.id, fulfillment: "pickup", date: input.date, pickup_time: input.time, pickup_timezone: "America/Los_Angeles", ...(input.promotionCode ? { promotion_code: input.promotionCode } : {}) },
        payment_intent_data: { metadata: { order_id: order.id, date: input.date, pickup_time: input.time, pickup_timezone: "America/Los_Angeles" }, description: `Srivari pickup requested ${input.date} at ${input.time} Pacific time — 3180 Santa Rita Rd, Pleasanton` },
        // Apply the server-approved offer to taxable unit prices. No extra Stripe coupon permissions are required.
        line_items: (JSON.parse(order.lines_json) as ReturnType<typeof cartLines>).map(line => ({ quantity: line.quantity, price_data: { currency: "usd", unit_amount: input.promotionCode ? discountedUnitCents(line.unitCents) : line.unitCents, product_data: { name: `${line.name}${input.promotionCode ? " · THANKS10 (10% off)" : ""}` } }, ...(order.tax_rate ? { tax_rates: [order.tax_rate] } : {}) })),
        phone_number_collection: { enabled: true },
        shipping_options: [{ shipping_rate_data: { type: "fixed_amount", display_name: "Free pickup — Pleasanton", fixed_amount: { amount: 0, currency: "usd" } } }],
        custom_text: { submit: { message: live ? `Pickup at 3180 Santa Rita Rd, Pleasanton, CA 94566. Requested: ${input.date} at ${input.time} Pacific time. Tax is shown in the total. Our team will confirm pickup timing.` : `Sandbox test only. Pickup at 3180 Santa Rita Rd, Pleasanton, CA 94566. Requested: ${input.date} at ${input.time} Pacific time. ${order.tax_rate ? "Tax shown in total." : "Tax is omitted for this sandbox test."} This is not a real food order.` } },
        success_url: `${env.CHECKOUT_ORIGIN}/checkout?${localSandbox ? "flag=sandbox&" : ""}session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.CHECKOUT_ORIGIN}/checkout?${localSandbox ? "flag=sandbox&" : ""}${input.promotionCode ? `promo=${input.promotionCode}&` : ""}canceled=1`, expires_at: order.expires_at,
      }, { idempotencyKey: `srivari-checkout-${order.id}` });
      if (session.livemode !== live) throw new Error("Unexpected payment mode.");
      await env.REPORT_DB.prepare("UPDATE checkout_orders SET session_id = ?1 WHERE id = ?2").bind(session.id, order.id).run();
    }
    if (session.livemode !== live || session.status !== "open" || !session.url) return json({ error: "Checkout has closed. Check payment status before starting a new order.", closed: true }, 409);
    return json({ url: session.url });
  } catch { return json({ error: "Checkout could not be confirmed. Retry with the same order or contact Srivari." }, 503); }
}

export async function handleStripeWebhook(request: Request, env: CheckoutEnv, stripe?: Stripe) {
  if (request.method !== "POST") return json({ error: "Use POST." }, 405);
  if (!env.REPORT_DB || !env.STRIPE_WEBHOOK_SECRET || !env.STRIPE_RESTRICTED_KEY) return json({ error: "Webhook is not configured." }, 503);
  let event: Stripe.Event;
  try {
    stripe ??= stripeClient(env);
    event = await stripe.webhooks.constructEventAsync(await readLimited(request, 262144), request.headers.get("stripe-signature") ?? "", env.STRIPE_WEBHOOK_SECRET, undefined, Stripe.createSubtleCryptoProvider());
  } catch { return json({ error: "Invalid Stripe signature." }, 400); }
  if (event.livemode !== isLive(env)) return json({ error: "Webhook payment mode does not match this environment." }, 400);
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed", "checkout.session.expired"].includes(event.type)) return json({ received: true });
  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const id = session.metadata?.order_id;
    if (!uuid(id)) return json({ received: true });
    const order = await findOrder(env, id);
    if (!order) return json({ error: "Order unavailable; retry." }, 500);
    if (order.stripe_mode !== (isLive(env) ? "live" : "sandbox")) return json({ error: "Order payment mode does not match." }, 400);
    if (session.client_reference_id !== id || session.currency !== "usd" || (order.session_id && order.session_id !== session.id)) return json({ error: "Order does not match." }, 400);
    const promotionCode = JSON.parse(order.payload_json).promotionCode;
    const subtotal = (JSON.parse(order.lines_json) as ReturnType<typeof cartLines>).reduce((n, line) => n + (promotionCode ? discountedUnitCents(line.unitCents) : line.unitCents) * line.quantity, 0);
    if ((session.amount_subtotal != null || promotionCode) && session.amount_subtotal !== subtotal) return json({ error: "Payment subtotal does not match." }, 400);
    if (!order.tax_rate && session.amount_total !== subtotal) return json({ error: "Payment total does not match." }, 400);
    const paid = ["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type) && session.payment_status === "paid";
    const state = paid ? "paid" : event.type === "checkout.session.expired" ? "expired" : event.type === "checkout.session.async_payment_failed" ? "failed" : "pending";
    // Paid is terminal: duplicated or delayed events cannot undo payment confirmation.
    await env.REPORT_DB.prepare("UPDATE checkout_orders SET status = CASE WHEN status = 'paid' THEN 'paid' ELSE ?1 END, session_id = ?2, customer_json = ?3, updated_at = ?4 WHERE id = ?5")
      .bind(state, session.id, JSON.stringify(session.customer_details ?? null), Date.now(), id).run();
    return json({ received: true });
  } catch { return json({ error: "Order update failed; retry webhook." }, 500); }
}
