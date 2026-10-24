import { menus } from "../app/data/catering-menu";
import { decodeCateringPlan } from "../app/lib/catering-plan-cookie";
import { readLimited } from "./restaurant-menu";

type Statement = {
  bind: (...values: (string | number)[]) => Statement;
  run: () => Promise<{ meta: { changes: number } }>;
  all: <T>() => Promise<{ results: T[] }>;
};
export type ReportDatabase = { prepare: (sql: string) => Statement };
export type ReportEmail = { from: string; to: string; subject: string; html: string; text: string };
export type ReportEnv = {
  REPORT_DB?: ReportDatabase;
  ACTIVITY_RATE_LIMITER?: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
  DAILY_REPORT_EMAIL?: { send: (message: ReportEmail) => Promise<{ messageId: string }> };
  REPORT_EMAIL_FROM?: string;
  REPORT_EMAIL_TO?: string;
  REPORTS_ENABLED?: string;
};
type ActivityKind = "page_view" | "package_view" | "plan_preview" | "enquiry_sent";
type Activity = { id: string; kind: ActivityKind; path: string; packageName: string; guests: number; choices: Record<string, string[]> };
const timezone = "America/Los_Angeles";
const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" });

export function pacificDay(time: number) {
  const parts = dayFormatter.formatToParts(new Date(time));
  const part = (name: string) => parts.find((item) => item.type === name)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function previousPacificDay(time: number) {
  const date = new Date(`${pacificDay(time)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function isReportTime(time: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(time));
  return parts.some((item) => item.type === "hour" && item.value === "09") && parts.some((item) => item.type === "minute" && item.value === "00");
}

export function validateActivity(body: unknown): Activity | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  if (typeof input.id !== "string" || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(input.id)) return null;
  if (typeof input.kind !== "string" || typeof input.path !== "string" || !["page_view", "package_view", "plan_preview", "enquiry_sent"].includes(input.kind) || !["/", "/contact"].includes(input.path)) return null;
  const activity: Activity = { id: input.id, kind: input.kind as ActivityKind, path: input.path as string, packageName: "", guests: 0, choices: {} };
  if (activity.kind === "page_view") return activity;
  if (activity.kind === "enquiry_sent" && input.packageName === undefined) return activity;
  const menu = menus.find((item) => item.name === input.packageName);
  if (!menu) return null;
  activity.packageName = menu.name;
  if (activity.kind === "package_view") return activity;
  if (typeof input.guests !== "string" || !/^\d{1,6}$/.test(input.guests)) return null;
  const guests = Number(input.guests);
  if (guests < (menu.minimumGuests ?? 1) || guests > 100000) return null;
  activity.guests = guests;
  if (activity.kind === "enquiry_sent") return activity;
  const plan = typeof input.plan === "string" ? decodeCateringPlan(input.plan) : null;
  if (!plan || plan.menuName !== menu.name || Number(plan.guestCount) !== guests || menu.selections?.some((group) => plan.choices[group.name]?.length !== group.count)) return null;
  activity.choices = plan.choices;
  return activity;
}

const json = (value: unknown, status: number) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } });

export async function handleSiteActivity(request: Request, env: ReportEnv, now = Date.now()) {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Activity must originate from this website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ error: "Use JSON." }, 415);
  if (!env.REPORT_DB || !env.ACTIVITY_RATE_LIMITER || env.REPORTS_ENABLED !== "true") return json({ error: "Reporting is not enabled." }, 503);
  try {
    const allowed = await env.ACTIVITY_RATE_LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") || "local-preview" });
    if (!allowed.success) return json({ error: "Activity limit reached." }, 429);
    let activity: Activity | null;
    try { activity = validateActivity(JSON.parse(await readLimited(request, 8192))); } catch { activity = null; }
    if (!activity) return json({ error: "Invalid activity." }, 400);
    await env.REPORT_DB.prepare("INSERT OR IGNORE INTO site_activity (id, day, kind, path, package_name, guests, choices_json, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)")
      .bind(activity.id, pacificDay(now), activity.kind, activity.path, activity.packageName, activity.guests, JSON.stringify(activity.choices), now).run();
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  } catch {
    return json({ error: "Reporting is temporarily unavailable." }, 503);
  }
}

type ActivityTotal = { kind: ActivityKind; path: string; package_name: string; events: number; guests: number };
type DishTotal = { dish: string; selections: number };
type PackageTotal = { name: string; views: number; previews: number; enquiries: number; guests: number };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export async function buildDailyReport(db: ReportDatabase, day: string) {
  const [{ results: activity }, { results: dishes }] = await Promise.all([
    db.prepare("SELECT kind, path, package_name, COUNT(*) AS events, SUM(guests) AS guests FROM site_activity WHERE day = ?1 GROUP BY kind, path, package_name").bind(day).all<ActivityTotal>(),
    db.prepare("SELECT item.value AS dish, COUNT(*) AS selections FROM site_activity, json_each(site_activity.choices_json) AS choice_group, json_each(choice_group.value) AS item WHERE day = ?1 AND kind = 'plan_preview' GROUP BY item.value ORDER BY selections DESC, dish LIMIT 12").bind(day).all<DishTotal>(),
  ]);
  const count = (kind: ActivityKind) => activity.filter((row) => row.kind === kind).reduce((total, row) => total + row.events, 0);
  const totals = { pageViews: count("page_view"), packageViews: count("package_view"), previews: count("plan_preview"), enquiries: count("enquiry_sent") };
  const packageMap = new Map<string, PackageTotal>();
  for (const row of activity.filter((item) => item.kind !== "page_view")) {
    const name = row.package_name || "General contact enquiries";
    const item = packageMap.get(name) ?? { name, views: 0, previews: 0, enquiries: 0, guests: 0 };
    if (row.kind === "package_view") item.views += row.events;
    if (row.kind === "plan_preview") { item.previews += row.events; item.guests += row.guests; }
    if (row.kind === "enquiry_sent") item.enquiries += row.events;
    packageMap.set(name, item);
  }
  const packages = [...packageMap.values()].sort((a, b) => b.views + b.previews + b.enquiries - a.views - a.previews - a.enquiries || a.name.localeCompare(b.name));
  const pages = activity.filter((item) => item.kind === "page_view");
  const subject = `Srivari Catering daily report — ${day}`;
  const dateLabel = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
  const note = "Pacific calendar day. Counts represent browser-reported activity, not unique visitors or confirmed bookings. Repeat views and previews are included. Guest totals come from menu previews. Enquiry counts are reported after the form provider confirms success. Contact details and messages are not recorded in this report.";
  const text = [subject, "", `Page views: ${totals.pageViews}`, `Package views: ${totals.packageViews}`, `Menu previews: ${totals.previews}`, `Reported successful enquiries: ${totals.enquiries}`, "", "PACKAGE INTEREST", ...packages.map((item) => `${item.name}: ${item.views} views, ${item.previews} previews, ${item.enquiries} enquiries, ${item.guests} guests across previews`), ...(packages.length ? [] : ["No package activity recorded."]), "", "PAGES", ...pages.map((item) => `${item.path}: ${item.events} views`), "", "POPULAR MENU SELECTIONS", ...dishes.map((item) => `${item.dish}: ${item.selections}`), ...(dishes.length ? [] : ["No menu selections recorded."]), "", note].join("\n");
  const cell = (value: string | number) => `<td style="padding:12px;border-bottom:1px solid #e8dfce;text-align:left">${escapeHtml(String(value))}</td>`;
  const table = (headers: string[], rows: (string | number)[][]) => `<table style="border-collapse:collapse;width:100%;font-size:14px"><thead><tr>${headers.map((header) => `<th style="padding:12px;background:#f1e5cb;text-align:left">${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map(cell).join("")}</tr>`).join("")}</tbody></table>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head><body style="margin:0;padding:24px;background:#faf7ef;font-family:Arial,sans-serif;color:#34261b"><main style="max-width:800px;margin:auto;background:white;padding:28px;border:1px solid #e8dfce;border-radius:12px"><p style="color:#987126;letter-spacing:2px;font-size:12px">SRIVARI CATERING</p><h1 style="font-family:Georgia,serif">Your daily catering report</h1><p>${dateLabel} · Pacific time</p>${table(["Page views", "Package views", "Menu previews", "Enquiries"], [[totals.pageViews, totals.packageViews, totals.previews, totals.enquiries]])}<h2 style="font-family:Georgia,serif">Package interest</h2>${packages.length ? table(["Package", "Views", "Previews", "Enquiries", "Guests in previews"], packages.map((item) => [item.name, item.views, item.previews, item.enquiries, item.guests])) : "<p>No package activity recorded.</p>"}<h2 style="font-family:Georgia,serif">Pages</h2>${pages.length ? table(["Page", "Views"], pages.map((item) => [item.path, item.events])) : "<p>No page views recorded.</p>"}<h2 style="font-family:Georgia,serif">Popular menu selections</h2>${dishes.length ? table(["Dish", "Selections"], dishes.map((item) => [item.dish, item.selections])) : "<p>No menu selections recorded.</p>"}<p style="font-size:12px;color:#786b5c;line-height:1.6;margin-top:28px">${note}</p></main></body></html>`;
  return { subject, html, text, totals, packages, dishes };
}

export async function sendDailyReport(time: number, env: ReportEnv) {
  if (env.REPORTS_ENABLED !== "true" || !isReportTime(time)) return { status: "skipped" };
  if (!env.REPORT_DB || !env.DAILY_REPORT_EMAIL || !env.REPORT_EMAIL_FROM || !env.REPORT_EMAIL_TO) throw new Error("Daily report bindings and email addresses must be configured.");
  const day = previousPacificDay(time);
  const now = Date.now();
  const token = crypto.randomUUID();
  const claim = await env.REPORT_DB.prepare("INSERT INTO daily_report_delivery (day, state, claim_token, claimed_at) VALUES (?1, 'sending', ?2, ?3) ON CONFLICT(day) DO UPDATE SET state = 'sending', claim_token = excluded.claim_token, claimed_at = excluded.claimed_at WHERE state = 'failed' OR (state = 'sending' AND claimed_at < ?3 - 1800000)").bind(day, token, now).run();
  if (!claim.meta.changes) return { status: "already-claimed", day };
  try {
    const report = await buildDailyReport(env.REPORT_DB, day);
    const response = await env.DAILY_REPORT_EMAIL.send({ from: env.REPORT_EMAIL_FROM, to: env.REPORT_EMAIL_TO, subject: report.subject, html: report.html, text: report.text });
    await env.REPORT_DB.prepare("UPDATE daily_report_delivery SET state = 'sent', message_id = ?1, sent_at = ?2 WHERE day = ?3 AND claim_token = ?4").bind(response.messageId, Date.now(), day, token).run();
  } catch (error) {
    await env.REPORT_DB.prepare("UPDATE daily_report_delivery SET state = 'failed' WHERE day = ?1 AND claim_token = ?2").bind(day, token).run();
    throw error;
  }
  // Retention cleanup is independent of delivery success.
  const cutoff = now - 90 * 24 * 60 * 60 * 1000;
  try {
    await env.REPORT_DB.prepare("DELETE FROM site_activity WHERE created_at < ?1").bind(cutoff).run();
    await env.REPORT_DB.prepare("DELETE FROM daily_report_delivery WHERE claimed_at < ?1").bind(cutoff).run();
  } catch { console.error("Daily report sent; retention cleanup needs a retry."); }
  return { status: "sent", day };
}
