// Tray menu supplied by the owner on October 27, 2026.
// Restaurant single-portion prices and unconfirmed piece-pack quotes are not tray prices.
// The quarter-tray rate sets the scale: $30 / $55 / $85 / $110, rounded to the nearest $5.
// Supplied half/full rates remain in source rows for reference only; no percentage markup applies.
export type TrayPrices = { quarter: number | null; half: number | null; threeQuarter: number | null; full: number | null };
export type MenuPack = { quantity: number; price: number; unit: "pieces" | "whole naan" | "gallon" | "fl oz" };
export type ALaCarteItem = {
  id: string;
  name: string;
  prices: TrayPrices;
  note?: string;
  orderUnit?: "piece" | "volume";
  pack?: MenuPack;
  perPiecePrice?: number;
};

export type ALaCarteCategory = { id: string; name: string; onRequest: boolean; items: ALaCarteItem[]; note?: string; sourceUrl?: string };
type UnitPricing = { pack?: MenuPack; perPiece?: number };
type TrayRow = [name: string, quarter: number | null, half: number | null, full: number | null, note?: string, orderUnit?: "piece" | "volume", pricing?: UnitPricing];

export function calculateTrayPrices(quarter: number | null): TrayPrices {
  if (quarter === null) return { quarter: null, half: null, threeQuarter: null, full: null };
  // Integer cents preserve exact halfway cases; round $2.50 ties upward to the next $5.
  const baseCents = Math.round(quarter * 100);
  const scale = (reference: number) => Math.round(baseCents * reference / (3000 * 5)) * 5;
  return {
    quarter,
    half: scale(55),
    threeQuarter: scale(85),
    full: scale(110),
  };
}

export function formatTrayPrice(price: number | null): string {
  return price === null ? "Enquire" : new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2,
  }).format(price);
}

function category(id: string, name: string, rows: TrayRow[], options: { onRequest?: boolean; note?: string; sourceUrl?: string } = {}): ALaCarteCategory {
  return { ...options, id, name, onRequest: options.onRequest ?? false, items: rows.map(([name, quarter, , , note, orderUnit, pricing], index) => ({
    id: `${id}-${index + 1}`, name, prices: calculateTrayPrices(orderUnit ? null : quarter), ...(note ? { note } : {}), ...(orderUnit ? { orderUnit } : {}), ...(pricing?.pack ? { pack: pricing.pack } : {}), ...(pricing?.perPiece !== undefined ? { perPiecePrice: pricing.perPiece } : {}),
  })) };
}

export const aLaCarteCategories: ALaCarteCategory[] = [
  category("appetizers", "Appetizers", [
    ["Chilli Mushroom", 45, 80, 150],
    ["Chilli Gobi", 40, 75, 140],
    ["Chilli Soya", 35, 65, 120],
    ["Chilli Baby Corn", 40, 75, 140],
    ["Chilli Paneer", 45, 85, 160],
    ["Curry Leaf Soya Fry", 35, 65, 120],
    ["Curry Leaf Babycorn Fry", 40, 75, 140],
    ["Curry Leaf Mushroom Fry", 45, 80, 150],
    ["Curry Leaf Paneer Fry", 45, 85, 160],
    ["Curry Leaf Gobi Fry", 40, 75, 140],
    ["Green Chilli Mushroom Fry", 45, 80, 150],
    ["Green Chilli Soya Fry", 35, 65, 120],
    ["Green Chilli Paneer Fry", 45, 85, 160],
    ["Veg Manchurian Balls", 40, 75, 140, "Please confirm your preferred preparation when ordering."],
    ["Ghee Karam Punugulu", 35, 60, 110],
    ["Punugulu", 30, 55, 100],
    ["Green Chilli Fry", 40, 75, 140, "Please ask us about the available vegetable preparation."],
    ["Hara Bhara Kabab", 40, 75, 140],
    ["Manchurian Balls", 40, 75, 140, "Please confirm your preferred preparation when ordering."],
    ["Mushroom 65", 45, 80, 150],
    ["Soya 65", 35, 65, 120],
    ["Gobi 65", 40, 75, 140],
    ["Paneer 65", 45, 85, 160],
    ["Babycorn 65", 40, 75, 140],
    ["Veg Cutlet", 40, 75, 140],
    ["Veg Lollipop", 40, 75, 140],
    ["Gobi Majestic", 40, 75, 140],
    ["Paneer Majestic", 45, 85, 160],
    ["Soya Majestic", 35, 65, 120],
    ["Mushroom Majestic", 45, 80, 150],
    ["Babycorn Majestic", 40, 75, 140],
    ["Soya Manchurian", 35, 65, 120],
    ["Paneer Manchurian", 45, 85, 160],
    ["Gobi Manchurian", 40, 75, 140],
    ["Mushroom Spicy Dynamite", 45, 80, 150],
    ["Gobi Spicy Dynamite", 40, 75, 140],
    ["Soya Spicy Dynamite", 35, 65, 120],
    ["Paneer Spicy Dynamite", 45, 85, 160],
    ["Babycorn Spicy Dynamite", 40, 75, 140],
    ["Butter Garlic Babycorn", 40, 75, 140],
    ["Butter Garlic Mushroom", 45, 80, 150],
    ["Butter Garlic Soya", 35, 65, 120],
    ["Butter Garlic Paneer", 45, 85, 160],
    ["Butter Garlic Gobi", 40, 75, 140],
    ["Green Chilli Gobi Fry", 40, 75, 140],
    ["Mushroom Manchurian", 45, 80, 150],
    ["Tofu 65", 40, 75, 140],
    ["Curry Leaf Tofu Fry", 40, 75, 140],
    ["Green Chili Tofu Fry", 40, 75, 140],
    ["Tofu Manchurian", 40, 75, 140],
    ["Chili Tofu", 40, 75, 140],
    ["Green Chilli Babycorn Fry", 40, 75, 140],
    ["Babycorn Manchurian", 40, 75, 140],
    ["Veg Manchurian", 40, 75, 140, "Please confirm your preferred preparation and tray price when ordering."],
    ["Khaman Dhokla", 30, 55, 100, "Please confirm availability when enquiring."],
    ["Guntur Gobi / Gunpowder Gobi Roast", 40, 75, 140, "Please confirm availability when enquiring."],
    ["Babycorn Pallipalayam", 40, 75, 140, "Please confirm availability when enquiring."],
  ]),
  category("snacks", "Snacks", [
    ["Cut Mirchi Bajji", 30, 55, 100],
    ["Mirchi Bajji", 30, 55, 100],
    ["Mix Veg Pakora", 30, 55, 100],
    ["Onion Pakora", 30, 55, 100],
    ["Onion Rings Bajji", 30, 55, 100],
    ["Potato Bajji", 30, 55, 100],
    ["Eggplant Bajji", 30, 55, 100],
    ["Veg Spring Roll", 35, 65, 120],
    ["Movie Theatre Onion Samosa", null, null, null, "Piece count and catering price on enquiry.", "piece"],
    ["Punjabi Samosa", null, null, null, "Piece count and catering price on enquiry.", "piece"],
    ["Keema Samosa", null, null, null, "Please confirm vegetarian filling and piece count when enquiring.", "piece"],
    ["Samosa", null, null, null, "Please confirm piece count when enquiring.", "piece"],
    ["Mini Onion Samosa", null, null, null, "Please confirm piece count when enquiring.", "piece"],
    ["Medhu Vada / Masala Vada", null, null, null, "Please confirm your choice and piece count when enquiring.", "piece"],
    ["Thayir Vada", null, null, null, "Please confirm piece count when enquiring.", "piece"],
  ]),
  category("tandoori", "Tandoori", [
    ["Achari Paneer Tikka", 55, 95, 180],
    ["Badami Paneer Tikka", 55, 95, 180],
    ["Chilli Pineapple Skewers", 45, 80, 150],
    ["Classic Paneer Tikka", 55, 95, 180],
    ["Haryali Paneer Kebab", 55, 95, 180],
    ["Malai Paneer Kebab", 55, 95, 180],
    ["Paneer Sizzler", 55, 95, 180, "Served by the tray; sizzling plates and on-site service are not included."],
    ["Peshawari Paneer Tikka", 55, 95, 180],
    ["Sweet Corn Sizzler", 45, 80, 150, "Served by the tray; sizzling plates and on-site service are not included."],
    ["Veg Sizzler", 45, 80, 150, "Served by the tray; sizzling plates and on-site service are not included."],
  ]),
  category("house-specials", "House Specials", [
    ["Mushroom Chukka", 45, 80, 150],
    ["Soya Chukka", 35, 65, 120],
    ["Gobi Ghee Roast", 40, 75, 140],
    ["Paneer Ghee Roast", 50, 90, 170],
    ["Andhra Pepper Mushroom", 45, 80, 150],
    ["Gongura Paneer Tikka", 55, 95, 180],
  ]),
  category("idli-specials", "Idli Specials", [
    ["Ghee Podi Idli", 35, 65, 120, "Please confirm tray portion and piece count when ordering."],
    ["Ghee Podi Karam Fried Idli", 35, 65, 120],
    ["Nalla Karam Fried Idli", 35, 65, 120],
    ["Ghee Karuvepakku Karam Fried Idli", 35, 65, 120],
    ["Fried Idli", 35, 65, 120],
  ]),
  category("curries", "Curries", [
    ["Chana Masala", 30, 55, 100],
    ["Gobi Pallipalayam", 40, 75, 140],
    ["Gutti Vankaya Curry", 40, 75, 140],
    ["Kadai Paneer", 40, 70, 130],
    ["Kaju Mushroom", 45, 85, 160],
    ["Kaju Paneer", 50, 90, 170],
    ["Mixed Veg Korma", 35, 65, 120],
    ["Mutter Paneer", 40, 70, 130],
    ["Palak Paneer", 40, 70, 130],
    ["Paneer Butter Masala", 40, 70, 130],
    ["Paneer Do Pyaza", 45, 80, 150],
    ["Paneer Pallipalayam", 45, 80, 150],
    ["Paneer Tikka Masala", 40, 75, 140],
    ["Pundu Kozhumbu", 30, 55, 100],
    ["Shahi Paneer", 45, 80, 150],
    ["Veg Chettinad", 35, 65, 120],
    ["Veg Jalfrezi", 35, 65, 120],
    ["Veg Kadai", 35, 65, 120],
    ["Veg Malai Kofta", 45, 80, 150],
    ["Malai Paneer", 45, 80, 150, "Please confirm availability when enquiring."],
    ["Mix Veg Kurma", 35, 65, 120, "Please confirm availability when enquiring."],
    ["Bhindi Masala / Bhindi Peanut Fry", 35, 65, 120, "Please confirm availability when enquiring."],
    ["Aloo Gobi", 30, 55, 100, "Please confirm availability when enquiring."],
    ["Dal Makhani", 30, 55, 100, "Please confirm availability when enquiring."],
    ["Rajma Masala / Punjabi Kadhi Pakora", 35, 60, 110, "Please confirm availability when enquiring."],
    ["Kadamba Sambar / Wedding Sambar", 25, 45, 80, "Please confirm availability when enquiring."],
    ["Tomato Rasam / Pineapple Rasam", 20, 35, 65, "Please confirm availability when enquiring."],
    ["Mor Kuzhambu / Majjiga Pulusu", 30, 55, 100, "Please confirm availability when enquiring."],
    ["Paruppu Urundai Kuzhambu", 40, 75, 140, "Please confirm availability when enquiring."],
    ["Beans Paruppusili", 40, 75, 140, "Please confirm availability when enquiring."],
    ["Vazhakkai Fry / Potato Roast", 35, 60, 110, "Please confirm availability when enquiring."],
    ["Sorakkai Kootu / Chow Chow Kootu", 30, 55, 100, "Please confirm availability when enquiring."],
  ]),
  category("daal", "Daal", [
    ["Dal Tadka", 30, 55, 100],
    ["Mango Dal", 30, 55, 100],
    ["Spinach Dal", 30, 55, 100],
    ["Tomato Dal", 30, 55, 100],
  ]),
  category("rice", "Rice", [
    ["Steamed Rice", 20, null, null],
    ["Jeera Rice", 25, null, null],
    ["Lemon / Coconut / Puliyodarai Rice", 30, null, null],
    ["Gongura Rice / Peanut Podi Rice", 35, null, null],
    ["Curd Rice", 25, null, null],
    ["Bisi Bele Bath / Sambar Sadam", 35, null, null],
    ["Peas Pulao / Veg Pulao", 35, null, null],
  ], { note: "Indicative rice tray prices. Please confirm your final quote and availability when ordering." }),
  // Names checked against the restaurant's live menu.json on October 27, 2026.
  // These base tray rates are an owner-requested draft, not published restaurant prices.
  category("biryanis", "Biryanis", [
    ["Avakkai Paneer Biryani", 45, 85, 160],
    ["Gongura Paneer Biryani", 45, 85, 160],
    ["Hyderabadi Paneer Biryani", 45, 85, 160],
    ["Mushroom Fry Piece Biryani", 45, 80, 150],
    ["Paneer Burji Biryani", 45, 85, 160],
    ["Thalapakkati Style Jackfruit Biryani", 50, 90, 170],
    ["Ulavacharu Paneer Biryani", 50, 90, 170],
    ["Malai Paneer Biryani", 50, 90, 170],
    ["Srivari Special Biryani", 50, 90, 170],
    ["Veg Dum Biryani", 40, 75, 140],
    ["Veg Biryani", 40, 75, 140],
    // Additional choices supplied directly by the owner.
    ["Special Veg Dum Biryani", 40, null, null],
    ["Ambur Jackfruit Biryani", 50, null, null],
    ["Paneer Dum Biryani", 45, null, null],
  ], { note: "Indicative biryani tray prices. Please confirm your final quote and availability when ordering.", sourceUrl: "https://www.srivaripleasanton.com/#menu" }),
  category("pulaos", "Pulaos", [
    ["Haryali Paneer Pulao", 50, 90, 170],
    ["Jackfruit Pulao", 50, 90, 170],
    ["Kaju Paneer Pulao", 50, 90, 170],
    ["Mushroom Fry Piece Pulao", 45, 85, 160],
    ["Pachi Mirchi Paneer Pulao", 50, 90, 170],
    ["Paneer Pulao", 45, 85, 160],
    ["Masala Paneer Pulao", 50, 90, 170],
    ["Curry Leaf Paneer Pulao", 50, 90, 170],
    ["Malai Paneer Pulao", 50, 90, 170],
    // Additional choices supplied directly by the owner.
    ["Gutti Vankaya Pulao", 45, null, null],
  ], { note: "Indicative pulao tray prices. Please confirm your final quote and availability when ordering.", sourceUrl: "https://www.srivaripleasanton.com/#menu" }),
  category("indo-chinese", "Indo-Chinese", [
    ["Veg Hakka Noodles / Veg Fried Rice", 40, null, null],
    ["Chilli Garlic Noodles / Schezwan Rice", 45, null, null],
  ], { note: "Indicative tray prices. Please confirm your choice and final quote when ordering." }),
  category("south-indian-specials", "South Indian Specials", [
    ["Veg Kothu Parotta", 45, null, null],
    ["Paneer Kothu Parotta", 50, null, null],
    ["Kara Kuzhi Paniyaram", 35, null, null],
  ], { note: "Indicative tray prices. Please confirm your final quote and availability when ordering." }),
  category("breads", "Breads", [
    ["Pulka Roti", null, null, null, "25 pulka rotis per pack.", "piece", { pack: { quantity: 25, price: 25, unit: "pieces" } }],
    ["Butter Naan", null, null, null, "25 whole butter naans per pack.", "piece", { pack: { quantity: 25, price: 50, unit: "whole naan" } }],
    ["Garlic Naan", null, null, null, "25 whole garlic naans per pack.", "piece", { pack: { quantity: 25, price: 60, unit: "whole naan" } }],
  ], { note: "Bread prices are per pack of 25. Naan packs contain whole naan." }),
  category("desserts", "Desserts", [
    ["Rava Kesari / Semiya Payasam", 30, null, null],
    ["Paal Payasam / Paruppu Payasam", 35, null, null],
    ["Double Ka Meetha / Shahi Tukda", 40, null, null],
    ["Gajar Halwa", 40, null, null],
    ["Fruit Custard", 35, null, null],
    ["Elaneer Payasam", 45, null, null],
    ["Gulab Jamun", null, null, null, "Sold by the piece.", "piece", { perPiece: 1.5 }],
    ["Rasmalai", null, null, null, "Sold by the piece.", "piece", { perPiece: 1.5 }],
  ], { note: "Indicative dessert tray prices. Gulab Jamun and Rasmalai are $1.50 per piece." }),
  category("beverages", "Beverages", [
    ["Mango Lassi / Rose Milk", null, null, null, "Price per gallon of your chosen beverage.", "volume", { pack: { quantity: 1, price: 35, unit: "gallon" } }],
    ["Masala Chai / Filter Coffee", null, null, null, "Price per gallon of your chosen beverage.", "volume", { pack: { quantity: 1, price: 30, unit: "gallon" } }],
    ["Nanari Sarbath", null, null, null, "Price per gallon.", "volume", { pack: { quantity: 1, price: 35, unit: "gallon" } }],
    ["Chaas", null, null, null, "Price per gallon.", "volume", { pack: { quantity: 1, price: 30, unit: "gallon" } }],
  ], { note: "Mango lassi, rose milk, or Nanari Sarbath is $35 per gallon. Masala chai, filter coffee, or chaas is $30 per gallon." }),
  category("accompaniments", "Accompaniments", [
    ["Raita / Salan", null, null, null, "Please confirm your choice and required volume when enquiring.", "volume"],
    ["Chutneys", null, null, null, "32 fl oz per chutney variety.", "volume", { pack: { quantity: 32, price: 12, unit: "fl oz" } }],
  ], { note: "Each chutney variety is $12 for 32 fl oz. Raita and salan prices are available on enquiry." }),
];

export const aLaCarteItemCount = aLaCarteCategories.reduce((total, category) => total + category.items.length, 0);
