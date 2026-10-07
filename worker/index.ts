import { keywordDishes, keywordPackages, type SearchReply } from "../app/data/menu-search";
import { fetchRestaurantMenu, readLimited } from "./restaurant-menu";

export type SearchEnv = {
  ASSETS: { fetch: typeof fetch };
  SEARCH_RATE_LIMITER: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
};
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
export async function handleSearch(request: Request, env: SearchEnv, fetcher: typeof fetch = fetch, cache?: Pick<Cache, "match" | "put">) {
  if (request.method !== "POST") return json({ error: "Use POST for menu search." }, 405, { Allow: "POST" });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Search must be submitted from this website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ error: "Submit a JSON search request." }, 415);
  let body: { query?: unknown; mode?: unknown };
  try { body = JSON.parse(await readLimited(request, 8192)); } catch { return json({ error: "Search request is invalid or too large." }, 400); }
  if (!body || typeof body.query !== "string" || !body.query.trim() || body.query.trim().length > 1000 || ![undefined, "keyword"].includes(body.mode as string | undefined)) {
    return json({ error: "Enter a menu question of up to 1,000 characters." }, 400);
  }
  if (!env.SEARCH_RATE_LIMITER) return json({ error: "Search is temporarily unavailable. Please browse the catering packages." }, 503);
  let allowed = false;
  try { allowed = (await env.SEARCH_RATE_LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") || "local-preview" })).success; } catch { /* Fail closed before external requests. */ }
  if (!allowed) return json({ error: "Too many searches. Please try again in a minute." }, 429, { "Retry-After": "60" });
  const query = body.query.trim();
  const source = await fetchRestaurantMenu(fetcher, cache);
  const result: SearchReply = { mode: "keyword", packageNames: keywordPackages(query), restaurantItems: keywordDishes(query, source.dishes), restaurantStatus: source.status, checkedAt: source.checkedAt };
  return json(result);
}

const worker = {
  async fetch(request: Request, env: SearchEnv) {
    if (new URL(request.url).pathname === "/api/catering-search") {
      const cache = (globalThis.caches as CacheStorage & { default?: Cache } | undefined)?.default;
      return handleSearch(request, env, fetch, cache);
    }
    if (new URL(request.url).pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(request);
  },
};

export default worker;
