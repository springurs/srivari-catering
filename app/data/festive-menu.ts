// Transcribed from the supplied Golu Season Packages and
// Unique Tamil & Telugu Golu Specialties attachments.
export const festiveExtras = [
  {
    name: "Tiffin Package Upgrade",
    items: [
      "Add $49 — Mini Idli with Sambar, Ven Pongal / Katte Pongali, Uthappam or Pesarattu.",
      "Accompanied with sambar and chutney.",
    ],
  },
  {
    name: "Premium Package Upgrade",
    items: [
      "Small Premium — Add $49: Choose one premium snack and one premium sweet.",
      "Medium Premium — Add $89: Choose two premium snacks and one premium sweet.",
      "Grand Golu — Add $129: Choose two premium snacks, two premium sweets and one beverage.",
    ],
  },
  {
    name: "Individual Golu Boxes",
    items: [
      "Divine Mini Box — $7.99: Sundal / Guggillu + one sweet.",
      "Traditional Box — $10.99: Sundal + snack + sweet.",
      "Premium Tambulam Box — $14.99: Sundal + two snacks + two sweets.",
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
      ["Konda Kadalai Sundal / Black Channa Guggillu", "$28", "$42"],
      ["Vella Kadalai Sundal / White Channa Guggillu", "$28", "$42"],
      ["Pachai Payaru Sundal / Pesara Guggillu", "$28", "$42"],
      ["Karamani Sundal / Alasanda Guggillu", "$34", "$48"],
      ["Verkadalai Sundal / Verusenaga Guggillu", "$28", "$42"],
      ["Sweet Corn Guggillu with Coconut", "$34", "$48"],
      ["Mamidikaya Senagapappu Sundal", "$34", "$48"],
      ["Navadhanya Sundal", "$34", "$48"],
      ["Temple-Style Mixed Bean Guggillu", "$28", "$42"],
      ["Pomegranate Coconut Sundal", "$38", "$69"],
    ],
  },
  {
    name: "Traditional Rice Specialties",
    rows: [
      ["Temple Puliyodarai / Andhra Pulihora", "$40", "$80"],
      ["Kovil Sakkarai Pongal", "$50", "$90"],
      ["Ven Pongal / Katte Pongali", "$50", "$90"],
      ["Ellu Sadam / Sesame Rice", "$45", "$85"],
      ["Coconut Rice / Kobbari Annam", "$45", "$85"],
      ["Lemon Rice / Nimmakaya Pulihora", "$45", "$85"],
      ["Kadamba Sadam", "$55", "$105"],
      ["Kalkandu Sadam", "$55", "$105"],
      ["Daddojanam / Temple Curd Rice", "$48", "$88"],
      ["Raw Mango Pulihora", "$50", "$95"],
      ["Gongura Pulihora", "$55", "$100"],
      ["Sesame-Peanut Pulihora", "$50", "$95"],
      ["Karivepaku Annam / Curry Leaf Rice", "$50", "$95"],
      ["Chintapandu Atukulu / Tamarind Poha", "$40", "$85"],
    ],
  },
  {
    name: "Tamil Traditional Savories",
    rows: [
      ["Milagu Vadai", "12 — $28", "24 — $58"],
      ["Paruppu Vadai", "12 — $28", "24 — $58"],
      ["Ulundu Vadai", "12 — $28", "24 — $58"],
      ["Kara Kozhukattai", "24 — $38", "48 — $72"],
      ["Ammini Kozhukattai", "$45", "$85"],
      ["Pidi Kozhukattai", "12 — $40", "24 — $76"],
      ["Thavala Vadai", "12 — $36", "24 — $68"],
      ["Kuzhi Paniyaram", "30 — $45", "60 — $85"],
      ["Mini Adai with Aviyal", "12 — $60", "24 — $115"],
      ["Mor Kali Bites", "24 — $40", "48 — $76"],
      ["Aval Upma", "$35", "$60"],
      ["Lemon Sevai", "$35", "$60"],
      ["Ellu Podi Sevai", "$40", "$70"],
      ["Coconut Sevai", "$35", "$60"],
      ["Thattai and Ribbon Pakoda", "1 lb — $24", "2 lb — $40"],
    ],
  },
  {
    name: "Tamil Traditional Sweets",
    rows: [
      ["Nei Appam", "12 — $36", "24 — $68"],
      ["Sakkarai Pongal", "$55", "$100"],
      ["Paal Kozhukattai", "$55", "$105"],
      ["Sweet Pidi Kozhukattai", "12 — $40", "24 — $76"],
      ["Aval Puttu", "$48", "$90"],
      ["Adhirasam", "12 — $42", "24 — $80"],
      ["Kalkandu Pongal", "$60", "$112"],
      ["Coconut Poli", "12 — $48", "24 — $92"],
      ["Paruppu Poli", "12 — $48", "24 — $92"],
      ["Kasi Halwa", "$60", "$112"],
      ["Elaneer Payasam", "$65", "$120"],
    ],
  },
  {
    name: "Telugu Traditional Savories",
    rows: [
      ["Minapa Garelu", "12 — $28", "24 — $60"],
      ["Masala Garelu", "12 — $28", "24 — $64"],
      ["Pesara Punugulu", "30 — $42", "60 — $78"],
      ["Minapa Punugulu", "30 — $40", "60 — $75"],
      ["Pesarattu Rolls with Allam Chutney", "20 — $55", "40 — $105"],
      ["Dibba Rotti Bites", "24 — $48", "48 — $90"],
      ["Atukula Upma", "$35", "$60"],
      ["Karam Kudumulu", "24 — $40", "48 — $76"],
      ["Undrallu with Allam Chutney", "$45", "$85"],
      ["Chitti Garelu with Coconut Chutney", "24 — $36", "48 — $68"],
      ["Sakinalu", "1 lb — $24", "2 lb — $40"],
      ["Chekkalu", "1 lb — $24", "2 lb — $40"],
      ["Janthikalu", "1 lb — $24", "2 lb — $40"],
      ["Mirapakaya Bajji Bites", "24 — $45", "48 — $85"],
    ],
  },
  {
    name: "Telugu Traditional Sweets",
    rows: [
      ["Poornam Boorelu", "12 — $42", "24 — $80"],
      ["Bobbatlu", "12 — $48", "24 — $92"],
      ["Ariselu", "12 — $42", "24 — $80"],
      ["Sunnundalu", "12 — $36", "24 — $68"],
      ["Bellam Paramanannam", "$55", "$105"],
      ["Chalimidi", "$48", "$90"],
      ["Bellam Kudumulu", "12 — $40", "24 — $76"],
      ["Rava Laddu", "12 — $32", "24 — $60"],
      ["Kobbari Louz", "12 — $38", "24 — $72"],
      ["Atukula Payasam", "$52", "$98"],
      ["Pesara Boorelu", "12 — $45", "24 — $85"],
      ["Dry-Fruit Pootharekulu", "12 — $60", "24 — $115"],
      ["Bandar Laddu Bites", "24 — $42", "48 — $80"],
    ],
  },
];
