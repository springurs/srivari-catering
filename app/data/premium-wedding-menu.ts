import type { CateringMenu, MenuSelection } from "./catering-menu";

// Menu choices and service inclusions transcribed from pages 2–13 of
// Srivari_Luxury_Andhra_North_Indian_Wedding_Catering_Proposal (1).pdf.
// The proposal's framework allows one choice across either regional list
// for each course, two appetisers, and one bread/specialty live station.
// The existing business-wide 25-person wedding minimum remains in effect.
const weddingSelections: MenuSelection[] = [
  {
    "name": "Welcome drink",
    "section": "Welcome & live stations",
    "count": 1,
    "replaces": "Choose 1 welcome drink",
    "options": [
      "Watermelon Sabja Cooler",
      "Pineapple Ginger Punch",
      "Guava Chilli Cooler",
      "Pomegranate Lime Punch",
      "Muskmelon Milkshake",
      "Gulkand Paan Mojito",
      "Kesar Pista Milk",
      "Tender Coconut Sabja Cooler",
      "Mango Chilli Welcome Shot",
      "Jaggery Ginger Lemon Fizz",
      "Nannari Basil Seed Cooler",
      "Bellam Nimmakaya Paniyam",
      "Mamidikaya Panna",
      "Spiced Majjiga",
      "Rose Badam Milk",
      "Badam Pista Thandai",
      "Shahi Rose Badam Milk",
      "Banarasi Paan Cooler",
      "Kesar Aam Panna",
      "Anar-Rose Cooler",
      "Khus Sabja Sharbat",
      "Pineapple Kesar Punch",
      "Kesar Kharbuja Shake"
    ]
  },
  {
    "name": "Live bread or specialty station",
    "section": "Welcome & live stations",
    "count": 1,
    "replaces": "Choose 1 live bread or specialty station",
    "options": [
      "Mini Dosa Station",
      "Parotta Station",
      "Poori & Chole Station",
      "Kuzhi Paniyaram Station",
      "Appam Station",
      "Fresh Naan Station",
      "Bhatura Station",
      "Pani Puri Station",
      "Paneer Taco Station"
    ]
  },
  {
    "name": "Live dessert or beverage station",
    "section": "Welcome & live stations",
    "count": 1,
    "replaces": "Choose 1 live dessert or beverage station",
    "options": [
      "Jalebi Station",
      "Masala Milk Station",
      "Jigarthanda Station",
      "Kulfi Falooda Station"
    ]
  },
  {
    "name": "Appetisers",
    "section": "Appetisers & accompaniments",
    "count": 2,
    "replaces": "Choose 2 appetisers",
    "options": [
      "Punugulu with Ginger Chutney",
      "Guntur Mirapakaya Bajji",
      "Mini Garelu",
      "Pesarattu Rolls",
      "Aratikaya Bajji",
      "Gobi Vepudu",
      "Curry Leaf Paneer Fry",
      "Baby Corn Karam Vepudu",
      "Podi Idli Bites",
      "Bobbarlu Vada",
      "Mini Masala Vada - Crispy chana dal and herb fritters",
      "Mini Ghee Podi Idli - Tossed with aromatic podi and ghee",
      "Andhra Chilli Paneer",
      "Guntur Gobi Fry",
      "Firecracker Baby Corn",
      "Pepper Mushroom Fry",
      "Chettinad Mushroom Varuval",
      "Coconut-Crusted Paneer Fingers",
      "Mini Podi Idli Skewers",
      "Paneer Ghee Roast Tartlets",
      "Dosa Cigar Rolls with Potato Masala",
      "Uttapam Canapes with Tomato Chutney",
      "Mini Vegetable Kothu Parotta Cups",
      "Mysore Bonda with Coconut Chutney",
      "Avakkai Arancini"
    ]
  },
  {
    "name": "Podi with ghee",
    "section": "Appetisers & accompaniments",
    "count": 1,
    "replaces": "Choose 1 podi with ghee",
    "options": [
      "Kandi Podi with Pure Ghee",
      "Karivepaku Podi",
      "Nuvvula Podi"
    ]
  },
  {
    "name": "Pickle or pachadi",
    "section": "Appetisers & accompaniments",
    "count": 1,
    "replaces": "Choose 1 pickle or pachadi",
    "options": [
      "Avakaya",
      "Gongura Pachadi",
      "Dosakaya Pachadi",
      "Tomato Pachadi",
      "Beerakaya Roti Pachadi"
    ]
  },
  {
    "name": "Bread",
    "section": "Breads & rice",
    "count": 1,
    "replaces": "Choose 1 bread",
    "options": [
      "Chapati",
      "Phulka Roti",
      "Pesarattu",
      "Minapa Rotti",
      "Butter Naan",
      "Laccha Paratha",
      "Tandoori Roti",
      "Amritsari Kulcha"
    ]
  },
  {
    "name": "Variety rice, pulao or biryani",
    "section": "Breads & rice",
    "count": 1,
    "replaces": "Choose 1 variety rice, pulao or biryani",
    "options": [
      "Jackfruit Biryani",
      "Paneer Dum Biryani",
      "Navratan Pulao",
      "Cashew Peas Pulao",
      "Coconut Milk Pulao",
      "Saffron Vegetable Pulao",
      "Puliyodarai / Tamarind Rice",
      "Lemon Rice",
      "Coconut Rice",
      "Curd Rice",
      "Tomato Rice",
      "Mango Rice",
      "Sesame Rice",
      "Curry Leaf Rice",
      "Mint Rice",
      "Coriander Rice",
      "Shahi Vegetable Dum Biryani",
      "Lucknowi Vegetable Biryani",
      "Mughlai Vegetable Biryani",
      "Paneer Tikka Biryani",
      "Kaju Makhana Biryani",
      "Navratan Biryani",
      "Kashmiri Pulao",
      "Subz Kofta Biryani"
    ]
  },
  {
    "name": "Plain rice",
    "section": "Breads & rice",
    "count": 1,
    "replaces": "Choose 1 plain rice",
    "options": [
      "Steamed Rice",
      "Basmati Plain Rice",
      "Jeera Rice"
    ]
  },
  {
    "name": "Sambar or kadhi",
    "section": "Sambar & rasam",
    "count": 1,
    "replaces": "Choose 1 sambar or kadhi",
    "options": [
      "Mamidikaya Sambar - Raw mango sambar",
      "Munakkaya Sambar - Drumstick sambar",
      "Bendakaya Sambar - Okra sambar",
      "Vankaya Sambar - Eggplant sambar",
      "Sorakaya Sambar - Bottle gourd sambar",
      "Beerakaya Sambar - Ridge gourd sambar",
      "Dosakaya Sambar - Yellow cucumber sambar",
      "Mixed Vegetable Sambar - Traditional wedding favorite",
      "Kothimeera Sambar - Coriander-flavored sambar",
      "Ullipaya Sambar - Pearl onion sambar",
      "Punjabi Kadhi Pakora",
      "Gujarati Kadhi",
      "Rajasthani Gatte Ki Kadhi",
      "Sindhi Kadhi",
      "Aloo Rasedar",
      "Subz Handi",
      "Kashmiri Dum Aloo",
      "Gatte Ki Sabzi"
    ]
  },
  {
    "name": "Rasam, charu or shorba",
    "section": "Sambar & rasam",
    "count": 1,
    "replaces": "Choose 1 rasam, charu or shorba",
    "options": [
      "Miriyala Charu - Black pepper rasam",
      "Jeelakarra Miriyala Charu - Cumin and pepper rasam",
      "Tomato Charu - Classic tomato rasam",
      "Kothimeera Charu - Fresh coriander rasam",
      "Nimmakaya Charu - Lemon rasam",
      "Mamidikaya Charu - Raw mango rasam",
      "Chintapandu Charu - Traditional tamarind rasam",
      "Pachi Pulusu - Uncooked tamarind, onion and green chilli broth",
      "Ulavacharu - Rich horse gram rasam, ideal for premium weddings",
      "Pappu Charu - Mild lentil-based Telugu-style rasam",
      "Munakkaya Charu - Drumstick rasam",
      "Vellulli Charu - Garlic rasam",
      "Inguva Charu - Asafoetida-flavored rasam",
      "Karivepaku Charu - Curry leaf rasam",
      "Pineapple Charu - Sweet, tangy wedding-style rasam",
      "Tamatar Dhania Shorba",
      "Dal Shorba",
      "Jeera Ajwain Shorba",
      "Lemon Coriander Shorba",
      "Subz Shorba",
      "Makai Shorba",
      "Badam Shorba"
    ]
  },
  {
    "name": "Pappu or dal",
    "section": "Lentils & curries",
    "count": 1,
    "replaces": "Choose 1 pappu or dal",
    "options": [
      "Mamidikaya Pappu",
      "Gongura Pappu",
      "Palakura Pappu",
      "Tomato Pappu",
      "Dosakaya Pappu",
      "Thotakura Pappu",
      "Mudda Pappu with Ghee",
      "Dal Makhani",
      "Panchmel Dal",
      "Lasooni Dal Palak",
      "Maa Chole Ki Dal",
      "Dal Panchratna",
      "Amritsari Dal",
      "Dal Mughlai"
    ]
  },
  {
    "name": "Dry curry or vepudu",
    "section": "Lentils & curries",
    "count": 1,
    "replaces": "Choose 1 dry curry or vepudu",
    "options": [
      "Bendakaya Vepudu",
      "Aratikaya Vepudu",
      "Dondakaya Vepudu",
      "Bangaladumpa Karam Vepudu",
      "Chamagadda Vepudu",
      "Vankaya Kothimeera Karam",
      "Beans Kobbari Kura",
      "Cabbage Senagapappu Kura",
      "Panasa Pottu Kura",
      "Gutti Vankaya Kura",
      "Dum Aloo Banarasi",
      "Aloo Gobhi Adraki",
      "Bhindi Do Pyaza",
      "Bharwa Bhindi",
      "Methi Malai Matar Dry",
      "Amritsari Gobhi",
      "Tawa Paneer Khurchan",
      "Kaju Makhana Masala Dry",
      "Shahi Navratan Dry",
      "Tandoori Mixed Vegetables",
      "Subz Miloni Dry",
      "Baby Corn Mushroom Pepper Fry"
    ]
  },
  {
    "name": "Gravy curry",
    "section": "Lentils & curries",
    "count": 1,
    "replaces": "Choose 1 gravy curry",
    "options": [
      "Andhra Gutti Vankaya",
      "Sorakaya Senagapappu Kura",
      "Beerakaya Senagapappu Kura",
      "Tomato Munakkaya Kura",
      "Kaju Paneer Kura",
      "Mushroom Karam Kura",
      "Mixed Vegetable Kurma",
      "Paneer Lababdar",
      "Veg Jalfrezi",
      "Dal Makhani",
      "Chana Masala",
      "Malai Kofta",
      "Navratan Korma",
      "Khoya Matar",
      "Mushroom Matar Masala",
      "Veg Kofta Curry",
      "Dum Aloo Kashmiri",
      "Shahi Paneer",
      "Paneer Butter Masala",
      "Kadai Paneer",
      "Paneer Pasanda",
      "Methi Malai Paneer"
    ]
  },
  {
    "name": "Pulusu or specialty curry",
    "section": "Lentils & curries",
    "count": 1,
    "replaces": "Choose 1 pulusu or specialty curry",
    "options": [
      "Mukkala Pulusu - Mixed vegetables in tamarind-jaggery gravy",
      "Majjiga Pulusu - Vegetables simmered in seasoned buttermilk gravy",
      "Poosanikaya Majjiga Pulusu - Ash gourd buttermilk pulusu",
      "Bendakaya Majjiga Pulusu - Okra buttermilk pulusu",
      "Gummadikaya Pulusu - Pumpkin with a mild sweet-and-sour flavor",
      "Anapakaya Senagapappu Pulusu - Bottle gourd with chana dal",
      "Munakkaya Tomato Pulusu - Drumstick and tomato gravy",
      "Panasapottu Pulusu - Tender jackfruit pulusu",
      "Gatte Ki Sabzi",
      "Govind Gatta Curry",
      "Kashmiri Dum Aloo",
      "Makhana Matar Curry",
      "Subz Kofta Curry",
      "Achari Mushroom Masala"
    ]
  },
  {
    "name": "Savoury side",
    "section": "Traditional sides",
    "count": 1,
    "replaces": "Choose 1 savoury side",
    "options": [
      "Garelu",
      "Dahi Bhalla",
      "Moong Dal Kachori"
    ]
  },
  {
    "name": "Papad",
    "section": "Traditional sides",
    "count": 1,
    "replaces": "Choose 1 papad",
    "options": [
      "Appadam",
      "Roasted Papad",
      "Fried Papad"
    ]
  },
  {
    "name": "Chilli side",
    "section": "Traditional sides",
    "count": 1,
    "replaces": "Choose 1 chilli side",
    "options": [
      "Challa Mirapakayalu",
      "Bharwa Mirchi"
    ]
  },
  {
    "name": "Curd",
    "section": "Traditional sides",
    "count": 1,
    "replaces": "Choose 1 curd",
    "options": [
      "Perugu",
      "Plain Dahi"
    ]
  },
  {
    "name": "Boondi accompaniment",
    "section": "Traditional sides",
    "count": 1,
    "replaces": "Choose 1 boondi accompaniment",
    "options": [
      "Boondi Perugu Pachadi",
      "Boondi Raita"
    ]
  },
  {
    "name": "Cucumber accompaniment",
    "section": "Traditional sides",
    "count": 1,
    "replaces": "Choose 1 cucumber accompaniment",
    "options": [
      "Cucumber Perugu Pachadi",
      "Kheera Raita"
    ]
  },
  {
    "name": "Dessert",
    "section": "Dessert",
    "count": 1,
    "replaces": "Choose 1 dessert",
    "options": [
      "Kaju Katli",
      "Coconut Burfi",
      "Tender Coconut Kheer",
      "Tender Coconut Rasmalai",
      "Rose Milk Tres Leches",
      "Filter Coffee Tiramisu",
      "Filter Coffee Mousse",
      "Mysore Pak Cheesecake",
      "Jangiri Rabdi Cups",
      "Gulab Jamun Cheesecake Cups",
      "Payasam Panna Cotta",
      "Poornam Boorelu",
      "Bobbatlu with Ghee",
      "Ariselu",
      "Kakinada Kaja",
      "Madatha Kaja",
      "Sunnundalu",
      "Bellam Paramannam",
      "Semiya Payasam",
      "Palathalikalu",
      "Rava Kesari",
      "Pineapple Kesari",
      "Double Ka Meetha",
      "Qubani Ka Meetha",
      "Rasmalai Cheesecake Cups",
      "Motichoor Cheesecake",
      "Jalebi Rabdi Cups",
      "Paan Tiramisu",
      "Thandai Panna Cotta",
      "Kesar-Pistachio Mousse",
      "Gulab Jamun Trifle",
      "Shahi Tukda Tres Leches",
      "Angoori Rasmalai",
      "Malpua with Rabdi",
      "Motichoor Ladoo",
      "Kesar Phirni",
      "Shahi Tukda",
      "Mawa Gujiya",
      "Paan Mousse Cups"
    ]
  }
];

const weddingCourses: CateringMenu["courses"] = [
  {
    "name": "Welcome & live stations",
    "dishes": [
      "Choose 1 welcome drink",
      "Choose 1 live bread or specialty station",
      "Choose 1 live dessert or beverage station"
    ]
  },
  {
    "name": "Appetisers & accompaniments",
    "dishes": [
      "Choose 2 appetisers",
      "Choose 1 podi with ghee",
      "Choose 1 pickle or pachadi"
    ]
  },
  {
    "name": "Breads & rice",
    "dishes": [
      "Choose 1 bread",
      "Choose 1 variety rice, pulao or biryani",
      "Choose 1 plain rice"
    ]
  },
  {
    "name": "Sambar & rasam",
    "dishes": [
      "Choose 1 sambar or kadhi",
      "Choose 1 rasam, charu or shorba"
    ]
  },
  {
    "name": "Lentils & curries",
    "dishes": [
      "Choose 1 pappu or dal",
      "Choose 1 dry curry or vepudu",
      "Choose 1 gravy curry",
      "Choose 1 pulusu or specialty curry"
    ]
  },
  {
    "name": "Traditional sides",
    "dishes": [
      "Choose 1 savoury side",
      "Choose 1 papad",
      "Choose 1 chilli side",
      "Choose 1 curd",
      "Choose 1 boondi accompaniment",
      "Choose 1 cucumber accompaniment",
      "Vadiyalu"
    ]
  },
  {
    "name": "Dessert",
    "dishes": [
      "Choose 1 dessert"
    ]
  }
];

const planningNotes = [
  "Final menu, staffing, and service logistics are confirmed after reviewing guest count, venue layout, access requirements, and the event schedule.",
  "Live-counter placement, power, ventilation, access, and operating times will be coordinated with the venue.",
  "Jain-friendly, vegan, no-onion/no-garlic, and mild-spice requests can be discussed during final menu planning; dishes may be adjusted for ingredient compatibility and service format.",
];

export const premiumWeddingMenus: CateringMenu[] = [
  {
    name: "Traditional Banana Leaf Full Service",
    image: "/images/occasion-weddings.webp",
    intro: "A premium Andhra-style wedding feast served course by course on fresh banana leaves, with your choice of Andhra and North Indian dishes, welcome drinks, live stations, and desserts.",
    minimumGuests: 25,
    courses: weddingCourses,
    selections: weddingSelections,
    includedService: {
      style: "Banana leaf dining",
      staffing: "Approximately four to five professionally dressed service staff; final staffing depends on guest count and venue layout.",
      inclusions: [
        "Food preparation and delivery to the venue",
        "Fresh banana leaves and traditional dining presentation",
        "Dining and food-service-area setup",
        "Course-by-course table-side serving and guest assistance",
        "Continuous food replenishment and coordinated refill flow",
        "Professional service team and on-site coordination",
        "Service-area clearing after meal service",
      ],
      planningNotes,
    },
  },
  {
    name: "Premium Wedding Buffet",
    image: "/images/occasion-weddings.webp",
    intro: "An elegant Andhra and North Indian wedding buffet with customizable vegetarian courses, live stations, welcome drinks, and desserts. Delivery, buffet setup, attendants, and continuous refilling are included.",
    minimumGuests: 25,
    courses: weddingCourses,
    selections: weddingSelections,
    includedService: {
      style: "Premium buffet",
      staffing: "Buffet attendants included; staffing is finalized by guest count, venue layout, and the number of serving lines and counters.",
      inclusions: [
        "Food preparation and delivery to the venue",
        "Professional buffet setup, serving equipment, and presentation",
        "Buffet attendants to assist guests and manage serving flow",
        "Continuous counter monitoring, refilling, and presentation management",
        "Hot-food holding and live-station readiness",
        "Service-area clearing after meal service",
      ],
      planningNotes,
    },
  },
];
