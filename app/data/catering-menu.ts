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
  isSuggested?: boolean;
  dishDescriptions?: Record<string, string>;
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
    courses: [
      { name: "Starters", dishes: [
        "2 vegetarian starters",
      ] },
      { name: "Rice & breads", dishes: [
        "Steamed rice or jeera rice",
        "Butter naan, roti or chapati",
        "Vegetable dum biryani or pulao",
      ] },
      { name: "Curries & lentils", dishes: [
        "2 vegetarian curries",
        "Sambar or dal tadka",
        "Rasam, shorba or kadhi",
      ] },
      { name: "Accompaniments", dishes: [
        "Raita",
        "Salan",
        "Roti pachadi (vegetable pickle)",
      ] },
      { name: "Dessert", dishes: [
        "1 dessert",
      ] },
    ],
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
    courses: [
      { name: "Starter", dishes: [
        "Garelu or Alasanda Guggillu",
      ] },
      { name: "Rice & breads", dishes: [
        "Chapati with Kurma",
        "Steamed Rice",
      ] },
      { name: "Lentils & curries", dishes: [
        "Pappu Charu or Sambar",
        "Charu or Rasam",
        "Tomato, Mango or Dosakaya Pappu",
        "Gutti Vankaya Kura",
        "Dosakaya Pulusu or Majjiga Pulusu",
      ] },
      { name: "Vegetable side", dishes: [
        "Bendakaya or Dondakaya Palli Vepudu",
      ] },
      { name: "Accompaniments", dishes: [
        "Kandi Podi with Ghee",
        "Roti Pachadi",
        "Perugu (Curd)",
        "Avakaya Pickle",
        "Appadam",
      ] },
      { name: "Dessert", dishes: [
        "Payasam",
      ] },
    ],
  },
  {
    name: "Wedding Thali Combo",
    image: "/images/occasion-weddings.webp",
    intro: "A celebratory South Indian spread with traditional accompaniments and two desserts.",
    pricePerPerson: 24.99,
    isCombo: true,
    courses: [
      { name: "Starter", dishes: [
        "Masala Vada, Bajji or Cut Mirchi",
      ] },
      { name: "Rice & breads", dishes: [
        "Roti or Parotta with Salan / Kurma",
        "Variety Rice or Biryani",
        "Steamed Rice",
      ] },
      { name: "Lentils & curries", dishes: [
        "Pappu Charu or Sambar",
        "Charu or Rasam",
        "Tomato, Mango or Dosakaya Pappu",
        "Vathal Kulambu, Mor Kuzhambu, Majjiga Pulusu or Pulusu",
      ] },
      { name: "Vegetable sides", dishes: [
        "Kara Poriyal or Bangaladumpa Vepudu",
        "Thengai Poriyal or Kobbari Kura",
      ] },
      { name: "Accompaniments", dishes: [
        "Sweet Pachadi",
        "Paruppu Podi with Ghee",
        "Thogayal or Roti Pachadi",
        "Curd or Buttermilk",
        "Mango or Lemon Pickle",
        "Appalam or Fryums",
      ] },
      { name: "Desserts", dishes: [
        "Shahi Tukda",
        "Elaneer Payasam",
      ] },
    ],
  },
  {
    name: "Apna Ghar Ka Bhojan",
    image: "/images/occasion-traditional.webp",
    intro: "A generous North Indian menu featuring classic breads, curries, rice and festive sweets.",
    pricePerPerson: 23.99,
    isCombo: true,
    courses: [
      { name: "Starter", dishes: [
        "Punjabi Samosa, Onion Pakora or Hara Bhara Kebab",
      ] },
      { name: "Rice & breads", dishes: [
        "Tandoori Roti or Naan with Paneer Curry",
        "Vegetable Pulao or Peas Pulao",
        "Steamed Basmati Rice",
      ] },
      { name: "Dal & curries", dishes: [
        "Dal Tadka or Dal Makhani",
        "Punjabi Kadhi or Tomato Shorba",
        "Rajma Masala, Chana Masala or Dal Palak",
        "Kadhi Pakora or Sindhi Kadhi",
      ] },
      { name: "Vegetable sides", dishes: [
        "Jeera Aloo or Punjabi Aloo Gobi",
        "Matar Gobi, Beans Aloo Sabzi or Vegetable Jalfrezi",
      ] },
      { name: "Accompaniments", dishes: [
        "Saunth-Imli Chutney",
        "Mint-Coriander Chutney",
        "Boondi Raita or Masala Chaas",
        "Mango or Lemon Pickle",
        "Roasted Papad or Masala Papad",
      ] },
      { name: "Sweets", dishes: [
        "Gur with Ghee or Rajasthani Churma",
        "Gulab Jamun or Gajar Halwa",
        "Kesar Badam Kheer or Rice Kheer",
      ] },
    ],
  },
  {
    name: "Small Golu Package",
    image: "/images/occasion-festive.webp",
    intro: "A traditional spread for Navaratri Golu gatherings, pooja celebrations, and evening guests.",
    pricePerPackage: 99,
    serves: "8–10 guests",
    courses: [
      { name: "Welcome drink", dishes: [
        "Sweet Panakam",
      ] },
      { name: "Traditional bites", dishes: [
        "Konda Kadalai Sundal / Senagalu Guggillu",
        "Milagu Vadai / Miriyala Garelu — 10 pieces",
      ] },
      { name: "Temple rice", dishes: [
        "Temple Puliyodarai / Andhra Pulihora — ¼ tray",
      ] },
      { name: "Accompaniment", dishes: [
        "Thengai Thuvaiyal / Kobbari Pachadi",
      ] },
      { name: "Traditional sweet", dishes: [
        "Nei Appam / Bellam Appalu — 10 pieces",
      ] },
    ],
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
    courses: [
      { name: "Starter", dishes: [
        "Masal Vadai/Medhu Vada",
      ] },
      { name: "Rice & breads", dishes: [
        "Roti / Parotta with Salna / Kurma",
        "Steamed Rice",
      ] },
      { name: "Curries & lentils", dishes: [
        "Sambar",
        "Rasam",
        "Kootu / Aviyal",
        "Vathal Kulambu / Mor Kozhumbu",
      ] },
      { name: "Vegetable sides", dishes: [
        "Kara Poriyal",
        "Thengai Poriyal",
      ] },
      { name: "Accompaniments", dishes: [
        "Paruppu Podi with Ghee",
        "Curd / Butter Milk",
        "Mango / Lemon Pickle",
        "Appalam",
      ] },
      { name: "Dessert", dishes: [
        "Kesari / Payasam",
      ] },
    ],
  },
  {
    name: "Quick Fill Combo",
    image: "/images/occasion-combos.webp",
    intro: "A filling South Indian combo. Jain option available.",
    isTiffin: true,
    courses: [
      { name: "Idly & savoury bites", dishes: [
        "1pc Thatte Idly or 6pc Mini Idly",
        "1pc Medhu Vada / 2 pc Kara Kuzhi Paniyaram / Punugulu",
      ] },
      { name: "Breakfast mains", dishes: [
        "Ghee Pongal or Ghee Upma or Kichidi or Pesarattu Upma",
        "Poori with Aloo Masala",
      ] },
      { name: "Accompaniments", dishes: [
        "Sambar & 2 types of chutneys",
      ] },
      { name: "Sweet finish", dishes: [
        "Badam Kesari / Pineapple Kesari or Sooji Halwa",
      ] },
    ],
  },
  {
    name: "Jumbo Combo",
    image: "/images/occasion-combos.webp",
    intro: "The ultimate South Indian breakfast feast. Jain option available.",
    isTiffin: true,
    courses: [
      { name: "Idly & savoury bites", dishes: [
        "1pc Thatte Idly or 6pc Mini Idly",
        "1pc Medhu Vada(Garelu) or 2pc Kara Kuzhi Paniyaram or Punugulu",
      ] },
      { name: "Breakfast mains", dishes: [
        "Ghee Pongal or Ghee Upma or Pesarattu Upma",
        "Poori Aloo Masala",
        "Kothu Parotta/Aloo Paratha/Chapati with Kurma",
      ] },
      { name: "Accompaniments", dishes: [
        "Sambar & 2 types of chutneys",
      ] },
      { name: "Sweet finish", dishes: [
        "Badam/Pineapple Kesari or Sooji Halwa",
      ] },
      { name: "Refreshment", dishes: [
        "Filter Coffee or Tea or Badam Milk",
      ] },
    ],
  },
  {
    name: "Wedding Style Tiffin",
    image: "/images/occasion-combos.webp",
    intro: "A grand kalyana-style breakfast platter.",
    isTiffin: true,
    courses: [
      { name: "Idly & savoury bites", dishes: [
        "1pc Thatte Idly or 6pc Mini Idly",
        "1pc Medhu Vada(Garelu)",
        "2pc Kara Kuzhi Paniyaram or Punugulu",
      ] },
      { name: "Breakfast mains", dishes: [
        "Ghee Pongal or Kichidi",
        "Ghee Upma or Tomato Bath",
        "Mix Veg Uthappam or Kal Dosa or Pesarattu Upma",
        "Poori Aloo Masala",
        "Idiyappam Coconut Milk or Bellam Semiya",
      ] },
      { name: "Curries & accompaniments", dishes: [
        "Veg Paya or Vadacurry or Veg Kurma or Senagapappu Kurma",
        "Sambar & 2 types of chutneys",
      ] },
      { name: "Sweet finish", dishes: [
        "Badam/Pineapple Kesari or Sooji Halwa",
      ] },
      { name: "Refreshment", dishes: [
        "Filter Coffee or Tea or Badam Milk",
      ] },
    ],
  },
  {
    name: "Srivari Power Lunch",
    image: "/images/package-power-lunch.webp",
    intro: "A modern Indian bowl menu for everyday team lunches, with your choice of base and main, masala corn chaat cups, and fresh sides.",
    isSuggested: true,
    dishDescriptions: {
      "Choose 1 base: Jeera rice or Lemon millet rice": "Start your bowl with cumin rice or lemon-flavoured millet rice.",
      "Choose 1 main: Paneer tikka or Chana masala": "Add paneer tikka pieces or a hearty chickpea curry.",
      "Seasonal vegetable poriyal": "A South Indian vegetable side to complete the bowl.",
      "Cucumber, tomato & carrot salad": "A fresh, crunchy side served separately.",
      "Mint-coriander chutney": "A herb chutney to spoon over the bowl.",
      "Cucumber raita": "A cooling yogurt-and-cucumber accompaniment.",
      "Masala corn & peanut chaat cups": "Individual cups of sweet corn and peanuts with a tangy masala dressing.",
      "Mini Badam Kesari": "A small almond-kesari sweet to finish lunch.",
    },
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
    isSuggested: true,
    dishDescriptions: {
      "Paneer tikka sliders with mint chutney": "Mini buns filled with paneer tikka, crunchy vegetables, and mint chutney.",
      "Beetroot-aloo sliders with tomato relish": "Mini buns with beetroot-and-potato patties and tomato relish.",
      "Dahi papdi chaat cups": "Individual cups of crisp papdi, yogurt, chickpeas, and sweet and tangy chutneys.",
      "Vegetable dum biryani": "Fragrant rice layered with mixed vegetables for the shared lunch spread.",
      "Paneer Butter Masala": "Paneer in a creamy tomato gravy, paired with rice or bread.",
      "Dal Tadka": "Tempered lentils to accompany the lunch mains.",
      "Butter naan / Roti": "Indian breads to serve alongside the curries.",
      "Cucumber raita": "A cooling yogurt-and-cucumber side for the biryani.",
      "Fresh green salad": "A fresh vegetable salad to balance the lunch spread.",
      "Mint chutney": "A herb dip for the sliders and lunch accompaniments.",
      "Mini Gulab Jamun": "Small syrup-soaked sweets for a bite-size dessert.",
      "Rose milk": "A chilled rose-flavoured milk refreshment.",
    },
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
    isSuggested: true,
    dishDescriptions: {
      "Podi idly skewers": "Mini idly tossed in podi and arranged on skewers for easy serving.",
      "Mini uttapam tacos with coconut chutney": "Small uttapam folded around a vegetable filling, with coconut chutney.",
      "Kara Kuzhi Paniyaram": "Savoury South Indian batter bites, served with chutney.",
      "Mini paneer wraps": "Small wraps filled with paneer and vegetables for a meeting snack.",
      "Coconut chutney": "A classic South Indian dip for the idly, uttapam, and paniyaram.",
      "Mint chutney": "A fresh herb dip to accompany the paneer wraps.",
      "Rose-rabdi dessert cups": "Individual cups of rose-flavoured thickened milk dessert.",
      "Fresh fruit": "A selection of fruit for a lighter sweet option.",
      "Filter coffee / Masala chai": "Choose South Indian filter coffee or spiced tea for the break.",
    },
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
