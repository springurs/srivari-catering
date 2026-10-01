"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon, type IconName } from "./catering-icons";

const menus = [
  { name: "The traditional feast", note: "A banana-leaf celebration", intro: "A generous spread of comforting classics, with all the little accompaniments that make a South Indian meal special.", courses: [{ name: "To begin", dishes: "Medu vada · Coconut chutney · Fresh pickle" }, { name: "The main occasion", dishes: "Steamed rice · Sambar · Rasam · Vegetable poriyal · Kootu" }, { name: "A happy ending", dishes: "Payasam · Curd rice · Crisp appalam" }] },
  { name: "Breakfast favourites", note: "A delicious start to the day", intro: "Soft, crisp, savoury, and satisfying. A morning menu that brings familiar favourites together around one table.", courses: [{ name: "Fresh from the kitchen", dishes: "Soft idli · Medu vada · Ven pongal" }, { name: "On the side", dishes: "Coconut chutney · Tomato chutney · Sambar" }, { name: "Something sweet", dishes: "Kesari · Filter coffee" }] },
  { name: "The festive table", note: "For a little extra celebration", intro: "A colourful vegetarian spread for joyful gatherings, pairing South Indian favourites with dishes made for sharing.", courses: [{ name: "A warm welcome", dishes: "Vegetable cutlet · Masala vada · Mint chutney" }, { name: "A festive spread", dishes: "Vegetable biryani · Raita · Lemon rice · Potato roast" }, { name: "The sweet finish", dishes: "Gulab jamun · Payasam" }] },
];

const occasions: { name: string; formValue: string; description: string; icon: IconName; menuIndices: number[] }[] = [
  { name: "Weddings", formValue: "Wedding or reception", description: "Make your special day even more memorable with a beautiful feast.", icon: "rings", menuIndices: [0, 2, 1] },
  { name: "Birthday Parties", formValue: "Birthday party", description: "Delicious food for your favourite people and joyful celebrations.", icon: "cake", menuIndices: [2, 1] },
  { name: "Corporate Events", formValue: "Corporate event", description: "Bring your team together over thoughtfully chosen favourites.", icon: "office", menuIndices: [2, 1] },
  { name: "Housewarming", formValue: "Housewarming", description: "A welcoming spread to make your new beginning even brighter.", icon: "home", menuIndices: [0, 1] },
  { name: "Festive Catering", formValue: "Festival or puja", description: "Traditional flavours for the occasions you hold close to your heart.", icon: "lotus", menuIndices: [0, 2] },
];

function reveal(element: HTMLElement | null) {
  if (!element) return;
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

export function OccasionPackages() {
  const [selectedOccasion, setSelectedOccasion] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const packagesHeading = useRef<HTMLHeadingElement>(null);
  const detailsHeading = useRef<HTMLHeadingElement>(null);
  const plannerHeading = useRef<HTMLHeadingElement>(null);
  const occasion = selectedOccasion === null ? null : occasions[selectedOccasion];
  const menu = selectedMenu === null ? null : menus[selectedMenu];

  useEffect(() => { if (selectedOccasion !== null) reveal(packagesHeading.current); }, [selectedOccasion]);
  useEffect(() => { if (selectedMenu !== null) reveal(detailsHeading.current); }, [selectedMenu]);
  useEffect(() => { if (showPlanner) reveal(plannerHeading.current); }, [showPlanner]);

  return (
    <section className="occasion-section" id="occasions" aria-labelledby="occasions-title">
      <div className="occasion-heading">
        <p className="eyebrow">PLAN YOUR PERFECT EVENT</p>
        <h2 id="occasions-title">Choose Your Occasion</h2>
        <p className="occasion-subtitle"><span aria-hidden="true" />Explore the perfect package<span aria-hidden="true" /></p>
      </div>
      <div className="occasion-grid">
        {occasions.map((item, index) => (
          <button
            type="button"
            className={`occasion-card${selectedOccasion === index ? " is-selected" : ""}`}
            key={item.name}
            aria-label={`${item.name} — view packages`}
            aria-pressed={selectedOccasion === index}
            aria-controls="occasion-packages"
            onClick={() => { setSelectedOccasion(index); setSelectedMenu(null); setShowPlanner(false); if (selectedOccasion === index) reveal(packagesHeading.current); }}
          >
            <span className="occasion-photo" aria-hidden="true" style={{ backgroundPosition: `${index * 25}% center` }} />
            <span className="occasion-card-body">
              <Icon name={item.icon} className="occasion-icon" />
              <span className="occasion-name">{item.name}</span>
              <span className="occasion-description">{item.description}</span>
              <span className="card-arrow" aria-hidden="true"><Icon name="arrow" /></span>
            </span>
          </button>
        ))}
      </div>
      <div id="occasion-packages" className="packages-region" hidden={!occasion}>
        {occasion && <>
          <div className="package-heading"><div><p className="eyebrow">YOUR OCCASION / {occasion.name.toUpperCase()}</p><h3 ref={packagesHeading} tabIndex={-1}>Explore {occasion.name.toLowerCase()} packages</h3></div><p>Choose a sample package to see what’s on the menu.</p></div>
          <div className="package-grid">
            {occasion.menuIndices.map((menuIndex) => {
              const option = menus[menuIndex];
              return <article className={`package-card${selectedMenu === menuIndex ? " is-selected" : ""}`} key={option.name}><p className="eyebrow">SAMPLE PACKAGE</p><h4>{option.name}</h4><p>{option.intro}</p><span className="package-price">Pricing upon enquiry</span><button className="button" type="button" aria-expanded={selectedMenu === menuIndex} aria-controls="package-details" onClick={() => { setSelectedMenu(menuIndex); setShowPlanner(false); if (selectedMenu === menuIndex) reveal(detailsHeading.current); }}>View package <Icon name="arrow" /><span className="sr-only">: {option.name}</span></button></article>;
            })}
          </div>
          <p className="package-note">Sample menus for inspiration. Final dishes, pricing, and dietary arrangements are agreed before booking.</p>
        </>}
      </div>
      <div id="package-details" hidden={!menu}>
        {menu && occasion && <div className="package-details">
          <div className="details-intro"><p className="eyebrow">{occasion.name.toUpperCase()} / PACKAGE DETAILS</p><h3 ref={detailsHeading} tabIndex={-1}>{menu.name}</h3><p>{menu.intro}</p><button className="button" type="button" aria-expanded={showPlanner} aria-controls="event-planner" onClick={() => { setShowPlanner(true); if (showPlanner) reveal(plannerHeading.current); }}>Plan with this package <Icon name="arrow" /></button></div>
          <div className="menu-courses">{menu.courses.map((course, index) => <div className="menu-course" key={course.name}><span aria-hidden="true">0{index + 1}</span><div><h4>{course.name}</h4><p>{course.dishes}</p></div></div>)}</div>
        </div>}
      </div>
      <div id="event-planner" hidden={!showPlanner}>
        {showPlanner && occasion && menu && <div className="planner-section"><div className="planner-intro"><p className="eyebrow">LET’S PLAN YOUR OCCASION</p><h3 ref={plannerHeading} tabIndex={-1}>Make it your own.</h3><p>{occasion.name} · {menu.name}</p><p>Tell us a little about your event. Save a brief to share when discussing your menu and arrangements.</p></div><EventPlanner key={`${selectedOccasion}-${selectedMenu}`} defaultOccasion={occasion.formValue} defaultMenu={menu.name}/></div>}
      </div>
    </section>
  );
}

export function EventPlanner({ defaultOccasion = "", defaultMenu = "Help me choose" }: { defaultOccasion?: string; defaultMenu?: string }) {
  const [brief, setBrief] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const result = useRef<HTMLDivElement>(null);
  function createBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date"));
    const formatted = date ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "To be decided";
    setBrief(["SRIVARI CATERING — EVENT BRIEF", `Name: ${String(data.get("name")).trim()}`, `Email: ${String(data.get("email")).trim()}`, `Occasion: ${data.get("occasion")}`, `Date: ${formatted}`, `Guests: ${data.get("guests")}`, `Location: ${String(data.get("location")).trim()}`, `Menu: ${data.get("menu")}`, `Requests: ${String(data.get("notes")).trim() || "None specified"}`, "", "Planning brief only. Availability, pricing, and booking are not confirmed."].join("\n"));
    setCopyStatus("");
    requestAnimationFrame(() => result.current?.focus());
  }
  async function copyBrief() {
    try { await navigator.clipboard.writeText(brief); setCopyStatus("Copied. Your brief is ready to share."); }
    catch { setCopyStatus("Copy isn’t available here. Use Download brief to save your details."); }
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "srivari-event-brief.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="planner-card"><form onSubmit={createBrief} onChange={() => { setBrief(""); setCopyStatus(""); }}><div className="form-grid"><label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" required maxLength={100}/></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={200}/></label><label>What’s the occasion?<select name="occasion" defaultValue={defaultOccasion} required><option value="" disabled>Select an occasion</option><option>Wedding or reception</option><option>Birthday party</option><option>Housewarming</option><option>Family celebration</option><option>Festival or puja</option><option>Corporate event</option><option>Community gathering</option><option>Something else</option></select></label><label>Event date <span className="optional">(optional)</span><input name="date" type="date"/></label><label>Number of guests<input name="guests" type="number" min="1" max="100000" placeholder="e.g. 100" required/></label><label>Event location<input name="location" placeholder="City or venue" required maxLength={200}/></label><label className="full-width">Your menu preference<select name="menu" defaultValue={defaultMenu}><option>Help me choose</option>{menus.map((menu) => <option key={menu.name}>{menu.name}</option>)}<option>A custom menu</option></select></label><label className="full-width">Anything else we should know? <span className="optional">(optional)</span><textarea name="notes" rows={3} placeholder="Favourite dishes, dietary requirements, service preferences…" maxLength={2000}/></label></div><button className="button" type="submit">Create my event brief <span aria-hidden="true">↗</span></button><p className="form-note">Your details stay in your browser. Creating a brief does not send an enquiry or confirm a booking.</p></form>{brief && <div className="brief-result" tabIndex={-1} ref={result}><p className="eyebrow">ONE STEP CLOSER</p><h3>Your event brief is ready.</h3><p>Save your details to share when arranging your event.</p><pre>{brief}</pre><div className="brief-actions"><button type="button" className="button button-small" onClick={downloadBrief}>Download brief ↓</button><button type="button" className="text-link" onClick={copyBrief}>Copy details</button></div><p role="status">{copyStatus}</p></div>}</div>;
}
