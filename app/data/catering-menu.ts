export type MenuSelection = {
  name: string;
  count: number;
  options: string[];
};

export type CateringMenu = {
  name: string;
  image: string;
  intro: string;
  pricePerPerson?: number;
  pricePerPackage?: number;
  serves?: string;
  minimumGuests?: number;
  isCombo?: boolean;
  isTiffin?: boolean;
  courses: { name: string; dishes: string | string[] }[];
  selections?: MenuSelection[];
};

// Combo names, prices, inclusions, and choices transcribed from the supplied
// Srivari Vegetarian Catering Combos PDF (pages 1–5), with North Indian Thali
// from page 6 of the six-page edition.
// Golu menus, package prices, servings, and sweet choices come from the
// supplied Golu Season Packages attachment.
// Corporate menus are proposed vegetarian menus created at the user's request;
// pricing, availability, and serving arrangements are confirmed on enquiry.
export const menus: CateringMenu[] = [
  {
    name: "Srivari Signature Veg Feast",
    image: "/images/occasion-traditional.webp",
    intro: "Build your perfect menu with South Indian, Andhra, and North Indian favourites. Choose 2 starters, 2 curries, and 1 dessert, subject to availability.",
    pricePerPerson: 20,
    minimumGuests: 25,
    isCombo: true,
    courses: [{ name: "What’s included", dishes: [
      "2 vegetarian starters",
      "Steamed rice or jeera rice",
      "Butter naan, roti or chapati",
      "Vegetable dum biryani or pulao",
      "2 vegetarian curries",
      "Sambar or dal tadka",
      "Rasam, shorba or kadhi",
      "1 dessert",
      "Raita",
      "Salan",
      "Roti pachadi (vegetable pickle)",
    ] }],
    selections: [
      {
        name: "Vegetarian starters", count: 2,
        options: [
          "Punugulu", "Alasanda Guggillu", "Samosa", "Medhu Vada (Garelu)",
          "Masala Vada", "Vegetable Pakora", "Cut Mirchi", "Mysore Bonda",
          "Kara Kuzhi Paniyaram / Gunta Ponganalu", "Gobi Manchurian / Chilli Gobi",
          "Baby Corn Manchurian / Chilli Baby Corn", "Sundal - chickpea or peanut varieties",
          "Aloo Tikki", "Sabudana Vada",
        ],
      },
      {
        name: "Vegetarian curries", count: 2,
        options: [
          "Paneer Butter Masala", "Matar Paneer Masala", "Bhindi Fry with Peanuts",
          "Navratan Korma", "Saag Paneer", "Gutti Vankaya Curry", "Vegetable Paya / Stew",
          "Tamil-style Kootu", "Vada Curry", "Paneer / Mirchi Ka Salan", "Malai Kofta",
          "Dondakaya Fry", "Dal Tadka", "Jaipuri Bhindi", "Tomato / Palak / Gongura Pappu",
          "Baingan Ka Bharta", "Rajma Masala", "Chana Masala", "Vangi Bharit",
          "Methi Batata Bhaji", "Pithla", "Vegetable Kadai", "Mixed Vegetable Curry",
          "Bendakaya / Dosakaya Pulusu", "Tomato Munakkaya Kura",
        ],
      },
      {
        name: "Dessert", count: 1,
        options: [
          "Gulab Jamun", "Jamun Rabdi", "Rice Kheer", "Rasmalai", "Payasam",
          "Kesari", "Double Ka Meetha", "Fruit Custard", "Shahi Tukda", "Gajar Halwa",
        ],
      },
    ],
  },
  {
    name: "Andhra Inti Bhojanam",
    image: "/images/package-south-indian-thali.webp",
    intro: "A comforting Andhra-style feast inspired by traditional home cooking.",
    pricePerPerson: 22.99,
    isCombo: true,
    courses: [{ name: "What’s included", dishes: [
      "Garelu or Alasanda Guggillu", "Kandi Podi with Ghee", "Roti Pachadi",
      "Chapati with Kurma", "Steamed Rice", "Pappu Charu or Sambar", "Charu or Rasam",
      "Tomato, Mango or Dosakaya Pappu", "Bendakaya or Dondakaya Palli Vepudu",
      "Gutti Vankaya Kura", "Dosakaya Pulusu or Majjiga Pulusu", "Perugu (Curd)",
      "Avakaya Pickle", "Payasam", "Appadam",
    ] }],
  },
  {
    name: "Wedding Thali Combo",
    image: "/images/occasion-weddings.webp",
    intro: "A celebratory South Indian spread with traditional accompaniments and two desserts.",
    pricePerPerson: 24.99,
    isCombo: true,
    courses: [{ name: "What’s included", dishes: [
      "Masala Vada, Bajji or Cut Mirchi", "Sweet Pachadi", "Paruppu Podi with Ghee",
      "Roti or Parotta with Salan / Kurma", "Variety Rice or Biryani", "Steamed Rice",
      "Pappu Charu or Sambar", "Charu or Rasam", "Tomato, Mango or Dosakaya Pappu",
      "Vathal Kulambu, Mor Kuzhambu, Majjiga Pulusu or Pulusu",
      "Kara Poriyal or Bangaladumpa Vepudu", "Thengai Poriyal or Kobbari Kura",
      "Thogayal or Roti Pachadi", "Curd or Buttermilk", "Mango or Lemon Pickle",
      "Shahi Tukda", "Elaneer Payasam", "Appalam or Fryums",
    ] }],
  },
  {
    name: "Apna Ghar Ka Bhojan",
    image: "/images/occasion-traditional.webp",
    intro: "A generous North Indian menu featuring classic breads, curries, rice and festive sweets.",
    pricePerPerson: 23.99,
    isCombo: true,
    courses: [{ name: "What’s included", dishes: [
      "Punjabi Samosa, Onion Pakora or Hara Bhara Kebab",
      "Saunth-Imli Chutney", "Gur with Ghee or Rajasthani Churma",
      "Tandoori Roti or Naan with Paneer Curry", "Vegetable Pulao or Peas Pulao",
      "Steamed Basmati Rice", "Dal Tadka or Dal Makhani",
      "Punjabi Kadhi or Tomato Shorba", "Rajma Masala, Chana Masala or Dal Palak",
      "Kadhi Pakora or Sindhi Kadhi", "Jeera Aloo or Punjabi Aloo Gobi",
      "Matar Gobi, Beans Aloo Sabzi or Vegetable Jalfrezi",
      "Mint-Coriander Chutney", "Boondi Raita or Masala Chaas",
      "Mango or Lemon Pickle", "Gulab Jamun or Gajar Halwa",
      "Kesar Badam Kheer or Rice Kheer", "Roasted Papad or Masala Papad",
    ] }],
  },
  {
    name: "Small Golu Package",
    image: "/images/occasion-festive.webp",
    intro: "A traditional spread for Navaratri Golu gatherings, pooja celebrations, and evening guests.",
    pricePerPackage: 99,
    serves: "8–10 guests",
    courses: [{ name: "What’s included", dishes: [
      "Sweet Panakam",
      "Konda Kadalai Sundal / Senagalu Guggillu",
      "Milagu Vadai / Miriyala Garelu — 10 pieces",
      "Temple Puliyodarai / Andhra Pulihora — ¼ tray",
      "Thengai Thuvaiyal / Kobbari Pachadi",
      "Nei Appam / Bellam Appalu — 10 pieces",
    ] }],
  },
  {
    name: "Medium Golu Package",
    image: "/images/occasion-festive.webp",
    intro: "Traditional bites, two rice specialties, and your choice of sweet for a festive gathering.",
    pricePerPackage: 219,
    serves: "15–20 guests",
    courses: [
      { name: "Refreshment", dishes: ["Panakam or Neer Mor / Majjiga"] },
      { name: "Traditional bites", dishes: [
        "Konda Kadalai Sundal / Senagalu Guggillu",
        "Mamidikaya Senagapappu Sundal",
        "Milagu Vadai / Miriyala Garelu — 20 pieces",
        "Kuzhi Paniyaram / Gunta Ponganalu — 40 pieces",
      ] },
      { name: "Rice specialties", dishes: [
        "Temple Puliyodarai / Andhra Pulihora — ¼ tray",
        "Thengai Sadam / Kobbari Annam — ¼ tray",
      ] },
      { name: "Accompaniments", dishes: ["Coconut and ginger chutneys included"] },
    ],
    selections: [{ name: "Sweet", count: 1, options: [
      "Sakkarai Pongal / Bellam Pongali",
      "Poornam Boorelu — 20 pieces",
      "Nei Appam / Bellam Appalu — 20 pieces",
    ] }],
  },
  {
    name: "Premium Golu Heritage Package",
    image: "/images/occasion-festive.webp",
    intro: "A generous heritage menu with welcome drinks, traditional savouries, temple rice, and festive sweets.",
    pricePerPackage: 399,
    serves: "25–30 guests",
    courses: [
      { name: "Welcome drinks", dishes: ["Sweet Panakam", "Neer Mor / Majjiga"] },
      { name: "Sundal & Guggillu", dishes: [
        "Navadhanya Sundal / Navadhanya Guggillu", "Mamidikaya Senagapappu Sundal",
      ] },
      { name: "Traditional savories", dishes: [
        "Milagu Vadai / Miriyala Garelu — 30 pieces",
        "Kara Kozhukattai / Karam Kudumulu — 30 pieces",
        "Kuzhi Paniyaram / Gunta Ponganalu — 60 pieces",
      ] },
      { name: "Temple rice specialties", dishes: [
        "Temple Puliyodarai / Andhra Pulihora — ½ tray",
        "Thayir Sadam / Daddojanam — ¼ tray",
      ] },
      { name: "Traditional sweets", dishes: [
        "Paruppu Poli / Bobbatlu — 15 pieces, cut in halves",
        "Poornam Boorelu — 30 pieces", "Sakkarai Pongal / Bellam Pongali",
      ] },
      { name: "Accompaniments", dishes: [
        "Thengai Chutney / Kobbari Pachadi", "Inji Chutney / Allam Pachadi",
        "Milagai Podi / Karam Podi",
      ] },
    ],
  },
  {
    name: "Namba Oru Sapadu",
    image: "/images/package-south-indian-thali.webp",
    pricePerPerson: 22.99,
    intro: "A traditional meal with Masal Vadai, rice, comforting curries, and classic accompaniments.",
    courses: [{ name: "What’s included", dishes: [
      "Masal Vadai/Medhu Vada",
      "Paruppu Podi with Ghee",
      "Roti / Parotta with Salna / Kurma",
      "Steamed Rice",
      "Sambar",
      "Rasam",
      "Kootu / Aviyal",
      "Vathal Kulambu / Mor Kozhumbu",
      "Kara Poriyal",
      "Thengai Poriyal",
      "Curd / Butter Milk",
      "Mango / Lemon Pickle",
      "Kesari / Payasam",
      "Appalam",
    ] }],
  },
  {
    name: "Quick Fill Combo",
    image: "/images/occasion-combos.webp",
    intro: "A filling South Indian combo. Jain option available.",
    isTiffin: true,
    courses: [{ name: "What’s included", dishes: [
      "1pc Thatte Idly or 6pc Mini Idly",
      "1pc Medhu Vada / 2 pc Kara Kuzhi Paniyaram / Punugulu",
      "Ghee Pongal or Ghee Upma or Kichidi or Pesarattu Upma",
      "Poori with Aloo Masala",
      "Badam Kesari / Pineapple Kesari or Sooji Halwa",
      "Sambar & 2 types of chutneys",
    ] }],
  },
  {
    name: "Jumbo Combo",
    image: "/images/occasion-combos.webp",
    intro: "The ultimate South Indian breakfast feast. Jain option available.",
    isTiffin: true,
    courses: [{ name: "What’s included", dishes: [
      "1pc Thatte Idly or 6pc Mini Idly",
      "1pc Medhu Vada(Garelu) or 2pc Kara Kuzhi Paniyaram or Punugulu",
      "Ghee Pongal or Ghee Upma or Pesarattu Upma",
      "Poori Aloo Masala",
      "Kothu Parotta/Aloo Paratha/Chapati with Kurma",
      "Badam/Pineapple Kesari or Sooji Halwa",
      "Sambar & 2 types of chutneys",
      "Filter Coffee or Tea or Badam Milk",
    ] }],
  },
  {
    name: "Wedding Style Tiffin",
    image: "/images/occasion-combos.webp",
    intro: "A grand kalyana-style breakfast platter.",
    isTiffin: true,
    courses: [{ name: "What’s included", dishes: [
      "1pc Thatte Idly or 6pc Mini Idly",
      "1pc Medhu Vada(Garelu)",
      "2pc Kara Kuzhi Paniyaram or Punugulu",
      "Ghee Pongal or Kichidi",
      "Ghee Upma or Tomato Bath",
      "Mix Veg Uthappam or Kal Dosa or Pesarattu Upma",
      "Poori Aloo Masala",
      "Idiyappam Coconut Milk or Bellam Semiya",
      "Veg Paya or Vadacurry or Veg Kurma or Senagapappu Kurma",
      "Badam/Pineapple Kesari or Sooji Halwa",
      "Sambar & 2 types of chutneys",
      "Filter Coffee or Tea or Badam Milk",
    ] }],
  },
  {
    name: "Srivari Power Lunch",
    image: "/images/package-power-lunch.webp",
    intro: "A modern Indian bowl menu for everyday team lunches, with your choice of base and main, masala corn chaat cups, and fresh sides.",
    courses: [
      { name: "Build your bowl", dishes: [
        "Choose 1 base: Jeera rice or Lemon millet rice",
        "Choose 1 main: Paneer tikka or Chana masala",
      ] },
      { name: "Fresh accompaniments", dishes: [
        "Seasonal vegetable poriyal", "Cucumber, tomato & carrot salad",
        "Mint-coriander chutney", "Cucumber raita",
      ] },
      { name: "Office specialty", dishes: ["Masala corn & peanut chaat cups"] },
      { name: "Sweet finish", dishes: ["Mini Badam Kesari"] },
    ],
    selections: [
      { name: "Bowl base", count: 1, options: ["Jeera rice", "Lemon millet rice"] },
      { name: "Bowl main", count: 1, options: ["Paneer tikka", "Chana masala"] },
    ],
  },
  {
    name: "The Boardroom Feast",
    image: "/images/occasion-corporate.webp",
    intro: "Paneer tikka and beetroot-aloo sliders, chaat cups, and a generous vegetarian lunch spread for client meetings and team celebrations.",
    courses: [
      { name: "Signature sliders & chaat", dishes: [
        "Paneer tikka sliders with mint chutney",
        "Beetroot-aloo sliders with tomato relish",
        "Dahi papdi chaat cups",
      ] },
      { name: "The lunch spread", dishes: [
        "Vegetable dum biryani", "Paneer Butter Masala", "Dal Tadka",
        "Butter naan / Roti",
      ] },
      { name: "On the side", dishes: [
        "Cucumber raita", "Fresh green salad", "Mint chutney",
      ] },
      { name: "Sweet finish & refreshment", dishes: ["Mini Gulab Jamun", "Rose milk"] },
    ],
  },
  {
    name: "The Meeting Break",
    image: "/images/package-meeting-break.webp",
    intro: "Podi idly skewers, mini uttapam tacos, and dessert cups bring a fresh South Indian twist to meetings, workshops, and afternoon breaks.",
    courses: [
      { name: "Savoury bites", dishes: [
        "Podi idly skewers", "Mini uttapam tacos with coconut chutney",
        "Kara Kuzhi Paniyaram", "Mini paneer wraps",
      ] },
      { name: "On the side", dishes: ["Coconut chutney", "Mint chutney"] },
      { name: "Something sweet", dishes: ["Rose-rabdi dessert cups", "Fresh fruit"] },
      { name: "Tea & coffee", dishes: ["Filter coffee / Masala chai"] },
    ],
  },
];

export function menuPrice(menu: CateringMenu) {
  const price = menu.pricePerPackage ?? menu.pricePerPerson;
  if (price === undefined) return "Pricing upon enquiry";
  return `$${Number.isInteger(price) ? price : price.toFixed(2)} ${menu.pricePerPackage !== undefined ? "per package" : "per person"}`;
}
