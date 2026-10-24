import { menus, sanitizeMenuChoices, type CateringMenu } from "../data/catering-menu";

export type MenuChoices = Record<string, string[]>;
export type SavedCateringPlan = { menuName: string; choices: MenuChoices; guestCount: string };

export const cateringPlanCookie = "srivari_catering_plan";
const lifetime = 30 * 24 * 60 * 60;

// Compact option indices keep even the premium wedding menus within cookie limits.
// Discard old indices when a package's available choices have changed.
function selectionSchema(menu: CateringMenu) {
  const text = JSON.stringify(menu.selections ?? []);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function normalizeGuestCount(value: unknown, menu: CateringMenu): string {
  if (typeof value !== "string" || !/^\d{1,6}$/.test(value) || Number(value) > 100000 || Number(value) < 1) {
    return menu.isLiveDosa ? String(menu.minimumGuests ?? 30) : "";
  }
  return String(Math.max(Number(value), menu.minimumGuests ?? 1));
}

export function encodeCateringPlan(plan: SavedCateringPlan): string | null {
  const menu = menus.find((item) => item.name === plan.menuName);
  if (!menu) return null;
  const choices = (menu.selections ?? []).map((group) => sanitizeMenuChoices(group, plan.choices[group.name] ?? [])
    .map((dish) => group.options.indexOf(dish)));
  const value = encodeURIComponent(JSON.stringify({ v: 1, m: menu.name, s: selectionSchema(menu), c: choices, g: normalizeGuestCount(plan.guestCount, menu) }));
  return value.length <= 3800 ? value : null;
}

export function decodeCateringPlan(value: string): SavedCateringPlan | null {
  if (value.length > 3800) return null;
  try {
    const data = JSON.parse(decodeURIComponent(value));
    if (!data || data.v !== 1 || typeof data.m !== "string") return null;
    const menu = menus.find((item) => item.name === data.m);
    if (!menu || data.s !== selectionSchema(menu) || !Array.isArray(data.c)) return null;
    const choices: MenuChoices = {};
    for (const [index, group] of (menu.selections ?? []).entries()) {
      const selected = data.c[index];
      if (!Array.isArray(selected)) continue;
      const indices = [...new Set(selected.filter((item): item is number =>
        Number.isInteger(item) && item >= 0 && item < group.options.length))].slice(0, group.count);
      choices[group.name] = sanitizeMenuChoices(group, indices.map((item) => group.options[item]));
    }
    return { menuName: menu.name, choices, guestCount: normalizeGuestCount(data.g, menu) };
  } catch {
    return null;
  }
}

export function readCateringPlan(): SavedCateringPlan | null {
  try {
    const record = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${cateringPlanCookie}=`));
    return record ? decodeCateringPlan(record.slice(cateringPlanCookie.length + 1)) : null;
  } catch {
    return null;
  }
}

export function saveCateringPlan(plan: SavedCateringPlan | null) {
  try {
    const value = plan ? encodeCateringPlan(plan) : null;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${cateringPlanCookie}=${value ?? ""}; Path=/; Max-Age=${value ? lifetime : 0}; SameSite=Lax${secure}`;
  } catch {
    // Planning continues normally when browser storage is disabled.
  }
}
