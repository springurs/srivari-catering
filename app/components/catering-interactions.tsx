"use client";

import Image from "next/image";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Icon, type IconName } from "./catering-icons";

import { menus, menuPrice, buildPackageMenu, type MenuSelection } from "../data/catering-menu";
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

type MenuChoices = Record<string, string[]>;
type ChoicesByMenu = Record<string, MenuChoices>;
type ChangeChoice = (menuName: string, groupName: string, dish: string, checked: boolean) => void;

function MenuCheckboxes({ groups, choices, onChange }: {
  groups: MenuSelection[];
  choices: MenuChoices;
  onChange: (groupName: string, dish: string, checked: boolean) => void;
}) {
  const id = useId();
  const [openSection, setOpenSection] = useState<number | null>(0);
  const sectionButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const sections = groups.reduce<{ name: string; groups: MenuSelection[] }[]>((result, group) => {
    const name = group.section ?? group.name;
    const previous = result[result.length - 1];
    if (previous?.name === name) previous.groups.push(group);
    else result.push({ name, groups: [group] });
    return result;
  }, []);

  return sections.map((section, sectionIndex) => {
    const selectedCount = section.groups.reduce((total, group) => total + (choices[group.name]?.length ?? 0), 0);
    const selectionLimit = section.groups.reduce((total, group) => total + group.count, 0);
    const isOpen = openSection === sectionIndex;
    const headerId = `${id}-${sectionIndex}-header`;
    const panelId = `${id}-${sectionIndex}-panel`;

    return (
      <div className={`menu-accordion${isOpen ? " is-open" : ""}`} key={section.name}>
        <h5 className="menu-accordion-heading">
          <button className="menu-accordion-toggle" type="button" id={headerId} aria-expanded={isOpen} aria-controls={panelId} ref={(element) => { sectionButtons.current[sectionIndex] = element; }} onClick={() => setOpenSection(isOpen ? null : sectionIndex)}>
            <span className="menu-accordion-title">{section.name}</span>
            <span className="menu-choice-count">{selectedCount}/{selectionLimit} selected</span>
            <span className="menu-accordion-icon" aria-hidden="true">+</span>
          </button>
        </h5>
        <div className="menu-accordion-panel" id={panelId} role="region" aria-labelledby={headerId} aria-hidden={!isOpen} inert={!isOpen}>
          <div className="menu-accordion-clip">
            <div className="menu-accordion-body">
              {section.groups.map((group) => {
                const groupIndex = groups.indexOf(group);
                const selected = choices[group.name] ?? [];
                const atLimit = selected.length >= group.count;
                const hintId = `${id}-${groupIndex}-hint`;

                return (
                  <fieldset className="menu-choice-group" key={group.name} data-selection-group={groupIndex} aria-describedby={hintId}>
                    <legend><span className="menu-choice-heading"><span>{group.name} — choose {group.count}</span><span className="menu-choice-count" role="status">{selected.length}/{group.count} selected</span></span></legend>
                    <p className="menu-choice-hint" id={hintId}>Choose {group.count}. Uncheck an item to change your selection.</p>
                    <div className="menu-choice-grid">
                      {group.options.map((dish) => {
                        const checked = selected.includes(dish);
                        const disabled = atLimit && !checked;
                        return (
                          <label className={`menu-choice${checked ? " is-checked" : ""}${disabled ? " is-disabled" : ""}`} key={dish}>
                            <input type="checkbox" name={`selection-${groupIndex}`} value={dish} checked={checked} disabled={disabled} onChange={(event) => {
                              const isChecked = event.target.checked;
                              onChange(group.name, dish, isChecked);
                              const nextChoices = { ...choices, [group.name]: isChecked ? [...selected, dish] : selected.filter((item) => item !== dish) };
                              if (isChecked && section.groups.every((item) => nextChoices[item.name]?.length === item.count)) {
                                const nextSection = [...sections.keys()].slice(sectionIndex + 1).concat([...sections.keys()].slice(0, sectionIndex))
                                  .find((index) => sections[index].groups.some((item) => nextChoices[item.name]?.length !== item.count));
                                setOpenSection(nextSection ?? null);
                                sectionButtons.current[nextSection ?? sectionIndex]?.focus({ preventScroll: true });
                              }
                            }} />
                            <span>{dish}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  });
}

export function OccasionPackages() {
  const [selectedOccasion, setSelectedOccasion] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [choicesByMenu, setChoicesByMenu] = useState<ChoicesByMenu>({});
  const [menuResetCount, setMenuResetCount] = useState(0);
  const packagesHeading = useRef<HTMLHeadingElement>(null);
  const detailsHeading = useRef<HTMLHeadingElement>(null);
  const choicesHeading = useRef<HTMLHeadingElement>(null);
  const plannerHeading = useRef<HTMLHeadingElement>(null);
  const occasion = selectedOccasion === null ? null : occasions[selectedOccasion];
  const menu = selectedMenu === null ? null : menus[selectedMenu];

  const changeChoice: ChangeChoice = (menuName, groupName, dish, checked) => {
    const group = menus.find((option) => option.name === menuName)?.selections?.find((option) => option.name === groupName);
    if (!group?.options.includes(dish)) return;
    setChoicesByMenu((current) => {
      const choices = current[menuName] ?? {};
      const selected = choices[groupName] ?? [];
      if (checked && (selected.includes(dish) || selected.length >= group.count)) return current;
      return { ...current, [menuName]: { ...choices, [groupName]: checked ? [...selected, dish] : selected.filter((option) => option !== dish) } };
    });
  };

  function editPackage(menuName: string) {
    const menuIndex = menus.findIndex((option) => option.name === menuName);
    const occasionIndex = occasions.findIndex((option) => option.menuIndices.includes(menuIndex));
    if (menuIndex < 0 || occasionIndex < 0) return;
    setSelectedOccasion(occasionIndex);
    setSelectedMenu(menuIndex);
    requestAnimationFrame(() => reveal(menus[menuIndex].selections ? choicesHeading.current : detailsHeading.current));
  }

  useEffect(() => { if (selectedOccasion !== null) reveal(packagesHeading.current); }, [selectedOccasion]);
  useEffect(() => { if (selectedMenu !== null) reveal(detailsHeading.current); }, [selectedMenu]);
  useEffect(() => { if (showPlanner) reveal(plannerHeading.current); }, [showPlanner]);

  const planAfterChoices = Boolean(menu?.selections) && occasion?.name !== "Corporate Events" && occasion?.name !== "Festive Catering";
  const planButton = <button className="button" type="button" aria-expanded={showPlanner} aria-controls="event-planner" onClick={() => { setShowPlanner(true); if (showPlanner) reveal(plannerHeading.current); }}>Plan with this package <Icon name="arrow" /></button>;

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
          <div className="details-intro"><p className="eyebrow">{occasion.name.toUpperCase()} / PACKAGE DETAILS</p><h3 ref={detailsHeading} tabIndex={-1}>{menu.name}</h3><p>{menu.intro}</p>{(menu.pricePerPerson !== undefined || menu.pricePerPackage !== undefined || menu.minimumGuests !== undefined) && <p className="combo-detail-price">{menuPrice(menu)}{menu.serves && <span>Serves {menu.serves}</span>}{menu.minimumGuests && <span>Minimum order: {menu.minimumGuests} guests</span>}</p>}{!planAfterChoices && planButton}</div>
          <div className="menu-courses">
            {menu.isSuggested && <p className="menu-suggestion-note">Suggested corporate menu. Item descriptions can be tailored with our team; final dishes and pricing are confirmed on enquiry.</p>}
            {menu.courses.map((course, index) => (
              <div className="menu-course" key={course.name}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h4>{course.name}</h4>
                  {Array.isArray(course.dishes) ? (
                    <ul>{course.dishes.map((dish) => (
                      <li key={dish}>
                        {dish}
                        {menu.dishDescriptions?.[dish] && <span className="menu-dish-description">{menu.dishDescriptions[dish]}</span>}
                      </li>
                    ))}</ul>
                  ) : <p>{course.dishes}</p>}
                </div>
              </div>
            ))}
          </div>
          {menu.selections && <div className="combo-options">
            <div className="combo-options-heading">
              <h4 ref={choicesHeading} tabIndex={-1}>Build your perfect menu</h4>
              <button className="text-link" type="button" aria-label="Reset all menu selections" onClick={() => {
                setChoicesByMenu((current) => ({ ...current, [menu.name]: {} }));
                setMenuResetCount((count) => count + 1);
              }}>Reset all</button>
            </div>
            <p>Choose your favourites below. Your selections carry into the event planner.</p>
            <MenuCheckboxes key={`${menu.name}-${menuResetCount}`} groups={menu.selections} choices={choicesByMenu[menu.name] ?? {}} onChange={(groupName, dish, checked) => changeChoice(menu.name, groupName, dish, checked)} />
            {planAfterChoices && planButton}
          </div>}
        </div>}
      </div>
      <div id="event-planner" hidden={!showPlanner}>
        {showPlanner && occasion && menu && <div className="planner-section"><div className="planner-intro"><p className="eyebrow">LET’S PLAN YOUR OCCASION</p><h3 ref={plannerHeading} tabIndex={-1}>Your catering plan.</h3><p>Review your package and selected dishes, then enter the number of people. Save a brief to share with our team.</p></div><EventPlanner defaultMenu={menu.name} choicesByMenu={choicesByMenu} onEditPackage={editPackage}/></div>}
      </div>
      {occasion?.name === "Festive Catering" && <FestiveOptions />}
    </section>
  );
}

function EventPlanner({ defaultMenu, choicesByMenu, onEditPackage }: {
  defaultMenu: string;
  choicesByMenu: ChoicesByMenu;
  onEditPackage: (menuName: string) => void;
}) {
  const [savedBrief, setBrief] = useState<{ text: string; choices: string } | null>(null);
  const [selectionAttempted, setSelectionAttempted] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [chosenMenu, setChosenMenu] = useState(defaultMenu);
  const plannedMenu = menus.find((menu) => menu.name === chosenMenu);
  const choices = choicesByMenu[chosenMenu] ?? {};
  const choiceSnapshot = JSON.stringify(choices);
  const brief = savedBrief?.choices === choiceSnapshot ? savedBrief.text : "";
  const incompleteGroup = plannedMenu?.selections?.find((group) => (choices[group.name]?.length ?? 0) !== group.count);
  const packageGroups = plannedMenu ? buildPackageMenu(plannedMenu, choices) : [];
  const result = useRef<HTMLDivElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);

  function createBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    for (const group of plannedMenu?.selections ?? []) {
      const dishes = choices[group.name] ?? [];
      if (dishes.length !== group.count || new Set(dishes).size !== group.count || dishes.some((dish) => !group.options.includes(dish))) {
        setSelectionAttempted(true);
        editButton.current?.focus();
        return;
      }
    }
    setSelectionAttempted(false);
    setBrief({ choices: choiceSnapshot, text: [
      "SRIVARI CATERING — EVENT BRIEF",
      `Package: ${chosenMenu}`,
      `Number of people: ${data.get("guests")}`,
      ...(plannedMenu && (plannedMenu.pricePerPerson !== undefined || plannedMenu.pricePerPackage !== undefined) ? [`Price: ${menuPrice(plannedMenu)}`] : []),
      ...(plannedMenu?.serves ? [`Package serves: ${plannedMenu.serves}`] : []),
      "",
      "FULL PACKAGE MENU",
      ...packageGroups.map((group) => `${group.name}: ${group.dishes.join(" · ")}`),
      "",
      "Planning brief only. Availability, pricing, and booking are not confirmed.",
    ].join("\n") });
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
      <form onSubmit={createBrief} onChange={() => {
        setBrief(null);
        setSelectionAttempted(false);
        setCopyStatus("");
      }}>
        <div className="form-grid">
          <label className="full-width">Package<select name="menu" value={chosenMenu} onChange={(event) => { setChosenMenu(event.target.value); setSelectionAttempted(false); }}>{menus.map((menu) => <option key={menu.name}>{menu.name}</option>)}</select></label>
          <label className="full-width">Number of people<input name="guests" type="number" min={plannedMenu?.minimumGuests ?? 1} max="100000" step="1" placeholder="e.g. 100" required/>{plannedMenu?.minimumGuests && <span className="guest-minimum">Minimum {plannedMenu.minimumGuests} people for this package.</span>}</label>
        </div>
        <div className="selected-menu-summary">
          <div className="selected-menu-heading"><h4>Full package menu</h4><button className="text-link" type="button" ref={editButton} onClick={() => onEditPackage(chosenMenu)}>{plannedMenu?.selections ? "Edit selections" : "View package"}</button></div>
          {packageGroups.map((group) => <div className="selected-menu-group" key={group.name}><h5>{group.name}</h5><ul>{group.dishes.map((dish) => <li key={dish}>{dish}</li>)}</ul></div>)}
        </div>
        {selectionAttempted && incompleteGroup && <p className="menu-choice-error" role="alert">Choose exactly {incompleteGroup.count} {incompleteGroup.name.toLowerCase()} before creating your event brief.</p>}
        <button className="button" type="submit">Create my event brief <span aria-hidden="true">↗</span></button>
        <p className="form-note">Your details stay in your browser. Creating a brief does not send an enquiry or confirm a booking.</p>
      </form>
      {brief && <div className="brief-result" tabIndex={-1} ref={result}><p className="eyebrow">ONE STEP CLOSER</p><h3>Your event brief is ready.</h3><p>Save your details to share when arranging your event.</p><pre>{brief}</pre><div className="brief-actions"><button type="button" className="button button-small" onClick={downloadBrief}>Download brief ↓</button><button type="button" className="text-link" onClick={copyBrief}>Copy details</button></div><p role="status">{copyStatus}</p></div>}
    </div>
  );
}
