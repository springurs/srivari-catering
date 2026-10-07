import { dietaryAvailability, menus } from "./catering-menu";

export const restaurantMenuUrl = "https://www.srivaripleasanton.com/#menu";
export type RestaurantDish = { id: string; name: string; category: string; description: string; price: number | null };
export type SearchReply = {
  mode: "keyword";
  packageNames: string[];
  restaurantItems: RestaurantDish[];
  restaurantStatus: "live" | "cached" | "unavailable";
  checkedAt: string | null;
};

const categoryNames = ["combos vegetarian feast", "traditional Andhra thali", "wedding thali", "traditional North Indian thali", "festive Golu", "festive Golu", "festive Golu", "traditional Tamil thali", "combos tiffin breakfast", "combos tiffin breakfast", "wedding combos tiffin breakfast", "corporate office lunch", "corporate office sliders lunch", "corporate office meeting snacks", "live dosa party", "wedding Andhra banana leaf", "wedding Andhra North Indian buffet"];
const stopWords = new Set("a an and are at available can catering for have i in is me menu menus my of on please show some the to want with people guests person persons need we our us find recommend suggest looking options option restaurant".split(" "));

export function queryWords(query: string) {
  return query.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").split(/\s+/)
    .filter((word) => word && !stopWords.has(word) && !/^\d+$/.test(word))
    .map((word) => ({ thalis: "thali", dosas: "dosa", dishes: "dish", parties: "party" })[word as "thalis" | "dosas" | "dishes" | "parties"] ?? word);
}

function rank<T>(items: T[], query: string, getText: (item: T) => string, limit: number) {
  const words = queryWords(query);
  if (!words.length) return [];
  const scored = items.map((item, index) => ({ item, index, score: words.reduce((total, word) => total + (getText(item).toLowerCase().includes(word) ? 1 : 0), 0) }));
  const bestScore = Math.max(0, ...scored.map((entry) => entry.score));
  return scored.filter((entry) => entry.score > 0 && entry.score === bestScore)
    .sort((a, b) => a.index - b.index).slice(0, limit).map(({ item }) => item);
}

export function keywordPackages(query: string) {
  return rank(menus, query, (menu) => [menu.name, menu.intro, categoryNames[menus.indexOf(menu)], dietaryAvailability,
    ...menu.courses.flatMap((course) => [course.name, ...[course.dishes].flat()]),
    ...(menu.selections?.flatMap((group) => group.options) ?? []), menu.includedService?.style ?? "",
  ].join(" "), 6).map((menu) => menu.name);
}

export function keywordDishes(query: string, dishes: RestaurantDish[]) {
  return rank(dishes, query, (dish) => [dish.name, dish.category, dish.description].join(" "), 6);
}

// Validate the response before rendering. URLs always come from our own source constant.
export function isSearchReply(value: unknown): value is SearchReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as SearchReply;
  return reply.mode === "keyword" &&
    Array.isArray(reply.packageNames) && reply.packageNames.length <= 17 && reply.packageNames.every((name) => menus.some((menu) => menu.name === name)) &&
    Array.isArray(reply.restaurantItems) && reply.restaurantItems.length <= 6 && reply.restaurantItems.every((dish) =>
      dish && typeof dish.id === "string" && dish.id.length <= 300 && typeof dish.name === "string" && dish.name.length <= 160 &&
      typeof dish.category === "string" && dish.category.length <= 160 && typeof dish.description === "string" && dish.description.length <= 600 &&
      (dish.price === null || typeof dish.price === "number" && Number.isFinite(dish.price) && dish.price >= 0 && dish.price < 10000)) &&
    ["live", "cached", "unavailable"].includes(reply.restaurantStatus) &&
    (reply.checkedAt === null || typeof reply.checkedAt === "string" && reply.checkedAt.length <= 40 && Number.isFinite(Date.parse(reply.checkedAt)));
}
