import type { MenuChoices } from "./catering-plan-cookie";
import { encodeCateringPlan } from "./catering-plan-cookie";

export type SiteActivity =
  | { kind: "page_view" }
  | { kind: "package_view"; packageName: string }
  | { kind: "plan_preview"; packageName: string; guestCount: string; choices: MenuChoices }
  | { kind: "enquiry_sent"; packageName?: string; guestCount?: string };

export function reportSiteActivity(activity: SiteActivity) {
  try {
    const { kind } = activity;
    const packageName = "packageName" in activity ? activity.packageName : undefined;
    const guests = "guestCount" in activity ? activity.guestCount : undefined;
    const plan = kind === "plan_preview" ? encodeCateringPlan({ menuName: activity.packageName, choices: activity.choices, guestCount: activity.guestCount }) : undefined;
    // Send only known activity fields; contact details and descriptions stay out of reports.
    void fetch("/api/site-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: crypto.randomUUID(), kind, path: window.location.pathname, packageName, guests, plan }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Reporting must never interrupt browsing, planning or enquiry submission.
  }
}
