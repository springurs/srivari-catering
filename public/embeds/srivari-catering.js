/* Srivari responsive catering placement. Usage: /embeds/demo.html */
(() => {
  "use strict";
  const script = document.currentScript;
  if (!(script instanceof HTMLScriptElement) || script.dataset.srivariMounted === "true") return;
  const container = script.dataset.container ? document.getElementById(script.dataset.container) : script.parentElement;
  if (!container || container === document.head) return;
  script.dataset.srivariMounted = "true";

  const campaigns = {
    catering: {
      label: "Vegetarian catering · Pleasanton",
      headline: "A feast for every occasion.",
      description: "Tamil, Andhra and North Indian favourites for weddings, family gatherings and office celebrations.",
      cta: "Explore catering", path: "/", hash: "occasions",
      image: "/images/occasion-traditional.webp", alt: "A vegetarian thali with rice, chapati, curries and appalam",
    },
    diwali: {
      label: "Srivari Diwali catering",
      headline: "Host the lights. We bring the feast.",
      description: "Celebrate with vegetarian Diwali menus for family gatherings, poojas and office celebrations.",
      cta: "See Diwali specials", path: "/", hash: "diwali",
      image: "/images/occasion-diwali.webp", alt: "A festive vegetarian spread beside glowing Diwali lamps",
    },
    corporate: {
      label: "Vegetarian catering for work",
      headline: "Good food. A great team gathering.",
      description: "Explore office meals, sliders, rice bowls and meeting bites. Plan a vegetarian spread with our team.",
      cta: "Plan an office feast", path: "/contact", hash: "",
      image: "/images/package-power-lunch.webp", alt: "A vegetarian rice bowl prepared for an office lunch",
    },
  };
  const campaignName = Object.hasOwn(campaigns, script.dataset.campaign || "") ? script.dataset.campaign : "catering";
  const campaign = campaigns[campaignName];
  const isEzCater = script.dataset.destination === "ezcater";
  const source = /^[a-z0-9.-]{1,80}$/i.test(script.dataset.source || "") ? script.dataset.source.toLowerCase() : location.hostname;
  const placement = /^[a-z0-9_-]{1,60}$/i.test(script.dataset.placement || "") ? script.dataset.placement.toLowerCase() : "responsive-banner";
  const destination = isEzCater
    ? new URL("https://www.ezcater.com/catering/srivari-3?fulfillmentDetailId=f9917079-1d88-471b-8ac1-e74b901096d9")
    : new URL(campaign.path, "https://srivaricatering.com");
  if (!isEzCater) {
    destination.hash = campaign.hash;
    destination.searchParams.set("utm_source", source);
    destination.searchParams.set("utm_medium", "referral");
    destination.searchParams.set("utm_campaign", `srivari-${campaignName}`);
    destination.searchParams.set("utm_content", placement);
  }

  const assetOrigin = new URL(script.src).origin;
  const host = document.createElement("srivari-catering-placement");
  host.dataset.theme = script.dataset.theme === "light" ? "light" : "dark";
  const shadow = host.attachShadow({ mode: "open" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("srivari-catering.css", script.src).href;
  shadow.append(stylesheet);

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const banner = element("section", "banner");
  banner.setAttribute("aria-label", "Srivari catering promotion");
  const brand = element("div", "brand");
  const logo = element("img", "logo");
  logo.src = `${assetOrigin}/icon.png`;
  logo.alt = "Srivari — Pure Indian Vegetarian";
  logo.width = 88; logo.height = 88; logo.loading = "lazy"; logo.decoding = "async";
  brand.append(logo);
  const copy = element("div", "copy");
  copy.append(element("p", "eyebrow", campaign.label), element("h2", "headline", campaign.headline), element("p", "description", campaign.description));
  const details = element("p", "details", "100% vegetarian · Jain & no-onion, no-garlic options on request");
  copy.append(details);
  const actions = element("div", "actions");
  const cta = element("a", "cta", isEzCater ? "Order on ezCater" : campaign.cta);
  cta.href = destination.href;
  cta.target = "_blank"; cta.rel = "noopener noreferrer";
  cta.append(element("span", "arrow", "↗"), element("span", "sr-only", " (opens in a new tab)"));
  const call = element("a", "call", "(408) 893-0438");
  call.href = "tel:+14088930438";
  call.setAttribute("aria-label", "Call Srivari Catering at (408) 893-0438");
  actions.append(cta, call, element("p", "destination-note", isEzCater ? "Order on ezCater · New tab" : "Explore Srivari Catering · New tab"));
  const photo = element("img", "photo");
  photo.src = `${assetOrigin}${campaign.image}`;
  photo.alt = campaign.alt; photo.width = 256; photo.height = 256; photo.loading = "lazy"; photo.decoding = "async";
  banner.append(brand, copy, actions, photo);
  shadow.append(banner);
  if (container === script.parentElement) container.insertBefore(host, script);
  else container.append(host);
})();
