import { diwaliMenus } from "./diwali-menu";
import { ezCaterOrderingUrl } from "./ordering-partners";

export type CateringFaq = {
  id: string;
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
};

type FaqCategory = { id: string; title: string; items: CateringFaq[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "planning", title: "Planning your catering",
    items: [
      {
        id: "occasions", question: "What occasions does Srivari cater for?",
        answer: "Explore vegetarian menus for weddings, traditional gatherings, corporate events, tiffin and meal combos, Diwali celebrations, and live dosa catering. Share your event date, guest count, location, and menu preferences so our team can confirm availability and a suitable package.",
        links: [{ label: "Explore catering packages", href: "/#occasions" }],
      },
      {
        id: "location", question: "Where is Srivari Catering based?",
        answer: "Srivari is based at 3180 Santa Rita Rd, Pleasanton, CA 94566. For catering enquiries, call (408) 893-0438 or email srivaripleasanton@gmail.com. The restaurant phone number is (925) 201-3640. Confirm delivery availability for your event address with our team or through your chosen ordering channel.",
        links: [{ label: "Contact Srivari in Pleasanton", href: "/contact" }],
      },
      {
        id: "minimum-guests", question: "What is the minimum guest count for catering?",
        answer: "Wedding, traditional, and combo packages require at least 25 guests. Standard Live Dosa Catering starts at 30 guests. The Diwali Live Dosa Celebration has a separate minimum of 35 guests. Check the selected package for its minimum; ezCater orders follow the requirements displayed on ezCater.",
        links: [{ label: "Choose a catering package", href: "/#occasions" }],
      },
      {
        id: "request-quote", question: "How do I request a custom catering quote?",
        answer: "Choose a package, complete its menu selections, and enter your guest count and event details in the planner. Preview your menu request, then add your name, a phone number or email address, and a description before submitting. The request includes your package and selected dishes. Our team must confirm availability, arrangements, and the final quote; submitting the form does not confirm a booking.",
        links: [{ label: "Start planning your menu", href: "/#occasions" }, { label: "Send a general catering enquiry", href: "/contact" }],
      },
    ],
  },
  {
    id: "menus-and-trays", title: "Menus, signature dishes & trays",
    items: [
      {
        id: "cuisines", question: "Which vegetarian cuisines and office menus can I choose?",
        answer: "Our menus cover Tamil, Andhra, North Indian, and South Indian tiffin favourites. Traditional options include Namba Oru Sapadu, Andhra Inti Bhojanam, and Apna Ghar Ka Bhojan. Corporate options include Srivari Executive Feast and menu ideas with sliders, rice bowls, chaat cups, and meeting bites. Confirm your final menu and preparation requirements with our team.",
        links: [{ label: "Read about our cuisines", href: "/#about" }],
      },
      {
        id: "tray-orders", question: "Can I order individual catering trays instead of a package?",
        answer: "Yes. The À La Carte Trays section lists individual dishes across appetizers, curries, dal, rice, biryanis, pulaos, desserts, and other categories. Tray dishes show quarter, half, three-quarter, and full-tray options. These are separate from the per-guest packages. Confirm quantities, availability, and your final quote when enquiring.",
        links: [{ label: "Browse À La Carte Trays", href: "/#a-la-carte" }],
      },
      {
        id: "tray-servings", question: "How many people does each catering tray serve?",
        answer: "The tray menu does not assign a fixed guest count to each size. The quantity you need depends on the dish, the number of dishes, and whether it is a main course or an accompaniment. Share your guest count and full menu with our team for help choosing tray sizes.",
        links: [{ label: "Ask about tray quantities", href: "/contact" }],
      },
      {
        id: "signature-concepts", question: "What are Srivari Signature Trays?",
        answer: "Srivari Signature Trays is a collection of proposed Telugu-, Tamil-, and North Indian-inspired vegetarian dishes, including new curry concepts. The descriptions and tray prices are indicative ideas for kitchen review. Recipes, preparation, availability, and final pricing must be confirmed with our team before ordering.",
        links: [{ label: "Explore Signature Trays", href: "/#signature-trays" }],
      },
      {
        id: "piece-and-volume", question: "Are breads, sweets, and beverages priced by the tray?",
        answer: "Some items use piece, pack, or volume pricing instead of tray pricing. The menu labels bread packs, per-piece sweets, gallon beverages, and chutney containers separately. Use the unit shown beside each item; ask our team about items marked Enquire.",
        links: [{ label: "See tray and add-on pricing", href: "/#a-la-carte" }],
      },
    ],
  },
  {
    id: "dietary-requests", title: "Dietary & preparation requests",
    items: [
      {
        id: "jain-options", question: "Are Jain and no-onion, no-garlic catering options available?",
        answer: "Jain and no-onion, no-garlic options are available on request. Select your preparation preference in the catering planner and use Description to explain which dishes or how many guests need it. Our team will confirm the appropriate substitutions and preparation for your selected menu.",
        links: [{ label: "Discuss a dietary request", href: "/contact" }],
      },
      {
        id: "allergies", question: "How should I tell you about allergies or other dietary needs?",
        answer: "Include the specific ingredients to avoid and the number of affected guests in your enquiry. Our team needs to confirm ingredients and preparation before you order. A vegetarian menu or a Jain preparation request does not by itself establish that a dish is suitable for a particular allergy.",
        links: [{ label: "Contact the catering team", href: "/contact" }],
      },
    ],
  },
  {
    id: "live-and-diwali", title: "Live dosa & Diwali catering",
    items: [
      {
        id: "live-dosa", question: "What is included in standard Live Dosa Catering?",
        answer: "Standard Live Dosa Catering starts at 30 guests and includes unlimited freshly prepared dosas with additions such as ghee, podi, masala, paneer, and vegetables. Choose one vegetarian appetiser, one variety rice or biryani, one dessert, and one complimentary beverage from coffee, tea, chaas, rose milk, or lassi. Share your event date, time, and specific requirements for confirmation.",
        links: [{ label: "Explore live catering packages", href: "/#occasions" }],
      },
      {
        id: "diwali-packages", question: "Which Diwali catering packages are available?",
        answer: `${diwaliMenus.map((menu) => `${menu.name} is $${menu.pricePerPerson?.toFixed(2)} per person with a minimum of ${menu.minimumGuests} guests`).join(". ")}. Live Dosa Celebration includes a two-hour live service. Select one menu for the entire event. Delivery, tax, and additional services are extra; menu availability and any upgrades need confirmation.`,
        links: [{ label: "See Diwali menus and selections", href: "/#diwali" }],
      },
    ],
  },
  {
    id: "ezcater", title: "Ordering Srivari on ezCater",
    items: [
      {
        id: "order-ezcater", question: "Can I order Srivari catering through ezCater?",
        answer: "Yes. Use the Order on ezCater link to open Srivari’s listing for 3180 Santa Rita Rd, Pleasanton. Enter your event details, review the available menu and order requirements, and complete your order on ezCater. The ordering link opens an external website in a new tab.",
        links: [{ label: "Order Srivari on ezCater", href: ezCaterOrderingUrl }],
      },
      {
        id: "planner-to-ezcater", question: "Will my catering plan transfer automatically to ezCater?",
        answer: "No. The menu planner on this website creates a direct enquiry for the Srivari team. Its selections, guest count, and contact details are not transferred to ezCater. If you prefer to order on ezCater, build and submit your order there separately.",
        links: [{ label: "Request a custom menu directly", href: "/contact" }, { label: "Open Srivari on ezCater", href: ezCaterOrderingUrl }],
      },
      {
        id: "ezcater-pricing", question: "Are ezCater menus, prices, and delivery requirements the same as this website?",
        answer: "Review the menu, pricing, order minimums, delivery availability, fees, and timing shown on ezCater for your event. They may differ from this website’s packages, tray prices, or a custom quote. Use the details displayed in your chosen ordering channel when placing the order.",
        links: [{ label: "Check the current ezCater menu", href: ezCaterOrderingUrl }],
      },
      {
        id: "ezcater-order-help", question: "How do I get help with an order placed on ezCater?",
        answer: "Use your ezCater order confirmation and the help options available in your ezCater account to ask about that order, changes, or cancellation terms. For a direct enquiry submitted on this website, contact Srivari at (408) 893-0438 or srivaripleasanton@gmail.com. Sending a website enquiry does not change an ezCater order.",
        links: [{ label: "Contact Srivari", href: "/contact" }],
      },
    ],
  },
  {
    id: "service-and-delivery", title: "Service, equipment & delivery",
    items: [
      {
        id: "staff-and-cutlery", question: "Can I request service staff, plates, and cutlery?",
        answer: "The planner offers service staff and cutlery requests for applicable packages. These are priced on enquiry, so confirm the number of staff, guest count, and serving arrangements with our team. Live dosa packages use their own service arrangements and do not show the same staff and cutlery fields.",
        links: [{ label: "Discuss your event service", href: "/contact" }],
      },
      {
        id: "chafing-dishes", question: "Are chafing dishes and burners included?",
        answer: "The catering planner notes that chafing dishes and ladles are provided free. Burners are not supplied; customers need to buy their own. Confirm equipment needs and arrangements with our team for your selected package.",
        links: [{ label: "Ask about catering equipment", href: "/contact" }],
      },
      {
        id: "delivery-and-notice", question: "How do I confirm delivery and how far ahead should I order?",
        answer: "Share your event date, time, address, and guest count when enquiring so our team can confirm availability, delivery arrangements, and any charges. This website does not promise a fixed delivery radius or advance-order deadline. For ezCater orders, check the delivery options and lead time shown for your event on ezCater.",
        links: [{ label: "Check your event availability", href: "/contact" }],
      },
    ],
  },
];

export const cateringFaqs = faqCategories.flatMap((category) => category.items);
export const homeFaqs = cateringFaqs.filter((faq) => ["minimum-guests", "tray-orders", "jain-options", "order-ezcater"].includes(faq.id));
