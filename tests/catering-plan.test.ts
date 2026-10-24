import assert from "node:assert/strict";
import test from "node:test";
import { menus } from "../app/data/catering-menu";
import { cateringPlanCookie, encodeCateringPlan, decodeCateringPlan, normalizeGuestCount, readCateringPlan, saveCateringPlan } from "../app/lib/catering-plan-cookie";

test("every package and its complete selections fit a cookie and round-trip", () => {
  for (const menu of menus) {
    const choices = Object.fromEntries((menu.selections ?? []).map((group) => [group.name, group.options.slice(0, group.count)]));
    const plan = { menuName: menu.name, choices, guestCount: "75" };
    const encoded = encodeCateringPlan(plan);
    assert(encoded);
    assert(encoded.length <= 3800);
    assert.deepEqual(decodeCateringPlan(encoded), plan);
  }
});

test("invalid, obsolete and oversized cookies cannot restore a package", () => {
  const encoded = encodeCateringPlan({ menuName: menus[0].name, choices: {}, guestCount: "25" })!;
  const data = JSON.parse(decodeURIComponent(encoded));
  for (const value of ["%broken", "null", "{}", "x".repeat(3801),
    encodeURIComponent(JSON.stringify({ ...data, v: 2 })),
    encodeURIComponent(JSON.stringify({ ...data, m: "Removed package" })),
    encodeURIComponent(JSON.stringify({ ...data, s: "outdated-options" })),
    encodeURIComponent(JSON.stringify({ ...data, c: null }))]) {
    assert.equal(decodeCateringPlan(value), null);
  }
});

test("restored selections obey menu choices, deduplication and group limits", () => {
  const menu = menus.find((item) => item.selections?.some((group) => group.count === 2))!;
  const data = JSON.parse(decodeURIComponent(encodeCateringPlan({ menuName: menu.name, choices: {}, guestCount: "50" })!));
  data.c = menu.selections!.map(() => [0, 0, "1", -1, 999, null, 1, 2, 3]);
  data.email = "should-not-be-restored@example.com";
  const restored = decodeCateringPlan(encodeURIComponent(JSON.stringify(data)))!;
  for (const group of menu.selections!) {
    assert.deepEqual(restored.choices[group.name], group.options.slice(0, group.count));
  }
  assert.deepEqual(Object.keys(restored).sort(), ["choices", "guestCount", "menuName"]);
});

test("guest counts retain package minimums and reject invalid values", () => {
  const wedding = menus.find((item) => item.minimumGuests === 25)!;
  const dosa = menus.find((item) => item.name === "Live Dosa Catering")!;
  assert.equal(normalizeGuestCount("12", wedding), "25");
  assert.equal(normalizeGuestCount("25", dosa), "30");
  assert.equal(normalizeGuestCount("", dosa), "30");
  assert.equal(normalizeGuestCount("00100", wedding), "100");
  for (const value of [null, "", "0", "-1", "1.5", "1e3", "100001"]) {
    assert.equal(normalizeGuestCount(value, wedding), "");
  }
});

test("the browser cookie lasts 30 days, is host-scoped, uses HTTPS security and can be cleared", () => {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const browserDocument = { cookie: "" };
  Object.defineProperty(globalThis, "document", { configurable: true, value: browserDocument });
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { protocol: "https:" } } });
  try {
    const plan = { menuName: menus[0].name, choices: {}, guestCount: "50" };
    saveCateringPlan(plan);
    assert(browserDocument.cookie.includes("Max-Age=2592000; SameSite=Lax; Secure"));
    assert(browserDocument.cookie.includes("Path=/"));
    assert(!browserDocument.cookie.includes("Domain="));
    assert.equal(readCateringPlan()?.menuName, plan.menuName);
    assert.equal(readCateringPlan()?.guestCount, "50");
    saveCateringPlan(null);
    assert(browserDocument.cookie.startsWith(`${cateringPlanCookie}=;`));
    assert(browserDocument.cookie.includes("Max-Age=0"));
    assert.equal(readCateringPlan(), null);
    Object.defineProperty(browserDocument, "cookie", { get() { throw new Error("Storage blocked"); }, set() { throw new Error("Storage blocked"); } });
    assert.equal(readCateringPlan(), null);
    assert.doesNotThrow(() => saveCateringPlan(plan));
  } finally {
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
