// Transcribed from the supplied Golu Season Packages and
// Unique Tamil & Telugu Golu Specialties attachments.
export const festiveExtras = [
  {
    name: "Tiffin Package Upgrade",
    items: [
      "Mini Idli with Sambar, Ven Pongal / Katte Pongali, Uthappam or Pesarattu.",
      "Accompanied with sambar and chutney.",
    ],
  },
  {
    name: "Premium Package Upgrade",
    items: [
      "Small Premium — Choose one premium snack and one premium sweet.",
      "Medium Premium — Choose two premium snacks and one premium sweet.",
      "Grand Golu — Choose two premium snacks, two premium sweets and one beverage.",
    ],
  },
  {
    name: "Individual Golu Boxes",
    items: [
      "Divine Mini Box — Sundal / Guggillu + one sweet.",
      "Traditional Box — Sundal + snack + sweet.",
      "Premium Tambulam Box — Sundal + two snacks + two sweets.",
      "Add decorative tambulam bag, kumkum and turmeric.",
    ],
  },
];

type SpecialtyTable = {
  name: string;
  rows: [item: string, small: string, medium: string][];
};

export const festiveSpecialties: SpecialtyTable[] = [
  {
    name: "Sundal & Guggillu",
    rows: [
      ["Konda Kadalai Sundal / Black Channa Guggillu", "Available", "Available"],
      ["Vella Kadalai Sundal / White Channa Guggillu", "Available", "Available"],
      ["Pachai Payaru Sundal / Pesara Guggillu", "Available", "Available"],
      ["Karamani Sundal / Alasanda Guggillu", "Available", "Available"],
      ["Verkadalai Sundal / Verusenaga Guggillu", "Available", "Available"],
      ["Sweet Corn Guggillu with Coconut", "Available", "Available"],
      ["Mamidikaya Senagapappu Sundal", "Available", "Available"],
      ["Navadhanya Sundal", "Available", "Available"],
      ["Temple-Style Mixed Bean Guggillu", "Available", "Available"],
      ["Pomegranate Coconut Sundal", "Available", "Available"],
    ],
  },
  {
    name: "Traditional Rice Specialties",
    rows: [
      ["Temple Puliyodarai / Andhra Pulihora", "Available", "Available"],
      ["Kovil Sakkarai Pongal", "Available", "Available"],
      ["Ven Pongal / Katte Pongali", "Available", "Available"],
      ["Ellu Sadam / Sesame Rice", "Available", "Available"],
      ["Coconut Rice / Kobbari Annam", "Available", "Available"],
      ["Lemon Rice / Nimmakaya Pulihora", "Available", "Available"],
      ["Kadamba Sadam", "Available", "Available"],
      ["Kalkandu Sadam", "Available", "Available"],
      ["Daddojanam / Temple Curd Rice", "Available", "Available"],
      ["Raw Mango Pulihora", "Available", "Available"],
      ["Gongura Pulihora", "Available", "Available"],
      ["Sesame-Peanut Pulihora", "Available", "Available"],
      ["Karivepaku Annam / Curry Leaf Rice", "Available", "Available"],
      ["Chintapandu Atukulu / Tamarind Poha", "Available", "Available"],
    ],
  },
  {
    name: "Tamil Traditional Savories",
    rows: [
      ["Milagu Vadai", "12 pieces", "24 pieces"],
      ["Paruppu Vadai", "12 pieces", "24 pieces"],
      ["Ulundu Vadai", "12 pieces", "24 pieces"],
      ["Kara Kozhukattai", "24 pieces", "48 pieces"],
      ["Ammini Kozhukattai", "Available", "Available"],
      ["Pidi Kozhukattai", "12 pieces", "24 pieces"],
      ["Thavala Vadai", "12 pieces", "24 pieces"],
      ["Kuzhi Paniyaram", "30 pieces", "60 pieces"],
      ["Mini Adai with Aviyal", "12 pieces", "24 pieces"],
      ["Mor Kali Bites", "24 pieces", "48 pieces"],
      ["Aval Upma", "Available", "Available"],
      ["Lemon Sevai", "Available", "Available"],
      ["Ellu Podi Sevai", "Available", "Available"],
      ["Coconut Sevai", "Available", "Available"],
      ["Thattai and Ribbon Pakoda", "1 lb", "2 lb"],
    ],
  },
  {
    name: "Tamil Traditional Sweets",
    rows: [
      ["Nei Appam", "12 pieces", "24 pieces"],
      ["Sakkarai Pongal", "Available", "Available"],
      ["Paal Kozhukattai", "Available", "Available"],
      ["Sweet Pidi Kozhukattai", "12 pieces", "24 pieces"],
      ["Aval Puttu", "Available", "Available"],
      ["Adhirasam", "12 pieces", "24 pieces"],
      ["Kalkandu Pongal", "Available", "Available"],
      ["Coconut Poli", "12 pieces", "24 pieces"],
      ["Paruppu Poli", "12 pieces", "24 pieces"],
      ["Kasi Halwa", "Available", "Available"],
      ["Elaneer Payasam", "Available", "Available"],
    ],
  },
  {
    name: "Telugu Traditional Savories",
    rows: [
      ["Minapa Garelu", "12 pieces", "24 pieces"],
      ["Masala Garelu", "12 pieces", "24 pieces"],
      ["Pesara Punugulu", "30 pieces", "60 pieces"],
      ["Minapa Punugulu", "30 pieces", "60 pieces"],
      ["Pesarattu Rolls with Allam Chutney", "20 pieces", "40 pieces"],
      ["Dibba Rotti Bites", "24 pieces", "48 pieces"],
      ["Atukula Upma", "Available", "Available"],
      ["Karam Kudumulu", "24 pieces", "48 pieces"],
      ["Undrallu with Allam Chutney", "Available", "Available"],
      ["Chitti Garelu with Coconut Chutney", "24 pieces", "48 pieces"],
      ["Sakinalu", "1 lb", "2 lb"],
      ["Chekkalu", "1 lb", "2 lb"],
      ["Janthikalu", "1 lb", "2 lb"],
      ["Mirapakaya Bajji Bites", "24 pieces", "48 pieces"],
    ],
  },
  {
    name: "Telugu Traditional Sweets",
    rows: [
      ["Poornam Boorelu", "12 pieces", "24 pieces"],
      ["Bobbatlu", "12 pieces", "24 pieces"],
      ["Ariselu", "12 pieces", "24 pieces"],
      ["Sunnundalu", "12 pieces", "24 pieces"],
      ["Bellam Paramanannam", "Available", "Available"],
      ["Chalimidi", "Available", "Available"],
      ["Bellam Kudumulu", "12 pieces", "24 pieces"],
      ["Rava Laddu", "12 pieces", "24 pieces"],
      ["Kobbari Louz", "12 pieces", "24 pieces"],
      ["Atukula Payasam", "Available", "Available"],
      ["Pesara Boorelu", "12 pieces", "24 pieces"],
      ["Dry-Fruit Pootharekulu", "12 pieces", "24 pieces"],
      ["Bandar Laddu Bites", "24 pieces", "48 pieces"],
    ],
  },
];
