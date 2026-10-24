import type { CateringMenu, MenuSelection } from "./catering-menu";

// Transcribed from the supplied “Choose Your Diwali Feast” poster.
const classicSelections: MenuSelection[] = [
  { name: "Starter", count: 1, options: ["Curry Leaf Podi Idly", "Gunpowder Gobi", "Masala Vadai", "Babycorn Pallipalayam"] },
  { name: "Paneer curry", count: 1, options: ["Paneer Butter Masala", "Palak Paneer", "Kadai Paneer"] },
  { name: "Vegetable curry", count: 1, options: ["Gutti Vankaya Curry", "Bhindi Peanut Fry", "Aloo Capsicum Masala"] },
  { name: "Dal or sambar", count: 1, options: ["Dal Tadka", "Mango Pappu", "Drumstick Sambar"] },
  { name: "Biryani", count: 1, options: ["Ambur Jackfruit Biryani", "Chennai Style Veg Dum Biryani"] },
  { name: "Bread", count: 1, options: ["Plain Pulka", "Chapati"] },
  { name: "Dessert", count: 1, options: ["Pineapple Kesari", "Paruppu Payasam", "Gulab Jamun"] },
  { name: "Raita", count: 1, options: ["Cucumber", "Boondi"] },
];

const signatureSelections: MenuSelection[] = [
  {
    name: "Starters", count: 2,
    options: ["Kobbari Kanthari Mushroom", "Paneer Ghee Roast", "Gongura Soya Chukka", "Peshwari Paneer Tikka", "Pallipalayam Baby Corn"],
    featuredOptions: ["Peshwari Paneer Tikka", "Pallipalayam Baby Corn"],
    limits: [{ label: "Maximum one paneer starter", count: 1, options: ["Paneer Ghee Roast", "Peshwari Paneer Tikka"] }],
  },
  { name: "Curry", count: 1, options: ["Babycorn Pallipalayam", "Gongura Paneer Masala", "Roasted Coconut & Pepper Paneer"], featuredOptions: ["Roasted Coconut & Pepper Paneer"] },
  { name: "Vegetable curry", count: 1, options: ["Gutti Vankaya Kura", "Raw Banana & Mochai Kara Kuzhambu", "Pumpkin, Cashew & Coconut Kurma"], featuredOptions: ["Pumpkin, Cashew & Coconut Kurma"] },
  { name: "Dal or sambar", count: 1, options: ["Gongura Pappu", "Kadamba Sambar", "Roasted Pumpkin & Shallot Sambar"], featuredOptions: ["Roasted Pumpkin & Shallot Sambar"] },
  { name: "Biryani", count: 1, options: ["Ambur Jackfruit Biryani", "Ulavacharu Paneer Biryani", "Srivari Special Veg Dum Biryani"] },
  { name: "Bread", count: 1, options: ["Plain Pulka", "Chapati"] },
  { name: "Dessert", count: 1, options: ["Paal Kozhukattai", "Bellam Atukula Payasam", "Poornam Boorelu"] },
  { name: "Raita", count: 1, options: ["Pomegranate-Cucumber", "Roasted Pineapple & Mint"], featuredOptions: ["Roasted Pineapple & Mint"] },
  { name: "Roti pachadi", count: 1, options: ["Dosakaya", "Tomato-Sesame", "Roasted Brinjal"] },
];

export const diwaliNotes = [
  "Select one menu for your entire event.",
  "Delivery is available at an additional cost. Tax and additional services are extra.",
  "★ New recipe selections are subject to kitchen confirmation; upgrades may cost extra.",
];

function feastSelections(groups: MenuSelection[]) {
  return groups.map((group) => ({ ...group, replaces: `Choose ${group.count} ${group.name.toLowerCase()}` }));
}

function feastCourses(groups: MenuSelection[]) {
  return groups.map((group) => ({ name: group.name, dishes: [`Choose ${group.count} ${group.name.toLowerCase()}`] }));
}

const optionsFor = (name: string) => [...new Set([...classicSelections, ...signatureSelections].filter((group) => group.name === name || name === "Starter" && group.name === "Starters").flatMap((group) => group.options))];
const liveSelections: MenuSelection[] = [
  { name: "Starter", count: 1, options: optionsFor("Starter") },
  { name: "Biryani", count: 1, options: optionsFor("Biryani") },
  { name: "Dessert", count: 1, options: optionsFor("Dessert") },
  { name: "Complimentary beverage", count: 1, options: ["Coffee", "Tea", "Chaas", "Rose milk", "Lassi"] },
];

export const diwaliMenus: CateringMenu[] = [
  {
    name: "Classic Feast",
    image: "/images/occasion-diwali.webp",
    theme: "diwali",
    pricePerPerson: 17.99,
    minimumGuests: 25,
    intro: "Your Diwali table, filled with familiar favourites. Choose one starter, paneer curry, vegetable curry, dal or sambar, biryani, bread, dessert, and raita for your entire event.",
    courses: [...feastCourses(classicSelections), { name: "Included", dishes: ["Steamed rice", "Pickle"] }],
    selections: feastSelections(classicSelections),
    notes: diwaliNotes.slice(0, 2),
  },
  {
    name: "Signature Celebration",
    image: "/images/occasion-diwali.webp",
    theme: "diwali",
    pricePerPerson: 19.99,
    minimumGuests: 25,
    intro: "A special Diwali spread with two starters and your choice of curry, vegetable curry, dal or sambar, biryani, bread, dessert, raita, and roti pachadi. Maximum one paneer starter; steamed rice and salan are included.",
    courses: [...feastCourses(signatureSelections), { name: "Included", dishes: ["Steamed rice", "Salan"] }],
    selections: feastSelections(signatureSelections),
    notes: diwaliNotes,
  },
  {
    name: "Live Dosa Celebration",
    image: "/images/occasion-live-catering.webp",
    theme: "diwali",
    isLiveDosa: true,
    pricePerPerson: 21.99,
    minimumGuests: 35,
    serviceDuration: "2-hour service",
    intro: "Celebrate Diwali with unlimited dosas from our menu and a two-hour live service. Choose one starter, one biryani, one dessert, and one complimentary beverage. Sambar, chutneys, raita, and salan are included.",
    courses: [
      { name: "Live dosa station", dishes: ["Unlimited dosas from our menu", "2-hour service"] },
      { name: "Available dosas for your dosa party", dishes: ["Andhra Kara Dosa", "Green Chili Dosa", "Curry Leaf Dosa", "Paneer Dosa", "Plain Dosa", "Masala Dosa", "Ghee Dosa", "Ghee Podi Dosa", "Mysore Dosa", "Cheese Dosa", "Chocolate Dosa"] },
      ...feastCourses(liveSelections),
      { name: "Included", dishes: ["Sambar", "Chutneys", "Raita", "Salan"] },
    ],
    selections: feastSelections(liveSelections),
    notes: [...diwaliNotes.slice(0, 2), "Starter, biryani and dessert choices are drawn from the Diwali feast menus. Confirm your live-station menu and beverage with our team."],
  },
];
