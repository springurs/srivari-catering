import assert from "node:assert/strict";
import test from "node:test";
import { diwaliMenus } from "../app/data/diwali-menu";
import { menus, validMenuChoices, sanitizeMenuChoices, packagePricing, buildPackageMenu } from "../app/data/catering-menu";
import { keywordPackages } from "../app/data/menu-search";
import { encodeCateringPlan, decodeCateringPlan, normalizeGuestCount } from "../app/lib/catering-plan-cookie";

test("Diwali replaces the seasonal packages with the poster's prices, minimums and service duration", () => {
  assert.deepEqual(diwaliMenus.map((menu) => [menu.name, menu.pricePerPerson, menu.minimumGuests]), [
    ["Classic Feast", 17.99, 25], ["Signature Celebration", 19.99, 25], ["Live Dosa Celebration", 21.99, 35],
  ]);
  assert.equal(diwaliMenus[2].serviceDuration, "2-hour service");
  assert.equal(diwaliMenus[2].isLiveDosa, true);
  assert.equal(normalizeGuestCount("", diwaliMenus[2]), "35");
  assert.equal(normalizeGuestCount("30", diwaliMenus[2]), "35");
  assert.equal(menus.some((menu) => /golu/i.test(menu.name)), false);
  assert.equal(menus.find((menu) => menu.name === "Live Dosa Catering")?.minimumGuests, 30);
  assert.equal(packagePricing(diwaliMenus[0]), "$17.99 per person");
  assert(menus.filter((menu) => menu.theme !== "diwali").every((menu) => packagePricing(menu) === "Price on enquiry"));
});

test("Signature starters require two distinct dishes with at most one paneer starter", () => {
  const group = diwaliMenus[1].selections![0];
  assert(validMenuChoices(group, ["Paneer Ghee Roast", "Kobbari Kanthari Mushroom"], true));
  assert(validMenuChoices(group, ["Gongura Soya Chukka", "Pallipalayam Baby Corn"], true));
  assert(!validMenuChoices(group, ["Paneer Ghee Roast", "Peshwari Paneer Tikka"], true));
  assert(!validMenuChoices(group, ["Kobbari Kanthari Mushroom", "Kobbari Kanthari Mushroom"], true));
  assert(!validMenuChoices(group, ["Paneer Ghee Roast"], true));
  assert.deepEqual(sanitizeMenuChoices(group, ["Paneer Ghee Roast", "Peshwari Paneer Tikka", "Gongura Soya Chukka"]), ["Paneer Ghee Roast", "Gongura Soya Chukka"]);
});

test("Diwali search finds all three packages and no removed seasonal package", () => {
  assert.deepEqual(keywordPackages("Diwali"), diwaliMenus.map((menu) => menu.name));
  assert.deepEqual(keywordPackages("Deepavali"), diwaliMenus.map((menu) => menu.name));
  assert.deepEqual(keywordPackages("Golu"), []);
  assert(keywordPackages("Peshwari Paneer Tikka").includes("Signature Celebration"));
});

test("selected menus resolve into full packages and preserve fixed inclusions", () => {
  for (const menu of diwaliMenus) {
    const choices = Object.fromEntries(menu.selections!.map((group) => [group.name, group.options.slice(0, group.count)]));
    const resolved = buildPackageMenu(menu, choices);
    const allDishes = resolved.flatMap((course) => course.dishes);
    assert(!allDishes.some((dish) => dish.startsWith("Choose ")));
    for (const selected of Object.values(choices).flat()) assert(allDishes.includes(selected));
    const fixed = menu.name === "Classic Feast" ? ["Steamed rice", "Pickle"] : menu.name === "Signature Celebration" ? ["Steamed rice", "Salan"] : ["Sambar", "Chutneys", "Raita", "Salan", "2-hour service", "Chocolate Dosa"];
    for (const dish of fixed) assert(allDishes.includes(dish));
    const encoded = encodeCateringPlan({ menuName: menu.name, choices, guestCount: "75" })!;
    assert.deepEqual(decodeCateringPlan(encoded), { menuName: menu.name, choices, guestCount: "75" });
  }
});

test("tampered saved starters cannot restore two paneer selections", () => {
  const menu = diwaliMenus[1];
  const encoded = encodeCateringPlan({ menuName: menu.name, choices: {}, guestCount: "25" })!;
  const value = JSON.parse(decodeURIComponent(encoded));
  value.c[0] = [1, 3];
  const restored = decodeCateringPlan(encodeURIComponent(JSON.stringify(value)))!;
  assert.equal(restored.choices.Starters.length, 1);
  assert(!validMenuChoices(menu.selections![0], restored.choices.Starters, true));
  value.m = "Small Golu Package";
  assert.equal(decodeCateringPlan(encodeURIComponent(JSON.stringify(value))), null);
});
