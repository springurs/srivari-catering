# Daily catering email report

The report is configured for **srivaripleasanton@gmail.com at 9:00 AM America/Los_Angeles**, covering the previous Pacific calendar day. Its sender is **reports@srivaricatering.com**. The Cloudflare Cron Trigger runs at 16:00 and 17:00 UTC; the scheduled handler runs only when that is 9:00 AM Pacific, so delivery follows daylight saving time.

The email contains HTML and plain text with page views, package views, menu previews, reported successful enquiries, package interest, guest counts across previews, and popular selected dishes. Empty days still produce a report. These are browser-reported activity counts, not unique visitors or confirmed bookings; repeated actions are counted. Missing or blocked reporting requests are not included. Enquiry events are sent only after Web3Forms confirms submission; they are not a server-side delivery or inbox audit.

An [example report](../exports/Srivari-Daily-Report-Example.html) shows the email layout using clearly labeled, simulated local activity.

`/api/site-activity` accepts only known events and published packages. Selected dishes and guest counts are validated against the current menu. Event UUIDs deduplicate repeated delivery of the same event; they are not persistent visitor identifiers. The reporting database does not store names, phone numbers, email addresses, descriptions, IP addresses, browser fingerprints, event dates/times, or raw searches. IP addresses are used only by the Cloudflare rate limiter. Activity is stored in Cloudflare D1 and retained for 90 days. Reporting failures never block the existing browsing, planner, or contact form.

## Activation

The D1 database `srivari-catering-reports` and its schema have been created. The website changes, email binding and Cron Trigger still need to be deployed. No live test report has been sent.

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) with the account that owns `srivaricatering.com`.
2. Go to **Compute → Email Service → Email Sending** and onboard **srivaricatering.com**. Complete Cloudflare's email DNS authentication setup and wait for the sender domain to become ready. If Cloudflare requests destination verification for `srivaripleasanton@gmail.com`, complete that verification too.
3. Publish the prepared changes from the project directory with `npm run deploy`.
4. Under **Workers & Pages → srivari-catering → Settings → Triggers**, check the Cron Trigger `0 16,17 * * *`. Wrangler owns this configuration; future schedule changes should be made in `wrangler.jsonc`.
5. The first daily email arrives at the next 9:00 AM Pacific after deployment. It contains only activity recorded after the feature was deployed. Check Worker scheduled-event logs and Email Service logs if a report is missing.

The current Wrangler OAuth session returned Cloudflare error **2036 Unauthorized** when reading this domain's Email Sending settings. Domain readiness could not be verified from the terminal. Dashboard onboarding or an account permission update is required before live sending can be confirmed. The provider's current setup steps are documented in [Cloudflare Email Sending](https://developers.cloudflare.com/email-service/get-started/send-emails/).

## Configuration and checks

`wrangler.jsonc` contains the `REPORT_DB` database binding, `DAILY_REPORT_EMAIL` binding restricted to the report sender/recipient, `ACTIVITY_RATE_LIMITER`, `REPORT_EMAIL_FROM`, `REPORT_EMAIL_TO`, and `REPORTS_ENABLED`. Set `REPORTS_ENABLED` to `false` and redeploy to stop activity collection and daily sending.

For another deployment, create its D1 database, update the database ID, and run `npx wrangler d1 migrations apply REPORT_DB --remote`. For local testing, run `npx wrangler d1 migrations apply REPORT_DB --local`, then `npm run preview`. Local email bindings are simulated; do not add `remote: true` during development unless actual email sending is intended.

Run `npm run test:reports` with Node.js 22.13 or newer to exercise real SQLite queries, activity validation, request restrictions, duplicate events, daylight saving transitions, aggregation, concurrent scheduled calls, empty-day reports, failed delivery, and retention cleanup. Test emails use a mock binding. `npm run lint`, `npm run build`, and `npx wrangler deploy --dry-run` validate the app and Worker configuration without publishing.

`daily_report_delivery` records sending/sent/failed states and a claim token to guard concurrent or repeated invocations. Failed provider calls leave the report retryable by another scheduled invocation for that same day. The table is not a provider-level exactly-once guarantee: a crash after the provider accepts an email but before the Worker records success can cause duplicate delivery on retry. Inspect delivery state and email logs before manually replaying an old report.
