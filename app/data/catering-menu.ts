import { premiumWeddingMenus } from "./premium-wedding-menu";

export type MenuSelection = {
  name: string;
  count: number;
  options: string[];
  replaces?: string;
  section?: string;
};

export type CateringMenu = {
  name: string;
  image: string;
  intro: string;
  pricePerPerson?: number;
  pricePerPackage?: number;
  serves?: string;
  guestsPerPackage?: number;
  minimumGuests?: number;
  isCombo?: boolean;
  isTiffin?: boolean;
  isSuggested?: boolean;
  dishDescriptions?: Record<string, string>;
  includedService?: {
    style: string;
    staffing: string;
    inclusions: string[];
    planningNotes: string[];
  };
  courses: { name: string; dishes: string | string[] }[];
  selections?: MenuSelection[];
};

export const dietaryAvailability = "Jain and no-onion, no-garlic options available on request.";
export const dietaryRequestOptions = ["Jain preparation", "No onion or garlic"] as const;

// Combo names, prices, inclusions, and choices transcribed from the supplied
// Srivari Vegetarian Catering Combos PDF (pages 1–5), with North Indian Thali
// from page 6 of the six-page edition.
// Wedding, traditional, and combo minimums are 25 guests per the business update.
// Golu menus, package prices, servings, and sweet choices come from the
// supplied Golu Season Packages attachment.
// Corporate menus are proposed vegetarian menus created at the user's request;
// pricing, availability, and serving arrangements are confirmed on enquiry.
// Shared starter and dessert choices from the supplied vegetarian combo menu.
const vegetarianStarterChoices = [
  "Punugulu", "Alasanda Guggillu", "Samosa", "Medhu Vada (Garelu)",
  "Masala Vada", "Vegetable Pakora", "Cut Mirchi", "Mysore Bonda",
  "Kara Kuzhi Paniyaram / Gunta Ponganalu", "Gobi Manchurian / Chilli Gobi",
  "Baby Corn Manchurian / Chilli Baby Corn", "Sundal - chickpea or peanut varieties",
  "Aloo Tikki", "Sabudana Vada",
];
const vegetarianDessertChoices = [
  "Gulab Jamun", "Jamun Rabdi", "Rice Kheer", "Rasmalai", "Payasam",
  "Kesari", "Double Ka Meetha", "Fruit Custard", "Shahi Tukda", "Gajar Halwa",
];

export const menus: CateringMenu[] = [
  {
    name: "Srivari Signature Veg Feast",
    image: "/images/occasion-traditional.webp",
    intro: "Build your perfect menu with South Indian, Andhra, and North Indian favourites. Choose 2 starters, 2 curries, and 1 dessert, plus your rice, bread, lentil, and soup preferences, subject to availability.",
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
        name: "Vegetarian starters", count: 2, replaces: "2 vegetarian starters",
        options: vegetarianStarterChoices,
      },
      {
        name: "Rice", section: "Rice & breads", count: 1, replaces: "Steamed rice or jeera rice",
        options: ["Steamed rice", "Jeera rice"],
      },
      {
        name: "Bread", section: "Rice & breads", count: 1, replaces: "Butter naan, roti or chapati",
        options: ["Butter naan", "Roti", "Chapati"],
      },
      {
        name: "Biryani or pulao", section: "Rice & breads", count: 1, replaces: "Vegetable dum biryani or pulao",
        options: ["Vegetable dum biryani", "Pulao"],
      },
      {
        name: "Vegetarian curries", section: "Curries & lentils", count: 2, replaces: "2 vegetarian curries",
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
        name: "Lentils", section: "Curries & lentils", count: 1, replaces: "Sambar or dal tadka",
        options: ["Sambar", "Dal Tadka"],
      },
      {
        name: "Rasam, shorba or kadhi", section: "Curries & lentils", count: 1, replaces: "Rasam, shorba or kadhi",
        options: ["Rasam", "Shorba", "Kadhi"],
      },
      {
        name: "Dessert", count: 1, replaces: "1 dessert",
        options: vegetarianDessertChoices,
      },
    ],
  },
  {
    name: "Andhra Inti Bhojanam",
    minimumGuests: 25,
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
    selections: [
      { name: "Starter", section: "Starter", count: 1, replaces: "Garelu or Alasanda Guggillu",
        options: ["Garelu", "Alasanda Guggillu"] },
      { name: "Lentils", section: "Lentils & curries", count: 1, replaces: "Pappu Charu or Sambar",
        options: ["Pappu Charu", "Sambar"] },
      { name: "Rasam", section: "Lentils & curries", count: 1, replaces: "Charu or Rasam",
        options: ["Charu", "Rasam"] },
      { name: "Pappu", section: "Lentils & curries", count: 1, replaces: "Tomato, Mango or Dosakaya Pappu",
        options: ["Tomato Pappu", "Mango Pappu", "Dosakaya Pappu"] },
      { name: "Pulusu", section: "Lentils & curries", count: 1, replaces: "Dosakaya Pulusu or Majjiga Pulusu",
        options: ["Dosakaya Pulusu", "Majjiga Pulusu"] },
      { name: "Vegetable side", section: "Vegetable side", count: 1, replaces: "Bendakaya or Dondakaya Palli Vepudu",
        options: ["Bendakaya Palli Vepudu", "Dondakaya Palli Vepudu"] },
    ],
  },
  {
    name: "Wedding Spl Thali",
    minimumGuests: 25,
    image: "/images/occasion-weddings.webp",
    intro: "A celebratory South Indian spread with traditional accompaniments and two desserts.",
    pricePerPerson: 32.99,
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
    selections: [
      { name: "Starter", section: "Starter", count: 1, replaces: "Masala Vada, Bajji or Cut Mirchi",
        options: ["Masala Vada", "Bajji", "Cut Mirchi"] },
      { name: "Bread with curry", section: "Rice & breads", count: 1, replaces: "Roti or Parotta with Salan / Kurma",
        options: ["Roti with Salan", "Roti with Kurma", "Parotta with Salan", "Parotta with Kurma"] },
      { name: "Variety rice", section: "Rice & breads", count: 1, replaces: "Variety Rice or Biryani",
        options: ["Variety Rice", "Biryani"] },
      { name: "Lentils", section: "Lentils & curries", count: 1, replaces: "Pappu Charu or Sambar",
        options: ["Pappu Charu", "Sambar"] },
      { name: "Rasam", section: "Lentils & curries", count: 1, replaces: "Charu or Rasam",
        options: ["Charu", "Rasam"] },
      { name: "Pappu", section: "Lentils & curries", count: 1, replaces: "Tomato, Mango or Dosakaya Pappu",
        options: ["Tomato Pappu", "Mango Pappu", "Dosakaya Pappu"] },
      { name: "Kulambu or pulusu", section: "Lentils & curries", count: 1, replaces: "Vathal Kulambu, Mor Kuzhambu, Majjiga Pulusu or Pulusu",
        options: ["Vathal Kulambu", "Mor Kuzhambu", "Majjiga Pulusu", "Pulusu"] },
      { name: "Vegetable fry", section: "Vegetable sides", count: 1, replaces: "Kara Poriyal or Bangaladumpa Vepudu",
        options: ["Kara Poriyal", "Bangaladumpa Vepudu"] },
      { name: "Coconut vegetable side", section: "Vegetable sides", count: 1, replaces: "Thengai Poriyal or Kobbari Kura",
        options: ["Thengai Poriyal", "Kobbari Kura"] },
      { name: "Thogayal or pachadi", section: "Accompaniments", count: 1, replaces: "Thogayal or Roti Pachadi",
        options: ["Thogayal", "Roti Pachadi"] },
      { name: "Curd or buttermilk", section: "Accompaniments", count: 1, replaces: "Curd or Buttermilk",
        options: ["Curd", "Buttermilk"] },
      { name: "Pickle", section: "Accompaniments", count: 1, replaces: "Mango or Lemon Pickle",
        options: ["Mango Pickle", "Lemon Pickle"] },
      { name: "Crunchy accompaniment", section: "Accompaniments", count: 1, replaces: "Appalam or Fryums",
        options: ["Appalam", "Fryums"] },
    ],
  },
  {
    name: "Apna Ghar Ka Bhojan",
    minimumGuests: 25,
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
    selections: [
      { name: "Starter", section: "Starter", count: 1, replaces: "Punjabi Samosa, Onion Pakora or Hara Bhara Kebab",
        options: ["Punjabi Samosa", "Onion Pakora", "Hara Bhara Kebab"] },
      { name: "Bread with paneer curry", section: "Rice & breads", count: 1, replaces: "Tandoori Roti or Naan with Paneer Curry",
        options: ["Tandoori Roti with Paneer Curry", "Naan with Paneer Curry"] },
      { name: "Pulao", section: "Rice & breads", count: 1, replaces: "Vegetable Pulao or Peas Pulao",
        options: ["Vegetable Pulao", "Peas Pulao"] },
      { name: "Dal", section: "Dal & curries", count: 1, replaces: "Dal Tadka or Dal Makhani",
        options: ["Dal Tadka", "Dal Makhani"] },
      { name: "Kadhi or shorba", section: "Dal & curries", count: 1, replaces: "Punjabi Kadhi or Tomato Shorba",
        options: ["Punjabi Kadhi", "Tomato Shorba"] },
      { name: "Hearty curry", section: "Dal & curries", count: 1, replaces: "Rajma Masala, Chana Masala or Dal Palak",
        options: ["Rajma Masala", "Chana Masala", "Dal Palak"] },
      { name: "Kadhi", section: "Dal & curries", count: 1, replaces: "Kadhi Pakora or Sindhi Kadhi",
        options: ["Kadhi Pakora", "Sindhi Kadhi"] },
      { name: "Potato side", section: "Vegetable sides", count: 1, replaces: "Jeera Aloo or Punjabi Aloo Gobi",
        options: ["Jeera Aloo", "Punjabi Aloo Gobi"] },
      { name: "Vegetable side", section: "Vegetable sides", count: 1, replaces: "Matar Gobi, Beans Aloo Sabzi or Vegetable Jalfrezi",
        options: ["Matar Gobi", "Beans Aloo Sabzi", "Vegetable Jalfrezi"] },
      { name: "Raita or chaas", section: "Accompaniments", count: 1, replaces: "Boondi Raita or Masala Chaas",
        options: ["Boondi Raita", "Masala Chaas"] },
      { name: "Pickle", section: "Accompaniments", count: 1, replaces: "Mango or Lemon Pickle",
        options: ["Mango Pickle", "Lemon Pickle"] },
      { name: "Papad", section: "Accompaniments", count: 1, replaces: "Roasted Papad or Masala Papad",
        options: ["Roasted Papad", "Masala Papad"] },
      { name: "Traditional sweet", section: "Sweets", count: 1, replaces: "Gur with Ghee or Rajasthani Churma",
        options: ["Gur with Ghee", "Rajasthani Churma"] },
      { name: "Dessert", section: "Sweets", count: 1, replaces: "Gulab Jamun or Gajar Halwa",
        options: ["Gulab Jamun", "Gajar Halwa"] },
      { name: "Kheer", section: "Sweets", count: 1, replaces: "Kesar Badam Kheer or Rice Kheer",
        options: ["Kesar Badam Kheer", "Rice Kheer"] },
    ],
  },
  {
    name: "Small Golu Package",
    image: "/images/occasion-festive.webp",
    intro: "A traditional spread for Navaratri Golu gatherings, pooja celebrations, and evening guests.",
    pricePerPackage: 99,
    guestsPerPackage: 10,
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
    guestsPerPackage: 20,
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
    guestsPerPackage: 30,
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
    minimumGuests: 25,
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
    selections: [
      { name: "Starter", section: "Starter", count: 1, replaces: "Masal Vadai/Medhu Vada",
        options: ["Masal Vadai", "Medhu Vada"] },
      { name: "Bread with curry", section: "Rice & breads", count: 1, replaces: "Roti / Parotta with Salna / Kurma",
        options: ["Roti with Salna", "Roti with Kurma", "Parotta with Salna", "Parotta with Kurma"] },
      { name: "Kootu or aviyal", section: "Curries & lentils", count: 1, replaces: "Kootu / Aviyal",
        options: ["Kootu", "Aviyal"] },
      { name: "Kulambu", section: "Curries & lentils", count: 1, replaces: "Vathal Kulambu / Mor Kozhumbu",
        options: ["Vathal Kulambu", "Mor Kozhumbu"] },
      { name: "Curd or buttermilk", section: "Accompaniments", count: 1, replaces: "Curd / Butter Milk",
        options: ["Curd", "Butter Milk"] },
      { name: "Pickle", section: "Accompaniments", count: 1, replaces: "Mango / Lemon Pickle",
        options: ["Mango Pickle", "Lemon Pickle"] },
      { name: "Dessert", section: "Dessert", count: 1, replaces: "Kesari / Payasam",
        options: ["Kesari", "Payasam"] },
    ],
  },
  {
    name: "Quick Fill Combo",
    minimumGuests: 25,
    image: "/images/occasion-combos.webp",
    intro: "A filling South Indian combo.",
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
    selections: [
      { name: "Idly", section: "Idly & savoury bites", count: 1, replaces: "1pc Thatte Idly or 6pc Mini Idly",
        options: ["1pc Thatte Idly", "6pc Mini Idly"] },
      { name: "Savoury bite", section: "Idly & savoury bites", count: 1, replaces: "1pc Medhu Vada / 2 pc Kara Kuzhi Paniyaram / Punugulu",
        options: ["1pc Medhu Vada", "2 pc Kara Kuzhi Paniyaram", "Punugulu"] },
      { name: "Breakfast main", section: "Breakfast mains", count: 1, replaces: "Ghee Pongal or Ghee Upma or Kichidi or Pesarattu Upma",
        options: ["Ghee Pongal", "Ghee Upma", "Kichidi", "Pesarattu Upma"] },
      { name: "Sweet", section: "Sweet finish", count: 1, replaces: "Badam Kesari / Pineapple Kesari or Sooji Halwa",
        options: ["Badam Kesari", "Pineapple Kesari", "Sooji Halwa"] },
    ],
  },
  {
    name: "Jumbo Combo",
    minimumGuests: 25,
    image: "/images/occasion-combos.webp",
    intro: "The ultimate South Indian breakfast feast.",
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
    selections: [
      { name: "Idly", section: "Idly & savoury bites", count: 1, replaces: "1pc Thatte Idly or 6pc Mini Idly",
        options: ["1pc Thatte Idly", "6pc Mini Idly"] },
      { name: "Savoury bite", section: "Idly & savoury bites", count: 1, replaces: "1pc Medhu Vada(Garelu) or 2pc Kara Kuzhi Paniyaram or Punugulu",
        options: ["1pc Medhu Vada(Garelu)", "2pc Kara Kuzhi Paniyaram", "Punugulu"] },
      { name: "Breakfast main", section: "Breakfast mains", count: 1, replaces: "Ghee Pongal or Ghee Upma or Pesarattu Upma",
        options: ["Ghee Pongal", "Ghee Upma", "Pesarattu Upma"] },
      { name: "Bread or parotta", section: "Breakfast mains", count: 1, replaces: "Kothu Parotta/Aloo Paratha/Chapati with Kurma",
        options: ["Kothu Parotta", "Aloo Paratha", "Chapati with Kurma"] },
      { name: "Sweet", section: "Sweet finish", count: 1, replaces: "Badam/Pineapple Kesari or Sooji Halwa",
        options: ["Badam Kesari", "Pineapple Kesari", "Sooji Halwa"] },
      { name: "Refreshment", section: "Refreshment", count: 1, replaces: "Filter Coffee or Tea or Badam Milk",
        options: ["Filter Coffee", "Tea", "Badam Milk"] },
    ],
  },
  {
    name: "Wedding Style Tiffin",
    minimumGuests: 25,
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
    selections: [
      { name: "Idly", section: "Idly & savoury bites", count: 1, replaces: "1pc Thatte Idly or 6pc Mini Idly",
        options: ["1pc Thatte Idly", "6pc Mini Idly"] },
      { name: "Paniyaram or punugulu", section: "Idly & savoury bites", count: 1, replaces: "2pc Kara Kuzhi Paniyaram or Punugulu",
        options: ["2pc Kara Kuzhi Paniyaram", "Punugulu"] },
      { name: "Pongal or kichidi", section: "Breakfast mains", count: 1, replaces: "Ghee Pongal or Kichidi",
        options: ["Ghee Pongal", "Kichidi"] },
      { name: "Upma or tomato bath", section: "Breakfast mains", count: 1, replaces: "Ghee Upma or Tomato Bath",
        options: ["Ghee Upma", "Tomato Bath"] },
      { name: "Uthappam, dosa or pesarattu", section: "Breakfast mains", count: 1, replaces: "Mix Veg Uthappam or Kal Dosa or Pesarattu Upma",
        options: ["Mix Veg Uthappam", "Kal Dosa", "Pesarattu Upma"] },
      { name: "Idiyappam or semiya", section: "Breakfast mains", count: 1, replaces: "Idiyappam Coconut Milk or Bellam Semiya",
        options: ["Idiyappam Coconut Milk", "Bellam Semiya"] },
      { name: "Curry", section: "Curries & accompaniments", count: 1, replaces: "Veg Paya or Vadacurry or Veg Kurma or Senagapappu Kurma",
        options: ["Veg Paya", "Vadacurry", "Veg Kurma", "Senagapappu Kurma"] },
      { name: "Sweet", section: "Sweet finish", count: 1, replaces: "Badam/Pineapple Kesari or Sooji Halwa",
        options: ["Badam Kesari", "Pineapple Kesari", "Sooji Halwa"] },
      { name: "Refreshment", section: "Refreshment", count: 1, replaces: "Filter Coffee or Tea or Badam Milk",
        options: ["Filter Coffee", "Tea", "Badam Milk"] },
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
      { name: "Bowl base", count: 1, replaces: "Choose 1 base: Jeera rice or Lemon millet rice", options: ["Jeera rice", "Lemon millet rice"] },
      { name: "Bowl main", count: 1, replaces: "Choose 1 main: Paneer tikka or Chana masala", options: ["Paneer tikka", "Chana masala"] },
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
  {
    name: "Live Dosa Catering",
    image: "/images/occasion-live-catering.webp",
    minimumGuests: 30,
    intro: "Unlimited dosas, freshly prepared at your event, with a range of additions. Your package includes one appetiser, one variety rice or biryani, one dessert, and one complimentary beverage of your choice. Starts from 30 people; pricing upon enquiry.",
    courses: [
      { name: "Live dosa station", dishes: ["Unlimited freshly prepared dosas"] },
      { name: "Available dosas for your dosa party", dishes: [
        "Andhra Kara Dosa",
        "Green Chili Dosa",
        "Curry Leaf Dosa",
        "Paneer Dosa",
        "Plain Dosa",
        "Masala Dosa",
        "Ghee Dosa",
        "Ghee Podi Dosa",
        "Mysore Dosa",
        "Cheese Dosa",
        "Chocolate Dosa",
      ] },
      { name: "Dosa additions", dishes: ["Ghee", "Podi", "Masala", "Paneer", "Mix veg", "Kara paste", "Green chilli", "Curry leaf"] },
      { name: "Appetiser", dishes: ["1 vegetarian appetiser"] },
      { name: "Rice or biryani", dishes: ["1 variety rice or biryani"] },
      { name: "Dessert", dishes: ["1 dessert"] },
      { name: "Complimentary beverages", dishes: ["Coffee, Tea, Chaas, Rose milk or Lassi — choose 1"] },
    ],
    selections: [
      { name: "Appetiser", count: 1, replaces: "1 vegetarian appetiser", options: vegetarianStarterChoices },
      { name: "Variety rice or biryani", count: 1, replaces: "1 variety rice or biryani", options: ["Variety rice", "Vegetable biryani"] },
      { name: "Dessert", count: 1, replaces: "1 dessert", options: vegetarianDessertChoices },
      { name: "Complimentary beverages", count: 1, replaces: "Coffee, Tea, Chaas, Rose milk or Lassi — choose 1", options: ["Coffee", "Tea", "Chaas", "Rose milk", "Lassi"] },
    ],
  },
  ...premiumWeddingMenus,
];

export function buildPackageMenu(menu: CateringMenu, choices: Record<string, string[]>) {
  const selections = menu.selections ?? [];
  const filledGroups = new Set<string>();
  const selectedDishes = (group: MenuSelection) => Array.from(new Set(choices[group.name] ?? []))
    .filter((dish) => group.options.includes(dish)).slice(0, group.count);
  const courses = menu.courses.map((course) => ({
    name: course.name,
    dishes: (Array.isArray(course.dishes) ? course.dishes : [course.dishes]).flatMap((dish) => {
      const group = selections.find((selection) => selection.replaces === dish);
      if (!group) return [dish];
      filledGroups.add(group.name);
      const selected = selectedDishes(group);
      return selected.length ? selected : [dish];
    }),
  }));

  for (const group of selections) {
    if (filledGroups.has(group.name)) continue;
    const selected = selectedDishes(group);
    courses.push({ name: group.name, dishes: selected.length ? selected : [`Choose ${group.count} ${group.name.toLowerCase()} in Build your perfect menu`] });
  }
  return courses;
}

export function menuPrice(menu: CateringMenu) {
  const price = menu.pricePerPackage ?? menu.pricePerPerson;
  if (price === undefined) return "Pricing upon enquiry";
  return `$${Number.isInteger(price) ? price : price.toFixed(2)} ${menu.pricePerPackage !== undefined ? "per package" : "per person"}`;
}
