import assert from "node:assert/strict";
import { test } from "node:test";
import worker, { handleSearch, type SearchEnv } from "../worker/index";
import { fetchRestaurantMenu, parseRestaurantMenu, readLimited } from "../worker/restaurant-menu";
import { isSearchReply, keywordPackages } from "../app/data/menu-search";

const menu = { "@type": "Restaurant", hasMenu: { "@type": "Menu", hasMenuSection: [
  { "@type": "MenuSection", name: "Dosa", hasMenuItem: [
    { "@type": "MenuItem", name: "Plain Dosa", description: "Classic crispy South Indian dosa.", offers: { price: "11.99", priceCurrency: "USD" } },
    { "@type": "MenuItem", name: "<b>Paneer Dosa</b>", description: "Filled with paneer.", offers: { price: "not a price", priceCurrency: "USD" } },
  ] },
] } };
const html = `<script type="application/ld+json">${JSON.stringify(menu)}</script><script>throw Error('never execute')</script>`;
const source = () => new Response(html, { headers: { "Content-Type": "text/html" } });
const request = (body: unknown = { query: "dosa party for 30" }, headers: Record<string, string> = {}) => new Request("https://catering.example/api/catering-search", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const env = (overrides: Partial<SearchEnv> = {}): SearchEnv => ({ ASSETS: { fetch: async () => new Response("assets") }, SEARCH_RATE_LIMITER: { limit: async () => ({ success: true }) }, ...overrides });


test("extracts only menu data, strips markup, deduplicates, preserves verified USD prices", () => {
  const dishes = parseRestaurantMenu(html + html);
  assert.equal(dishes.length, 2);
  assert.deepEqual(dishes[0], { id: "dosa:plain dosa", name: "Plain Dosa", category: "Dosa", description: "Classic crispy South Indian dosa.", price: 11.99 });
  assert.equal(dishes[1].name, "Paneer Dosa");
  assert.equal(dishes[1].price, null);
  assert.deepEqual(parseRestaurantMenu('<script type="application/ld+json">bad json</script>'), []);
});

test("bounded reads stop oversized content even without content-length", async () => {
  await assert.rejects(() => readLimited(new Response("123456"), 5), /too large/);
});

test("fresh cache avoids source requests; stale cache refreshes", async () => {
  let calls = 0, saved: Response | undefined;
  const cache = { match: async () => saved?.clone(), put: async (_key: RequestInfo | URL, response: Response) => { saved = response; } } as Pick<Cache, "match" | "put">;
  const network = (async () => { calls++; return source(); }) as typeof fetch;
  assert.equal((await fetchRestaurantMenu(network, cache)).status, "live");
  assert.equal((await fetchRestaurantMenu(network, cache)).status, "cached");
  assert.equal(calls, 1);
  saved = Response.json({ dishes: parseRestaurantMenu(html), checkedAt: "2000-01-01T00:00:00Z" });
  assert.equal((await fetchRestaurantMenu(network, cache)).status, "live");
  assert.equal(calls, 2);
});

test("default search retrieves matching packages and published restaurant dishes without credentials", async () => {
  const reply = await (await handleSearch(request(), env(), (async () => source()) as typeof fetch)).json();
  assert(isSearchReply(reply));
  assert.equal(reply.mode, "keyword");
  assert(reply.packageNames.includes("Live Dosa Catering"));
  assert.equal(reply.restaurantItems[0].price, 11.99);
  assert.equal(reply.restaurantStatus, "live");
  assert(!("answer" in reply));
  assert(!("note" in reply));
});

test("keyword search only requests the restaurant source, even with legacy credentials", async () => {
  const urls: string[] = [];
  const network = (async (url: RequestInfo | URL) => { urls.push(String(url)); return source(); }) as typeof fetch;
  const environment = { ...env(), OPENAI_API_KEY: "test-only", OPENAI_MODEL: "unused" };
  const reply = await (await handleSearch(request({ query: "paneer", mode: "keyword" }), environment, network)).json();
  assert.equal(reply.mode, "keyword");
  assert.equal(reply.restaurantItems[0].name, "Paneer Dosa");
  assert.deepEqual(urls, ["https://www.srivaripleasanton.com/"]);
});

test("removed AI mode is rejected before any external requests", async () => {
  let calls = 0;
  const network = (async () => { calls++; return source(); }) as typeof fetch;
  const response = await handleSearch(request({ query: "office lunch", mode: "ai" }), env(), network);
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});

test("restaurant source outage leaves catering matches usable", async () => {
  const network = (async () => { throw new Error("offline"); }) as typeof fetch;
  const reply = await (await handleSearch(request(), env(), network)).json();
  assert.equal(reply.restaurantStatus, "unavailable");
  assert.equal(reply.restaurantItems.length, 0);
  assert(reply.packageNames.includes("Live Dosa Catering"));
});

test("bad input, cross-origin, method and rate limits block upstream calls", async () => {
  const network = (async () => { throw new Error("upstream must not run"); }) as typeof fetch;
  for (const [req, config, expected] of [
    [new Request("https://catering.example/api/catering-search"), env(), 405],
    [request({}, { origin: "https://other.example" }), env(), 403],
    [request({ query: " " }), env(), 400],
    [request({ query: "x".repeat(1001) }), env(), 400],
    [request(), env({ SEARCH_RATE_LIMITER: { limit: async () => ({ success: false }) } }), 429],
  ] as [Request, SearchEnv, number][]) {
    const response = await handleSearch(req, config, network);
    assert.equal(response.status, expected);
    if (expected === 429) assert.equal(response.headers.get("Retry-After"), "60");
  }
});

test("non-API requests still serve the static site", async () => {
  assert.equal(await (await worker.fetch(new Request("https://catering.example/contact"), env())).text(), "assets");
  assert.equal((await worker.fetch(new Request("https://catering.example/api/missing"), env())).status, 404);
});

test("keyword searches ignore filler words and unrecognized responses fail validation", () => {
  assert(keywordPackages("please show corporate lunch for 40 people").includes("Srivari Power Lunch"));
  assert.deepEqual(keywordPackages("xyzunmatched"), []);
  assert(!isSearchReply({ mode: "keyword", restaurantItems: [{ name: "Bad dish" }] }));
  assert(!isSearchReply({ mode: "ai", packageNames: [], restaurantItems: [], restaurantStatus: "unavailable", checkedAt: null }));
});


test("restaurant fetch uses edge-compatible manual redirects and refuses redirect targets", async () => {
  const redirect = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(init?.redirect, "manual");
    return new Response(null, { status: 302, headers: { Location: "https://other.example/private" } });
  }) as typeof fetch;
  assert.equal((await fetchRestaurantMenu(redirect)).status, "unavailable");
});
