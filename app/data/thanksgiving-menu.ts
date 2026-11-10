import type { CateringMenu } from "./catering-menu";

// Thanksgiving family menus and fixed package prices supplied by the owner.
export const thanksgivingMenus: CateringMenu[] = [
  {
    name: "Harvest Family Feast",
    theme: "thanksgiving",
    image: "/images/south-indian-feast.png",
    pricePerPackage: 119,
    serves: "5–6",
    intro: "Best for small families celebrating at home.",
    courses: [
      { name: "Family feast", dishes: [
        "Harvest Vegetable Pulao", "Paneer Butter Masala", "Pumpkin & Lentil Sambar",
        "Potato Pepper Fry", "Poori or Chapati", "Cucumber Raita", "Pumpkin Kesari", "Pickle & Fryums",
      ] },
    ],
    selections: [{ name: "Bread", count: 1, replaces: "Poori or Chapati", options: ["Poori", "Chapati"] }],
    notes: ["$119 is the price for one package serving 5–6 people."],
  },
  {
    name: "Signature Thanksgiving Celebration",
    theme: "thanksgiving",
    image: "/images/elegant-buffet.png",
    pricePerPackage: 229,
    serves: "10–12",
    badge: "Recommended bestseller",
    intro: "Recommended bestseller for family gatherings.",
    courses: [
      { name: "Thanksgiving celebration", dishes: [
        "Sweet Corn & Pumpkin Soup", "Golden Paneer Fingers", "Royal Cashew Vegetable Pulao",
        "Shahi Makhana Paneer", "Pumpkin & Pearl Onion Sambar", "Baby Corn Potato Pepper Roast",
        "Chapati, Rice & Raita", "Mango-Ginger Chutney", "Badam Kesari", "Pumpkin Cardamom Payasam",
      ] },
    ],
    notes: ["$229 is the price for one package serving 10–12 people."],
  },
  {
    name: "Royal Harvest Banquet",
    theme: "thanksgiving",
    image: "/images/occasion-festive.webp",
    pricePerPackage: 499,
    serves: "20–25",
    intro: "For large family celebrations and community events.",
    courses: [
      { name: "Harvest banquet", dishes: [
        "Spiced Pumpkin & Carrot Soup", "Gongura Paneer Tikka", "Crispy Vegetable Cutlets",
        "Southern Spice Vegetable Biryani", "Shahi Makhana Paneer", "Roasted Pumpkin Coconut Curry",
        "Andhra Gutti Vankaya", "Drumstick Sambar", "Mysore Rasam", "Potato & Baby Corn Pepper Fry",
        "Steam Rice, Chapati & Raita", "Pickle, Chutney & Fryums", "Cashew Rava Kesari", "Saffron Vermicelli Payasam",
      ] },
    ],
    notes: ["$499 is the price for one package serving 20–25 people."],
  },
];
