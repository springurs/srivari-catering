import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import Stripe from "stripe";
import { cartLines, validateCart, aLaCarteCartId, getCartOptions } from "../app/data/checkout-menu";
import { aLaCarteCategories } from "../app/data/a-la-carte-menu";
import { handleCheckout, handleStripeWebhook, stripeClient, mockCheckoutEnabled, checkoutEnvForRequest } from "../worker/checkout";
import { withSandboxFlag } from "../app/data/local-checkout-mode";
import { promotionError, discountedUnitCents, onlineOffer } from "../app/data/checkout-promotion";

const origin = "https://srivaricatering.com";
const cart = [{ trayId: "gongura-corn-pesarattu-rolls", size: "quarter", quantity: 2 }];
const date = "2099-12-20";
const contact = { name: "Test Customer", email: "customer@example.com", phone: "" };
const offerNow = Date.parse("2026-11-16T12:00:00-08:00");
function setup() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync("migrations/0002_checkout_orders.sql", "utf8"));
  db.exec(readFileSync("migrations/0003_checkout_mode.sql", "utf8"));
  const env = { CHECKOUT_ORIGIN: origin, STRIPE_RESTRICTED_KEY: "rk_test_fixture", STRIPE_WEBHOOK_SECRET: "whsec_fixture", SANDBOX_ALLOW_NO_TAX: "true", SEARCH_RATE_LIMITER: { async limit() { return { success: true }; } }, REPORT_DB: { prepare(query) { let values = []; return { bind(...v) { values = v; return this; }, async run() { return { meta: { changes: Number(db.prepare(query).run(...values).changes) } }; }, async all() { return { results: db.prepare(query).all(...values) }; } }; } } };
  const calls = [];
  const sessions = new Map();
  const stripe = { checkout: { sessions: {
    async create(params, options) { calls.push({ params, options }); const session = { id: `cs_${env.STRIPE_MODE === "live" ? "live" : "test"}_${"s".repeat(20)}${calls.length}`, status: "open", livemode: env.STRIPE_MODE === "live", url: "https://checkout.stripe.com/c/pay/test" }; sessions.set(session.id, session); return session; },
    async retrieve(id) { return sessions.get(id); },
  } } };
  const request = (body, path = "/api/checkout/session", headers = {}) => new Request(origin + path, { method: "POST", headers: { origin, "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
  const body = { orderId: crypto.randomUUID(), cart, date, time: "13:30", fulfillment: "pickup", contact };
  return { db, env, calls, stripe, sessions, request, body };
}
test("THANKS10 enforces its code, strict $40 minimum and Pacific expiry boundary", () => {
  assert.equal(promotionError("THANKS10", 4000, offerNow), "THANKS10 applies to orders over $40 before tax.");
  assert.equal(promotionError("THANKS10", 4001, onlineOffer.endsAt - 1), null);
  assert.match(promotionError("THANKS10", 9000, onlineOffer.endsAt), /expired/);
  assert.match(promotionError("FAKE", 9000, offerNow), /not recognised/);
  assert.equal(promotionError("", 9000, onlineOffer.endsAt), null);
  assert.equal(discountedUnitCents(150), 135);
});
test("THANKS10 discounts server prices, persists the code and keeps retries pinned", async t => {
  t.mock.method(Date, "now", () => offerNow);
  const f = setup();
  const body = { ...f.body, promotionCode: " thanks10 ", discount: 99, unitCents: 1 };
  assert.equal((await handleCheckout(f.request(body), f.env, f.stripe)).status, 200);
  assert.equal(f.calls[0].params.line_items[0].price_data.unit_amount, 4050);
  assert.match(f.calls[0].params.line_items[0].price_data.product_data.name, /THANKS10 \(10% off\)/);
  assert.equal(f.calls[0].params.metadata.promotion_code, "THANKS10");
  assert.match(f.calls[0].params.cancel_url, /promo=THANKS10/);
  const order = f.db.prepare("SELECT payload_json, lines_json FROM checkout_orders").get();
  assert.equal(JSON.parse(order.payload_json).promotionCode, "THANKS10");
  assert.equal(JSON.parse(order.lines_json)[0].unitCents, 4500);
  assert.equal((await handleCheckout(f.request(body), f.env, f.stripe)).status, 200);
  assert.equal(f.calls.length, 1);
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 409);
  f.db.close();
});
test("invalid, expired and below-minimum promotions create no order or Stripe session", async t => {
  let now = offerNow;
  t.mock.method(Date, "now", () => now);
  const f = setup();
  const small = [{ trayId: aLaCarteCartId(aLaCarteItem("Gulab Jamun").id), size: "piece", quantity: 1 }];
  for (const override of [{ promotionCode: "FAKE" }, { promotionCode: "THANKS10", cart: small }, { promotionCode: 10 }, { promotionCode: "x".repeat(33) }]) {
    assert.equal((await handleCheckout(f.request({ ...f.body, ...override }), f.env, f.stripe)).status, 400);
  }
  now = onlineOffer.endsAt;
  assert.equal((await handleCheckout(f.request({ ...f.body, promotionCode: "THANKS10" }), f.env, f.stripe)).status, 400);
  assert.equal(f.calls.length, 0);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS n FROM checkout_orders").get().n, 0);
  f.db.close();
});
test("signed discounted payments must match their pinned subtotal, including with tax", async t => {
  t.mock.method(Date, "now", () => offerNow);
  const f = setup(); enableLive(f);
  assert.equal((await handleCheckout(f.request({ ...f.body, promotionCode: "THANKS10" }), f.env, f.stripe)).status, 200);
  const sessionId = f.db.prepare("SELECT session_id FROM checkout_orders").get().session_id;
  const stripe = new Stripe("rk_live_fixture");
  async function send(subtotal) {
    const payload = JSON.stringify({ id: crypto.randomUUID(), type: "checkout.session.completed", livemode: true, data: { object: { id: sessionId, client_reference_id: f.body.orderId, metadata: { order_id: f.body.orderId }, currency: "usd", amount_subtotal: subtotal, amount_total: 8748, payment_status: "paid" } } });
    const signature = await stripe.webhooks.generateTestHeaderStringAsync({ payload, secret: f.env.STRIPE_WEBHOOK_SECRET, cryptoProvider: Stripe.createSubtleCryptoProvider() });
    return handleStripeWebhook(new Request(origin + "/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": signature }, body: payload }), f.env, stripe);
  }
  assert.equal((await send(1)).status, 400);
  assert.equal(f.db.prepare("SELECT status FROM checkout_orders").get().status, "pending");
  assert.equal((await send(undefined)).status, 400);
  assert.equal((await send(8100)).status, 200);
  assert.equal(f.db.prepare("SELECT status FROM checkout_orders").get().status, "paid");
  f.db.close();
});
test("cart validation rejects bad catalog IDs, sizes, quantities, duplicates and empty carts", () => {
  assert.deepEqual(validateCart(cart), cart);
  for (const invalid of [null, [], [...cart, ...cart], [{ ...cart[0], trayId: "bad" }], [{ ...cart[0], size: "bad" }], [{ ...cart[0], quantity: 0 }], [{ ...cart[0], quantity: 1.5 }], [{ ...cart[0], quantity: 100 }]]) assert.equal(validateCart(invalid), null);
  assert.equal(cartLines(cart)[0].unitCents, 4500);
});
const aLaCarteItem = name => aLaCarteCategories.flatMap(category => category.items).find(item => item.name === name);
test("mixed carts price a la carte trays, bread packs, individual sweets and drinks on the server", async () => {
  const f = setup();
  const mixed = [cart[0],
    { trayId: aLaCarteCartId(aLaCarteItem("Chilli Mushroom").id), size: "half", quantity: 1 },
    { trayId: aLaCarteCartId(aLaCarteItem("Butter Naan").id), size: "pack", quantity: 2 },
    { trayId: aLaCarteCartId(aLaCarteItem("Gulab Jamun").id), size: "piece", quantity: 4 },
    { trayId: aLaCarteCartId(aLaCarteItem("Mango Lassi / Rose Milk").id), size: "pack", quantity: 1 },
  ];
  const tampered = mixed.map(row => ({ ...row, unitCents: 1, price: 0.01 }));
  assert.equal((await handleCheckout(f.request({ ...f.body, cart: tampered }), f.env, f.stripe)).status, 200);
  const lines = f.calls[0].params.line_items;
  assert.deepEqual(lines.map(line => line.price_data.unit_amount), [4500, 8500, 5000, 150, 3500]);
  assert.deepEqual(lines.map(line => line.quantity), [2, 1, 2, 4, 1]);
  assert.match(lines[2].price_data.product_data.name, /Pack of 25 whole naan/);
  assert.match(lines[3].price_data.product_data.name, /Per piece/);
  assert.match(lines[4].price_data.product_data.name, /1 gallon/);
  assert.equal(cartLines(mixed).reduce((sum, line) => sum + line.unitCents * line.quantity, 0), 31600);
  f.db.close();
});
test("unpriced items and unsupported unit conversions cannot enter checkout", async () => {
  const f = setup();
  for (const [name, size] of [["Butter Naan", "quarter"], ["Gulab Jamun", "pack"], ["Mango Lassi / Rose Milk", "full"], ["Chilli Mushroom", "piece"], ["Movie Theatre Onion Samosa", "quarter"], ["Raita / Salan", "pack"]]) {
    const item = aLaCarteItem(name);
    assert.equal((await handleCheckout(f.request({ ...f.body, cart: [{ trayId: aLaCarteCartId(item.id), size, quantity: 1 }] }), f.env, f.stripe)).status, 400, name);
  }
  assert.deepEqual(getCartOptions(aLaCarteCartId(aLaCarteItem("Raita / Salan").id)), []);
  assert.equal(f.calls.length, 0);
  f.db.close();
});
test("sandbox runtime rejects live credentials", () => {
  assert.throws(() => stripeClient({ STRIPE_RESTRICTED_KEY: "rk_live_fixture" }), /sandbox API key/);
  assert.doesNotThrow(() => stripeClient({ STRIPE_RESTRICTED_KEY: "rk_test_fixture" }));
});
test("contact details are required and validated before an order or payment session is created", async () => {
  const f = setup();
  for (const invalid of [undefined, null, {}, { ...contact, name: "  " }, { ...contact, name: "a".repeat(121) }, { ...contact, email: "" }, { ...contact, email: "invalid" }, { ...contact, phone: "not-a-phone" }, { name: "Customer", phone: "123" }, { ...contact, email: 123 }]) {
    assert.equal((await handleCheckout(f.request({ ...f.body, contact: invalid }), f.env, f.stripe)).status, 400);
  }
  assert.equal(f.calls.length, 0);
  assert.equal(f.db.prepare("SELECT COUNT(*) AS count FROM checkout_orders").get().count, 0);
  f.db.close();
});
test("checkout saves trimmed contact details, prefills email and rejects contact changes on an existing attempt", async () => {
  const f = setup();
  assert.equal((await handleCheckout(f.request({ ...f.body, contact: { name: "  Test Customer  ", email: "  customer@example.com  " } }), f.env, f.stripe)).status, 200);
  assert.deepEqual(JSON.parse(f.db.prepare("SELECT payload_json FROM checkout_orders").get().payload_json).contact, contact);
  assert.equal(f.calls[0].params.customer_email, contact.email);
  assert.equal((await handleCheckout(f.request({ ...f.body, contact: { ...contact, name: "Another Customer" } }), f.env, f.stripe)).status, 409);
  assert.equal(f.calls.length, 1);
  f.db.close();
});
test("phone-only contact is accepted without sending an empty email to Stripe", async () => {
  const f = setup();
  const phoneContact = { name: "Test Customer", phone: "+1 (408) 555-0123" };
  assert.equal((await handleCheckout(f.request({ ...f.body, contact: phoneContact }), f.env, f.stripe)).status, 200);
  assert.deepEqual(JSON.parse(f.db.prepare("SELECT payload_json FROM checkout_orders").get().payload_json).contact, { ...phoneContact, email: "" });
  assert.equal(f.calls[0].params.customer_email, undefined);
  f.db.close();
});
test("pickup time is required, validated, persisted and pinned to the checkout attempt", async () => {
  const f = setup();
  for (const time of [undefined, "", "24:00", "12:60", "9:30", 1330]) {
    assert.equal((await handleCheckout(f.request({ ...f.body, time }), f.env, f.stripe)).status, 400);
  }
  assert.equal(f.calls.length, 0);
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 200);
  assert.equal(JSON.parse(f.db.prepare("SELECT payload_json FROM checkout_orders").get().payload_json).time, "13:30");
  assert.equal(f.calls[0].params.metadata.pickup_time, "13:30");
  assert.equal(f.calls[0].params.payment_intent_data.metadata.pickup_timezone, "America/Los_Angeles");
  assert.match(f.calls[0].params.custom_text.submit.message, /13:30 Pacific time/);
  assert.equal((await handleCheckout(f.request({ ...f.body, time: "14:30" }), f.env, f.stripe)).status, 409);
  assert.equal(f.calls.length, 1);
  f.db.close();
});
test("local mock completes without credentials and records a distinct idempotent demo result", async () => {
  const f = setup();
  f.env.CHECKOUT_ORIGIN = "http://localhost:8787";
  f.env.CHECKOUT_MOCK = "true";
  delete f.env.STRIPE_RESTRICTED_KEY;
  delete f.env.STRIPE_WEBHOOK_SECRET;
  const request = (body, path = "/api/checkout/session") => new Request(f.env.CHECKOUT_ORIGIN + path, { method: "POST", headers: { origin: f.env.CHECKOUT_ORIGIN, "content-type": "application/json" }, body: JSON.stringify(body) });
  const config = await (await handleCheckout(new Request(f.env.CHECKOUT_ORIGIN + "/api/checkout/config"), f.env)).json();
  assert.equal(config.mock, true);
  const first = await (await handleCheckout(request(f.body), f.env, f.stripe)).json();
  assert.equal(first.mock, true);
  const sessionId = new URL(first.url).searchParams.get("session_id");
  assert.equal(sessionId, `mock_${f.body.orderId}`);
  const second = await (await handleCheckout(request(f.body), f.env, f.stripe)).json();
  assert.deepEqual(first, second);
  const result = await (await handleCheckout(request({ sessionId }, "/api/checkout/status"), f.env)).json();
  assert.equal(result.status, "mock_paid");
  assert.deepEqual(result.cart, cart);
  assert.equal(result.confirmationNumber, `SRV-${f.body.orderId.toUpperCase()}`);
  assert.deepEqual(result.pickup, { date, time: "13:30" });
  assert.equal(f.db.prepare("SELECT COUNT(*) AS count FROM checkout_orders WHERE status = 'paid'").get().count, 0);
  assert.equal(f.calls.length, 0);
  assert.equal((await handleCheckout(request({ ...f.body, fulfillment: "delivery" }), f.env)).status, 400);
  assert.equal((await handleCheckout(request({ ...f.body, cart: [{ ...cart[0], quantity: 3 }] }), f.env)).status, 409);
  const unknown = await (await handleCheckout(request({ sessionId: `mock_${crypto.randomUUID()}` }, "/api/checkout/status"), f.env)).json();
  assert.equal(unknown.status, "pending");
  f.db.close();
});
test("mock is opt-in, localhost only, and client flags cannot bypass sandbox requirements", async () => {
  const f = setup();
  delete f.env.STRIPE_RESTRICTED_KEY;
  delete f.env.STRIPE_WEBHOOK_SECRET;
  f.env.CHECKOUT_MOCK = "true";
  assert.equal((await handleCheckout(f.request({ ...f.body, mock: true }), f.env, f.stripe)).status, 503);
  const config = await (await handleCheckout(new Request(origin + "/api/checkout/config"), f.env)).json();
  assert.equal(config.mock, false);
  f.env.CHECKOUT_ORIGIN = "http://localhost:8787";
  f.env.CHECKOUT_MOCK = "false";
  const request = new Request(f.env.CHECKOUT_ORIGIN + "/api/checkout/session", { method: "POST", headers: { origin: f.env.CHECKOUT_ORIGIN, "content-type": "application/json" }, body: JSON.stringify({ ...f.body, mock: true }) });
  assert.equal((await handleCheckout(request, f.env)).status, 503);
  assert.equal(f.calls.length, 0);
  f.db.close();
});
test("checkout prices on the server, charges zero pickup, and reuses the session after repeat clicks", async () => {
  const f = setup();
  const malicious = { ...f.body, amount: 1, deliveryCents: 2000, cart: [{ ...cart[0], unitCents: 1 }] };
  const response = await handleCheckout(f.request(malicious), f.env, f.stripe);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).url, "https://checkout.stripe.com/c/pay/test");
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 200);
  assert.equal(f.calls.length, 1);
  const { params, options } = f.calls[0];
  assert.equal(params.line_items[0].price_data.unit_amount, 4500);
  assert.equal(params.line_items[0].quantity, 2);
  assert.equal(params.shipping_options[0].shipping_rate_data.fixed_amount.amount, 0);
  assert.equal(params.payment_method_types, undefined);
  assert.equal(params.line_items[0].tax_rates, undefined);
  assert.match(params.custom_text.submit.message, /Tax is omitted/);
  assert.equal(options.idempotencyKey, `srivari-checkout-${f.body.orderId}`);
  assert.equal((await handleCheckout(f.request({ ...f.body, cart: [{ ...cart[0], quantity: 3 }] }), f.env, f.stripe)).status, 409);
  f.db.close();
});
test("retry after Stripe succeeds but database session save fails keeps idempotency parameters stable", async () => {
  const f = setup();
  const prepare = f.env.REPORT_DB.prepare;
  let fail = true;
  f.env.REPORT_DB.prepare = query => {
    const statement = prepare(query);
    if (query.startsWith("UPDATE checkout_orders SET session_id") && fail) statement.run = async () => { fail = false; throw new Error("temporary failure"); };
    return statement;
  };
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 503);
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 200);
  assert.equal(f.calls.length, 2);
  assert.deepEqual(f.calls[0], f.calls[1]);
  f.db.close();
});
test("delivery, invalid dates, foreign origin, rate limit and missing secrets block payment creation", async () => {
  const f = setup();
  for (const changes of [{ fulfillment: "delivery", address: "Oakland", deliveryCents: 0 }, { date: "2099-02-31" }, { date: "2000-01-01" }]) assert.equal((await handleCheckout(f.request({ ...f.body, ...changes }), f.env, f.stripe)).status, 400);
  assert.equal((await handleCheckout(f.request(f.body, undefined, { origin: "https://attacker.example" }), f.env, f.stripe)).status, 403);
  const rateEnv = { ...f.env, SEARCH_RATE_LIMITER: { async limit() { return { success: false }; } } };
  assert.equal((await handleCheckout(f.request(f.body), rateEnv, f.stripe)).status, 429);
  assert.equal((await handleCheckout(f.request(f.body), { ...f.env, STRIPE_WEBHOOK_SECRET: undefined }, f.stripe)).status, 503);
  assert.equal(f.calls.length, 0);
  f.db.close();
});
test("tax rate applies when configured; omission requires explicit sandbox flag", async () => {
  const f = setup();
  f.env.SANDBOX_ALLOW_NO_TAX = "false";
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 503);
  f.env.PICKUP_TAX_RATE_ID = "txr_fixture";
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 200);
  assert.deepEqual(f.calls[0].params.line_items[0].tax_rates, ["txr_fixture"]);
  f.db.close();
});
test("stored prices, tax rate and expiry stay pinned; closed sessions cannot be reopened", async () => {
  const f = setup();
  await handleCheckout(f.request(f.body), f.env, f.stripe);
  const row = f.db.prepare("SELECT * FROM checkout_orders").get();
  f.env.PICKUP_TAX_RATE_ID = "txr_changed";
  await handleCheckout(f.request(f.body), f.env, f.stripe);
  assert.deepEqual(f.db.prepare("SELECT * FROM checkout_orders").get(), row);
  f.sessions.get(row.session_id).status = "expired";
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 409);
  assert.equal(f.calls.length, 1);
  f.db.close();
});
test("real Stripe signature verification, pending asynchronous payments, failures and duplicate events", async () => {
  const f = setup();
  await handleCheckout(f.request(f.body), f.env, f.stripe);
  const sessionId = f.db.prepare("SELECT session_id FROM checkout_orders").get().session_id;
  const stripe = new Stripe("rk_test_fixture");
  async function event(type, overrides = {}, secret = f.env.STRIPE_WEBHOOK_SECRET, live = false) {
    const payload = JSON.stringify({ id: crypto.randomUUID(), type, livemode: live, data: { object: { id: sessionId, client_reference_id: f.body.orderId, metadata: { order_id: f.body.orderId }, currency: "usd", amount_total: 9000, payment_status: "unpaid", customer_details: { email: "sandbox@example.com" }, ...overrides } } });
    const signature = await stripe.webhooks.generateTestHeaderStringAsync({ payload, secret, cryptoProvider: Stripe.createSubtleCryptoProvider() });
    return handleStripeWebhook(new Request(origin + "/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": signature }, body: payload }), f.env, stripe);
  }
  const status = () => f.db.prepare("SELECT status FROM checkout_orders").get().status;
  assert.equal((await event("checkout.session.completed", {}, "wrong")).status, 400);
  assert.equal((await event("checkout.session.completed", {}, undefined, true)).status, 400);
  assert.equal((await event("checkout.session.completed", { amount_total: 1, payment_status: "paid" })).status, 400);
  assert.equal(status(), "pending");
  await event("checkout.session.completed");
  assert.equal(status(), "pending");
  const pendingDetails = await (await handleCheckout(f.request({ sessionId }, "/api/checkout/status"), f.env, f.stripe)).json();
  assert.equal(pendingDetails.confirmationNumber, undefined);
  assert.equal(pendingDetails.pickup, undefined);
  await event("checkout.session.async_payment_failed");
  assert.equal(status(), "failed");
  await event("checkout.session.async_payment_succeeded", { payment_status: "paid" });
  assert.equal(status(), "paid");
  await event("checkout.session.async_payment_succeeded", { payment_status: "paid" });
  await event("checkout.session.expired");
  await event("checkout.session.async_payment_failed");
  assert.equal(status(), "paid");
  assert.equal(f.db.prepare("SELECT COUNT(*) AS count FROM checkout_orders").get().count, 1);
  const confirmed = await (await handleCheckout(f.request({ sessionId }, "/api/checkout/status"), f.env, f.stripe)).json();
  assert.equal(confirmed.status, "paid");
  assert.deepEqual(confirmed.cart, cart);
  assert.equal(confirmed.confirmationNumber, `SRV-${f.body.orderId.toUpperCase()}`);
  assert.deepEqual(confirmed.pickup, { date, time: "13:30" });
  const reloaded = await (await handleCheckout(f.request({ sessionId }, "/api/checkout/status"), f.env, f.stripe)).json();
  assert.equal(reloaded.confirmationNumber, confirmed.confirmationNumber);
  f.db.close();
});
function enableLive(f) {
  Object.assign(f.env, { STRIPE_MODE: "live", STRIPE_ACCOUNT_ID: "acct_live_restaurant", STRIPE_RESTRICTED_KEY: "rk_live_fixture", PICKUP_TAX_RATE_ID: "txr_livefixture" });
  f.stripe.accounts = { async retrieve() { return { id: "acct_live_restaurant", charges_enabled: true }; } };
  f.stripe.taxRates = { async retrieve() { return { active: true, livemode: true }; } };
}
function localModeFixture() {
  const f = setup(); enableLive(f);
  f.env.CHECKOUT_ORIGIN = "http://localhost:8787";
  f.env.STRIPE_SANDBOX_RESTRICTED_KEY = "rk_test_local_fixture";
  f.env.STRIPE_SANDBOX_WEBHOOK_SECRET = "whsec_local_sandbox_fixture";
  const request = (body, path = "/api/checkout/session?flag=sandbox") => new Request(f.env.CHECKOUT_ORIGIN + path, { method: "POST", headers: { origin: f.env.CHECKOUT_ORIGIN, "content-type": "application/json" }, body: JSON.stringify(body) });
  return { ...f, localRequest: request };
}
test("local URL flag selects separate sandbox credentials and tax without changing live defaults", async () => {
  const f = localModeFixture();
  const request = new Request("http://localhost:8787/api/checkout/config?flag=sandbox");
  const selected = checkoutEnvForRequest(request, f.env);
  assert.equal(selected.STRIPE_MODE, "sandbox");
  assert.equal(selected.STRIPE_RESTRICTED_KEY, f.env.STRIPE_SANDBOX_RESTRICTED_KEY);
  assert.equal(selected.STRIPE_WEBHOOK_SECRET, f.env.STRIPE_SANDBOX_WEBHOOK_SECRET);
  assert.equal(selected.PICKUP_TAX_RATE_ID, undefined);
  assert.equal(selected.SANDBOX_ALLOW_NO_TAX, "true");
  assert.equal(selected.CHECKOUT_MOCK, "false");
  assert.equal(f.env.STRIPE_RESTRICTED_KEY, "rk_live_fixture");
  for (const flag of ["", "?flag=live", "?flag=other"]) {
    const config = await (await handleCheckout(new Request("http://localhost:8787/api/checkout/config" + flag), f.env)).json();
    assert.equal(config.mode, "live");
  }
  const config = await (await handleCheckout(request, f.env)).json();
  assert.equal(config.mode, "sandbox");
  assert.equal(config.mock, false);
  f.env.SANDBOX_PICKUP_TAX_RATE_ID = "txr_sandbox_fixture";
  assert.equal(checkoutEnvForRequest(request, f.env).PICKUP_TAX_RATE_ID, "txr_sandbox_fixture");
  f.db.close();
});
test("production and mismatched origins ignore the sandbox URL flag", async () => {
  const f = localModeFixture();
  f.env.CHECKOUT_ORIGIN = origin;
  for (const url of [origin + "/api/checkout/config?flag=sandbox", "http://localhost:8787/api/checkout/config?flag=sandbox", "https://localhost.evil.example/api/checkout/config?flag=sandbox"]) {
    assert.equal(checkoutEnvForRequest(new Request(url), f.env), f.env);
    assert.equal((await (await handleCheckout(new Request(url), f.env)).json()).mode, "live");
  }
  f.db.close();
});
test("sandbox flag never falls back to live credentials when test keys are missing", async () => {
  const f = localModeFixture();
  delete f.env.STRIPE_SANDBOX_RESTRICTED_KEY;
  const selected = checkoutEnvForRequest(f.localRequest(f.body), f.env);
  assert.equal(selected.STRIPE_RESTRICTED_KEY, undefined);
  assert.equal((await handleCheckout(f.localRequest(f.body), f.env, f.stripe)).status, 503);
  assert.equal(f.calls.length, 0);
  f.env.STRIPE_SANDBOX_RESTRICTED_KEY = "rk_live_wrong_for_sandbox";
  assert.equal((await handleCheckout(f.localRequest(f.body), f.env)).status, 503);
  f.db.close();
});
test("flagged sandbox checkout preserves mode on return and cannot reuse a live order", async () => {
  const f = localModeFixture();
  f.stripe.checkout.sessions.create = async (params, options) => {
    f.calls.push({ params, options });
    return { id: "cs_test_local_sandbox_fixture", livemode: false, status: "open", url: "https://checkout.stripe.com/c/pay/test" };
  };
  assert.equal((await handleCheckout(f.localRequest(f.body), f.env, f.stripe)).status, 200);
  const stored = f.db.prepare("SELECT * FROM checkout_orders").get();
  assert.equal(stored.stripe_mode, "sandbox");
  assert.equal(stored.tax_rate, "");
  assert.equal(f.calls[0].params.success_url, "http://localhost:8787/checkout?flag=sandbox&session_id={CHECKOUT_SESSION_ID}");
  assert.equal(f.calls[0].params.cancel_url, "http://localhost:8787/checkout?flag=sandbox&canceled=1");
  assert.equal((await handleCheckout(f.localRequest(f.body, "/api/checkout/session"), f.env, f.stripe)).status, 409);
  assert.equal((await handleCheckout(f.localRequest({ sessionId: "cs_live_123456789012345" }, "/api/checkout/status?flag=sandbox"), f.env)).status, 400);
  const status = await (await handleCheckout(f.localRequest({ sessionId: stored.session_id }, "/api/checkout/status?flag=sandbox"), f.env)).json();
  assert.equal(status.status, "pending");
  f.db.close();
});
test("local sandbox webhook uses its own signing secret and rejects events in the wrong mode", async () => {
  const f = localModeFixture();
  const sdk = new Stripe("rk_test_fixture");
  async function event(live, secret, flag = "?flag=sandbox") {
    const payload = JSON.stringify({ id: crypto.randomUUID(), type: "checkout.session.completed", livemode: live, data: { object: { metadata: {} } } });
    const signature = await sdk.webhooks.generateTestHeaderStringAsync({ payload, secret, cryptoProvider: Stripe.createSubtleCryptoProvider() });
    return handleCheckout(new Request(f.env.CHECKOUT_ORIGIN + "/api/stripe/webhook" + flag, { method: "POST", headers: { "stripe-signature": signature }, body: payload }), f.env, sdk);
  }
  assert.equal((await event(false, f.env.STRIPE_SANDBOX_WEBHOOK_SECRET)).status, 200);
  assert.equal((await event(false, f.env.STRIPE_WEBHOOK_SECRET)).status, 400);
  assert.equal((await event(true, f.env.STRIPE_SANDBOX_WEBHOOK_SECRET)).status, 400);
  assert.equal((await event(false, f.env.STRIPE_SANDBOX_WEBHOOK_SECRET, "")).status, 400);
  assert.equal((await event(true, f.env.STRIPE_WEBHOOK_SECRET, "")).status, 200);
  f.env.CHECKOUT_ORIGIN = origin;
  assert.equal((await event(false, f.env.STRIPE_SANDBOX_WEBHOOK_SECRET)).status, 400);
  assert.equal((await event(true, f.env.STRIPE_WEBHOOK_SECRET)).status, 200);
  f.db.close();
});
test("sandbox links preserve existing return parameters and menu anchors", () => {
  assert.equal(withSandboxFlag("/checkout", true), "/checkout?flag=sandbox");
  assert.equal(withSandboxFlag("/#signature-trays", true), "/?flag=sandbox#signature-trays");
  assert.equal(withSandboxFlag("/checkout?canceled=1", true), "/checkout?canceled=1&flag=sandbox");
  assert.equal(withSandboxFlag("/checkout", false), "/checkout");
});
test("live runtime refuses test keys, and mock/no-tax flags cannot enable unconfigured live payments", async () => {
  assert.throws(() => stripeClient({ STRIPE_MODE: "live", STRIPE_RESTRICTED_KEY: "rk_test_fixture" }), /live API key/);
  assert.doesNotThrow(() => stripeClient({ STRIPE_MODE: "live", STRIPE_RESTRICTED_KEY: "rk_live_fixture" }));
  const f = setup(); enableLive(f);
  f.env.CHECKOUT_MOCK = "true";
  assert.equal(mockCheckoutEnabled(new Request("http://localhost:8787"), { ...f.env, CHECKOUT_ORIGIN: "http://localhost:8787" }), false);
  delete f.env.PICKUP_TAX_RATE_ID;
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 503);
  assert.equal(f.calls.length, 0);
  f.db.close();
});
test("live checkout verifies the recipient account, account readiness, and active live tax rate", async () => {
  for (const bad of ["account", "disabled", "archivedTax", "sandboxTax"]) {
    const f = setup(); enableLive(f);
    if (bad === "account") f.stripe.accounts.retrieve = async () => ({ id: "acct_wrong", charges_enabled: true });
    if (bad === "disabled") f.stripe.accounts.retrieve = async () => ({ id: f.env.STRIPE_ACCOUNT_ID, charges_enabled: false });
    if (bad === "archivedTax") f.stripe.taxRates.retrieve = async () => ({ active: false, livemode: true });
    if (bad === "sandboxTax") f.stripe.taxRates.retrieve = async () => ({ active: true, livemode: false });
    assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 503, bad);
    assert.equal(f.calls.length, 0, bad);
    f.db.close();
  }
});
test("live checkout records live orders and has customer copy and free pickup", async () => {
  const f = setup(); enableLive(f);
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 200);
  const order = f.db.prepare("SELECT * FROM checkout_orders").get();
  assert.equal(order.stripe_mode, "live");
  assert.match(order.session_id, /^cs_live_/);
  assert.deepEqual(f.calls[0].params.line_items[0].tax_rates, ["txr_livefixture"]);
  assert.equal(f.calls[0].params.shipping_options[0].shipping_rate_data.fixed_amount.amount, 0);
  assert.doesNotMatch(f.calls[0].params.custom_text.submit.message, /sandbox|test only|not a real food order/i);
  assert.equal((await handleCheckout(f.request({ sessionId: "cs_test_123456789012345" }, "/api/checkout/status"), f.env, f.stripe)).status, 400);
  f.db.close();
});
test("sandbox orders cannot be reused when switching the same order ID to live mode", async () => {
  const f = setup();
  await handleCheckout(f.request(f.body), f.env, f.stripe);
  enableLive(f);
  assert.equal((await handleCheckout(f.request(f.body), f.env, f.stripe)).status, 409);
  assert.equal(f.calls.length, 1);
  f.db.close();
});
test("live webhooks accept signed live events, reject test events, and persist live payment", async () => {
  const f = setup(); enableLive(f);
  await handleCheckout(f.request(f.body), f.env, f.stripe);
  const sessionId = f.db.prepare("SELECT session_id FROM checkout_orders").get().session_id;
  const sdk = new Stripe("rk_live_fixture");
  async function send(live) {
    const payload = JSON.stringify({ id: crypto.randomUUID(), type: "checkout.session.completed", livemode: live, data: { object: { id: sessionId, client_reference_id: f.body.orderId, metadata: { order_id: f.body.orderId }, currency: "usd", amount_total: 9900, payment_status: "paid", customer_details: { email: "customer@example.com" } } } });
    const signature = await sdk.webhooks.generateTestHeaderStringAsync({ payload, secret: f.env.STRIPE_WEBHOOK_SECRET, cryptoProvider: Stripe.createSubtleCryptoProvider() });
    return handleStripeWebhook(new Request(origin + "/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": signature }, body: payload }), f.env, sdk);
  }
  assert.equal((await send(false)).status, 400);
  assert.equal(f.db.prepare("SELECT status FROM checkout_orders").get().status, "pending");
  assert.equal((await send(true)).status, 200);
  assert.equal(f.db.prepare("SELECT status FROM checkout_orders").get().status, "paid");
  const status = await (await handleCheckout(f.request({ sessionId }, "/api/checkout/status"), f.env, f.stripe)).json();
  assert.equal(status.status, "paid");
  f.db.close();
});
