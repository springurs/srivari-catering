import { calculateTrayPrices } from "./a-la-carte-menu";

export type SignatureRegion = "Telugu" | "Tamil" | "North Indian";

type SignatureTrayConcept = {
  id: string;
  region: SignatureRegion;
  name: string;
  course: string;
  description: string;
  signature: string;
  service: string;
  pairWith: string;
  ingredients: string[];
  quarterPrice: number;
};

// Original menu concepts for the owner's kitchen review, not established restaurant offerings.
// Quarter prices are draft estimates; all four tray sizes use the owner's existing pricing rule.
const concepts: SignatureTrayConcept[] = [
  {
    id: "gongura-corn-pesarattu-rolls", region: "Telugu", name: "Gongura Corn Pesarattu Rolls", course: "Small plates",
    description: "Green-gram pesarattu wrapped around smoky corn and crumbled paneer, finished with a tangy gongura relish and toasted sesame.",
    signature: "The sour lift of gongura meets a smoky filling inside a familiar Telugu tiffin.",
    service: "Cut into sharing portions, with the gongura relish packed separately for finishing at service.",
    pairWith: "Jeera Rice or a vegetable pulao", ingredients: ["Pesarattu", "Smoked corn", "Gongura"], quarterPrice: 45,
  },
  {
    id: "ulavacharu-jackfruit-chukka", region: "Telugu", name: "Ulavacharu Jackfruit Chukka", course: "Roasted main",
    description: "Tender green jackfruit roasted with black pepper and shallots, then glazed in a rich horse-gram reduction with a curry-leaf cashew finish.",
    signature: "Ulavacharu becomes a glossy roast glaze, rather than a soup or biryani base.",
    service: "Serve as a dry-style main, with the toasted cashew and curry-leaf garnish packed separately.",
    pairWith: "Steamed Rice and Mango Dal", ingredients: ["Green jackfruit", "Horse gram", "Black pepper"], quarterPrice: 50,
  },
  {
    id: "avakaya-millet-sesame-brinjal", region: "Telugu", name: "Avakaya Millet & Sesame Brinjal Dum", course: "Rice & grains",
    description: "Little millet layered with avakaya-spiced vegetables and sesame-crusted baby brinjal, finished with a fragrant curry-leaf tempering.",
    signature: "Pickled-mango warmth, a millet base, and sesame brinjal create three distinct textures.",
    service: "A layered sharing tray, with the brinjal arranged on top and pickle relish served alongside.",
    pairWith: "Curd Rice or Raita", ingredients: ["Little millet", "Avakaya", "Baby brinjal"], quarterPrice: 50,
  },
  {
    id: "gongura-pumpkin-chickpea-curry", region: "Telugu", name: "Gongura Pumpkin & Chickpea Curry", course: "Curry",
    description: "Roasted pumpkin and chickpeas simmered in a tangy gongura gravy, rounded with toasted sesame and a gentle red-chilli tempering.",
    signature: "Sweet roasted pumpkin balances the sharp gongura, with chickpeas adding a hearty bite.",
    service: "A saucy sharing tray, with toasted sesame and the curry-leaf tempering packed separately for finishing.",
    pairWith: "Steamed Rice or Pulka Roti", ingredients: ["Roasted pumpkin", "Chickpeas", "Gongura & sesame"], quarterPrice: 45,
  },
  {
    id: "mamidikaya-paneer-cashew-curry", region: "Telugu", name: "Mamidikaya Paneer & Cashew Curry", course: "Curry",
    description: "Seared paneer and whole cashews in a raw-mango and coconut gravy, finished with mustard seeds, green chilli, and curry leaves.",
    signature: "Raw mango gives a bright, tart edge to a creamy paneer curry without a tomato base.",
    service: "Paneer and cashews travel in the mango gravy, with the fresh tempering added just before serving.",
    pairWith: "Jeera Rice or Chapati", ingredients: ["Raw mango", "Seared paneer", "Cashew & coconut"], quarterPrice: 55,
  },
  {
    id: "karuveppilai-paneer-paniyaram", region: "Tamil", name: "Karuveppilai Paneer–Paniyaram Roast", course: "Small plates",
    description: "Golden kuzhi paniyaram and paneer tossed in a curry-leaf pepper masala, with toasted coconut and a bright tomato chutney on the side.",
    signature: "Soft paniyaram and roasted paneer share a dry, peppery curry-leaf coating.",
    service: "A warm sharing tray with the tomato chutney separate, ready to spoon over individual portions.",
    pairWith: "Lemon Rice or Sambar Sadam", ingredients: ["Kuzhi paniyaram", "Paneer", "Curry leaves"], quarterPrice: 45,
  },
  {
    id: "vathal-kuzhambu-potatoes", region: "Tamil", name: "Vathal Kuzhambu Stuffed Potatoes", course: "Roasted main",
    description: "Baby potatoes filled with a coconut-and-lentil crumble, roasted and glazed in a tangy tamarind vathal kuzhambu reduction.",
    signature: "A familiar Tamil kuzhambu becomes a glaze around a textured, filled potato roast.",
    service: "Arrange the stuffed potatoes in a shallow tray, with extra kuzhambu and the finishing crumble separate.",
    pairWith: "Steamed Rice and Curd Rice", ingredients: ["Baby potatoes", "Tamarind", "Coconut & lentils"], quarterPrice: 50,
  },
  {
    id: "pongal-gotsu-layered-feast", region: "Tamil", name: "Pongal–Gotsu Layered Feast", course: "Rice & grains",
    description: "Comforting rice-and-moong pongal layered with smoky kathirikai gotsu, finished with a black-pepper, cashew, and curry-leaf crown.",
    signature: "The classic pongal-and-gotsu pairing is reworked into a layered, scoop-and-share tray.",
    service: "The pongal and eggplant layers are assembled for sharing; the pepper-cashew finish is added at service.",
    pairWith: "Medhu Vada and Coconut Chutney", ingredients: ["Rice & moong", "Eggplant gotsu", "Pepper cashews"], quarterPrice: 45,
  },
  {
    id: "cauliflower-mochai-kurma", region: "Tamil", name: "Roasted Cauliflower & Mochai Kurma", course: "Curry",
    description: "Roasted cauliflower and tender field beans folded into a coconut, fennel, and poppy-seed kurma with a warm green-chilli finish.",
    signature: "Roasting the cauliflower adds depth and texture to a silky coconut kurma with mochai beans.",
    service: "Serve as a generous gravy tray, with roasted cauliflower folded in near service to keep its texture.",
    pairWith: "Parotta or Coconut Rice", ingredients: ["Roasted cauliflower", "Mochai beans", "Coconut & fennel"], quarterPrice: 45,
  },
  {
    id: "milagu-mushroom-peas-curry", region: "Tamil", name: "Milagu Mushroom & Green Peas Curry", course: "Curry",
    description: "Seared mushrooms and green peas in a dark roasted-pepper and coriander gravy, softened with coconut milk and finished with crisp curry leaves.",
    signature: "A fresh-ground pepper masala and deeply seared mushrooms make a rich, earthy curry.",
    service: "The mushroom-peas gravy is packed ready to reheat, with crisp curry leaves supplied separately.",
    pairWith: "Kal Dosa or Steamed Rice", ingredients: ["Seared mushrooms", "Green peas", "Black pepper"], quarterPrice: 50,
  },
  {
    id: "anardana-beetroot-paneer-kofta", region: "North Indian", name: "Anardana Beetroot–Paneer Kofta", course: "Curry",
    description: "Beetroot and paneer kofta seasoned with dried pomegranate and fennel, served with a gently spiced charred-tomato cashew gravy.",
    signature: "Anardana brings a tart contrast to sweet beetroot, paneer, and a smoky tomato sauce.",
    service: "Kofta and gravy are packed separately so they can be combined just before serving.",
    pairWith: "Pulka Roti or Jeera Rice", ingredients: ["Beetroot & paneer", "Anardana", "Charred tomato"], quarterPrice: 55,
  },
  {
    id: "achari-makhana-potato-dum", region: "North Indian", name: "Achari Makhana & Baby Potato Dum", course: "Curry",
    description: "Roasted makhana and baby potatoes in a yogurt-based dum gravy scented with mustard seed, fennel, and gentle pickling spices.",
    signature: "A creamy achari curry pairs soft potatoes with a separate roasted-makhana finish.",
    service: "The potato gravy travels in the tray, with roasted makhana packed separately to fold in at service.",
    pairWith: "Butter Naan or Peas Pulao", ingredients: ["Makhana", "Baby potatoes", "Achari spices"], quarterPrice: 50,
  },
  {
    id: "palak-stuffed-paneer-kesar-curry", region: "North Indian", name: "Palak-Stuffed Paneer in Kesar Gravy", course: "Curry",
    description: "Paneer pockets filled with spinach and toasted almonds, served in a delicate saffron-cashew gravy with cardamom and kasuri methi.",
    signature: "Spinach becomes the filling inside the paneer, while saffron brings a fragrant finish to the sauce.",
    service: "Stuffed paneer and gravy are packed separately, ready to combine gently before serving.",
    pairWith: "Butter Naan or Saffron Rice", ingredients: ["Spinach & paneer", "Toasted almonds", "Saffron cashew gravy"], quarterPrice: 55,
  },
  {
    id: "smoked-pepper-mushroom-masala", region: "North Indian", name: "Smoked Pepper & Mushroom Masala", course: "Curry",
    description: "Roasted bell peppers blended into a tomato gravy with browned mushrooms, crushed coriander, and a creamy kasuri-methi finish.",
    signature: "Charred bell peppers form the sauce itself, giving the mushroom curry a sweet, smoky depth.",
    service: "A rich gravy tray, with a roasted-pepper garnish supplied separately for finishing at service.",
    pairWith: "Garlic Naan or Peas Pulao", ingredients: ["Roasted bell peppers", "Browned mushrooms", "Kasuri methi"], quarterPrice: 50,
  },
  {
    id: "dal-makhani-saffron-rice", region: "North Indian", name: "Dal Makhani–Saffron Rice Layers", course: "Rice & grains",
    description: "Creamy black-lentil dal layered with saffron basmati and crowned with roasted cauliflower tikka, kasuri methi, and a buttery finish.",
    signature: "Dal, aromatic rice, and cauliflower tikka become one layered centrepiece.",
    service: "Spoon through the rice and dal together, with the cauliflower arranged over the top for sharing.",
    pairWith: "Raita and a side of Chana Masala", ingredients: ["Black lentils", "Saffron basmati", "Cauliflower tikka"], quarterPrice: 50,
  },
];

export const signatureRegions: SignatureRegion[] = ["Telugu", "Tamil", "North Indian"];
export const signatureTrays = concepts.map((concept) => ({ ...concept, prices: calculateTrayPrices(concept.quarterPrice) }));
