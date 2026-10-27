import assert from "node:assert/strict";
import test from "node:test";
import { aLaCarteCategories, aLaCarteItemCount, calculateTrayPrices, formatTrayPrice } from "../app/data/a-la-carte-menu";

test("tray rates follow the owner's $30/$55/$85/$110 scale rounded to the nearest $5", () => {
  for (const [quarter, half, threeQuarter, full] of [
    [20, 35, 55, 75],
    [25, 45, 70, 90],
    [30, 55, 85, 110],
    [35, 65, 100, 130],
    [40, 75, 115, 145],
    [45, 85, 130, 165],
    [50, 90, 140, 185],
    [55, 100, 155, 200],
  ]) assert.deepEqual(calculateTrayPrices(quarter), { quarter, half, threeQuarter, full });
});

test("missing prices remain on enquiry instead of becoming zero or inferred amounts", () => {
  assert.deepEqual(calculateTrayPrices(null), { quarter: null, half: null, threeQuarter: null, full: null });
  assert.deepEqual(calculateTrayPrices(0), { quarter: 0, half: 0, threeQuarter: 0, full: 0 });
  assert.equal(formatTrayPrice(null), "Enquire");
  assert.equal(formatTrayPrice(0), "$0");
});

test("USD prices display fractional dollars completely", () => {
  assert.equal(formatTrayPrice(165), "$165");
  assert.equal(formatTrayPrice(126.5), "$126.50");
  assert.equal(formatTrayPrice(85.25), "$85.25");
});

test("catalogue preserves distinct dishes and names the two sourced rice categories", () => {
  assert.equal(aLaCarteItemCount, 182);
  assert.equal(aLaCarteCategories.length, 16);
  const items = aLaCarteCategories.flatMap((category) => category.items);
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  for (const category of aLaCarteCategories) {
    assert.equal(new Set(category.items.map((item) => item.name.toLowerCase())).size, category.items.length);
  }
  for (const [id, count] of [["biryanis", 14], ["pulaos", 10]] as const) {
    const category = aLaCarteCategories.find((category) => category.id === id)!;
    assert.equal(category.items.length, count);
    assert.match(category.note!, /Indicative/);
    assert.equal(category.sourceUrl, "https://www.srivaripleasanton.com/#menu");
  }
  assert(aLaCarteCategories.find((category) => category.id === "curries")!.items.some((item) => item.name === "Malai Paneer"));
  assert(aLaCarteCategories.find((category) => category.id === "appetizers")!.items.some((item) => item.name === "Khaman Dhokla"));
});

test("piece and volume orders are quoted separately and never acquire tray prices", () => {
  const items = aLaCarteCategories.flatMap((category) => category.items);
  const countOrders = items.filter((item) => item.orderUnit === "piece");
  const volumeOrders = items.filter((item) => item.orderUnit === "volume");
  assert.equal(countOrders.length, 12);
  assert.equal(volumeOrders.length, 6);
  for (const item of [...countOrders, ...volumeOrders]) {
    assert.deepEqual(item.prices, { quarter: null, half: null, threeQuarter: null, full: null }, item.name);
  }
  assert.equal(items.filter((item) => item.name === "Gulab Jamun").length, 1);
  assert(aLaCarteCategories.find((category) => category.id === "snacks")!.items.filter((item) => /samosa/i.test(item.name)).length === 5);
});

test("bread packs use the owner's exact 25-count prices without tray scaling", () => {
  const breads = aLaCarteCategories.find((category) => category.id === "breads")!.items;
  for (const [name, price, unit] of [["Pulka Roti", 25, "pieces"], ["Butter Naan", 50, "whole naan"], ["Garlic Naan", 60, "whole naan"]] as const) {
    const item = breads.find((item) => item.name === name)!;
    assert.equal(item.orderUnit, "piece");
    assert.deepEqual(item.pack, { quantity: 25, price, unit });
    assert.deepEqual(item.prices, { quarter: null, half: null, threeQuarter: null, full: null });
  }
  assert.equal(breads.length, 3);
});

test("Gulab Jamun and Rasmalai are exactly $1.50 per piece without tray rounding or pack quantities", () => {
  const desserts = aLaCarteCategories.find((category) => category.id === "desserts")!.items;
  for (const name of ["Gulab Jamun", "Rasmalai"]) {
    const item = desserts.find((item) => item.name === name)!;
    assert.equal(item.orderUnit, "piece");
    assert.equal(item.perPiecePrice, 1.5);
    assert.equal(formatTrayPrice(item.perPiecePrice), "$1.50");
    assert.equal(item.pack, undefined);
    assert.deepEqual(item.prices, { quarter: null, half: null, threeQuarter: null, full: null });
  }
});

test("beverages and chutneys retain exact gallon/fl-oz prices and raita/salan remain on enquiry", () => {
  const items = aLaCarteCategories.flatMap((category) => category.items);
  for (const [name, quantity, price, unit] of [
    ["Mango Lassi / Rose Milk", 1, 35, "gallon"],
    ["Masala Chai / Filter Coffee", 1, 30, "gallon"],
    ["Nanari Sarbath", 1, 35, "gallon"],
    ["Chaas", 1, 30, "gallon"],
    ["Chutneys", 32, 12, "fl oz"],
  ] as const) {
    const item = items.find((item) => item.name === name)!;
    assert.equal(item.orderUnit, "volume");
    assert.deepEqual(item.pack, { quantity, price, unit });
    assert.deepEqual(item.prices, { quarter: null, half: null, threeQuarter: null, full: null });
  }
  const raitaSalan = items.find((item) => item.name === "Raita / Salan")!;
  assert.equal(raitaSalan.pack, undefined);
  assert.equal(raitaSalan.orderUnit, "volume");
});

test("every priced dish has increasing multiples of $5 close to the requested ratios", () => {
  for (const item of aLaCarteCategories.flatMap((category) => category.items)) {
    const { quarter, half, threeQuarter, full } = item.prices;
    if (quarter === null || half === null || threeQuarter === null || full === null) {
      assert.deepEqual([quarter, half, threeQuarter, full], [null, null, null, null], item.name);
      continue;
    }
    assert(quarter < half && half < threeQuarter && threeQuarter < full, item.name);
    for (const value of [quarter, half, threeQuarter, full]) assert.equal(value % 5, 0, item.name);
    for (const [value, reference] of [[half, 55], [threeQuarter, 85], [full, 110]]) {
      assert(Math.abs(value - quarter * reference / 30) <= 2.5, item.name);
    }
  }
});
