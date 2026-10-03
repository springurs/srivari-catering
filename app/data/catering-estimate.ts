import type { CateringMenu } from "./catering-menu";

export function formatCost(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function estimateFood(menu: CateringMenu, people: number) {
  if (menu.pricePerPackage !== undefined && menu.guestsPerPackage) {
    const packages = Math.ceil(people / menu.guestsPerPackage);
    const unitPrice = Math.round(menu.pricePerPackage * 100);
    return {
      amount: packages * unitPrice,
      calculation: `${packages} ${packages === 1 ? "package" : "packages"} × ${formatCost(unitPrice)} = ${formatCost(packages * unitPrice)}`,
      servings: `Up to ${menu.guestsPerPackage} people per package; ${packages} ${packages === 1 ? "package" : "packages"} for ${people} people.`,
    };
  }
  if (menu.pricePerPerson !== undefined) {
    const unitPrice = Math.round(menu.pricePerPerson * 100);
    return {
      amount: people * unitPrice,
      calculation: `${people} people × ${formatCost(unitPrice)} = ${formatCost(people * unitPrice)}`,
    };
  }
  return { amount: null, calculation: "Pricing upon enquiry" };
}

export function estimateStaff(count: number) {
  if (count === 0) return { amount: 0, calculation: "Not requested" };
  const fullRateCount = Math.min(count, 2);
  const additionalCount = Math.max(count - 2, 0);
  const amount = fullRateCount * 25000 + additionalCount * 20000;
  const rates = [`${fullRateCount} ${fullRateCount === 1 ? "staff member" : "staff members"} × ${formatCost(25000)}`];
  if (additionalCount) rates.push(`${additionalCount} additional ${additionalCount === 1 ? "staff member" : "staff members"} × ${formatCost(20000)}`);
  return { amount, calculation: `${rates.join(" + ")} = ${formatCost(amount)}` };
}
