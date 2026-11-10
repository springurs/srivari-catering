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
    navarathri: {
      festive: true, defaultTheme: "light",
      label: "Navarathri celebrations",
      headline: "Navarathri Festive Catering",
      description: "Vegetarian feasts for Golu gatherings, poojas and family celebrations.",
      cta: "Get Navarathri quote", path: "/contact", hash: "",
      image: "/images/occasion-traditional.webp", alt: "A traditional vegetarian feast for a festive gathering",
    },
    thanksgiving: {
      festive: true, defaultTheme: "light",
      label: "Thanksgiving celebrations",
      headline: "A Thanksgiving Feast, Catered with Tradition.",
      description: "Gather your loved ones over authentic Indian vegetarian flavours, freshly prepared by Srivari.",
      cta: "Explore Thanksgiving", path: "/", hash: "thanksgiving-offer",
      image: "/images/south-indian-feast.png", alt: "A traditional South Indian vegetarian feast for a family gathering",
    },
    corporate: {
      label: "Vegetarian catering for work",
      headline: "Good food. A great team gathering.",
      description: "Explore office meals, sliders, rice bowls and meeting bites. Plan a vegetarian spread with our team.",
      cta: "Plan an office feast", path: "/contact", hash: "",
      image: "/images/package-power-lunch.webp", alt: "A vegetarian rice bowl prepared for an office lunch",
    },
  };
  // Keep installed partner tags working as the seasonal promotion changes.
  const requestedCampaign = script.dataset.campaign === "diwali" ? "thanksgiving" : script.dataset.campaign;
  const campaignName = Object.hasOwn(campaigns, requestedCampaign || "") ? requestedCampaign : "catering";
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
  // Keep the partner's light theme name; this campaign's CSS supplies its harvest palette.
  host.dataset.theme = campaignName === "thanksgiving" ? "light" : ["light", "dark"].includes(script.dataset.theme) ? script.dataset.theme : campaign.defaultTheme || "dark";
  const shadow = host.attachShadow({ mode: "open" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("srivari-catering.css?v=thanksgiving-light-name-12", script.src).href;
  shadow.append(stylesheet);

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const banner = element("section", campaign.festive ? `banner banner--festive banner--${campaignName}` : "banner");
  banner.setAttribute("aria-label", "Srivari catering promotion");
  const brand = element("div", "brand");
  if (campaignName === "thanksgiving") {
    const decorations = element("div", "harvest-decor");
    decorations.setAttribute("aria-hidden", "true");
    for (const edge of ["top", "bottom"]) {
      decorations.append(element("div", `harvest-border harvest-border--${edge}`));
    }
    banner.append(decorations);
    const pumpkin = element("img", "harvest-brand-pumpkin");
    pumpkin.src = `${assetOrigin}/images/thanksgiving-pumpkin-orange.svg`;
    pumpkin.alt = "";
    pumpkin.setAttribute("aria-hidden", "true");
    pumpkin.width = 64; pumpkin.height = 50;
    brand.append(pumpkin);
  } else if (campaign.festive) {
    const svgNode = (tag, attributes) => {
      const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
      return node;
    };
    // Curved gold wires and fixed-size warm bulbs match the supplied border reference.
    for (const edge of ["top", "bottom"]) {
      const lights = element("div", `string-lights string-lights--${edge}`);
      lights.setAttribute("aria-hidden", "true");
      const wire = svgNode("svg", { viewBox: "0 0 960 64", preserveAspectRatio: "none", fill: "none", focusable: "false", class: "string-wire" });
      wire.append(svgNode("path", { d: "M0 2Q400 60 800 2Q880 20 960 32", stroke: "currentColor", "stroke-width": "1.2", "vector-effect": "non-scaling-stroke" }));
      lights.append(wire);
      for (let index = 1; index <= 6; index += 1) lights.append(element("span", `string-light string-light-${index}`));
      banner.append(lights);
    }
    // One prominent animated lamp, in the brand column rather than over the copy.
    const diya = element("span", "diya");
    diya.setAttribute("aria-hidden", "true");
    const svg = svgNode("svg", { viewBox: "0 0 120 120", fill: "none", focusable: "false" });
    const flame = svgNode("g", { class: "diya-flame" });
    flame.append(
      svgNode("path", { d: "M61 10C69 30 83 39 76 55C70 69 49 66 46 53C42 40 59 28 61 10Z", fill: "#F9AA37" }),
      svgNode("path", { d: "M61 29C64 42 72 47 67 55C63 63 53 58 54 51C54 45 60 38 61 29Z", fill: "#FFF4B8" }),
    );
    svg.append(flame,
      svgNode("path", { d: "M60 63L64 71", stroke: "#5D371D", "stroke-width": "3", "stroke-linecap": "round" }),
      svgNode("path", { d: "M14 72C22 114 97 114 106 72Z", fill: "#A74D29" }),
      svgNode("path", { d: "M20 78C36 99 84 99 100 78", stroke: "#E99E45", "stroke-width": "3" }),
      svgNode("ellipse", { cx: "60", cy: "72", rx: "46", ry: "10", fill: "#D68B37", stroke: "#F9D58A", "stroke-width": "2" }),
      svgNode("ellipse", { cx: "60", cy: "72", rx: "35", ry: "5", fill: "#F4BA54" }),
    );
    diya.append(element("span", "diya-glow"), svg);
    brand.append(diya);
  }
  const logo = element("img", "logo");
  logo.src = `${assetOrigin}/icon.png`;
  logo.alt = "Srivari — Pure Indian Vegetarian";
  logo.width = 88; logo.height = 88; logo.loading = "lazy"; logo.decoding = "async";
  brand.prepend(logo);
  const copy = element("div", "copy");
  copy.append(element("p", "eyebrow", campaign.label), element("h2", "headline", campaign.headline), element("p", "description", campaign.description));
  const details = element("p", "details", "100% vegetarian · Jain & no-onion, no-garlic options on request");
  copy.append(details);
  // Keep terms in sync with app/data/thanksgiving-offer.ts. This offer is for
  // direct catering enquiries, rather than an external ordering marketplace.
  const offerEndsAt = Date.parse("2026-11-27T00:00:00-08:00");
  let seasonalOffer = null;
  if (campaignName === "thanksgiving" && !isEzCater && Date.now() < offerEndsAt) {
    const offer = element("div", "harvest-scratch-offer");
    const header = element("div", "harvest-ticket-header");
    header.append(element("span", "", "THANKSGIVING OFFERS"), element("span", "harvest-ticket-expiry", "ENDS 11/26"));
    const amount = element("p", "harvest-ticket-amount");
    const percentage = element("strong", "", "10");
    percentage.append(element("span", "", "%"));
    amount.append(percentage, element("span", "", "OFF"));
    const threshold = element("p", "harvest-ticket-threshold", "on orders over $40");
    const label = element("p", "harvest-ticket-label", "A LITTLE SURPRISE FOR YOU");
    const surface = element("div", "harvest-scratch-surface");
    const code = element("code", "harvest-offer-code", "THANKS10");
    code.setAttribute("aria-hidden", "true");
    const canvas = element("canvas", "harvest-scratch-canvas");
    canvas.width = 480; canvas.height = 120;
    canvas.setAttribute("aria-hidden", "true");
    const hint = element("span", "harvest-scratch-hint", "✦ Scratch here ✦");
    hint.setAttribute("aria-hidden", "true");
    const button = element("button", "harvest-scratch-button", "Reveal code");
    button.type = "button";
    const status = element("p", "harvest-scratch-status", "Scratch with your finger or mouse, or select Reveal code.");
    status.setAttribute("role", "status");
    surface.append(code, canvas, hint);
    offer.append(header, amount, threshold, label, surface, button, status);
    seasonalOffer = offer;
    let revealed = false;
    let stroke = null;
    const context = canvas.getContext("2d");
    if (context) {
      const coating = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      coating.addColorStop(0, "#fff6d6"); coating.addColorStop(.5, "#e8bd68"); coating.addColorStop(1, "#fff0be");
      context.fillStyle = coating;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#80502f33";
      for (let x = 0; x < canvas.width; x += 14) {
        for (let y = 0; y < canvas.height; y += 14) context.fillRect(x, y, 2, 2);
      }
    }
    function removeOffer() {
      offer.remove();
      banner.classList.add("banner--without-offer");
    }
    function reveal() {
      if (Date.now() >= offerEndsAt) { removeOffer(); return; }
      revealed = true;
      stroke = null;
      canvas.remove(); hint.remove();
      surface.classList.add("is-revealed");
      code.removeAttribute("aria-hidden");
      label.textContent = "YOUR OFFER CODE";
      button.textContent = "Copy code";
      status.textContent = "Your code is THANKS10. Mention it with your catering enquiry.";
    }
    function checkCoverage() {
      if (!context || revealed) return;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0; let total = 0;
      for (let i = 3; i < pixels.length; i += 64) {
        total++;
        if (pixels[i] < 128) cleared++;
      }
      if (cleared / total >= .35) reveal();
    }
    function scratch(event, start = false) {
      if (revealed || (start && event.button !== 0)) return;
      if (!context) { reveal(); return; }
      const bounds = canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) * canvas.width / bounds.width;
      const y = (event.clientY - bounds.top) * canvas.height / bounds.height;
      if (start) {
        canvas.setPointerCapture(event.pointerId);
        stroke = { pointerId: event.pointerId, x, y, moves: 0 };
        hint.remove();
      }
      if (!stroke || stroke.pointerId !== event.pointerId) return;
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = 42; context.lineCap = "round";
      context.beginPath(); context.moveTo(stroke.x, stroke.y); context.lineTo(x + .01, y); context.stroke();
      stroke = { pointerId: event.pointerId, x, y, moves: stroke.moves + 1 };
      if (stroke.moves % 6 === 0) checkCoverage();
    }
    canvas.addEventListener("pointerdown", event => scratch(event, true));
    canvas.addEventListener("pointermove", event => scratch(event));
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) {
      canvas.addEventListener(name, event => {
        if (stroke?.pointerId !== event.pointerId) return;
        stroke = null;
        checkCoverage();
      });
    }
    button.addEventListener("click", async () => {
      if (Date.now() >= offerEndsAt) { removeOffer(); return; }
      if (!revealed) { reveal(); return; }
      try {
        await navigator.clipboard.writeText("THANKS10");
        status.textContent = "Code copied — mention THANKS10 with your catering enquiry.";
      } catch {
        status.textContent = "Use code THANKS10 when placing your catering enquiry.";
      }
    });
    function expireOffer() {
      if (!offer.isConnected) return;
      if (Date.now() >= offerEndsAt) removeOffer();
      else setTimeout(expireOffer, Math.min(offerEndsAt - Date.now(), 2_147_483_647));
    }
    setTimeout(expireOffer, Math.min(offerEndsAt - Date.now(), 2_147_483_647));
  }
  const actions = element("div", "actions");
  const cta = element("a", "cta", isEzCater ? "Order on ezCater" : campaignName === "thanksgiving" ? "Explore" : campaign.cta);
  if (campaignName === "thanksgiving" && !isEzCater) cta.setAttribute("aria-label", "Explore Thanksgiving catering (opens in a new tab)");
  cta.href = destination.href;
  cta.target = "_blank"; cta.rel = "noopener noreferrer";
  cta.append(element("span", "arrow", "↗"), element("span", "sr-only", " (opens in a new tab)"));
  const call = element("a", "call", "(408) 893-0438");
  call.href = "tel:+14088930438";
  call.setAttribute("aria-label", "Call Srivari Catering at (408) 893-0438");
  actions.append(cta, call, element("p", "destination-note", isEzCater ? "Order on ezCater" : "Explore Srivari Catering"));
  const photo = element("img", "photo");
  photo.src = `${assetOrigin}${campaign.image}`;
  photo.alt = campaign.alt; photo.width = 256; photo.height = 256; photo.loading = "lazy"; photo.decoding = "async";
  if (campaignName === "thanksgiving") {
    copy.append(actions);
    banner.append(brand, copy);
    if (seasonalOffer) banner.append(seasonalOffer);
    else banner.classList.add("banner--without-offer");
  } else banner.append(brand, copy, actions, photo);
  shadow.append(banner);
  if (container === script.parentElement) container.insertBefore(host, script);
  else container.append(host);
})();
