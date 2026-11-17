/* Srivari responsive catering placement. Usage: /embeds/demo.html */
(() => {
  "use strict";
  const script = document.currentScript;
  if (!(script instanceof HTMLScriptElement) || script.dataset.srivariMounted === "true") return;
  const container = script.dataset.container ? document.getElementById(script.dataset.container) : script.parentElement;
  if (!container || container === document.head) return;
  script.dataset.srivariMounted = "true";

  const campaigns = {
    diwali: {
      defaultTheme: "light",
      label: "SRIVARI · PURE INDIAN VEGETARIAN",
      headline: "Make your next gathering delicious.",
      description: "Big celebrations. Little get-togethers. Bring everyone to the table with freshly prepared Indian vegetarian catering.",
      cta: "Place an online order", path: "/", hash: "a-la-carte",
      image: "/images/srivari-catering-wide-background.png", alt: "A platter of vegetarian paneer skewers and chaat appetizers, presented for a celebration",
    },
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
  // Retain the installed Diwali tag for the new online catering creative.
  const requestedCampaign = script.dataset.campaign;
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
    if (campaignName === "diwali" && Date.now() < Date.parse("2026-11-27T00:00:00-08:00")) destination.searchParams.set("promo", "THANKS10");
  }

  const assetOrigin = new URL(script.src).origin;
  const host = document.createElement("srivari-catering-placement");
  // Keep the partner's light theme name; this campaign's CSS supplies its harvest palette.
  host.dataset.theme = campaignName === "thanksgiving" ? "light" : ["light", "dark"].includes(script.dataset.theme) ? script.dataset.theme : campaign.defaultTheme || "dark";
  const shadow = host.attachShadow({ mode: "open" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("srivari-catering.css?v=online-catering-five-seconds-31", script.src).href;
  shadow.append(stylesheet);

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  if (campaignName === "diwali") {
    host.dataset.theme = "light";
    // Document-level font faces are also available inside the isolated shadow root.
    if (!document.head.querySelector("link[data-srivari-banner-fonts]")) {
      const fonts = element("link", "");
      fonts.rel = "stylesheet";
      fonts.href = new URL("srivari-catering-fonts.css?v=1", script.src).href;
      fonts.dataset.srivariBannerFonts = "true";
      document.head.append(fonts);
    }
    const endsAt = Date.parse("2026-11-27T00:00:00-08:00");
    const promotionActive = !isEzCater && Date.now() < endsAt;
    const slideContent = [
      { image: "/images/srivari-catering-event-spread.jpg", title: "Buffets, bites & drinks.", highlight: "Your celebration, catered.", description: "A welcoming buffet, beautifully presented bites and drinks for your guests. Bring every part of your celebration together with Srivari." },
      { image: "/images/srivari-catering-dessert-display.jpg", title: "Dessert cups.", highlight: "Little treats. Big smiles.", description: "Give your celebration a sweet finishing touch with individual dessert cups, beautifully presented and ready for your guests to enjoy." },
      { image: "/images/srivari-catering-dessert-trays.jpg", title: "Sweet treats, ready.", highlight: "Made for a crowd.", description: "Planning a bigger gathering? Add individually portioned desserts to your catering spread, so every guest gets a little sweetness." },
      { image: "/images/occasion-live-catering.webp", title: "Live dosa catering.", highlight: "Fresh off the griddle.", description: "Bring the sizzle to your celebration with golden dosas prepared live. Crisp, warm and served fresh for your guests." },
    ];
    const banner = element("section", "online-banner");
    banner.setAttribute("aria-label", "Srivari online catering promotion");
    const visual = element("div", "online-visual");
    const photo = element("img", "online-photo");
    photo.src = `${assetOrigin}${campaign.image}`;
    photo.alt = campaign.alt;
    photo.width = 2172; photo.height = 724; photo.loading = "lazy";
    visual.append(photo);
    const slideshow = element("div", "online-slideshow");
    slideshow.setAttribute("aria-hidden", "true");
    for (const [index, { image }] of slideContent.entries()) {
      const slide = element("img", `online-slide online-slide--${index}`);
      slide.src = `${assetOrigin}${image}`;
      slide.alt = ""; slide.loading = "lazy"; slide.decoding = "async";
      slideshow.append(slide);
    }
    visual.append(slideshow);
    const pauseSlideshow = element("button", "online-slideshow-toggle", "Ⅱ");
    pauseSlideshow.type = "button";
    pauseSlideshow.setAttribute("aria-label", "Pause catering slideshow");
    pauseSlideshow.setAttribute("aria-pressed", "false");
    pauseSlideshow.title = "Pause catering slideshow";
    pauseSlideshow.addEventListener("click", () => {
      const paused = banner.classList.toggle("is-slideshow-paused");
      pauseSlideshow.textContent = paused ? "▶" : "Ⅱ";
      pauseSlideshow.setAttribute("aria-pressed", String(paused));
      pauseSlideshow.setAttribute("aria-label", paused ? "Resume catering slideshow" : "Pause catering slideshow");
      pauseSlideshow.title = paused ? "Resume catering slideshow" : "Pause catering slideshow";
    });
    const pattern = element("div", "online-catering-pattern");
    pattern.setAttribute("aria-hidden", "true");
    const cornerLogo = element("img", "online-corner-logo");
    cornerLogo.src = `${assetOrigin}/icon.png`;
    cornerLogo.alt = "Srivari"; cornerLogo.width = 28; cornerLogo.height = 28;
    const watermark = element("img", "online-watermark");
    watermark.src = `${assetOrigin}/images/srivari-logo.png`;
    watermark.alt = ""; watermark.setAttribute("aria-hidden", "true");
    const copy = element("div", "online-copy");
    const brand = element("div", "online-brand-name");
    brand.append(element("span", "", "SRIVARI CATERING"));
    const messages = element("div", "online-messages");
    messages.setAttribute("aria-live", "off");
    for (const [index, content] of slideContent.entries()) {
      const message = element("div", "online-slide-copy");
      message.style.animationDelay = `${index * 5}s`;
      const title = element("h2", "online-title", content.title);
      title.append(element("span", "online-title-highlight", content.highlight));
      message.append(title, element("p", "online-description", content.description));
      messages.append(message);
    }
    copy.append(brand, messages);
    const actions = element("div", "online-actions");
    const orderGroup = element("div", "online-order-group");
    const cta = element("a", "online-cta");
    cta.append(element("span", "online-order-label", isEzCater ? "Order on ezCater" : "ORDER NOW"));
    cta.href = destination.href; cta.target = "_blank"; cta.rel = "noopener noreferrer";
    cta.append(element("span", "", " ↗"), element("span", "sr-only", " (opens in a new tab)"));
    orderGroup.append(cta);
    if (promotionActive) orderGroup.append(element("p", "online-order-caption", "Save 10% when you order online"));
    const call = element("a", "online-call", "Let’s talk catering");
    call.href = "tel:+14088930438"; call.setAttribute("aria-label", "Call Srivari catering at (408) 893-0438");
    actions.append(orderGroup, call);
    copy.append(actions);
    banner.append(visual, pattern, watermark, cornerLogo, pauseSlideshow, copy);
    if (promotionActive) {
      const ticket = element("aside", "online-ticket");
      ticket.setAttribute("aria-label", "Online catering offer");
      const priceTag = element("div", "online-price-tag");
      priceTag.append(element("strong", "", "10%"), element("span", "", "OFF"));
      ticket.append(priceTag, element("span", "online-ticket-eyebrow", "ONLINE-ONLY SAVINGS"), element("h3", "online-offer-heading", "Great catering.\nExtra savings."));
      const offerOrderGroup = element("div", "online-order-group online-offer-order-group");
      const orderLink = element("a", "online-offer-order");
      orderLink.append(element("span", "online-order-label", "ORDER NOW"), element("span", "", "↗"));
      orderLink.href = destination.href; orderLink.target = "_blank"; orderLink.rel = "noopener noreferrer";
      orderLink.append(element("span", "sr-only", " (opens in a new tab)"));
      offerOrderGroup.append(orderLink, element("p", "online-order-caption", "Save 10% when you order online"));
      const reveal = element("button", "online-reveal", "Reveal your offer ✦");
      reveal.type = "button"; reveal.setAttribute("aria-expanded", "false");
      const code = element("code", "online-ticket-code", "THANKS10");
      code.hidden = true;
      const status = element("p", "online-ticket-status", "Reveal your code. Save on your feast.");
      status.setAttribute("role", "status");
      let revealed = false;
      reveal.addEventListener("click", async () => {
        if (Date.now() >= endsAt) { ticket.remove(); return; }
        if (!revealed) {
          revealed = true; code.hidden = false;
          reveal.textContent = "Copy offer code";
          reveal.setAttribute("aria-expanded", "true");
          ticket.classList.add("is-revealed");
          status.textContent = "Your offer code: THANKS10.";
        } else {
          try { await navigator.clipboard.writeText("THANKS10"); status.textContent = "Copied! Your code is THANKS10."; }
          catch { status.textContent = "Your code is THANKS10. Select the code to copy it."; }
        }
      });
      ticket.append(element("p", "online-ticket-message", "Your catering favourites, 10% off when you place your order online."), element("p", "online-ticket-terms", "Orders over $40 · Ends Nov 26, 2026"), offerOrderGroup, code, reveal, status);
      banner.append(ticket);
      function expireOffer() {
        if (!ticket.isConnected) return;
        if (Date.now() >= endsAt) ticket.remove();
        else setTimeout(expireOffer, Math.min(endsAt - Date.now(), 2_147_483_647));
      }
      setTimeout(expireOffer, Math.min(endsAt - Date.now(), 2_147_483_647));
    }
    shadow.append(banner);
    if (container === script.parentElement) container.insertBefore(host, script);
    else container.append(host);
    return;
  }
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
