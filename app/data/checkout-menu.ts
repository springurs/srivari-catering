import { signatureTrays } from "./signature-trays";
import { aLaCarteCategories } from "./a-la-carte-menu";

export const traySizes = [
  { key: "quarter", label: "Quarter tray" }, { key: "half", label: "Half tray" },
  { key: "threeQuarter", label: "¾ tray" }, { key: "full", label: "Full tray" },
] as const;
export type TraySize = typeof traySizes[number]["key"];
export const traySizeFractions: Record<TraySize, string> = { quarter: "1/4", half: "1/2", threeQuarter: "3/4", full: "1 full" };
export type OrderSize = TraySize | "pack" | "piece";
export type CartOption = { key: OrderSize; label: string; unitCents: number };
export type CartItem = { trayId: string; size: OrderSize; quantity: number };
type CatalogItem = { id: string; name: string; options: CartOption[] };
export const aLaCarteCartId = (id: string) => `a-la-carte-${id}`;
const priced = (value: number | null | undefined): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;
const catalog = new Map<string, CatalogItem>([
  ...signatureTrays.map(tray => ({ id: tray.id, name: tray.name, options: traySizes.flatMap(size => priced(tray.prices[size.key]) ? [{ ...size, unitCents: Math.round(tray.prices[size.key]! * 100) }] : []) })),
  ...aLaCarteCategories.flatMap(category => category.items.map(item => ({
    id: aLaCarteCartId(item.id), name: item.name,
    options: item.orderUnit
      ? item.pack && priced(item.pack.price) ? [{ key: "pack" as const, label: item.orderUnit === "volume" ? `${item.pack.quantity} ${item.pack.unit}` : `Pack of ${item.pack.quantity} ${item.pack.unit}`, unitCents: Math.round(item.pack.price * 100) }]
        : priced(item.perPiecePrice) ? [{ key: "piece" as const, label: "Per piece", unitCents: Math.round(item.perPiecePrice * 100) }] : []
      : traySizes.flatMap(size => priced(item.prices[size.key]) ? [{ ...size, unitCents: Math.round(item.prices[size.key]! * 100) }] : []),
  }))),
].map(item => [item.id, item]));
export function getCartOptions(trayId: string): CartOption[] { return catalog.get(trayId)?.options ?? []; }
export function validateCart(input: unknown): CartItem[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > 60) return null;
  const seen = new Set<string>();
  const items: CartItem[] = [];
  for (const row of input) {
    if (!row || typeof row !== "object" || typeof row.trayId !== "string"
      || !getCartOptions(row.trayId).some(s => s.key === row.size) || !Number.isInteger(row.quantity) || row.quantity < 1 || row.quantity > 99
      || seen.has(`${row.trayId}:${row.size}`)) return null;
    seen.add(`${row.trayId}:${row.size}`);
    items.push({ trayId: row.trayId, size: row.size, quantity: row.quantity });
  }
  return items;
}
export function cartLines(items: CartItem[]) {
  return items.map(item => {
    const product = catalog.get(item.trayId)!;
    const option = product.options.find(size => size.key === item.size)!;
    return { ...item, name: `${product.name} — ${option.label}`, unitCents: option.unitCents };
  });
}
export const formatMoney = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
