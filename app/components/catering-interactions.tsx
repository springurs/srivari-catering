"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type FormEvent } from "react";
import { Icon, type IconName } from "./catering-icons";

import { menus, menuPrice } from "../data/catering-menu";
import { FestiveOptions } from "./festive-options";

const occasions: { name: string; formValue: string; description: string; icon: IconName; image: string; menuIndices: number[] }[] = [
  { name: "Weddings", formValue: "Wedding or reception", description: "Make your special day even more memorable with a beautiful feast.", icon: "rings", image: "/images/occasion-weddings.webp", menuIndices: [2] },
  { name: "Traditional Package", formValue: "Traditional Package", description: "Celebrate with an Andhra, Tamil, or North Indian thali feast.", icon: "menu", image: "/images/occasion-traditional.webp", menuIndices: [1, 3, 7] },
  { name: "Corporate Events", formValue: "Corporate event", description: "Indian bowls, signature sliders, and creative meeting bites for your team.", icon: "office", image: "/images/occasion-corporate.webp", menuIndices: [11, 12, 13] },
  { name: "Combos", formValue: "Combos", description: "Choose a complete meal or a South Indian tiffin spread.", icon: "menu", image: "/images/occasion-combos.webp", menuIndices: [0, 8, 9, 10] },
  { name: "Festive Catering", formValue: "Festival or puja", description: "Golu season packages and Tamil & Telugu specialties for festive gatherings.", icon: "lotus", image: "/images/occasion-festive.webp", menuIndices: [4, 5, 6] },
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
            <Image className="occasion-photo" src={item.image} alt="" width={960} height={640} sizes="(max-width: 760px) 50vw, 20vw" />
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
          <div className="package-heading"><div><p className="eyebrow">YOUR OCCASION / {occasion.name.toUpperCase()}</p><h3 ref={packagesHeading} tabIndex={-1}>{occasion.name === "Combos" ? "Explore our combos" : occasion.name === "Traditional Package" ? "Explore our traditional packages" : occasion.name === "Festive Catering" ? "Golu Season Packages" : occasion.name === "Weddings" ? "Explore wedding packages" : "Fresh ideas for your workday"}</h3></div><p>{occasion.name === "Combos" ? "Choose a meal or tiffin combo to explore its complete menu." : occasion.name === "Traditional Package" ? "Choose a thali to explore its complete menu." : occasion.name === "Festive Catering" ? "Celebrate Navaratri with a Golu package, upgrades, and traditional specialties." : occasion.name === "Weddings" ? "Explore the complete Wedding Thali Combo menu." : "Choose an everyday lunch, a celebration spread, or a meeting break."}</p></div>
          {occasion.menuIndices.length === 0 && <div className="package-empty"><p>Contact our team to discuss corporate catering menus and arrangements.</p><a className="button" href="tel:+14088930438">Call +1 (408) 893-0438 <Icon name="arrow" /></a></div>}
          <div className="package-grid">
            {occasion.menuIndices.map((menuIndex, position) => {
              const option = menus[menuIndex];
              return <Fragment key={option.name}>
                {option.isTiffin && !menus[occasion.menuIndices[position - 1]]?.isTiffin && <div className="package-group-heading"><p className="eyebrow">SOUTH INDIAN BREAKFAST FAVOURITES</p><h3>Tiffin Combos</h3><p>Explore three tiffin spreads, from a quick fill to a grand wedding breakfast.</p></div>}
                <article className={`package-card${selectedMenu === menuIndex ? " is-selected" : ""}`}>
                  <div className="package-card-heading">
                    <Image className="package-image-icon" src={option.image} alt="" width={80} height={80} sizes="80px" />
                    <div>
                      <p className="eyebrow">{occasion.name === "Traditional Package" ? "TRADITIONAL PACKAGE" : occasion.name === "Festive Catering" ? "NAVARATRI CELEBRATIONS" : occasion.name === "Corporate Events" ? "CORPORATE PACKAGE" : option.isTiffin ? "TIFFIN COMBO" : option.isCombo ? "VEGETARIAN COMBO" : "CATERING PACKAGE"}</p>
                      <h4>{option.name}</h4>
                    </div>
                  </div>
                  <p>{option.intro}</p>
                  <div className="package-pricing"><span className="package-price">{menuPrice(option)}</span>{option.serves && <span className="package-minimum">Serves {option.serves}</span>}{option.minimumGuests && <span className="package-minimum">Minimum order: {option.minimumGuests} guests</span>}</div>
                  <button className="button" type="button" aria-expanded={selectedMenu === menuIndex} aria-controls="package-details" onClick={() => { setSelectedMenu(menuIndex); setShowPlanner(false); if (selectedMenu === menuIndex) reveal(detailsHeading.current); }}>View package <Icon name="arrow" /><span className="sr-only">: {option.name}</span></button>
                </article>
              </Fragment>;
            })}
          </div>
          <p className="package-note">{occasion.name === "Combos" ? "Menu selections may be combined across South Indian, Andhra, and North Indian favourites, subject to availability." : occasion.name === "Traditional Package" ? "Menu selections and presentation can be tailored to your event." : occasion.name === "Festive Catering" ? "Perfect for Navaratri Golu gatherings, pooja celebrations and evening guests. Custom Jain and no-onion/no-garlic packages available." : occasion.name === "Weddings" ? "Menu selections and presentation can be tailored to your wedding." : "Suggested vegetarian menus, ready to tailor to your team. Confirm dishes, availability, pricing, packaging, and dietary arrangements before booking."}</p>
        </>}
      </div>
      <div id="package-details" hidden={!menu}>
        {menu && occasion && <div className="package-details">
          <div className="details-intro"><p className="eyebrow">{occasion.name.toUpperCase()} / PACKAGE DETAILS</p><h3 ref={detailsHeading} tabIndex={-1}>{menu.name}</h3><p>{menu.intro}</p>{(menu.pricePerPerson !== undefined || menu.pricePerPackage !== undefined) && <p className="combo-detail-price">{menuPrice(menu)}{menu.serves && <span>Serves {menu.serves}</span>}{menu.minimumGuests && <span>Minimum order: {menu.minimumGuests} guests</span>}</p>}<button className="button" type="button" aria-expanded={showPlanner} aria-controls="event-planner" onClick={() => { setShowPlanner(true); if (showPlanner) reveal(plannerHeading.current); }}>Plan with this package <Icon name="arrow" /></button></div>
          <div className="menu-courses">{menu.courses.map((course, index) => <div className="menu-course" key={course.name}><span aria-hidden="true">0{index + 1}</span><div><h4>{course.name}</h4>{Array.isArray(course.dishes) ? <ul>{course.dishes.map((dish) => <li key={dish}>{dish}</li>)}</ul> : <p>{course.dishes}</p>}</div></div>)}</div>
          {menu.selections && <div className="combo-options"><h4>Build your perfect menu</h4><p>Choose your favourites when planning this package.</p>{menu.selections.map((group) => <details key={group.name}><summary>{group.name} — choose {group.count}<span aria-hidden="true">+</span></summary><ul>{group.options.map((dish) => <li key={dish}>{dish}</li>)}</ul></details>)}</div>}
        </div>}
      </div>
      <div id="event-planner" hidden={!showPlanner}>
        {showPlanner && occasion && menu && <div className="planner-section"><div className="planner-intro"><p className="eyebrow">LET’S PLAN YOUR OCCASION</p><h3 ref={plannerHeading} tabIndex={-1}>Make it your own.</h3><p>{occasion.name} · {menu.name}</p><p>Tell us a little about your event. Save a brief to share when discussing your menu and arrangements.</p></div><EventPlanner key={`${selectedOccasion}-${selectedMenu}`} defaultOccasion={occasion.formValue} defaultMenu={menu.name}/></div>}
      </div>
      {occasion?.name === "Festive Catering" && <FestiveOptions />}
    </section>
  );
}

export function EventPlanner({ defaultOccasion = "", defaultMenu = "Help me choose" }: { defaultOccasion?: string; defaultMenu?: string }) {
  const [brief, setBrief] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [chosenMenu, setChosenMenu] = useState(defaultMenu);
  const plannedMenu = menus.find((menu) => menu.name === chosenMenu);
  const result = useRef<HTMLDivElement>(null);

  function createBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selections: string[] = [];
    for (const [groupIndex, group] of (plannedMenu?.selections ?? []).entries()) {
      const dishes = Array.from({ length: group.count }, (_, index) => String(data.get(`selection-${groupIndex}-${index}`)));
      if (new Set(dishes).size !== group.count) {
        const field = event.currentTarget.querySelector<HTMLSelectElement>(`[name="selection-${groupIndex}-${group.count - 1}"]`);
        field?.setCustomValidity(`Choose ${group.count} different ${group.name.toLowerCase()}.`);
        field?.reportValidity();
        return;
      }
      selections.push(`${group.name}: ${dishes.join(" · ")}`);
    }
    const date = String(data.get("date"));
    const formatted = date ? new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "To be decided";
    setBrief([
      "SRIVARI CATERING — EVENT BRIEF",
      `Name: ${String(data.get("name")).trim()}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Occasion: ${data.get("occasion")}`,
      `Date: ${formatted}`,
      `Guests: ${data.get("guests")}`,
      `Location: ${String(data.get("location")).trim()}`,
      `Menu: ${data.get("menu")}`,
      ...(plannedMenu && (plannedMenu.pricePerPerson !== undefined || plannedMenu.pricePerPackage !== undefined) ? [`Price: ${menuPrice(plannedMenu)}`] : []),
      ...(plannedMenu?.serves ? [`Package serves: ${plannedMenu.serves}`] : []),
      ...selections,
      `Requests: ${String(data.get("notes")).trim() || "None specified"}`,
      "",
      "Planning brief only. Availability, pricing, and booking are not confirmed.",
    ].join("\n"));
    setCopyStatus("");
    requestAnimationFrame(() => result.current?.focus());
  }

  async function copyBrief() {
    try { await navigator.clipboard.writeText(brief); setCopyStatus("Copied. Your brief is ready to share."); }
    catch { setCopyStatus("Copy isn’t available here. Use Download brief to save your details."); }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "srivari-event-brief.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="planner-card">
      <form onSubmit={createBrief} onChange={(event) => {
        setBrief("");
        setCopyStatus("");
        event.currentTarget.querySelectorAll<HTMLSelectElement>("select").forEach((field) => field.setCustomValidity(""));
      }}>
        <div className="form-grid">
          <label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" required maxLength={100}/></label>
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={200}/></label>
          <label>What’s the occasion?<select name="occasion" defaultValue={defaultOccasion} required><option value="" disabled>Select an occasion</option><option>Wedding or reception</option><option>Traditional Package</option><option>Combos</option><option>Family celebration</option><option>Festival or puja</option><option>Corporate event</option><option>Community gathering</option><option>Something else</option></select></label>
          <label>Event date <span className="optional">(optional)</span><input name="date" type="date"/></label>
          <label>Number of guests<input name="guests" type="number" min={plannedMenu?.minimumGuests ?? 1} max="100000" placeholder="e.g. 100" required/>{plannedMenu?.minimumGuests && <span className="guest-minimum">Minimum {plannedMenu.minimumGuests} guests for this combo.</span>}</label>
          <label>Event location<input name="location" placeholder="City or venue" required maxLength={200}/></label>
          <label className="full-width">Your menu preference<select name="menu" value={chosenMenu} onChange={(event) => setChosenMenu(event.target.value)}><option>Help me choose</option>{menus.map((menu) => <option key={menu.name}>{menu.name}</option>)}<option>A custom menu</option></select></label>
          <label className="full-width">Anything else we should know? <span className="optional">(optional)</span><textarea name="notes" rows={3} placeholder="Preferred breads, rice, accompaniments, dietary requirements…" maxLength={2000}/></label>
        </div>
        {plannedMenu?.selections && <div className="combo-form-selections" key={plannedMenu.name}>
          <h4>Choose your package favourites</h4>
          {plannedMenu.selections.map((group, groupIndex) => <fieldset key={group.name}>
            <legend>{group.name} — choose {group.count}</legend>
            <div className="form-grid">{Array.from({ length: group.count }, (_, index) => <div key={index}><label htmlFor={`combo-choice-${groupIndex}-${index}`}>{group.name} {index + 1}</label><select id={`combo-choice-${groupIndex}-${index}`} name={`selection-${groupIndex}-${index}`} defaultValue="" required><option value="" disabled>Choose a selection</option>{group.options.map((dish) => <option key={dish}>{dish}</option>)}</select></div>)}</div>
          </fieldset>)}
        </div>}
        <button className="button" type="submit">Create my event brief <span aria-hidden="true">↗</span></button>
        <p className="form-note">Your details stay in your browser. Creating a brief does not send an enquiry or confirm a booking.</p>
      </form>
      {brief && <div className="brief-result" tabIndex={-1} ref={result}><p className="eyebrow">ONE STEP CLOSER</p><h3>Your event brief is ready.</h3><p>Save your details to share when arranging your event.</p><pre>{brief}</pre><div className="brief-actions"><button type="button" className="button button-small" onClick={downloadBrief}>Download brief ↓</button><button type="button" className="text-link" onClick={copyBrief}>Copy details</button></div><p role="status">{copyStatus}</p></div>}
    </div>
  );
}
