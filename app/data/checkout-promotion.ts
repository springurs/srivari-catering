import { thanksgivingOffer } from "./thanksgiving-offer";

export const onlineOffer = thanksgivingOffer;
export function promotionError(code: string, subtotal: number, now = Date.now()): string | null {
  if (!code) return null;
  if (code !== onlineOffer.code) return "This offer code is not recognised.";
  if (now >= onlineOffer.endsAt) return "THANKS10 has expired. It was available through November 26, Pacific time.";
  if (subtotal <= onlineOffer.minimumOrder * 100) return "THANKS10 applies to orders over $40 before tax.";
  return null;
}
export function discountedUnitCents(cents: number) {
  return Math.round(cents * (100 - onlineOffer.percent) / 100);
}
