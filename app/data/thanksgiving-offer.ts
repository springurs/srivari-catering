export const thanksgivingOffer = {
  code: "THANKS10",
  percent: 10,
  minimumOrder: 40,
  // Offer remains available through November 26 in Pacific time.
  endsAt: Date.parse("2026-11-27T00:00:00-08:00"),
};

export const isThanksgivingOfferActive = (now = Date.now()) => now < thanksgivingOffer.endsAt;

export function thanksgivingOfferRequest(now = Date.now()) {
  return isThanksgivingOfferActive(now)
    ? `Offer code: ${thanksgivingOffer.code} — 10% off orders over $40. Ends November 26, 2026.`
    : null;
}
