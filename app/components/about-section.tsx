import Image from "next/image";
import Link from "next/link";
import { Icon } from "./catering-icons";

const cuisines = [
  {
    title: "Tamil vegetarian traditions",
    description: "Namba Oru Sapadu brings together sambar, rasam, kootu or aviyal, vathal kulambu or mor kuzhambu, and vegetable poriyals. Masal vadai, paruppu podi with ghee, appalam, and a sweet finish of kesari or payasam complete a meal built around familiar Tamil flavours.",
  },
  {
    title: "Andhra home-style flavours",
    description: "Andhra Inti Bhojanam celebrates pappu, roti pachadi, kandi podi with ghee, and steamed rice. Explore gutti vankaya kura, vegetable vepudu, dosakaya or majjiga pulusu, and avakaya pickle, with garelu or guggillu to start and payasam to finish.",
  },
  {
    title: "North Indian favourites",
    description: "Apna Ghar Ka Bhojan pairs roti or naan with paneer curry, dal, pulao, and basmati rice. Rajma or chana masala, kadhi, vegetable sabzis, mint-coriander chutney, and raita bring variety to the thali, followed by gulab jamun, gajar halwa, or kheer from the menu’s selections.",
  },
  {
    title: "South Indian tiffin",
    description: "Our Quick Fill, Jumbo, and Wedding Style Tiffin menus offer combinations of thatte or mini idly, medhu vada, paniyaram, pongal, upma, and poori with aloo masala. Larger spreads include favourites such as uthappam, idiyappam with coconut milk, and filter coffee, accompanied by sambar and chutneys.",
  },
  {
    title: "Festive Tamil & Telugu specialties",
    description: "For Navaratri Golu and pooja gatherings, explore panakam, sundal or guggillu, temple puliyodarai or Andhra pulihora, traditional savouries, and sweets. Our festive selection includes Tamil and Telugu specialties such as kozhukattai, garelu, paruppu poli, bobbatlu, and poornam boorelu, with packages for different gathering sizes.",
  },
  {
    title: "Modern menus for the office",
    description: "Explore Indian rice or millet bowls, paneer tikka and beetroot-aloo sliders, chaat cups, and meeting bites such as podi idly skewers and mini uttapam tacos. Srivari Power Lunch, The Boardroom Feast, and The Meeting Break offer menu ideas to discuss for team lunches, meetings, and workplace celebrations.",
  },
];

export function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-intro">
        <Image className="about-photo" src="/images/about-thali.jpg" alt="A vegetarian thali with rice, chapati, appalam, curries, and accompaniments served in stainless steel bowls" width={1436} height={1600} sizes="(max-width: 760px) 100vw, 40vw" />
        <div className="about-copy">
          <p className="eyebrow">SRIVARI · PURE INDIAN VEGETARIAN</p>
          <h2 id="about-title">About Us</h2>
          <p className="about-lead">Regional flavours. A shared love of good food.</p>
          <p>Based in Pleasanton, Srivari brings together Tamil, Andhra, and North Indian vegetarian favourites for the occasions that bring people together. Our menus range from traditional thali meals and South Indian tiffin to wedding feasts, festive specialties, and contemporary ideas for corporate gatherings.</p>
          <p>Choose a regional spread or explore Srivari Signature Veg Feast, where starter, curry, and dessert selections let you bring different favourites into one menu. Each package lists its dishes so you can find a combination that suits your guests and your celebration.</p>
        </div>
      </div>
      <div className="about-cuisines" aria-label="Our cuisines and catering specialties">
        {cuisines.map((cuisine) => (
          <article className="about-cuisine" key={cuisine.title}>
            <h3>{cuisine.title}</h3>
            <p>{cuisine.description}</p>
          </article>
        ))}
      </div>
      <div className="about-menu-note">
        <div>
          <h3>A menu that suits your gathering</h3>
          <p>Jain and no-onion, no-garlic options are available on request across all our catering menus, from traditional thalis and tiffin combos to weddings, office catering, festive spreads, and live dosas. Select your preferences in the catering planner and tell us which dishes or how many guests need special preparation in your enquiry.</p>
        </div>
        <Link className="button" href="/contact">Discuss Your Menu <Icon name="arrow" /></Link>
      </div>
    </section>
  );
}
