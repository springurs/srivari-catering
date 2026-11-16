# Stripe checkout: live and sandbox

The selected live account for both local testing and production is `acct_1UbGMnPnTtncdfto`. Sandbox development uses **srvaricatering sandbox** (`acct_1UbGMzPUsTZIPVZD`). `STRIPE_MODE` selects the environment; API-key prefixes, Session references, webhook events and stored orders must match that mode. Production is not activated until the live key, live webhook and confirmed tax rate are configured and the Worker is deployed. Local live testing uses `npm run dev:live` and credentials in the ignored `.dev.vars`; the local webhook listener has a separate signing secret from the hosted destination.

Signature Tray prices were approved by the owner on November 13, 2026. Customers select a size on a tray card, add trays, and open `/checkout` to edit quantities and choose fulfillment. Pickup is free at 3180 Santa Rita Rd, Pleasanton, CA 94566. The server obtains prices from the catalog; amounts or delivery fees supplied by the browser cannot change them.

À La Carte rows also support cart ordering. Priced tray dishes offer quarter, half, ¾ and full sizes; bread packs, sweets and drinks retain their listed pack, piece or volume units and exact prices. Items without a confirmed price have an Enquire action and cannot enter paid checkout. The server shares this catalog with the size selectors, accepts mixed Signature/À La Carte carts, and rejects unsupported unit conversions or browser-supplied price changes. Cart item editing offers only the options available for that item.

Before payment, customers provide their full name and at least one contact method (email or phone). These details are validated and stored with the order. A supplied email prefills Stripe Checkout. Each cart item has its own blue pencil icon for editing tray size and quantity; changing to a size already in the cart combines the quantities, up to 99. Customers save or close item edits before selecting Make my payment, which opens Stripe directly without a separate Checkout step. On desktop, a sticky Secure Checkout panel on the right summarizes every selected item, quantity, price, contact detail, fulfillment choice, requested date and time, and pickup location or delivery address. The summary updates as selections change and appears below the form on smaller screens. Changing order details uses a new checkout attempt; delivery quote forms reuse the entered contact details.

Requested date and time appear side by side, with times interpreted in America/Los_Angeles. Both are required and included in the stored order, Stripe pickup details and delivery quote request. Changing the requested time uses a new checkout attempt. Requested timing remains subject to staff confirmation.

Delivery requires a location-based quote. The checkout collects the date and full address, then opens the existing contact form with the order details prefilled. Staff confirm availability, delivery cost and applicable tax before arranging payment through the restaurant's normal Stripe quote/invoice or payment-link process. Delivery requests cannot call the immediate pickup payment endpoint. This change does not calculate delivery mileage, issue delivery payment links automatically, or send a quote without staff review.

## Local URL switch (live by default)

Run `npm run dev:live` once and use either URL:

- `http://localhost:8787/` uses the existing live credentials.
- `http://localhost:8787/?flag=sandbox` uses the separate sandbox credentials below.

Keep the working live settings in `.dev.vars` and add:

```dotenv
STRIPE_SANDBOX_RESTRICTED_KEY=rk_test_REPLACE_WITH_SANDBOX_KEY
STRIPE_SANDBOX_WEBHOOK_SECRET=whsec_REPLACE_WITH_SANDBOX_LISTENER_SECRET
# Optional: SANDBOX_PICKUP_TAX_RATE_ID=txr_FROM_THE_SAME_SANDBOX
```

Sandbox selection never falls back to the live key, live webhook secret, or live tax rate. Without a sandbox tax rate, sandbox checkout omits tax. These placeholders must be replaced with real sandbox credentials; missing credentials keep sandbox payments unavailable. Mock checkout is disabled for this URL switch.

Authenticate the Stripe CLI to the intended sandbox, then run:

```sh
stripe listen --forward-to 'http://localhost:8787/api/stripe/webhook?flag=sandbox'
```

Save the listener's signing secret as `STRIPE_SANDBOX_WEBHOOK_SECRET`, and keep the listener running to confirm sandbox payments. A separate live listener forwards to `/api/stripe/webhook` without the flag and uses `STRIPE_WEBHOOK_SECRET`.

The cart link, checkout API requests, Add more trays link, Stripe success/cancel return links, and payment-status requests preserve `flag=sandbox`. Removing the flag selects the default live configuration again. The override is restricted to loopback hosts whose origin matches the configured local checkout origin. Hosted production ignores the flag. The fixed-mode `dev:sandbox` and `dev:mock` commands remain available separately.

## Local mock success (no credentials)

Run `npm run dev:mock`, open `http://localhost:8787`, add trays, select pickup and a date, then choose **Complete mock checkout**. The API stores a `mock_paid` demo order and redirects to the success screen, which clears the matching cart. Stripe is not contacted, and no charge or real food order is made. Delivery continues to require a quote.

This mode requires `CHECKOUT_MOCK=true` and a matching localhost origin. The command enables the flag only for its local process; hosted configuration does not enable it. A browser request or query parameter cannot turn it on. Mock references are separate from Stripe Session IDs and are never recorded as real `paid` orders.

When ready for Stripe sandbox, stop the mock server, configure the credentials below, then use `npm run dev:sandbox` to explicitly disable mock mode. Mock success does not test Stripe connectivity or webhook delivery.

## Runtime configuration

The Stripe plugin connection is not a website runtime API key. Obtain a **restricted test key** from the selected sandbox, granting Checkout Sessions read/write and permissions needed to create inline Products/Prices and PaymentIntents. Keep keys out of chat, source control, browser code and logs.

For local development, put the following variables in the ignored `.dev.vars` file, preserving any existing entries:

```dotenv
STRIPE_MODE=sandbox
STRIPE_RESTRICTED_KEY=rk_test_REPLACE_WITH_YOUR_SANDBOX_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_WEBHOOK_SIGNING_SECRET
CHECKOUT_ORIGIN=http://localhost:8787
SANDBOX_ALLOW_NO_TAX=true
```

These are placeholders, not working credentials. The test key and webhook must belong to **srvaricatering sandbox**, not SRIVARI live mode or another test account.

For local testing, with `SANDBOX_ALLOW_NO_TAX=true`, sandbox payments can be tested without tax; both the website and Stripe page say that tax may be omitted. To test tax, add `PICKUP_TAX_RATE_ID=txr_...` for an active rate from the same sandbox and set `SANDBOX_ALLOW_NO_TAX=false`. The configured rate is applied to every tray line. This is a manual tax-rate integration, not automatic Stripe Tax. Never reuse this no-tax test configuration as a production tax policy.

## Local test flow

```sh
npx wrangler d1 migrations apply srivari-catering-reports --local
npm run build
npm run dev:sandbox
```

Use `http://localhost:8787`, matching `CHECKOUT_ORIGIN`. `next dev` alone does not serve Worker APIs. Local D1 storage is isolated from the remote production database.

Configure a Stripe CLI webhook forwarder authenticated to **srvaricatering sandbox**:

```sh
stripe listen --forward-to http://localhost:8787/api/stripe/webhook
```

Copy the forwarder's signing secret into `.dev.vars` as `STRIPE_WEBHOOK_SECRET`, then restart Wrangler. The webhook must receive:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

Open the menu, add trays, select pickup and a date, and continue to hosted Stripe Checkout. Use Stripe sandbox payment methods. Check that the total matches the menu, pickup is free, and the return page eventually shows confirmed test payment. Test cancel/retry and a delayed payment as well. No end-to-end Stripe test has been completed until real sandbox credentials and the forwarder are configured.

## Hosted live configuration

The root `wrangler.jsonc` config targets live payments for `acct_1UbGMnPnTtncdfto`, requires tax and has no mock flag. The ignored `.dev.vars` supplies local credentials and the selected mode. Use the same live API key, account ID and confirmed live tax rate in both environments, with each environment's own checkout origin and webhook signing secret. Never upload `.dev.vars` as production settings; it can contain a local listener secret or sandbox credentials.

Create a restricted LIVE key on Srivaripleasanton with Checkout Sessions read/write, the permissions needed for inline Products/Prices and PaymentIntents, Account read and Tax Rates read. Store it in Cloudflare secrets. Use a live signing secret from the hosted webhook destination, not the local CLI listener:


```sh
npx wrangler secret put STRIPE_RESTRICTED_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

Set `CHECKOUT_ORIGIN` to `https://srivaricatering.com` and `PICKUP_TAX_RATE_ID` to the owner's confirmed live `txr_…` rate. Live mode always requires an active live tax rate, regardless of `SANDBOX_ALLOW_NO_TAX`. Before creating a live Session the Worker checks that the runtime key belongs to the expected account, charges are enabled and the stored tax rate is active and live. No rate or exemption is guessed.

Apply migrations 0002 and 0003 to the hosted D1 database before deployment. Existing orders default to `sandbox`; they cannot be reused or fulfilled as live orders. Register `https://srivaricatering.com/api/stripe/webhook` in the selected LIVE Stripe account for the four events above, using snapshot payloads. Save the returned signing secret in Cloudflare, then deploy the Worker with the complete configuration. Hosted previews intentionally have no D1 binding and cannot take payments without separate configuration.

The checkout UI reads its mode from the Worker. Live orders show customer payment/confirmation copy. Local sandbox and mock checkout retain test notices. The server permits the documented sandbox URL override only on the configured loopback origin; hosted query strings and browser payloads cannot switch production mode.

Verify the deployed configuration, create and then expire an unpaid live Checkout Session to check Session creation and signed live webhook delivery without charging a card. A successful unpaid Session test does not prove a card payment, refund or bank settlement. Staff must monitor the live Stripe Dashboard and D1 paid orders for real customer purchases.

## Confirmation and operations

The server pins the catalog lines, tax rate and expiry in D1 before creating a Checkout Session. One order ID maps to one Session. Stripe idempotency keys keep retries safe even when Stripe succeeds before the database stores the Session reference. Client retries preserve the attempt in session storage. Changing an order under the same ID is rejected.

Only signed webhook events mark an order `paid`; a success URL never does. Unpaid completed events remain pending. Delayed methods require the later success event, and duplicate or out-of-order events cannot downgrade a paid order. The return page polls persisted status and clears the cart only after confirmed payment, and only if its contents still match the paid order.

After verified payment, the return page displays “Thank you for your order!”, a stable confirmation number derived from the stored order ID, the requested pickup date/time and location, a contact message linking to srivaripleasanton@gmail.com, and a Browse packages button. Pending, failed and expired payments show their actual status and do not receive a confirmation number. Sandbox and mock confirmations retain explicit test notices. The Browse packages link preserves the local sandbox flag.

The `checkout_orders` D1 table stores cart, fixed prices, requested date, Session reference, payment status and customer contact details. Restrict database access and apply the restaurant's customer-data retention policy. Staff must fulfill only confirmed live orders; do not fulfill sandbox or mock orders. This change does not create kitchen tickets, send confirmation emails, reserve stock, or sync refunds/disputes. Stripe Dashboard remains the payment operations interface.

## Checks

```sh
npm run test:checkout
npm run test:search
npm run lint
npm run build
npx wrangler deploy --dry-run
```

Tests use temporary SQLite, mocked Sessions and genuine Stripe SDK signature verification. They do not create real payments or send enquiries.
