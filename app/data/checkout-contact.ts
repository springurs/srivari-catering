export type CheckoutContact = { name: string; email: string; phone: string };

export function validateCheckoutContact(input: unknown): CheckoutContact | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  if (typeof value.name !== "string" || (value.email !== undefined && typeof value.email !== "string") || (value.phone !== undefined && typeof value.phone !== "string")) return null;
  const name = value.name.trim();
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const phone = typeof value.phone === "string" ? value.phone.trim() : "";
  if (name.length < 2 || name.length > 120 || /[\u0000-\u001f\u007f]/.test(name) || (!email && !phone)) return null;
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return null;
  if (phone && (phone.length > 40 || !/^[+\d().\s-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15)) return null;
  return { name, email, phone };
}
