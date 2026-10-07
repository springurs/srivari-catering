import { isSearchReply, restaurantMenuUrl, type RestaurantDish } from "../app/data/menu-search";

const sourceUrl = new URL(restaurantMenuUrl).origin + "/";
const cacheUrl = new URL("/__restaurant-menu-v1", sourceUrl).href;
const maxBytes = 1_000_000;
export type MenuSource = { dishes: RestaurantDish[]; status: "live" | "cached" | "unavailable"; checkedAt: string | null };
type MenuCache = Pick<Cache, "match" | "put">;

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function list(value: unknown): unknown[] { return Array.isArray(value) ? value : value ? [value] : []; }
function clean(value: unknown, limit: number) { return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim().slice(0, limit) : ""; }

export function parseRestaurantMenu(html: string): RestaurantDish[] {
  const dishes = new Map<string, RestaurantDish>();
  function visit(value: unknown, category = "Restaurant menu", depth = 0) {
    if (depth > 12 || dishes.size >= 400) return;
    if (Array.isArray(value)) { value.forEach((item) => visit(item, category, depth + 1)); return; }
    const node = record(value);
    if (!node) return;
    const types = list(node["@type"]);
    if (types.includes("MenuItem")) {
      const name = clean(node.name, 160);
      if (!name) return;
      const offer = record(list(node.offers)[0]);
      const price = offer?.priceCurrency === "USD" && ["string", "number"].includes(typeof offer.price) && String(offer.price).trim() !== "" ? Number(offer.price) : NaN;
      const id = `${category}:${name}`.toLowerCase().slice(0, 300);
      dishes.set(id, { id, name, category, description: clean(node.description, 600), price: Number.isFinite(price) && price >= 0 && price < 10000 ? price : null });
      return;
    }
    if (types.includes("MenuSection")) category = clean(node.name, 160) || category;
    for (const key of ["@graph", "hasMenu", "hasMenuSection", "hasMenuItem"]) visit(node[key], category, depth + 1);
  }
  const scripts = html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi);
  for (const script of scripts) {
    try { visit(JSON.parse(script[1])); } catch { /* Ignore unrelated malformed structured data. */ }
  }
  return [...dishes.values()];
}

export async function readLimited(response: Response | Request, limit = maxBytes): Promise<string> {
  if (Number(response.headers.get("content-length")) > limit) throw new Error("Response too large");
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let length = 0, text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) throw new Error("Response too large");
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { await reader.cancel(); }
}

export async function fetchRestaurantMenu(fetcher: typeof fetch = fetch, cache?: MenuCache): Promise<MenuSource> {
  if (cache) {
    try {
      const cached = await cache.match(cacheUrl);
      if (cached) {
        const data = await cached.json() as { dishes: RestaurantDish[]; checkedAt: string };
        // Reuse client field validation in bounded batches for the larger cached catalogue.
        if (Array.isArray(data.dishes) && data.dishes.length > 0 && data.dishes.length <= 400 &&
          Date.now() - Date.parse(data.checkedAt) >= 0 && Date.now() - Date.parse(data.checkedAt) < 900_000 &&
          data.dishes.every((dish) => isSearchReply({ mode: "keyword", packageNames: [], restaurantItems: [dish], restaurantStatus: "cached", checkedAt: data.checkedAt }))) {
          return { ...data, status: "cached" };
        }
      }
    } catch { /* Fetch afresh if cache cannot be read. */ }
  }
  try {
    const response = await fetcher(sourceUrl, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(8000), redirect: "manual" });
    if (!response.ok) throw new Error("Menu source unavailable");
    const dishes = parseRestaurantMenu(await readLimited(response));
    if (!dishes.length) throw new Error("No published menu found");
    const checkedAt = new Date().toISOString();
    if (cache) {
      try { await cache.put(cacheUrl, Response.json({ dishes, checkedAt }, { headers: { "Cache-Control": "public, max-age=900" } })); } catch { /* Search still works without cache. */ }
    }
    return { dishes, checkedAt, status: "live" };
  } catch (error) {
    console.warn("Restaurant menu retrieval failed:", error instanceof Error ? error.message : "Unknown retrieval error");
    return { dishes: [], checkedAt: null, status: "unavailable" };
  }
}
