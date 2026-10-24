import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { menus } from "../app/data/catering-menu";
import { encodeCateringPlan } from "../app/lib/catering-plan-cookie";
import { handleSiteActivity, validateActivity, buildDailyReport, pacificDay, previousPacificDay, isReportTime, sendDailyReport } from "../worker/daily-reports";

function setup() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(readFileSync("migrations/0001_daily_reports.sql", "utf8"));
  const db = {
    prepare(query) {
      let values = [];
      return {
        bind(...nextValues) { values = nextValues; return this; },
        async run() { return { meta: { changes: Number(sql.prepare(query).run(...values).changes) } }; },
        async all() { return { results: sql.prepare(query).all(...values) }; },
      };
    },
  };
  const emails = [];
  const env = {
    REPORT_DB: db,
    REPORTS_ENABLED: "true",
    REPORT_EMAIL_FROM: "reports@srivaricatering.com",
    REPORT_EMAIL_TO: "srivaripleasanton@gmail.com",
    ACTIVITY_RATE_LIMITER: { limit: async () => ({ success: true }) },
    DAILY_REPORT_EMAIL: { async send(message) { emails.push(message); return { messageId: "mock-delivery" }; } },
  };
  return { sql, db, env, emails };
}

const menu = menus.find((item) => item.name === "Srivari Executive Feast");
const choices = Object.fromEntries(menu.selections.map((group) => [group.name, group.options.slice(0, group.count)]));
const plan = encodeCateringPlan({ menuName: menu.name, choices, guestCount: "50" });
const activity = (kind, extras = {}) => ({ id: crypto.randomUUID(), kind, path: "/", ...extras });
function request(body, options = {}) {
  return new Request("https://srivaricatering.com/api/site-activity", { method: "POST", headers: { origin: "https://srivaricatering.com", "content-type": "application/json" }, body: JSON.stringify(body), ...options });
}

test("Pacific report scheduling handles summer, winter and daylight-saving transitions", () => {
  for (const [day, hour] of [["2030-01-10", "17"], ["2030-07-10", "16"], ["2026-03-08", "16"], ["2026-11-01", "17"]]) {
    assert(isReportTime(Date.parse(`${day}T${hour}:00:00Z`)));
    const otherHour = hour === "17" ? "16" : "17";
    assert(!isReportTime(Date.parse(`${day}T${otherHour}:00:00Z`)));
    assert(!isReportTime(Date.parse(`${day}T${hour}:01:00Z`)));
  }
  assert.equal(pacificDay(Date.parse("2030-07-10T02:00:00Z")), "2030-07-09");
  assert.equal(previousPacificDay(Date.parse("2030-01-01T17:00:00Z")), "2029-12-31");
});

test("activity accepts known menus and complete selections while dropping personal fields", () => {
  const value = activity("plan_preview", { packageName: menu.name, guests: "50", plan, name: "Private name", email: "private@example.com", description: "Private message" });
  const result = validateActivity(value);
  assert(result);
  assert.deepEqual(result.choices, choices);
  assert(!JSON.stringify(result).includes("Private"));
  assert(!JSON.stringify(result).includes("private@example.com"));
  for (const invalid of [{ ...value, id: "invalid" }, { ...value, kind: "unknown" }, { ...value, path: "/api/private" }, { ...value, packageName: "Unknown package" }, { ...value, guests: "24" }, { ...value, plan: "%broken" }, { ...value, plan: encodeCateringPlan({ menuName: menu.name, choices: {}, guestCount: "50" }) }]) {
    assert.equal(validateActivity(invalid), null);
  }
});

test("activity endpoint validates requests, deduplicates events and uses the server's Pacific date", async () => {
  const { sql, env } = setup();
  try {
    const value = activity("page_view", { day: "Fake day", created_at: 0, email: "private@example.com" });
    const time = Date.parse("2030-07-10T02:00:00Z");
    assert.equal((await handleSiteActivity(request(value), env, time)).status, 204);
    assert.equal((await handleSiteActivity(request(value), env, time)).status, 204);
    const rows = sql.prepare("SELECT * FROM site_activity").all();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].day, "2030-07-09");
    assert(!JSON.stringify(rows).includes("private@example.com"));
    assert.equal((await handleSiteActivity(new Request("https://srivaricatering.com/api/site-activity"), env)).status, 405);
    assert.equal((await handleSiteActivity(request(value, { headers: { origin: "https://other.example", "content-type": "application/json" } }), env)).status, 403);
    assert.equal((await handleSiteActivity(request(value, { headers: { origin: "https://srivaricatering.com", "content-type": "text/plain" } }), env)).status, 415);
    assert.equal((await handleSiteActivity(request({ invalid: "x".repeat(9000) }), env)).status, 400);
    assert.equal((await handleSiteActivity(request(value), { ...env, REPORTS_ENABLED: "false" })).status, 503);
    assert.equal((await handleSiteActivity(request(value), { ...env, ACTIVITY_RATE_LIMITER: { limit: async () => ({ success: false }) } })).status, 429);
    assert.equal((await handleSiteActivity(request(value), { ...env, REPORT_DB: { prepare() { throw new Error("Database unavailable"); } } })).status, 503);
  } finally { sql.close(); }
});

test("daily report totals, packages and dishes cover exactly one Pacific day", async () => {
  const { sql, env, db } = setup();
  try {
    const time = Date.parse("2030-07-09T19:00:00Z");
    const values = [activity("page_view"), activity("page_view", { path: "/contact" }), activity("package_view", { packageName: menu.name }), activity("plan_preview", { packageName: menu.name, guests: "50", plan }), activity("enquiry_sent", { packageName: menu.name, guests: "50" }), activity("enquiry_sent", { path: "/contact" })];
    for (const value of values) assert.equal((await handleSiteActivity(request(value), env, time)).status, 204);
    await handleSiteActivity(request(activity("page_view")), env, Date.parse("2030-07-10T19:00:00Z"));
    const report = await buildDailyReport(db, "2030-07-09");
    assert.deepEqual(report.totals, { pageViews: 2, packageViews: 1, previews: 1, enquiries: 2 });
    assert.deepEqual(report.packages.find((item) => item.name === menu.name), { name: menu.name, views: 1, previews: 1, enquiries: 1, guests: 50 });
    assert(report.dishes.some((item) => item.dish === "Sambar Rice" && item.selections === 1));
    assert(report.text.includes("not unique visitors"));
    assert(report.html.includes("Guest totals come from menu previews"));
    assert.deepEqual((await buildDailyReport(db, "2030-07-08")).totals, { pageViews: 0, packageViews: 0, previews: 0, enquiries: 0 });
  } finally { sql.close(); }
});

test("daily delivery sends HTML and text once, prevents concurrent repeats and cleans old activity", async () => {
  const { sql, env, emails } = setup();
  try {
    sql.prepare("INSERT INTO site_activity (id, day, kind, path, created_at) VALUES (?, '2020-01-01', 'page_view', '/', ?)").run(crypto.randomUUID(), Date.now() - 91 * 86400000);
    const time = Date.parse("2030-07-10T16:00:00Z");
    const results = await Promise.all([sendDailyReport(time, env), sendDailyReport(time, env)]);
    assert(results.some((item) => item.status === "sent"));
    assert.equal(emails.length, 1);
    assert.equal(emails[0].to, "srivaripleasanton@gmail.com");
    assert.equal(emails[0].from, "reports@srivaricatering.com");
    assert(emails[0].subject.includes("2030-07-09"));
    assert(emails[0].html.includes("No package activity recorded"));
    assert(emails[0].text.includes("Page views: 0"));
    assert.equal((await sendDailyReport(time, env)).status, "already-claimed");
    assert.equal((await sendDailyReport(Date.parse("2030-07-10T17:00:00Z"), env)).status, "skipped");
    assert.equal((await sendDailyReport(time, { ...env, REPORTS_ENABLED: "false" })).status, "skipped");
    assert.equal(sql.prepare("SELECT state FROM daily_report_delivery").get()?.state, "sent");
    assert.equal(sql.prepare("SELECT COUNT(*) AS total FROM site_activity").get()?.total, 0);
  } finally { sql.close(); }
});

test("failed emails remain retryable and are never marked sent", async () => {
  const { sql, env, emails } = setup();
  try {
    const time = Date.parse("2030-01-10T17:00:00Z");
    await assert.rejects(sendDailyReport(time, { ...env, DAILY_REPORT_EMAIL: { async send() { throw new Error("Email not enabled"); } } }), /Email not enabled/);
    assert.equal(sql.prepare("SELECT state FROM daily_report_delivery").get()?.state, "failed");
    assert.equal((await sendDailyReport(time, env)).status, "sent");
    assert.equal(emails.length, 1);
  } finally { sql.close(); }
});
